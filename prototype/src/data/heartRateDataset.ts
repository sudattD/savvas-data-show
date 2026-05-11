// Heart rate vs body mass across mammals — a compact biology dataset for
// teaching log-log relationships (Kleiber-style allometry).
//
// Values are *typical resting* heart rates and *typical adult* body masses
// compiled from comparative-physiology references. Sources: Schmidt-Nielsen,
// "Animal Physiology: Adaptation and Environment" (5th ed., 1997); Calder,
// "Size, Function, and Life History" (1984); plus AVMA / NIH reference
// ranges for domesticated species and the WHO range for humans.
//
// Within any species, resting heart rate varies by ±30% with age, fitness,
// and time of day. The dataset's point is not the precise value for each
// species but the *trend* across five orders of magnitude in mass: log(BPM)
// drops by about 0.25 for every 10× increase in body mass — a relationship
// known to hold for resting metabolism going back to Max Rubner (1883) and
// quantified by Max Kleiber in 1932.

import type { Dataset } from '../lib/dataset';

interface Row {
  species: string;
  group: string; // taxonomic / size group, useful for color
  massKg: number; // body mass in kilograms
  bpm: number; // resting heart rate, beats per minute
  lifespanYears: number; // typical maximum lifespan in years
}

const RAW: Row[] = [
  { species: 'Etruscan shrew',  group: 'Tiny mammal',  massKg: 0.0018, bpm: 1200, lifespanYears: 2 },
  { species: 'Mouse',           group: 'Tiny mammal',  massKg: 0.020,  bpm: 500,  lifespanYears: 3 },
  { species: 'Hamster',         group: 'Tiny mammal',  massKg: 0.120,  bpm: 450,  lifespanYears: 4 },
  { species: 'Rat',             group: 'Small mammal', massKg: 0.250,  bpm: 350,  lifespanYears: 4 },
  { species: 'Rabbit',          group: 'Small mammal', massKg: 2.0,    bpm: 200,  lifespanYears: 9 },
  { species: 'Cat',             group: 'Small mammal', massKg: 4.5,    bpm: 150,  lifespanYears: 15 },
  { species: 'Dog (small)',     group: 'Small mammal', massKg: 10,     bpm: 110,  lifespanYears: 14 },
  { species: 'Dog (large)',     group: 'Medium mammal', massKg: 30,    bpm: 80,   lifespanYears: 12 },
  { species: 'Sheep',           group: 'Medium mammal', massKg: 50,    bpm: 75,   lifespanYears: 12 },
  { species: 'Human',           group: 'Medium mammal', massKg: 70,    bpm: 70,   lifespanYears: 80 },
  { species: 'Horse',           group: 'Large mammal',  massKg: 500,   bpm: 40,   lifespanYears: 25 },
  { species: 'Cow',             group: 'Large mammal',  massKg: 700,   bpm: 50,   lifespanYears: 20 },
  { species: 'Giraffe',         group: 'Large mammal',  massKg: 1200,  bpm: 65,   lifespanYears: 25 },
  { species: 'African elephant', group: 'Megafauna',    massKg: 5000,  bpm: 28,   lifespanYears: 70 },
  { species: 'Orca',            group: 'Megafauna',     massKg: 5500,  bpm: 60,   lifespanYears: 50 },
  { species: 'Blue whale',      group: 'Megafauna',     massKg: 150000, bpm: 10,  lifespanYears: 90 },
];

