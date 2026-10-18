import { config } from '../config.js';
import { round1, num } from '../utils.js';

// How strongly a new result moves the stored mastery (1 = replace it).
const LEARNING_RATE = { diagnostic: 1, weekly: 0.5, quiz: 0.3 };

/**
 * Update per-topic mastery from graded answers.
 * items: [{ topic_id, difficulty, is_correct }]  (db = pool or transaction connection)
 */
export async function applyResults(db, userId, items, mode) {
  const alpha = LEARNING_RATE[mode] ?? 0.3;
  const byTopic = new Map();
  for (const it of items) {
    const t = byTopic.get(it.topic_id) || { weighted: 0, total: 0, correct: 0, count: 0 };
    t.weighted += it.is_correct ? it.difficulty : 0; // harder questions count more
    t.total += it.difficulty;
    t.correct += it.is_correct ? 1 : 0;
    t.count += 1;
    byTopic.set(it.topic_id, t);
  }

  for (const [topicId, t] of byTopic) {
    const pct = (t.weighted / t.total) * 100;
    const [[existing]] = await db.query(
      'SELECT mastery, attempts, correct FROM topic_mastery WHERE user_id = ? AND topic_id = ? FOR UPDATE',
      [userId, topicId]
    );
    if (!existing) {
      await db.query(
        'INSERT INTO topic_mastery (user_id, topic_id, mastery, prev_mastery, attempts, correct) VALUES (?, ?, ?, NULL, ?, ?)',
        [userId, topicId, round1(pct), t.count, t.correct]
      );
    } else {
      const old = Number(existing.mastery);
      const next = old * (1 - alpha) + pct * alpha;
      await db.query(
        'UPDATE topic_mastery SET mastery = ?, prev_mastery = ?, attempts = attempts + ?, correct = correct + ? WHERE user_id = ? AND topic_id = ?',
        [round1(next), old, t.count, t.correct, userId, topicId]
      );
    }
  }
}

/** Overall KinetIQ score for a subject: average mastery over assessed, grade-eligible topics. */
export async function subjectScore(db, userId, subjectId, grade) {
  const [[row]] = await db.query(
    `SELECT AVG(m.mastery) AS score FROM topic_mastery m
     JOIN topics t ON t.id = m.topic_id
     WHERE m.user_id = ? AND t.subject_id = ? AND t.grade_min <= ?`,
    [userId, subjectId, grade]
  );
  return row?.score === null || row?.score === undefined ? null : round1(Number(row.score));
}

export const isMastered = (m) => num(m) >= config.learning.masteredThreshold;
