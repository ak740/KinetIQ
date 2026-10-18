import { pool } from './pool.js';
import { subjects, topics } from '../data/catalog.js';
import { mathQuestions } from '../data/math.js';
import { scienceQuestions } from '../data/science.js';
import { lessons } from '../data/lessons.js';
import { badges } from '../data/badges.js';

/**
 * Idempotent content seed. Content is keyed by slug/code, so re-running
 * updates existing rows and adds new ones without touching user data.
 * To add content: append to the files in src/data and restart the API.
 */
export async function seed() {
  for (const s of subjects) {
    await pool.query(
      `INSERT INTO subjects (slug, name, icon, description) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), description = VALUES(description)`,
      [s.slug, s.name, s.icon, s.description]
    );
  }
  const [subjectRows] = await pool.query('SELECT id, slug FROM subjects');
  const subjectId = Object.fromEntries(subjectRows.map((r) => [r.slug, r.id]));

  let order = 0;
  for (const t of topics) {
    await pool.query(
      `INSERT INTO topics (subject_id, slug, name, description, grade_min, sort_order) VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description),
         grade_min = VALUES(grade_min), sort_order = VALUES(sort_order), subject_id = VALUES(subject_id)`,
      [subjectId[t.subject], t.slug, t.name, t.description, t.gradeMin, order++]
    );
  }
  const [topicRows] = await pool.query('SELECT id, slug FROM topics');
  const topicId = Object.fromEntries(topicRows.map((r) => [r.slug, r.id]));

  const allQuestions = [...mathQuestions, ...scienceQuestions];
  for (const q of allQuestions) {
    await pool.query(
      `INSERT INTO questions (code, topic_id, difficulty, grade_min, text, options, correct_index, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE topic_id = VALUES(topic_id), difficulty = VALUES(difficulty),
         grade_min = VALUES(grade_min), text = VALUES(text), options = VALUES(options),
         correct_index = VALUES(correct_index), explanation = VALUES(explanation)`,
      [q.code, topicId[q.topic], q.difficulty, q.gradeMin, q.text, JSON.stringify(q.options), q.correct, q.explanation]
    );
  }

  for (const l of lessons) {
    await pool.query(
      `INSERT INTO lessons (code, topic_id, title, content, minutes, sort_order) VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE topic_id = VALUES(topic_id), title = VALUES(title),
         content = VALUES(content), minutes = VALUES(minutes), sort_order = VALUES(sort_order)`,
      [l.code, topicId[l.topic], l.title, l.content, l.minutes, l.order ?? 0]
    );
  }

  order = 0;
  for (const b of badges) {
    await pool.query(
      `INSERT INTO badges (code, name, description, icon, rule_type, rule_value, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), icon = VALUES(icon),
         rule_type = VALUES(rule_type), rule_value = VALUES(rule_value), sort_order = VALUES(sort_order)`,
      [b.code, b.name, b.description, b.icon, b.rule, b.value, order++]
    );
  }

  console.log(
    `[db] seeded ${subjects.length} subjects, ${topics.length} topics, ${allQuestions.length} questions, ${lessons.length} lessons, ${badges.length} badges`
  );
}
