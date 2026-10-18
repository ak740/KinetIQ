import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, pool, withTransaction } from '../db/pool.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { HttpError, wrap } from '../utils.js';
import { getUserView } from '../services/users.js';

const router = Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim()) throw new HttpError(400, 'Name is required');
  if (!emailRe.test(email || '')) throw new HttpError(400, 'A valid email is required');
  if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

  const [exists] = await pool.query('SELECT 1 FROM users WHERE email = ?', [email.toLowerCase()]);
  if (exists.length) throw new HttpError(409, 'An account with this email already exists');

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [
    name.trim(), email.toLowerCase(), hash,
  ]);
  res.status(201).json({ token: signToken({ id: result.insertId }), user: await getUserView(result.insertId) });
}));

router.post('/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body || {};
  const [user] = await query('SELECT id, password_hash FROM users WHERE email = ?', [(email || '').toLowerCase()]);
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    throw new HttpError(401, 'Incorrect email or password');
  }
  res.json({ token: signToken(user), user: await getUserView(user.id) });
}));

router.get('/me', requireAuth, wrap(async (req, res) => {
  res.json(await getUserView(req.userId));
}));

/** Onboarding: choose grade and subjects. Can be revisited to add subjects later. */
router.put('/me/profile', requireAuth, wrap(async (req, res) => {
  const { grade, subjectIds } = req.body || {};
  if (!Number.isInteger(grade) || grade < 9 || grade > 12) throw new HttpError(400, 'Grade must be between 9 and 12');
  if (!Array.isArray(subjectIds) || !subjectIds.length) throw new HttpError(400, 'Select at least one subject');

  const valid = await query('SELECT id FROM subjects WHERE id IN (?)', [subjectIds]);
  if (valid.length !== new Set(subjectIds).size) throw new HttpError(400, 'Unknown subject selected');

  await withTransaction(async (conn) => {
    await conn.query('UPDATE users SET grade = ? WHERE id = ?', [grade, req.userId]);
    await conn.query('DELETE FROM user_subjects WHERE user_id = ? AND subject_id NOT IN (?)', [req.userId, subjectIds]);
    await conn.query('INSERT IGNORE INTO user_subjects (user_id, subject_id) VALUES ?', [
      subjectIds.map((id) => [req.userId, id]),
    ]);
  });
  res.json(await getUserView(req.userId));
}));

export default router;
