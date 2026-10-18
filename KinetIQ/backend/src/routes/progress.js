import { Router } from 'express';
import { pool, query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { wrap, num, round1, HttpError } from '../utils.js';
import { getUserForTest, getUserView } from '../services/users.js';
import { buildSwot } from '../services/swot.js';
import { weeklyStatus } from '../services/testEngine.js';

const router = Router();
router.use(requireAuth);

async function subjectSummary(user, subject) {
  const history = await query(
    'SELECT score, source, created_at AS at FROM score_history WHERE user_id = ? AND subject_id = ? ORDER BY id',
    [user.id, subject.id]
  );
  const scores = history.map((h) => Number(h.score));
  const [openTest] = await query(
    "SELECT id, type FROM tests WHERE user_id = ? AND subject_id = ? AND status = 'in_progress' AND type <> 'quiz' ORDER BY id DESC LIMIT 1",
    [user.id, subject.id]
  );
  const diagnosticDone = history.some((h) => h.source === 'diagnostic');
  const weekly = await weeklyStatus(pool, user.id, subject.id);
  const [{ n: weeklyCount }] = await query(
    "SELECT COUNT(*) AS n FROM tests WHERE user_id = ? AND subject_id = ? AND type = 'weekly' AND status = 'completed'",
    [user.id, subject.id]
  );
  return {
    ...subject,
    diagnosticDone,
    initialScore: scores.length ? scores[0] : null,
    score: scores.length ? scores[scores.length - 1] : null,
    change: scores.length ? round1(scores[scores.length - 1] - scores[0]) : null,
    weekly: { ...weekly, completed: weeklyCount },
    openTest: openTest || null,
    history: history.map((h) => ({ score: Number(h.score), source: h.source, at: h.at })),
  };
}

router.get('/progress/dashboard', wrap(async (req, res) => {
  const me = await getUserView(req.userId);
  const subjects = [];
  for (const s of me.subjects) subjects.push(await subjectSummary({ id: me.id }, s));
  const badges = await query(
    `SELECT b.code, b.name, b.icon, ub.earned_at AS earnedAt FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = ? ORDER BY ub.earned_at DESC LIMIT 6`,
    [req.userId]
  );
  const [{ n: lessons }] = await query('SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id = ?', [req.userId]);
  const [{ n: tests }] = await query("SELECT COUNT(*) AS n FROM tests WHERE user_id = ? AND status = 'completed'", [req.userId]);
  res.json({ user: me, subjects, recentBadges: badges, totals: { lessons, tests } });
}));

router.get('/progress/subjects/:subjectId', wrap(async (req, res) => {
  const user = await getUserForTest(req.userId);
  const subjectId = Number(req.params.subjectId);
  const [subject] = await query(
    'SELECT s.id, s.slug, s.name, s.icon FROM subjects s JOIN user_subjects us ON us.subject_id = s.id WHERE s.id = ? AND us.user_id = ?',
    [subjectId, user.id]
  );
  if (!subject) throw new HttpError(404, 'Subject not found');
  const summary = await subjectSummary(user, subject);
  const swot = await buildSwot(pool, user.id, subjectId, user.grade);
  const topics = await query(
    `SELECT t.id, t.name, m.mastery, m.prev_mastery AS prev, m.attempts
     FROM topics t LEFT JOIN topic_mastery m ON m.topic_id = t.id AND m.user_id = ?
     WHERE t.subject_id = ? AND t.grade_min <= ? ORDER BY t.sort_order`,
    [user.id, subjectId, user.grade]
  );
  res.json({
    ...summary,
    swot,
    topics: topics.map((t) => ({ id: t.id, name: t.name, mastery: num(t.mastery), attempts: t.attempts })),
  });
}));

router.get('/progress/badges', wrap(async (req, res) => {
  const rows = await query(
    `SELECT b.code, b.name, b.description, b.icon, ub.earned_at AS earnedAt
     FROM badges b LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = ?
     ORDER BY b.sort_order`,
    [req.userId]
  );
  res.json(rows.map((r) => ({ ...r, earned: !!r.earnedAt })));
}));

export default router;
