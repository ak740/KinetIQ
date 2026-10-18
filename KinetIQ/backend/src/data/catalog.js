// Subjects and topics. To add a subject (e.g. English), add it here, add questions/lessons
// that reference its topic slugs, and restart: the seed is idempotent.
export const subjects = [
  { slug: 'math', name: 'Mathematics', icon: '📐', description: 'Algebra, geometry, trigonometry, statistics and calculus' },
  { slug: 'science', name: 'Science', icon: '🔬', description: 'Physics, chemistry and biology fundamentals' },
];

export const topics = [
  { subject: 'math', slug: 'algebra', name: 'Algebra', description: 'Equations, expressions, functions', gradeMin: 9 },
  { subject: 'math', slug: 'geometry', name: 'Geometry', description: 'Shapes, area, volume, similarity', gradeMin: 9 },
  { subject: 'math', slug: 'trigonometry', name: 'Trigonometry', description: 'Ratios, identities, radians', gradeMin: 10 },
  { subject: 'math', slug: 'stats-probability', name: 'Statistics & Probability', description: 'Averages, chance, counting', gradeMin: 9 },
  { subject: 'math', slug: 'calculus', name: 'Calculus Basics', description: 'Limits, derivatives, integrals', gradeMin: 11 },
  { subject: 'science', slug: 'mechanics', name: 'Mechanics (Physics)', description: 'Motion, forces, energy', gradeMin: 9 },
  { subject: 'science', slug: 'electricity', name: 'Electricity & Magnetism (Physics)', description: 'Circuits, power, fields', gradeMin: 9 },
  { subject: 'science', slug: 'atoms-periodic', name: 'Atoms & Periodic Table (Chemistry)', description: 'Structure, bonding, trends', gradeMin: 9 },
  { subject: 'science', slug: 'chemical-reactions', name: 'Chemical Reactions (Chemistry)', description: 'Equations, acids, moles', gradeMin: 9 },
  { subject: 'science', slug: 'cells-genetics', name: 'Cells & Genetics (Biology)', description: 'Cell biology, DNA, inheritance', gradeMin: 9 },
];
