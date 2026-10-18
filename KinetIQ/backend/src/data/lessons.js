// Lesson content uses a tiny markdown subset: # / ## headings, "- " bullets, **bold**, `code`.
// Multiple lessons per topic are supported: add more entries with a different code and order.
const l = (topic, title, minutes, content) => ({ code: `${topic}-l1`, topic, title, minutes, order: 1, content });

export const lessons = [
  l('algebra', 'Solving Equations & Quadratics', 12, `# Solving equations
An equation says two expressions are equal. To solve it, do the **same operation to both sides** until the variable is alone.

## Linear equations
- Example: 2x + 6 = 14 → 2x = 8 → x = 4
- Always check by substituting back.

## Quadratics
A quadratic looks like ax² + bx + c = 0. Three ways to solve it:
- **Factor:** x² − 5x + 6 = (x − 2)(x − 3), so x = 2 or 3
- **Quadratic formula:** x = (−b ± √(b² − 4ac)) / 2a
- **Complete the square**

## The discriminant
D = b² − 4ac tells you the number of real roots:
- D > 0: two real roots
- D = 0: one repeated root
- D < 0: no real roots

## Systems of equations
Use **elimination** (add or subtract equations) or **substitution** to find values that satisfy both.

## Exponent equations
Rewrite both sides with the same base: 2^(x+1) = 32 = 2⁵, so x + 1 = 5.`),

  l('geometry', 'Shapes, Area & Volume', 12, `# Geometry essentials
## Angles
- Triangle interior angles add to **180°**.
- Regular n-gon interior angle = (n − 2) × 180° / n.

## Area & perimeter
- Rectangle: length × width
- Triangle: ½ × base × height
- Circle: πr², circumference 2πr

## Pythagoras
In a right triangle: a² + b² = c². The 6-8-10 and 3-4-5 triples come up often.

## Volume
- Cylinder: πr²h
- Cone: ⅓πr²h
- Sphere: 4⁄3 πr³

## Similarity
If sides scale by k, **areas scale by k²** and volumes by k³.

## Coordinate geometry
Distance between (x₁, y₁) and (x₂, y₂) is √((x₂ − x₁)² + (y₂ − y₁)²).`),

  l('trigonometry', 'Ratios, Identities & Radians', 12, `# Trigonometry
## SOH-CAH-TOA
- **sin θ** = opposite / hypotenuse
- **cos θ** = adjacent / hypotenuse
- **tan θ** = opposite / adjacent

## Special angles
- sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2
- tan 45° = 1

## Key identity
sin²θ + cos²θ = 1 and tan θ = sin θ / cos θ.

## Radians
π radians = 180°. So 90° = π/2 and 60° = π/3.

## Graphs
y = sin(bx) has period 2π/b. y = A sin x has amplitude A.

## Applications
Ladder, shadow and slope problems: draw the right triangle, label the known side, choose the ratio that links known and unknown.`),

  l('stats-probability', 'Averages, Probability & Counting', 11, `# Statistics & probability
## Averages
- **Mean:** sum ÷ count
- **Median:** middle value after sorting
- **Mode:** most frequent value

## Spread
**Standard deviation** measures how far values typically sit from the mean. Bigger means more spread.

## Probability
P(event) = favourable outcomes ÷ total outcomes, always between 0 and 1.
- Independent events: P(A and B) = P(A) × P(B)
- Either-or (exclusive): P(A or B) = P(A) + P(B)

## Counting
- Arrangements of n distinct items: **n!**
- Choosing r from n: nCr = n! / (r!(n − r)!)

Example: 4 books can be arranged in 4! = 24 ways.`),

  l('calculus', 'Limits, Derivatives & Integrals', 14, `# Calculus basics
## Limits
A limit is the value a function approaches. When direct substitution gives 0/0, factor and cancel: (x² − 4)/(x − 2) = x + 2 → 4 at x = 2.

## Derivatives
The derivative is the instantaneous rate of change (slope of the tangent).
- **Power rule:** d/dx xⁿ = n xⁿ⁻¹
- Constants differentiate to 0
- d/dx sin x = cos x, d/dx cos x = −sin x

## Finding turning points
Set f'(x) = 0 to find critical points, then check whether they are maxima or minima.

## Integrals
Integration reverses differentiation.
- ∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C
- Definite integrals give **area under the curve**: evaluate the antiderivative at the top limit minus the bottom limit.`),

  l('mechanics', 'Motion, Forces & Energy', 13, `# Mechanics
## Motion
- speed = distance / time
- v = u + at, s = ut + ½at²
- **Velocity** is a vector (has direction); speed is a scalar.

## Newton's laws
1. An object keeps its state of motion unless a net force acts (inertia).
2. **F = ma**
3. Every action has an equal and opposite reaction.

## Energy
- Kinetic energy: ½mv²
- Gravitational potential energy: mgh
- Energy is conserved; it only changes form.

## Free fall
Near Earth g ≈ 10 m/s² (9.8 more precisely). Starting from rest, v = gt.

## Tip
Always list known quantities with units first, then pick the equation that links them.`),

  l('electricity', 'Circuits, Power & Magnetism', 13, `# Electricity & magnetism
## Ohm's law
**V = IR**: voltage (V), current (A), resistance (Ω).

## Combining resistors
- **Series:** R = R₁ + R₂ (same current)
- **Parallel:** 1/R = 1/R₁ + 1/R₂ (same voltage)

## Power & energy
- P = VI = I²R
- Energy (kWh) = power (kW) × time (h)

## Magnetism
A current produces a magnetic field. Around a straight wire, field lines are **concentric circles** (right-hand grip rule). A coil acts like a bar magnet.`),

  l('atoms-periodic', 'Atoms, Bonding & the Periodic Table', 13, `# Atoms & the periodic table
## Particles
- Protons (+) and neutrons (0) in the nucleus; electrons (−) around it.
- **Atomic number** = protons. A neutral atom has equal electrons.
- **Isotopes** differ only in neutron count.

## Periodic table
- Groups (columns) share chemical behaviour: Group 1 alkali metals, Group 17 halogens, Group 18 noble gases.
- Across a period, atomic radius **decreases**; down a group it increases.

## Bonding
- **Ionic:** electrons are transferred (metal + non-metal)
- **Covalent:** electrons are shared (non-metals)

## Electron configuration
Fill shells in order 1s, 2s, 2p, 3s… Oxygen (8): 1s² 2s² 2p⁴.`),

  l('chemical-reactions', 'Reactions, Acids & Moles', 13, `# Chemical reactions
## Signs of a chemical change
New substance forms: colour change, gas, precipitate, heat or light.

## Balancing equations
Atoms are conserved, so each element needs the same count on both sides. 2H₂ + O₂ → 2H₂O.

## Acids and bases
- pH below 7 acidic, 7 neutral, above 7 basic.
- Acid + base → salt + water (**neutralisation**).

## Energy changes
- **Exothermic:** releases heat
- **Endothermic:** absorbs heat

## The mole
- moles = mass ÷ molar mass
- CO₂: 12 + 2 × 16 = 44 g/mol
- 36 g of water (18 g/mol) is 2 mol.`),

  l('cells-genetics', 'Cells, DNA & Inheritance', 13, `# Cells & genetics
## Cell structures
- **Nucleus:** holds DNA
- **Mitochondria:** release energy (ATP)
- **Chloroplasts:** (plants only) photosynthesis
- **Ribosomes:** make proteins

## Photosynthesis
Carbon dioxide + water + light → glucose + oxygen.

## DNA
Base pairs: **A–T** and **G–C**.
- **Transcription:** DNA → mRNA
- **Translation:** mRNA → protein

## Cell division
- **Mitosis:** two identical body cells
- **Meiosis:** four gametes with half the chromosomes (humans: 23)

## Inheritance
With Tt × Tt (T dominant), offspring are TT, Tt, Tt, tt, so **25%** show the recessive trait.`),
];
