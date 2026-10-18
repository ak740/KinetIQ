import { Router } from 'express';
import { pool, query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { wrap, num } from '../utils.js';
import { getUserForTest } from '../services/users.js';
import { startTest, getTestView, submitTest, weeklyStatus } from '../services/testEngine.js';

const router = Router();
router.use(requireAuth);

// Start (or resume) a diagnostic, weekly or topic quiz.
router.post('/tests', wrap(async (req, res) => {
  const { subjectId, type, topicId } = req.body || {};
  const user = await getUserForTest(req.userId);
  const id = await startTest(user, { subjectId: Number(subjectId), type, topicId: topicId ? Number(topicId) : null });
  res.status(201).json(await getTestView(id, req.userId));
}));

router.get('/tests', wrap(async (req, res) => {
  const rows = await query(
    `SELECT t.id, t.type, t.score, t.xp_earned AS xpEarned, t.completed_at AS completedAt,
            s.name AS subject, tp.name AS topic
     FROM tests t JOIN subjects s ON s.id = t.subject_id LEFT JOIN topics tp ON tp.id = t.topic_id
     WHERE t.user_id = ? AND t.status = 'completed' ORDER BY t.completed_at DESC LIMIT 50`,
    [req.userId]
  );
  res.json(rows.map((r) => ({ ...r, score: num(r.score) })));
}));

router.get('/tests/weekly-status/:subjectId', wrap(async (req, res) => {
  res.json(await weeklyStatus(pool, req.userId, Number(req.params.subjectId)));
}));

router.get('/tests/:id', wrap(async (req, res) => {
  res.json(await getTestView(Number(req.params.id), req.userId));
}));

router.post('/tests/:id/submit', wrap(async (req, res) => {
  const user = await getUserForTest(req.userId);
  res.json(await submitTest(user, Number(req.params.id), req.body?.answers));
}));

export default router;
