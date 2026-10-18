import { config } from '../config.js';

export const levelFor = (xp) => Math.floor(Math.sqrt(xp / 50)) + 1;
const xpForLevel = (level) => 50 * (level - 1) ** 2;

export function levelInfo(xp) {
  const level = levelFor(xp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, levelStartXp: start, nextLevelXp: next, progress: (xp - start) / (next - start) };
}

export const xpForActivity = (type, correct = 0) =>
  (config.xp[type] || 0) + correct * config.xp.perCorrectAnswer;

export async function awardXp(db, userId, amount) {
  if (amount > 0) await db.query('UPDATE users SET xp = xp + ? WHERE id = ?', [amount, userId]);
}

/** Maintain the daily study streak. Call once per learning activity. */
export async function touchStreak(db, userId) {
  const [[u]] = await db.query(
    `SELECT streak, last_active_date, DATEDIFF(CURDATE(), last_active_date) AS gap FROM users WHERE id = ?`,
    [userId]
  );
  let streak = u.streak;
  if (u.last_active_date === null || u.gap > 1) streak = 1;
  else if (u.gap === 1) streak += 1;
  await db.query('UPDATE users SET streak = ?, last_active_date = CURDATE() WHERE id = ?', [streak, userId]);
}

/**
 * Stats that badge rules can reference (badges.rule_type = stat name).
 * Add a new stat here and a row in data/badges.js to introduce a new kind of achievement.
 */
export async function collectStats(db, userId) {
  const [[c]] = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM tests WHERE user_id = ? AND type = 'diagnostic' AND status = 'completed') AS diagnostics_completed,
       (SELECT COUNT(*) FROM tests WHERE user_id = ? AND type = 'weekly' AND status = 'completed') AS weekly_completed,
       (SELECT COUNT(*) FROM tests WHERE user_id = ? AND type = 'quiz' AND status = 'completed') AS quizzes_completed,
       (SELECT COUNT(*) FROM tests WHERE user_id = ? AND status = 'completed' AND score >= 100) AS perfect_tests,
       (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ?) AS lessons_completed,
       (SELECT COUNT(*) FROM topic_mastery WHERE user_id = ? AND mastery >= ?) AS topics_mastered,
       (SELECT streak FROM users WHERE id = ?) AS streak,
       (SELECT xp FROM users WHERE id = ?) AS xp`,
    [userId, userId, userId, userId, userId, userId, config.learning.masteredThreshold, userId, userId]
  );
  const [hist] = await db.query(
    'SELECT subject_id, score FROM score_history WHERE user_id = ? ORDER BY id',
    [userId]
  );
  const first = {}, last = {};
  for (const h of hist) {
    if (!(h.subject_id in first)) first[h.subject_id] = Number(h.score);
    last[h.subject_id] = Number(h.score);
  }
  const improvement = Math.max(0, ...Object.keys(first).map((k) => last[k] - first[k]));
  const stats = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Number(v)]));
  stats.score_improvement = improvement;
  return stats;
}

/** Award any badges whose rule is now satisfied. Returns the newly earned badges. */
export async function evaluateBadges(db, userId) {
  const stats = await collectStats(db, userId);
  const [candidates] = await db.query(
    `SELECT b.* FROM badges b
     WHERE b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)`,
    [userId]
  );
  const earned = candidates.filter((b) => (stats[b.rule_type] ?? 0) >= b.rule_value);
  for (const b of earned) {
    await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, b.id]);
  }
  return earned.map((b) => ({ id: b.id, code: b.code, name: b.name, icon: b.icon, description: b.description }));
}
