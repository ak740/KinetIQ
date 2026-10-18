const q = (topic, n, difficulty, gradeMin, text, options, correct, explanation) => ({
  code: `${topic}-${n}`, topic, difficulty, gradeMin, text, options, correct, explanation,
});

export const scienceQuestions = [
  // Mechanics
  q('mechanics', 1, 1, 9, 'What is the SI unit of force?', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'Force is measured in newtons (N).'),
  q('mechanics', 2, 1, 9, 'A car travels 120 km in 2 hours. Its average speed is…', ['40 km/h', '60 km/h', '120 km/h', '240 km/h'], 1, 'Speed = distance / time = 120 / 2 = 60 km/h.'),
  q('mechanics', 3, 2, 9, "Newton's first law says that…", ['F = ma', 'Objects keep their state of motion unless a net force acts', 'Every action has an equal and opposite reaction', 'Force equals pressure × area'], 1, 'The first law is the law of inertia.'),
  q('mechanics', 4, 2, 9, 'A 5 kg mass accelerates at 3 m/s². The net force is…', ['1.7 N', '8 N', '15 N', '53 N'], 2, 'F = ma = 5 × 3 = 15 N.'),
  q('mechanics', 5, 2, 10, 'Which of these is a vector quantity?', ['Speed', 'Mass', 'Velocity', 'Time'], 2, 'Velocity has both magnitude and direction.'),
  q('mechanics', 6, 2, 10, 'Kinetic energy of a 2 kg object moving at 3 m/s?', ['6 J', '9 J', '18 J', '3 J'], 1, 'KE = ½mv² = ½ × 2 × 9 = 9 J.'),
  q('mechanics', 7, 3, 10, 'An object falls from rest for 2 s (g = 10 m/s²). Its speed is…', ['10 m/s', '20 m/s', '40 m/s', '5 m/s'], 1, 'v = gt = 10 × 2 = 20 m/s.'),
  q('mechanics', 8, 3, 11, 'A 1000 kg car speeds up from 10 to 20 m/s in 5 s. The net force is…', ['500 N', '1000 N', '2000 N', '5000 N'], 2, 'a = 10/5 = 2 m/s², so F = 1000 × 2 = 2000 N.'),

  // Electricity & Magnetism
  q('electricity', 1, 1, 9, 'What is the unit of electric current?', ['Volt', 'Ohm', 'Ampere', 'Watt'], 2, 'Current is measured in amperes (A).'),
  q('electricity', 2, 1, 9, "Ohm's law states…", ['V = I / R', 'V = IR', 'V = R / I', 'V = I + R'], 1, 'Voltage equals current times resistance.'),
  q('electricity', 3, 2, 9, 'A 12 V battery drives current through a 4 Ω resistor. Current?', ['0.33 A', '3 A', '8 A', '48 A'], 1, 'I = V / R = 12 / 4 = 3 A.'),
  q('electricity', 4, 2, 10, 'Total resistance of 2 Ω and 3 Ω resistors in series?', ['1.2 Ω', '5 Ω', '6 Ω', '0.2 Ω'], 1, 'Series resistances add: 2 + 3 = 5 Ω.'),
  q('electricity', 5, 2, 10, 'Total resistance of 6 Ω and 3 Ω resistors in parallel?', ['9 Ω', '4.5 Ω', '2 Ω', '18 Ω'], 2, '1/R = 1/6 + 1/3 = 1/2, so R = 2 Ω.'),
  q('electricity', 6, 2, 10, 'Power used by a device with 10 V across it and 2 A through it?', ['5 W', '12 W', '20 W', '8 W'], 2, 'P = VI = 10 × 2 = 20 W.'),
  q('electricity', 7, 3, 11, 'Energy used by a 100 W bulb left on for 10 hours?', ['0.1 kWh', '1 kWh', '10 kWh', '100 kWh'], 1, '0.1 kW × 10 h = 1 kWh.'),
  q('electricity', 8, 3, 11, 'The magnetic field around a straight current-carrying wire forms…', ['No field', 'Concentric circles around the wire', 'Lines parallel to the wire', 'Lines radiating outward'], 1, 'The right-hand grip rule gives circular field lines around the wire.'),

  // Atoms & Periodic Table
  q('atoms-periodic', 1, 1, 9, 'What is the charge of a proton?', ['Negative', 'Positive', 'Neutral', 'Variable'], 1, 'Protons carry a positive charge.'),
  q('atoms-periodic', 2, 1, 9, 'The atomic number of an element is its number of…', ['Neutrons', 'Protons', 'Protons + neutrons', 'Electrons + neutrons'], 1, 'Atomic number Z = number of protons.'),
  q('atoms-periodic', 3, 2, 9, 'Group 1 elements are called…', ['Halogens', 'Noble gases', 'Alkali metals', 'Alkaline earth metals'], 2, 'Group 1 (Li, Na, K…) are the alkali metals.'),
  q('atoms-periodic', 4, 2, 9, 'A neutral atom of sodium (Z = 11) has how many electrons?', ['1', '10', '11', '23'], 2, 'Neutral atoms have as many electrons as protons.'),
  q('atoms-periodic', 5, 2, 10, 'An ionic bond forms by…', ['Sharing electrons', 'Transfer of electrons', 'Sharing neutrons', 'Attraction of protons'], 1, 'One atom gives electrons to another, forming oppositely charged ions.'),
  q('atoms-periodic', 6, 2, 10, 'Isotopes of an element differ in their number of…', ['Protons', 'Neutrons', 'Electrons', 'Atomic number'], 1, 'Same protons, different neutrons.'),
  q('atoms-periodic', 7, 3, 11, 'Electron configuration of oxygen (Z = 8)?', ['1s² 2s² 2p⁶', '1s² 2s² 2p⁴', '1s² 2s⁴ 2p²', '1s² 2p⁶'], 1, 'Fill 1s (2), 2s (2), then 2p gets the remaining 4.'),
  q('atoms-periodic', 8, 3, 11, 'Across a period (left to right) atomic radius generally…', ['Increases', 'Decreases', 'Stays the same', 'Doubles'], 1, 'Increasing nuclear charge pulls electrons closer.'),

  // Chemical Reactions
  q('chemical-reactions', 1, 1, 9, 'Which of these is a chemical change?', ['Ice melting', 'Iron rusting', 'Water boiling', 'Sugar dissolving'], 1, 'Rusting forms a new substance (iron oxide).'),
  q('chemical-reactions', 2, 1, 9, 'The chemical formula of water is…', ['HO', 'H₂O', 'H₂O₂', 'OH'], 1, 'Two hydrogen atoms bonded to one oxygen atom.'),
  q('chemical-reactions', 3, 2, 9, 'Balance H₂ + O₂ → H₂O. What is the coefficient of H₂O?', ['1', '2', '3', '4'], 1, '2H₂ + O₂ → 2H₂O.'),
  q('chemical-reactions', 4, 2, 10, 'The pH of a neutral solution at 25 °C is…', ['0', '7', '10', '14'], 1, 'pH 7 is neutral.'),
  q('chemical-reactions', 5, 2, 10, 'Acid + base → salt + water is called…', ['Combustion', 'Neutralisation', 'Decomposition', 'Displacement'], 1, 'This is a neutralisation reaction.'),
  q('chemical-reactions', 6, 2, 10, 'Molar mass of CO₂ (C = 12, O = 16)?', ['28 g/mol', '32 g/mol', '44 g/mol', '56 g/mol'], 2, '12 + 2 × 16 = 44 g/mol.'),
  q('chemical-reactions', 7, 2, 11, 'A reaction that releases heat to the surroundings is…', ['Endothermic', 'Exothermic', 'Isothermal', 'Catalytic'], 1, 'Exothermic reactions release energy.'),
  q('chemical-reactions', 8, 3, 11, 'How many moles are in 36 g of water (18 g/mol)?', ['0.5', '2', '18', '648'], 1, 'n = mass / molar mass = 36 / 18 = 2.'),

  // Cells & Genetics
  q('cells-genetics', 1, 1, 9, 'Which organelle is the "powerhouse" of the cell?', ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi body'], 2, 'Mitochondria produce most of the cell’s ATP.'),
  q('cells-genetics', 2, 1, 9, 'Which organelle is found in plant cells but not animal cells?', ['Mitochondrion', 'Chloroplast', 'Nucleus', 'Ribosome'], 1, 'Chloroplasts carry out photosynthesis in plants.'),
  q('cells-genetics', 3, 2, 9, 'Photosynthesis produces…', ['CO₂ and water', 'Glucose and oxygen', 'Glucose and CO₂', 'Oxygen and water only'], 1, '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.'),
  q('cells-genetics', 4, 2, 10, 'In DNA, adenine pairs with…', ['Guanine', 'Cytosine', 'Thymine', 'Uracil'], 2, 'A pairs with T, and G pairs with C.'),
  q('cells-genetics', 5, 2, 10, 'Tt × Tt (T dominant). What fraction of offspring show the recessive trait?', ['0%', '25%', '50%', '75%'], 1, 'Only tt shows it: 1 in 4.'),
  q('cells-genetics', 6, 2, 10, 'Cell division that produces gametes is…', ['Mitosis', 'Meiosis', 'Binary fission', 'Budding'], 1, 'Meiosis halves the chromosome number.'),
  q('cells-genetics', 7, 3, 11, 'Making mRNA from a DNA template is called…', ['Translation', 'Replication', 'Transcription', 'Mutation'], 2, 'Transcription copies DNA into mRNA; translation builds protein.'),
  q('cells-genetics', 8, 3, 11, 'How many chromosomes are in a human gamete?', ['46', '23', '44', '92'], 1, 'Gametes are haploid: 23 chromosomes.'),
];