export const HEART_RATE_DATASET: Dataset = {
  id: 'heartRate',
  name: 'Heart rate vs body mass (mammals)',
  description:
    'Resting heart rate and adult body mass for sixteen mammal species — from the 1.8-gram Etruscan shrew (~1200 BPM) to the 150-tonne blue whale (~10 BPM). Five orders of magnitude in mass; a classic teaching example for log-log relationships.',
  source: 'Comparative-physiology references (Schmidt-Nielsen 1997, Calder 1984) + AVMA / WHO ranges',
  family: 'life',
  provenance: {
    primarySource: 'Schmidt-Nielsen, "Animal Physiology: Adaptation and Environment" (5th ed., Cambridge UP, 1997)',
    primarySourceUrl: 'https://www.cambridge.org/core/books/animal-physiology/2D24B41D5C2E0F38F8DCFF6BCC6BFD3E',
    collector: 'Compiled from comparative-physiology textbooks; individual species values come from species-specific veterinary references (AVMA), aquarium/zoo monitoring (cetaceans), and human clinical norms (WHO).',
    collectionMethod:
      'Each value is a *typical adult resting* heart rate and a *typical adult* body mass, compiled across literature reviews. Within any species, resting heart rate varies by roughly ±30% with age, fitness, time of day, and individual variation.',
    collectionPeriod: 'Reference values; current as of the 5th edition of Schmidt-Nielsen (1997)',
    retrievalDate: '2026-05-11',
    retrievalMethod: 'Hand-transcribed from Schmidt-Nielsen Table 4.1 + cross-checked against the AVMA companion-animal guide and the Calder allometry tables.',
    license: 'Reference values — facts about nature; reproduction of compiled values is fair use with citation',
    citation:
      'Schmidt-Nielsen, K. (1997). Animal Physiology: Adaptation and Environment, 5th ed. Cambridge UP. Calder, W. A. (1984). Size, Function, and Life History. Harvard UP.',
    caveats: [
      'Values are typical adult resting rates. Within-species variation is ±30% — your own resting heart rate isn\'t exactly 70 BPM; it might be 50–90.',
      'The blue whale value (10 BPM) is the surface-rest rate; during deep dives it can drop to 2 BPM.',
      'Heart rates rise dramatically during exercise. The blue whale\'s exertion rate can hit 30+ BPM — comparable to its resting elephant cousin.',
      'Three of these species (Etruscan shrew, orca, blue whale) are estimates from a small number of measurements due to the difficulty of measuring them at rest. Treat as order-of-magnitude.',
    ],
  },
  story: [
    {
      heading: 'A whale\'s heart beats 100× slower than a shrew\'s.',
      body:
        'Plot resting heart rate against body mass for any group of mammals and a stunningly consistent pattern emerges: bigger animals have slower hearts. The Etruscan shrew (1.8 g) clocks 1,200 beats per minute. The blue whale (150,000 kg) cruises at 10. Five orders of magnitude of mass, two orders of magnitude of heart rate.',
    },
    {
      heading: 'Why?',
      body:
        'Larger bodies have lower surface-to-volume ratios, so they lose heat more slowly per unit mass. They need less metabolic fire per gram. Slower metabolism means slower heart. Max Kleiber quantified this in 1932: metabolic rate scales as mass^0.75. Resting heart rate, which has to match metabolic demand, scales as mass^(-0.25) — give or take a noisy 0.05.',
      highlight: 'Heart rate ≈ a · mass^(-0.25). Slope on log-log axes: ≈ -0.25.',
    },
    {
      heading: 'About a billion heartbeats.',
      body:
        'Multiply each species\' heart rate by its typical lifespan and you get roughly the same number — somewhere between 0.5 and 2 billion heartbeats per lifetime. The shrew burns through its billion in three years; the whale, in ninety. Humans, with our medicine and our slow-paced lives, are now exceeding 3 billion — we\'ve broken the rule by living past our metabolic budget.',
    },
    {
      heading: 'How to see it in the data',
      body:
        'On linear axes, the data look like a sad hyperbola — the small animals tower over everything else. Flip both axes to log, and the same data becomes a clean straight line with slope ≈ -0.25. This is exactly what the Explorer\'s log-scale toggle is for. Fit a line and read off the slope.',
    },
  ],
  attributes: [
    { key: 'species',        label: 'Species',          kind: 'categorical', description: 'Mammal species (common name). Sixteen species spanning five orders of magnitude in body mass.' },
    { key: 'group',          label: 'Size class',       kind: 'categorical', ordinal: true, description: 'Tiny / Small / Medium / Large / Megafauna. Hand-grouped by body-mass range; useful for coloring or facetting.' },
    { key: 'massKg',         label: 'Body mass',        kind: 'numeric', unit: 'kg', description: 'Typical adult body mass in kilograms. Spans 0.0018 (Etruscan shrew) to 150,000 (blue whale).' },
    { key: 'bpm',            label: 'Resting heart rate', kind: 'numeric', unit: 'BPM', description: 'Typical adult resting heart rate in beats per minute. Within-species variation is ±30%.' },
    { key: 'lifespanYears',  label: 'Typical max lifespan', kind: 'numeric', unit: 'years', description: 'Typical maximum lifespan in years. Multiply by heart rate × 60 × 24 × 365 to get total lifetime heartbeats — roughly constant across species.' },
  ],
  featured: { x: 'massKg', y: 'bpm', color: 'group' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 6,
      topicName: 'Exponential and Logarithmic Functions',
      mathFit: 'Plot heart rate vs mass on linear axes — the data crowd into the corner. Switch both axes to log — they line up. Fit a line; the slope (≈ -0.25) is the Kleiber exponent.',
      standards: ['HSF-LE.A.4', 'HSF-IF.C.8'],
      studentWhy: 'Why does a whale\'s heart beat slower than a hummingbird\'s? Why do bigger animals live longer? The answer is the same equation.',
      objective: 'Students will fit a power law y = a·x^b to allometric data by linearizing with logarithms, and interpret the resulting exponent in biological terms.',
      minutes: 30,
      discussion: [
        'On linear axes the relationship "looks" like 1/x. On log-log it\'s a straight line. Which is the right way to see it, and why?',
        'If the slope is -0.25, what does that mean in words? Hint: doubling mass × 16 changes heart rate by a factor of ___.',
        'Multiply each species\' heart rate × lifespan × minutes-per-year. Is the result roughly constant? Why might that be?',
      ],
      flagship: true,
    },
  ],
  rows: RAW.map((r) => ({
    species: r.species,
    group: r.group,
    massKg: r.massKg,
    bpm: r.bpm,
    lifespanYears: r.lifespanYears,
  })),
};
