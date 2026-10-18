import { query } from '../db/pool.js';
import { HttpError } from '../utils.js';
import { levelInfo } from './gamification.js';

/** Public shape of a user, including enrolled subjects and level progress. */
export async function getUserView(userId) {
  const [u] = await query('SELECT id, email, name, grade, xp, streak FROM users WHERE id = ?', [userId]);
  if (!u) throw new HttpError(404, 'User not found');
  const subjects = await query(
    `SELECT s.id, s.slug, s.name, s.icon FROM user_subjects us JOIN subjects s ON s.id = us.subject_id
     WHERE us.user_id = ? ORDER BY s.id`,
    [userId]
  );
  return { ...u, subjects, onboarded: !!u.grade && subjects.length > 0, ...levelInfo(u.xp) };
}

export async function getUserForTest(userId) {
  const [u] = await query('SELECT id, grade FROM users WHERE id = ?', [userId]);
  if (!u) throw new HttpError(404, 'User not found');
  return u;
}
