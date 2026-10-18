import { config } from '../config.js';
import { num, round1 } from '../utils.js';

/**
 * Builds the student's SWOT-style profile for one subject from topic mastery:
 *  - strengths:    mastery >= strongThreshold
 *  - weaknesses:   mastery <  weakThreshold
 *  - improvements: in between, or slipping versus the previous result
 *  - training:     prioritised plan (weakest first) with lessons to study
 * Thresholds live in config.learning, so tuning the model is a one-line change.
 */
export async function buildSwot(db, userId, subjectId, grade) {
  const { strongThreshold, weakThreshold } = config.learning;

  const [rows] = await db.query(
    `SELECT t.id, t.name, m.mastery, m.prev_mastery, m.attempts
     FROM topics t
     LEFT JOIN topic_mastery m ON m.topic_id = t.id AND m.user_id = ?
     WHERE t.subject_id = ? AND t.grade_min <= ?
     ORDER BY t.sort_order`,
    [userId, subjectId, grade]
  );

  const strengths = [], weaknesses = [], improvements = [], unassessed = [];
  for (const r of rows) {
    if (r.mastery === null) {
      unassessed.push({ topicId: r.id, topic: r.name });
      continue;
    }
    const mastery = num(r.mastery);
    const prev = num(r.prev_mastery);
    const trend = prev === null ? 0 : round1(mastery - prev);
    const item = { topicId: r.id, topic: r.name, mastery, trend, attempts: r.attempts };
    if (mastery >= strongThreshold && trend > -10) strengths.push(item);
    else if (mastery < weakThreshold) weaknesses.push(item);
    else improvements.push({ ...item, slipping: trend <= -10 });
  }

  strengths.sort((a, b) => b.mastery - a.mastery);
  weaknesses.sort((a, b) => a.mastery - b.mastery);
  improvements.sort((a, b) => a.mastery - b.mastery);

  const focus = [...weaknesses, ...improvements].slice(0, 5);
  let training = [];
  if (focus.length) {
    const ids = focus.map((f) => f.topicId);
    const [lessonRows] = await db.query(
      `SELECT l.id, l.topic_id, l.title, l.minutes, lp.completed_at IS NOT NULL AS completed
       FROM lessons l LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
       WHERE l.topic_id IN (?) ORDER BY l.sort_order`,
      [userId, ids]
    );
    training = focus.map((f, i) => {
      const topicLessons = lessonRows
        .filter((l) => l.topic_id === f.topicId)
        .map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, completed: !!l.completed }));
      const nextLesson = topicLessons.find((l) => !l.completed);
      return {
        priority: i + 1,
        topicId: f.topicId,
        topic: f.topic,
        mastery: f.mastery,
        level: f.mastery < weakThreshold ? 'weakness' : 'improvement',
        lessons: topicLessons,
        action: nextLesson
          ? `Study "${nextLesson.title}", then take a practice quiz.`
          : 'Take a practice quiz to lock in what you learned.',
      };
    });
  }

  return { strengths, weaknesses, improvements, training, unassessed };
}
