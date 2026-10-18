import { config } from '../config.js';
import { pool, withTransaction } from '../db/pool.js';
import { HttpError, shuffle, weightedSample, num, round1 } from '../utils.js';
import { applyResults, subjectScore } from './mastery.js';
import { buildSwot } from './swot.js';
import { awardXp, touchStreak, evaluateBadges, xpForActivity, levelInfo } from './gamification.js';

const DAY_MS = 86400000;

/** When is the next weekly test due? (diagnostic or last weekly + cooldown) */
export async function weeklyStatus(db, userId, subjectId) {
  const [[row]] = await db.query(
    `SELECT MAX(completed_at) AS last,
            SUM(type = 'diagnostic' AND status = 'completed') AS diag
     FROM tests WHERE user_id = ? AND subject_id = ? AND type IN ('diagnostic','weekly') AND status = 'completed'`,
    [userId, subjectId]
  );
  if (!Number(row.diag)) return { available: false, reason: 'Take the diagnostic first', nextAt: null };
  const nextAt = new Date(new Date(row.last).getTime() + config.learning.weeklyCooldownDays * DAY_MS);
  return { available: nextAt <= new Date(), nextAt, lastAt: row.last };
}

async function eligibleQuestions(db, userId, subjectId, grade, topicId) {
  const [rows] = await db.query(
    `SELECT q.id, q.topic_id, q.difficulty,
            COALESCE(m.mastery, 50) AS mastery,
            EXISTS (SELECT 1 FROM test_questions tq JOIN tests ts ON ts.id = tq.test_id
                    WHERE tq.question_id = q.id AND ts.user_id = ? AND ts.status = 'completed') AS seen
     FROM questions q
     JOIN topics t ON t.id = q.topic_id
     LEFT JOIN topic_mastery m ON m.topic_id = t.id AND m.user_id = ?
     WHERE t.subject_id = ? AND t.grade_min <= ? AND q.grade_min <= ?
       ${topicId ? 'AND t.id = ?' : ''}`,
    topicId ? [userId, userId, subjectId, grade, grade, topicId] : [userId, userId, subjectId, grade, grade]
  );
  return rows.map((r) => ({ ...r, mastery: Number(r.mastery), seen: !!r.seen }));
}

/** Diagnostic: broad coverage, a spread of difficulties from every eligible topic. */
function pickDiagnostic(questions) {
  const byTopic = new Map();
  for (const q of questions) byTopic.set(q.topic_id, [...(byTopic.get(q.topic_id) || []), q]);
  const picked = [];
  for (const qs of byTopic.values()) {
    const chosen = [];
    for (const d of [1, 2, 3]) {
      const opts = shuffle(qs.filter((q) => q.difficulty === d));
      if (opts.length && chosen.length < config.learning.diagnosticPerTopic) chosen.push(opts[0]);
    }
    const rest = shuffle(qs.filter((q) => !chosen.includes(q)));
    while (chosen.length < config.learning.diagnosticPerTopic && rest.length) chosen.push(rest.pop());
    picked.push(...chosen);
  }
  return shuffle(picked);
}

/** Weekly: favour weak topics (lower mastery => higher weight) and unseen questions. */
function pickWeekly(questions) {
  const weighted = questions.map((q) => ({ ...q, weight: (110 - q.mastery) * (q.seen ? 0.3 : 1) }));
  return shuffle(weightedSample(weighted, config.learning.weeklyTestSize));
}

/** Quiz: one topic, unseen questions first. */
function pickQuiz(questions) {
  const weighted = questions.map((q) => ({ ...q, weight: q.seen ? 0.4 : 1 }));
  return shuffle(weightedSample(weighted, config.learning.quizSize));
}

export async function startTest(user, { subjectId, type, topicId }) {
  if (!['diagnostic', 'weekly', 'quiz'].includes(type)) throw new HttpError(400, 'Invalid test type');
  if (!user.grade) throw new HttpError(400, 'Complete onboarding first');
  const [enrolled] = await pool.query('SELECT 1 FROM user_subjects WHERE user_id = ? AND subject_id = ?', [user.id, subjectId]);
  if (!enrolled.length) throw new HttpError(403, 'Subject not selected');
  if (type === 'quiz' && !topicId) throw new HttpError(400, 'topicId required for quizzes');

  // Resume an unfinished test of the same kind rather than creating duplicates.
  const [open] = await pool.query(
    `SELECT id FROM tests WHERE user_id = ? AND subject_id = ? AND type = ? AND status = 'in_progress'
     AND (topic_id <=> ?) ORDER BY id DESC LIMIT 1`,
    [user.id, subjectId, type, type === 'quiz' ? topicId : null]
  );
  if (open.length) return open[0].id;

  if (type === 'diagnostic') {
    const [done] = await pool.query(
      "SELECT 1 FROM tests WHERE user_id = ? AND subject_id = ? AND type = 'diagnostic' AND status = 'completed'",
      [user.id, subjectId]
    );
    if (done.length) throw new HttpError(409, 'Diagnostic already completed for this subject');
  } else {
    const [[diag]] = await pool.query(
      "SELECT COUNT(*) AS n FROM tests WHERE user_id = ? AND subject_id = ? AND type = 'diagnostic' AND status = 'completed'",
      [user.id, subjectId]
    );
    if (!diag.n) throw new HttpError(409, 'Take the diagnostic test first');
  }
  if (type === 'weekly') {
    const status = await weeklyStatus(pool, user.id, subjectId);
    if (!status.available) throw new HttpError(409, `Weekly test unlocks on ${new Date(status.nextAt).toDateString()}`);
  }

  const all = await eligibleQuestions(pool, user.id, subjectId, user.grade, type === 'quiz' ? topicId : null);
  const picked = type === 'diagnostic' ? pickDiagnostic(all) : type === 'weekly' ? pickWeekly(all) : pickQuiz(all);
  if (!picked.length) throw new HttpError(404, 'No questions available');

  return withTransaction(async (conn) => {
    const [res] = await conn.query('INSERT INTO tests (user_id, subject_id, topic_id, type) VALUES (?, ?, ?, ?)', [
      user.id, subjectId, type === 'quiz' ? topicId : null, type,
    ]);
    const values = picked.map((q, i) => [res.insertId, q.id, i + 1]);
    await conn.query('INSERT INTO test_questions (test_id, question_id, position) VALUES ?', [values]);
    return res.insertId;
  });
}

