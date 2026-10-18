// q(topic, n, difficulty 1-3, gradeMin, text, options, correctIndex, explanation)
const q = (topic, n, difficulty, gradeMin, text, options, correct, explanation) => ({
  code: `${topic}-${n}`, topic, difficulty, gradeMin, text, options, correct, explanation,
});

export const mathQuestions = [
  // Algebra
  q('algebra', 1, 1, 9, 'Solve for x: 2x + 6 = 14', ['3', '4', '5', '8'], 1, 'Subtract 6 to get 2x = 8, then divide by 2: x = 4.'),
  q('algebra', 2, 1, 9, 'Simplify: 3(x + 2) − x', ['2x + 6', '4x + 6', '2x + 2', '3x + 5'], 0, 'Distribute: 3x + 6 − x = 2x + 6.'),
  q('algebra', 3, 2, 9, 'Solve: x² − 5x + 6 = 0', ['x = 1 or 6', 'x = 2 or 3', 'x = −2 or −3', 'x = −2 or 3'], 1, 'Factor as (x − 2)(x − 3) = 0.'),
  q('algebra', 4, 2, 9, 'What is the slope of the line through (1, 2) and (3, 8)?', ['2', '3', '4', '6'], 1, 'Slope = (8 − 2)/(3 − 1) = 6/2 = 3.'),
  q('algebra', 5, 2, 10, 'Solve the system: x + y = 10 and x − y = 2', ['x=5, y=5', 'x=6, y=4', 'x=4, y=6', 'x=7, y=3'], 1, 'Adding the equations gives 2x = 12, so x = 6 and y = 4.'),
  q('algebra', 6, 2, 10, 'If f(x) = 2x² − 3x + 1, what is f(2)?', ['1', '3', '5', '7'], 1, 'f(2) = 8 − 6 + 1 = 3.'),
  q('algebra', 7, 3, 10, 'How many real roots does x² + 4x + 5 = 0 have?', ['Two', 'One', 'None', 'Cannot be determined'], 2, 'Discriminant = 16 − 20 = −4 < 0, so there are no real roots.'),
  q('algebra', 8, 3, 11, 'Solve for x: 2^(x+1) = 32', ['3', '4', '5', '16'], 1, '32 = 2⁵, so x + 1 = 5 and x = 4.'),

  // Geometry
  q('geometry', 1, 1, 9, 'What is the sum of the interior angles of a triangle?', ['90°', '180°', '270°', '360°'], 1, 'The interior angles of any triangle add up to 180°.'),
  q('geometry', 2, 1, 9, 'What is the area of a rectangle 5 cm by 8 cm?', ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], 2, 'Area = length × width = 5 × 8 = 40.'),
  q('geometry', 3, 2, 9, 'Area of a circle with radius 7 cm (use π = 22/7)?', ['44 cm²', '154 cm²', '49 cm²', '308 cm²'], 1, 'Area = πr² = (22/7) × 49 = 154.'),
  q('geometry', 4, 2, 9, 'A right triangle has legs 6 and 8. What is the hypotenuse?', ['10', '12', '14', '48'], 0, '√(36 + 64) = √100 = 10.'),
  q('geometry', 5, 2, 10, 'What is each interior angle of a regular hexagon?', ['108°', '120°', '135°', '150°'], 1, '(6 − 2) × 180° / 6 = 120°.'),
  q('geometry', 6, 2, 10, 'Volume of a cylinder with radius 3 and height 5?', ['15π', '30π', '45π', '90π'], 2, 'V = πr²h = π × 9 × 5 = 45π.'),
  q('geometry', 7, 3, 10, 'Two similar triangles have side ratio 2:3. What is their area ratio?', ['2:3', '4:9', '8:27', '4:6'], 1, 'Areas scale with the square of the side ratio: 2² : 3² = 4 : 9.'),
  q('geometry', 8, 3, 10, 'Distance between points (1, 2) and (4, 6)?', ['5', '7', '25', '√7'], 0, '√(3² + 4²) = √25 = 5.'),

  // Trigonometry
  q('trigonometry', 1, 1, 10, 'What is sin 30°?', ['√3/2', '1/2', '1', '√2/2'], 1, 'sin 30° = 1/2, a standard special-angle value.'),
  q('trigonometry', 2, 1, 10, 'What is tan 45°?', ['0', '1/2', '1', '√3'], 2, 'At 45° opposite and adjacent sides are equal, so tan = 1.'),
  q('trigonometry', 3, 2, 10, 'In a right triangle, cos θ equals…', ['opposite / hypotenuse', 'adjacent / hypotenuse', 'opposite / adjacent', 'hypotenuse / adjacent'], 1, 'SOH-CAH-TOA: cosine = adjacent / hypotenuse.'),
  q('trigonometry', 4, 2, 10, 'sin²θ + cos²θ equals…', ['0', '1', '2', 'tan θ'], 1, 'This is the Pythagorean identity.'),
  q('trigonometry', 5, 2, 10, '180° expressed in radians is…', ['π/2', 'π', '2π', 'π/4'], 1, 'A half turn is π radians.'),
  q('trigonometry', 6, 2, 11, 'A 10 m ladder makes 60° with the ground. How high up the wall does it reach?', ['5 m', '5√3 m', '10√3 m', '10 m'], 1, 'Height = 10 sin 60° = 10 × √3/2 = 5√3 m.'),
  q('trigonometry', 7, 3, 11, 'What is the period of y = sin(2x)?', ['2π', 'π', 'π/2', '4π'], 1, 'Period = 2π / 2 = π.'),
  q('trigonometry', 8, 3, 11, 'If sin θ = 3/5 and θ is acute, then cos θ =', ['3/4', '4/5', '5/4', '3/5'], 1, 'From the 3-4-5 triangle, adjacent = 4, so cos θ = 4/5.'),

  // Statistics & Probability
  q('stats-probability', 1, 1, 9, 'Mean of 2, 4, 6, 8?', ['4', '5', '6', '20'], 1, 'Sum = 20, divided by 4 values = 5.'),
  q('stats-probability', 2, 1, 9, 'Median of 3, 9, 1, 7, 5?', ['3', '5', '7', '9'], 1, 'Sorted: 1, 3, 5, 7, 9. The middle value is 5.'),
  q('stats-probability', 3, 1, 9, 'Probability a fair die shows an even number?', ['1/6', '1/3', '1/2', '2/3'], 2, 'Three of six outcomes (2, 4, 6) are even: 3/6 = 1/2.'),
  q('stats-probability', 4, 2, 9, 'Mode of 2, 3, 3, 4, 5, 3, 6?', ['2', '3', '4', '5'], 1, 'The mode is the most frequent value; 3 appears three times.'),
  q('stats-probability', 5, 2, 10, 'Probability of two heads in two fair coin tosses?', ['1/2', '1/4', '1/3', '3/4'], 1, '1/2 × 1/2 = 1/4.'),
  q('stats-probability', 6, 2, 10, 'How many ways can 4 distinct books be arranged on a shelf?', ['12', '16', '24', '64'], 2, '4! = 4 × 3 × 2 × 1 = 24.'),
  q('stats-probability', 7, 2, 11, 'Standard deviation measures…', ['The central value', 'The spread of data', 'The most frequent value', 'The middle value'], 1, 'Standard deviation describes how spread out values are around the mean.'),
  q('stats-probability', 8, 3, 11, 'A and B are independent with P(A) = 0.3 and P(B) = 0.4. P(A and B) = ?', ['0.7', '0.12', '0.1', '0.34'], 1, 'For independent events multiply: 0.3 × 0.4 = 0.12.'),

  // Calculus
  q('calculus', 1, 1, 11, 'Derivative of x³?', ['x²', '3x²', '3x', 'x⁴/4'], 1, 'Power rule: d/dx xⁿ = n·xⁿ⁻¹.'),
  q('calculus', 2, 1, 11, 'Derivative of the constant 7?', ['7', '1', '0', 'x'], 2, 'Constants do not change, so the derivative is 0.'),
  q('calculus', 3, 2, 11, 'd/dx (5x² + 3x) = ?', ['10x + 3', '5x + 3', '10x² + 3', '10x'], 0, 'Differentiate term by term: 10x + 3.'),
  q('calculus', 4, 2, 11, '∫ 2x dx = ?', ['2x² + C', 'x² + C', 'x + C', '2 + C'], 1, 'Reverse the power rule: ∫ 2x dx = x² + C.'),
  q('calculus', 5, 2, 11, 'lim x→2 of (x² − 4)/(x − 2) = ?', ['0', '2', '4', 'undefined'], 2, 'Factor: (x−2)(x+2)/(x−2) = x + 2, which tends to 4.'),
  q('calculus', 6, 2, 12, 'd/dx (sin x) = ?', ['−cos x', 'cos x', '−sin x', 'tan x'], 1, 'The derivative of sine is cosine.'),
  q('calculus', 7, 3, 12, 'f(x) = x² − 6x + 5 has a critical point at…', ['x = 1', 'x = 3', 'x = 5', 'x = 6'], 1, "f'(x) = 2x − 6 = 0 gives x = 3."),
  q('calculus', 8, 3, 12, '∫ from 0 to 2 of 3x² dx = ?', ['4', '6', '8', '12'], 2, '[x³] from 0 to 2 = 8 − 0 = 8.'),
];
