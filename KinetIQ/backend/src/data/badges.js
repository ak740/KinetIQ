// Badge rules are data-driven: a badge is earned when stats[rule] >= value.
// Available stat names live in services/gamification.js (collectStats).
// To add a badge, add a row here. To add a new stat, extend collectStats.
export const badges = [
  { code: 'baseline-set', name: 'Baseline Set', icon: '🎯', description: 'Complete your first diagnostic test', rule: 'diagnostics_completed', value: 1 },
  { code: 'full-picture', name: 'Full Picture', icon: '🧭', description: 'Complete diagnostics in two subjects', rule: 'diagnostics_completed', value: 2 },
  { code: 'quiz-rookie', name: 'Quiz Rookie', icon: '📝', description: 'Complete your first practice quiz', rule: 'quizzes_completed', value: 1 },
  { code: 'quiz-machine', name: 'Quiz Machine', icon: '⚙️', description: 'Complete 10 practice quizzes', rule: 'quizzes_completed', value: 10 },
  { code: 'weekly-warrior', name: 'Weekly Warrior', icon: '🗓️', description: 'Complete a weekly improvement test', rule: 'weekly_completed', value: 1 },
  { code: 'month-master', name: 'Month Master', icon: '🏆', description: 'Complete 4 weekly improvement tests', rule: 'weekly_completed', value: 4 },
  { code: 'flawless', name: 'Flawless', icon: '💎', description: 'Score 100% on any test or quiz', rule: 'perfect_tests', value: 1 },
  { code: 'curious-mind', name: 'Curious Mind', icon: '💡', description: 'Complete your first lesson', rule: 'lessons_completed', value: 1 },
  { code: 'bookworm', name: 'Bookworm', icon: '📚', description: 'Complete 5 lessons', rule: 'lessons_completed', value: 5 },
  { code: 'scholar', name: 'Scholar', icon: '🎓', description: 'Complete 10 lessons', rule: 'lessons_completed', value: 10 },
  { code: 'on-a-roll', name: 'On a Roll', icon: '🔥', description: 'Reach a 3-day study streak', rule: 'streak', value: 3 },
  { code: 'week-streak', name: 'Seven Strong', icon: '⚡', description: 'Reach a 7-day study streak', rule: 'streak', value: 7 },
  { code: 'unstoppable', name: 'Unstoppable', icon: '🚀', description: 'Reach a 30-day study streak', rule: 'streak', value: 30 },
  { code: 'rising-star', name: 'Rising Star', icon: '⭐', description: 'Earn 100 XP', rule: 'xp', value: 100 },
  { code: 'xp-hunter', name: 'XP Hunter', icon: '🌟', description: 'Earn 500 XP', rule: 'xp', value: 500 },
  { code: 'legend', name: 'Legend', icon: '👑', description: 'Earn 1000 XP', rule: 'xp', value: 1000 },
  { code: 'level-up', name: 'Level Up', icon: '📈', description: 'Improve a subject score by 10 points', rule: 'score_improvement', value: 10 },
  { code: 'transformer', name: 'Transformer', icon: '🦋', description: 'Improve a subject score by 25 points', rule: 'score_improvement', value: 25 },
  { code: 'topic-master', name: 'Topic Master', icon: '🥇', description: 'Reach 80% mastery in a topic', rule: 'topics_mastered', value: 1 },
  { code: 'polymath', name: 'Polymath', icon: '🧠', description: 'Reach 80% mastery in 5 topics', rule: 'topics_mastered', value: 5 },
];
