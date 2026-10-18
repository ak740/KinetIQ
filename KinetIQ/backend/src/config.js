const num = (v, d) => (v === undefined || v === '' || Number.isNaN(+v) ? d : +v);

export const config = {
  port: num(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: num(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'kinetiq',
    password: process.env.DB_PASSWORD || 'kinetiq_pass',
    database: process.env.DB_NAME || 'kinetiq',
  },
  learning: {
    weeklyCooldownDays: num(process.env.WEEKLY_COOLDOWN_DAYS, 7),
    weeklyTestSize: 10,
    quizSize: 5,
    diagnosticPerTopic: 3,
    strongThreshold: 75, // mastery >= this -> strength
    weakThreshold: 50, // mastery < this -> weakness
    masteredThreshold: 80,
  },
  // XP awarded per activity. Add new activity types here.
  xp: {
    diagnostic: 50,
    weekly: 40,
    quiz: 10,
    lesson: 15,
    perCorrectAnswer: 2,
  },
};
