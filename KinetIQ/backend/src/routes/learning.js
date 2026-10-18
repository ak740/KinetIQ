import { Router } from 'express';
import { pool, query, withTransaction } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError, wrap, num } from '../utils.js';
import { getUserForTest } from '../services/users.js';
import { buildSwot } from '../services/swot.js';
import { awardXp, touchStreak, evaluateBadges, xpForActivity } from '../services/gamification.js';

const router = Router();
router.use(requireAuth);

// Personalised study plan: training areas from the SWOT, each with lessons and a quiz CTA.
router.get('/learning/plan/:subjectId', wrap(async (req, res) => {
  const user = await getUserForTest(req.userId);
  const swot = await buildSwot(pool, user.id, Number(req.params.subjectId), user.grade);
  res.json({ training: swot.training });
}));

// Topics of a subject with the student's mastery and lessons (for browsing).
router.get('/learning/subjects/:subjectId/topics', wrap(async (req, res) => {
  const user = await getUserForTest(req.userId);
  const topics = await query(
    `SELECT t.id, t.name, t.description, m.mastery
     FROM topics t LEFT JOIN topic_mastery m ON m.topic_id = t.id AND m.user_id = ?
     WHERE t.subject_id = ? AND t.grade_min <= ? ORDER BY t.sort_order`,
    [user.id, Number(req.params.subjectId), user.grade]
  );
  const lessons = topics.length
    ? await query(
        `SELECT l.id, l.topic_id, l.title, l.minutes, lp.completed_at IS NOT NULL AS completed
         FROM lessons l LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
         WHERE l.topic_id IN (?) ORDER BY l.sort_order`,
        [user.id, topics.map((t) => t.id)]
      )
    : [];
  res.json(
    topics.map((t) => ({
      id: t.id, name: t.name, description: t.description, mastery: num(t.mastery),
      lessons: lessons.filter((l) => l.topic_id === t.id).map((l) => ({ ...l, completed: !!l.completed })),
    }))
  );
}));

router.get('/learning/lessons/:id', wrap(async (req, res) => {
  const [lesson] = await query(
    `SELECT l.id, l.title, l.content, l.minutes, l.topic_id AS topicId, t.name AS topic,
            t.subject_id AS subjectId, lp.completed_at IS NOT NULL AS completed
     FROM lessons l JOIN topics t ON t.id = l.topic_id
     LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
     WHERE l.id = ?`,
    [req.userId, Number(req.params.id)]
  );
  if (!lesson) throw new HttpError(404, 'Lesson not found');
  res.json({ ...lesson, completed: !!lesson.completed });
}));

router.post('/learning/lessons/:id/complete', wrap(async (req, res) => {
  const lessonId = Number(req.params.id);
  const [lesson] = await query('SELECT id FROM lessons WHERE id = ?', [lessonId]);
  if (!lesson) throw new HttpError(404, 'Lesson not found');

  const result = await withTransaction(async (conn) => {
    const [ins] = await conn.query('INSERT IGNORE INTO lesson_progress (user_id, lesson_id) VALUES (?, ?)', [req.userId, lessonId]);
    const firstTime = ins.affectedRows > 0;
    const xpEarned = firstTime ? xpForActivity('lesson') : 0;
    if (firstTime) await awardXp(conn, req.userId, xpEarned);
    await touchStreak(conn, req.userId);
    const newBadges = await evaluateBadges(conn, req.userId);
    return { xpEarned, newBadges, alreadyCompleted: !firstTime };
  });
  res.json(result);
}));

export default router;