async function loadTest(db, testId, userId) {
  const [[test]] = await db.query(
    `SELECT t.*, s.name AS subject_name, s.icon AS subject_icon, tp.name AS topic_name
     FROM tests t JOIN subjects s ON s.id = t.subject_id LEFT JOIN topics tp ON tp.id = t.topic_id
     WHERE t.id = ? AND t.user_id = ?`,
    [testId, userId]
  );
  if (!test) throw new HttpError(404, 'Test not found');
  const [questions] = await db.query(
    `SELECT tq.id AS tq_id, tq.position, tq.selected_index, tq.is_correct,
            q.id AS question_id, q.text, q.options, q.difficulty, q.correct_index, q.explanation,
            q.topic_id, tp.name AS topic
     FROM test_questions tq JOIN questions q ON q.id = tq.question_id JOIN topics tp ON tp.id = q.topic_id
     WHERE tq.test_id = ? ORDER BY tq.position`,
    [testId]
  );
  return { test, questions };
}

/** Test view for the client. Correct answers are only revealed after completion. */
export async function getTestView(testId, userId) {
  const { test, questions } = await loadTest(pool, testId, userId);
  const done = test.status === 'completed';
  return {
    id: test.id,
    type: test.type,
    status: test.status,
    subject: { id: test.subject_id, name: test.subject_name, icon: test.subject_icon },
    topic: test.topic_name || null,
    score: num(test.score),
    xpEarned: test.xp_earned,
    completedAt: test.completed_at,
    questions: questions.map((q) => ({
      id: q.question_id,
      position: q.position,
      text: q.text,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty,
      ...(done && {
        selectedIndex: q.selected_index,
        isCorrect: !!q.is_correct,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      }),
    })),
  };
}

export async function submitTest(user, testId, answers) {
  if (!Array.isArray(answers)) throw new HttpError(400, 'answers must be an array');
  const given = new Map(answers.map((a) => [Number(a.questionId), a.selectedIndex]));

  const outcome = await withTransaction(async (conn) => {
    const { test, questions } = await loadTest(conn, testId, user.id);
    if (test.status === 'completed') throw new HttpError(409, 'Test already submitted');

    const graded = questions.map((q) => {
      const sel = given.get(q.question_id);
      const selected = Number.isInteger(sel) && sel >= 0 && sel < q.options.length ? sel : null;
      return { ...q, selected, is_correct: selected !== null && selected === q.correct_index };
    });
    for (const g of graded) {
      await conn.query('UPDATE test_questions SET selected_index = ?, is_correct = ? WHERE id = ?', [g.selected, g.is_correct, g.tq_id]);
    }

    const correct = graded.filter((g) => g.is_correct).length;
    const score = round1((correct / graded.length) * 100);

    const prevScore = await subjectScore(conn, user.id, test.subject_id, user.grade);
    await applyResults(conn, user.id, graded, test.type);
    const kinetiqScore = await subjectScore(conn, user.id, test.subject_id, user.grade);
    await conn.query('INSERT INTO score_history (user_id, subject_id, score, source, test_id) VALUES (?, ?, ?, ?, ?)', [
      user.id, test.subject_id, kinetiqScore, test.type, test.id,
    ]);
    const [[initial]] = await conn.query(
      'SELECT score FROM score_history WHERE user_id = ? AND subject_id = ? ORDER BY id LIMIT 1',
      [user.id, test.subject_id]
    );

    const xpEarned = xpForActivity(test.type, correct);
    await conn.query('UPDATE tests SET status = "completed", score = ?, xp_earned = ?, completed_at = NOW() WHERE id = ?', [
      score, xpEarned, test.id,
    ]);
    await awardXp(conn, user.id, xpEarned);
    await touchStreak(conn, user.id);
    const newBadges = await evaluateBadges(conn, user.id);
    const swot = await buildSwot(conn, user.id, test.subject_id, user.grade);
    const [[u]] = await conn.query('SELECT xp, streak FROM users WHERE id = ?', [user.id]);

    return { test, graded, correct, score, kinetiqScore, prevScore, initialScore: num(initial.score), xpEarned, newBadges, swot, u };
  });

  return {
    testId: outcome.test.id,
    type: outcome.test.type,
    score: outcome.score,
    correct: outcome.correct,
    total: outcome.graded.length,
    kinetiqScore: outcome.kinetiqScore,
    previousScore: outcome.prevScore,
    initialScore: outcome.initialScore,
    change: outcome.prevScore === null ? null : round1(outcome.kinetiqScore - outcome.prevScore),
    xpEarned: outcome.xpEarned,
    xp: outcome.u.xp,
    streak: outcome.u.streak,
    ...levelInfo(outcome.u.xp),
    newBadges: outcome.newBadges,
    swot: outcome.swot,
  };
}
