// Per-chapter alignment between Savvas's enVision 3-Act Math "Act 1" hook
// videos and a real-data exploration we could pair alongside.
//
// Premise / question are summarized from the Gemini 3 Flash transcripts of
// the 35 official Act-1 videos (extracted from QR codes in the printed
// enVision AGA 2024 textbook). See ~/Downloads/savvas-envision-3act-videos/
// for the source MP4s, SRT captions, and full transcripts.
//
// Strength tiers:
//   strong   — Savvas's hook sets up a real phenomenon and we have (or
//              can build) a dataset that lets students investigate it
//   possible — connection is there but would need a fresh dataset
//   weak     — pure-math hook (counting, factoring, abstract symmetry); no
//              natural data extension
//
// `datasetIds` references entries in `data/registry.ts`. When the row's
// extension is conceptually clear but the dataset doesn't exist yet,
// `needsDataset` describes what would have to be built.

import type { CourseId } from './chapters';

export type AlignmentStrength = 'strong' | 'possible' | 'weak';

/** Concrete, real-world dataset that could anchor a chapter's Act-1.5
 *  exploration — even if we haven't compiled it into our registry yet.
 *  The point is to show that for every possible-fit chapter there's a
 *  named, public, citable source — not a hand-wave. */
export interface CandidateDataset {
  /** Short human name shown on the page. */
  name: string;
  /** Publisher / institution. */
  source: string;
  /** Direct URL to the dataset or its landing page. */
  sourceUrl: string;
  /** Optional one-line characterization of what's in it. */
  note?: string;
}

export interface AlignmentRow {
  course: CourseId;
  topic: number;
  /** What happens visually in the Savvas Act-1 video, in one sentence. */
  savvasPremise: string;
  /** The math question the video poses, verbatim or paraphrased. */
  savvasQuestion: string;
  /** One-paragraph description of the real-data exploration that would
   *  pick up where Act 1 leaves off. */
  exploration: string;
  /** IDs of existing datasets in registry.ts that this exploration uses. */
  datasetIds: string[];
  /** Concrete dataset that exists in the public world but isn't yet in
   *  our registry — points at the source so the alignment row stays
   *  credible without us having to author the dataset today. */
  needsDataset?: CandidateDataset;
  strength: AlignmentStrength;
}

export const ALIGNMENT: AlignmentRow[] = [
  // ─────────── Algebra 1 ───────────
  {
    course: 'algebra1', topic: 1,
    savvasPremise: 'Four students each shake bags of cans, claiming theirs holds the most.',
    savvasQuestion: 'Who collected the most cans?',
    exploration: 'Real container & packaging recycling rates for all 50 states (Ball/Eunomia 2021 data). "Our school collected 5,000 cans" × state rate = what actually got recycled. Bottle-bill states recycle 3× more — a one-step equation with policy stakes.',
    datasetIds: ['recyclingRates'],
    strength: 'possible',
  },
  {
    course: 'algebra1', topic: 2,
    savvasPremise: 'A tall man (Jay) is measured in stacks of sheep, babies, teachers, then plastic cups.',
    savvasQuestion: 'How many cups tall is Jay?',
    exploration: '75 seasons of average NBA player height (1947-2021). The league grew 5 inches taller from 1947 (6\'2") to 1986 (6\'7"), then plateaued, then has DROPPED since 2005 as the three-point game devalued tall centers. A piecewise linear trend with a real breakpoint.',
    datasetIds: ['nbaHeights'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 3,
    savvasPremise: 'Supermarket express lane with three shopping carts; baskets line up alongside to match the length.',
    savvasQuestion: 'How many baskets equal the length of the 3 carts?',
    exploration: 'Pure unit-ratio question — no natural real-world phenomenon to extend.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'algebra1', topic: 4,
    savvasPremise: 'Two coworkers race to a rooftop party from their cubicles, taking separate elevators.',
    savvasQuestion: 'Who reaches the rooftop first?',
    exploration: '14 elevator systems from Guangzhou CTF\'s 21 m/s express (world\'s fastest) to a residential home elevator at 0.5 m/s — a 42× spread. Real linear-function math: d = v × t, plus waiting time as an intercept. Two coworkers race up the same shaft becomes a literal system-of-equations problem.',
    datasetIds: ['elevators'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 5,
    savvasPremise: 'A runner attempts to physically act out a speed-vs-time graph and gets confused as the graph fails to match.',
    savvasQuestion: 'Does the graph accurately represent the runner\'s speed?',
    exploration: 'Phone accelerometer logs a student\'s actual run — height vs. time, slope vs. time. Slope-as-rate becomes embodied; the class compares fastest vs. steepest. Existing dataset of Boston Marathon paces gives a population-scale comparison.',
    datasetIds: ['marathon'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 6,
    savvasPremise: 'A woman time-travels: deposits $100 at 5% interest, returns to find $100 million.',
    savvasQuestion: 'How many years did she travel into the future?',
    exploration: 'Real S&P 500 annual returns since 1928 — $100 invested at the start of 1928 is worth ~$1M by 2024. Solve for t given the actual long-run CAGR, then compare the smooth model to the actual year-by-year path with its crashes. Pairs with our Moore\'s Law dataset for cross-domain exponentials.',
    datasetIds: ['sp500', 'moore'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 7,
    savvasPremise: 'Four students each write a different factored expression for the same problem.',
    savvasQuestion: 'Which student has the correct answer?',
    exploration: 'Pure-algebra check; no real-world phenomenon.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'algebra1', topic: 8,
    savvasPremise: 'A player takes six basketball shots from the same spot; each ball\'s arc is traced.',
    savvasQuestion: 'Which shot is most likely to go in?',
    exploration: 'Same quadratic-fitting math on TWO real domains: our Wind Power Curve activity (slider-fit P = av² + bv + c on a 1.5 MW turbine) and 4 million real NBA shots since 2003-04 with x/y coordinates and make/miss outcomes. The math that runs a wind farm also predicts an NBA shot.',
    datasetIds: ['wind'],
    needsDataset: {
      name: 'NBA Shot Locations 2003-04 → 2024-25',
      source: 'DomSamangy / NBA_Shots_04_25',
      sourceUrl: 'https://github.com/DomSamangy/NBA_Shots_04_25',
      note: '~4M shots with x/y coordinates, distance, shot type, make/miss. Free, public, NBA-sourced.',
    },
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 9,
    savvasPremise: 'A young woman spreads out pennies from rolls; many more rolls remain unopened.',
    savvasQuestion: 'How many pennies are in the basket?',
    exploration: 'US Mint penny production by year, 1959–2025 — 67 years of real federal data. Rose to a 1982 peak of 16.7 billion, declined to 1.3 billion in 2025 as Treasury wound down the penny. A cubic-shaped curve whose roots are policy dates.',
    datasetIds: ['usMintCents'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 10,
    savvasPremise: 'A woman paints small wooden squares and tiles a 3×3 grid; she begins covering a much larger board with the same pattern.',
    savvasQuestion: 'How many small squares will it take to cover the large board?',
    exploration: 'Area scaling, mostly synthetic; weak data fit.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'algebra1', topic: 11,
    savvasPremise: 'A young man scrolls through endless unread text messages on his phone.',
    savvasQuestion: 'How many unread text messages does he have?',
    exploration: 'Our Reaction Time Arena anchors this chapter — students generate their own distributions (visual + audio) and compare summary statistics. Real "messaging volume" data from Pew Research gives a population benchmark to compare class data against.',
    datasetIds: ['marathon', 'penguins', 'countries'],
    strength: 'strong',
  },

  // ─────────── Geometry ───────────
  {
    course: 'geometry', topic: 1,
    savvasPremise: 'Close-ups of circular objects with repeating parts: saw blade, turbine, bicycle spokes, dartboard.',
    savvasQuestion: 'How many of each segment are there in total?',
    exploration: 'Counting via rotational symmetry — pure-geometry hook. Weak data fit beyond classification.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'geometry', topic: 2,
    savvasPremise: 'Satellite view of three rural construction sites paving roads over different durations.',
    savvasQuestion: 'Which site will finish first?',
    exploration: '8 famous US highway megaprojects with planned vs. actual durations (Big Dig: 9 years late and 9× over budget; I-15 Salt Lake: finished EARLY for the Olympics). Each project is a line: miles paved = rate × time. Different slopes, line intersections, and the planned-vs-actual lines diverge.',
    datasetIds: ['highwayProjects'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 3,
    savvasPremise: 'A presenter rotates and flips a 12-sided polygon with arrows on each side.',
    savvasQuestion: 'Where will the back arrow point after a rotation and flip?',
    exploration: 'Pure transformation geometry. Possible add-on: chirality in molecules (real biology) but that\'s a stretch from textbook scope.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'geometry', topic: 4,
    savvasPremise: 'Four students each try to draw a triangle with the same two sides (5", 7") and included angle (30°).',
    savvasQuestion: 'Will all four students draw the same triangle?',
    exploration: 'SAS uniqueness — pure-math demonstration. Weak data fit.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'geometry', topic: 5,
    savvasPremise: 'A county planner discusses where to put a helicopter ambulance pad so it serves three towns fairly.',
    savvasQuestion: 'Where should the pad be located to be equidistant from all three towns?',
    exploration: 'NYC FDNY response-time data for all 5 boroughs — Manhattan 8.3 min average, Bronx 13.7 min (5 min gap, same agency). Borough centroids give triangle vertices for circumcenter, centroid, and geometric-median calculations. Three "fair" definitions yield three different answers — all are real EMS-station-siting problems.',
    datasetIds: ['nycEms'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 6,
    savvasPremise: 'Close-ups of objects with multiple sides: coin, okra cross-section, glass base, umbrella.',
    savvasQuestion: 'How many sides does each object have?',
    exploration: 'Polygon classification — pure visual identification. Weak data fit.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'geometry', topic: 7,
    savvasPremise: 'A presenter shows a town model to the Mayor; the Mayor\'s figure is too small, so she scales it up.',
    savvasQuestion: 'How tall is the Mayor\'s statue?',
    exploration: 'The world\'s 30 tallest buildings — CTBUH-verified heights from 828 m (Burj Khalifa, 2010) to 428 m (Shandong IFC, 2025). Floors-to-height is a similarity relationship with revealing scatter: Empire State runs 3.7 m/floor, Burj Khalifa runs 5 m/floor. Same proportion math you use on a paper model.',
    datasetIds: ['tallestBuildings'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 8,
    savvasPremise: 'Two scientists measure park objects with a ladder; they reach a tree taller than their ladder.',
    savvasQuestion: 'How tall is the tree?',
    exploration: 'Our "Measure a Star" activity is the astronomical upgrade — Hipparcos parallax + Earth\'s orbit baseline gives the distance to nearby stars using the same right-triangle trig the kids use for the tree. Same principle, scaled to parsecs.',
    datasetIds: ['stars'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 9,
    savvasPremise: 'Four students try to plot two points and a third point exactly halfway between them.',
    savvasQuestion: 'Where is the midpoint of the segment?',
    exploration: 'Pure coordinate geometry; weak data fit.',
    datasetIds: [],
    strength: 'weak',
  },
  {
    course: 'geometry', topic: 10,
    savvasPremise: 'A satellite orbits Earth; the view zooms out to show two satellites each covering an arc of the surface.',
    savvasQuestion: 'How many satellites are needed to cover the entire equator?',
    exploration: 'Real satellite fleet — 16 operational constellations from ISS (410 km, 2,200 km coverage) to GEO weather sats (35,786 km, 9,000 km coverage). Coverage radius is the geometric horizon arccos(R/(R+h)). For a great-circle of length 2πR, how many caps tile it? Three GEO satellites cover the equator. Why does Starlink need 7,800?',
    datasetIds: ['satellites'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 11,
    savvasPremise: 'Orange candles are surrounded by cardboard boxes that fly into a shipping container in a grid.',
    savvasQuestion: 'How many candle boxes will fit in the large shipping box?',
    exploration: 'Five USPS Priority Mail flat-rate boxes with exact inside dimensions — Small (75 in³, $11) to Large (792 in³, $25). Rectangular-prism packing: how many Small boxes fit inside a Large? The answer is almost never the volume ratio.',
    datasetIds: ['uspsBoxes'],
    strength: 'strong',
  },
  {
    course: 'geometry', topic: 12,
    savvasPremise: 'A young woman flips four coins while a young man rolls two dice; they perform trials simultaneously.',
    savvasQuestion: 'Is the game fair?',
    exploration: 'Our "Hurricane Coin" activity (already mapped to this chapter) computes empirical probabilities from 70+ years of real Atlantic hurricane records — what\'s the chance of a Cat 4+ in any given year? Same probability framework, real-world stakes.',
    datasetIds: ['hurricanes'],
    strength: 'strong',
  },

  // ─────────── Algebra 2 ───────────
  {
    course: 'algebra2', topic: 1,
    savvasPremise: 'Three people run power tools through a Kill-A-Watt meter on one outlet — circular saw, belt sander, drill.',
    savvasQuestion: 'Will the circuit breaker trip if all three tools run at once?',
    exploration: '23 common appliances with real operating amperage. Sum of currents on a circuit is a linear expression; constraint is the breaker rating (15A or 20A). Which subsets of appliances stay within the limit? Why does NEC code limit continuous loads to 80%?',
    datasetIds: ['applianceLoads'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 2,
    savvasPremise: 'A cartoon soccer player kicks five colored balls toward a goal; each shot pauses at three flight points.',
    savvasQuestion: 'Which shot will go into the goal?',
    exploration: '25 representative shots from the 2022 FIFA World Cup with location, body part, defender count, and StatsBomb expected-goal (xG) probabilities. A penalty is 0.76; a long-range speculative shot is 0.03. The math is quadratic trajectory + position-dependent probability.',
    datasetIds: ['worldCupShots'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 3,
    savvasPremise: 'A tennis player serves numbered balls; some land in, some land out (different signed numbers).',
    savvasQuestion: 'Which of the remaining tennis balls will land in?',
    exploration: '25 fastest recorded tennis serves — Isner\'s ATP-record 157 mph, Sam Groth\'s ATP-unrecognized 163 mph Challenger, García Pérez\'s 137 mph WTA record. Each serve\'s flight is a polynomial in time: y(t) = h₀ + v_y·t − ½g·t². Whether it lands "in" depends on where the polynomial roots fall.',
    datasetIds: ['tennisServes'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 4,
    savvasPremise: 'A boy fills a pool with one hose (June), a stronger hose (July), then both (August).',
    savvasQuestion: 'How long will it take with both hoses?',
    exploration: '14 plumbing fixtures with real flow rates — federal-baseline vs. EPA WaterSense-certified. A garden hose runs ~12 gpm; a high-pressure source runs ~20 gpm; together about 32. The combined-rate rational-function setup with policy-grade numbers (1992 Energy Policy Act + 2006 WaterSense voluntary label).',
    datasetIds: ['waterFixtures'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 5,
    savvasPremise: 'Three friends at a beach debate which path to a snack shack is fastest, mixing sand vs. boardwalk.',
    savvasQuestion: 'Who reaches the shack first?',
    exploration: '12 running surfaces with real sprint speeds and metabolic costs from peer-reviewed sports-medicine studies. Synthetic track is 9.45 m/s; deep sand is 5.80 m/s (39% slower). Minimize total time over a path crossing two media. The math is Snell\'s law of refraction in disguise.',
    datasetIds: ['runningSurfaces'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 6,
    savvasPremise: 'A soccer player does shuttle runs that double each round, adding markers each time.',
    savvasQuestion: 'How far will the coach run in Round 20?',
    exploration: 'Geometric series with real training data — actual interval-training distances logged by coaches. Pair with our Olympic 100m and marathon datasets for cross-distance pacing comparisons.',
    datasetIds: ['olympic100m', 'marathon'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 7,
    savvasPremise: 'A flute player plays a melody; a sine wave appears on a coordinate plane as she holds a steady note.',
    savvasQuestion: 'What is the equation of the sine wave?',
    exploration: 'Our Voice DNA activity is literally this — live spectrogram via WebAudio, students see sums of sines as Fourier decomposition of their own voice. Our SF tides dataset is the second sinusoidal source (12.42-hour lunar period).',
    datasetIds: ['tides', 'co2'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 8,
    savvasPremise: 'A woman in a wheelchair watches two construction workers prepare to build a ramp for her porch.',
    savvasQuestion: 'How long should the ramp be?',
    exploration: '12 residential and public-building ramp scenarios with rise, slope, run, and ADA landing requirements. A single porch step (7.5" rise) needs 17.5 ft of total ramp under 1:12 ADA code. The trig identity tan(θ) = rise / run, with policy stakes attached.',
    datasetIds: ['adaRamps'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 9,
    savvasPremise: 'A man installs three sprinkler heads on a rectangular lawn.',
    savvasQuestion: 'Where should the sprinklers go to cover the entire lawn?',
    exploration: '11 cell-tower scenarios from rural 4G macrocells (707 km² each) down to 5G mmWave urban cells (0.28 km² each). Same disk-covering geometry as three sprinklers on a lawn, scaled up to Manhattan. Plot tower count needed vs. environment — the 5G capital-expenditure story falls out.',
    datasetIds: ['satellites', 'cellCoverage'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 10,
    savvasPremise: 'A customer insists on the "biggest burger" possible at a burger shop.',
    savvasQuestion: 'How many patties are in the big burger?',
    exploration: '25 signature fast-food burgers and sandwiches from seven chains, each with calories, fat, sodium, carbs, protein, and patty count — FDA-required disclosures, so the numbers are canonical. The matrix multiplication of nutrition: row vector "how many of each" × this 25×7 nutrient matrix = total meal. The same math the Census Pyramid uses to project a population.',
    datasetIds: ['population', 'fastFoodBurgers'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 11,
    savvasPremise: 'A girl frustrated by counting coins in her jar wants to estimate the total faster.',
    savvasQuestion: 'How much money is in the jar?',
    exploration: '12 published Alaska Chinook salmon mark-recapture studies — Yukon adults 2000-2004, Chilkat smolts, Unuk smolts. Apply Lincoln-Petersen (N = M × n / r), get a population estimate, compare to ADF&G\'s published number. The same equation that counts the coins counts the salmon.',
    datasetIds: ['salmonMarkRecapture'],
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 12,
    savvasPremise: 'A young woman and man play a coin-vs-dice game and bicker about who will win.',
    savvasQuestion: 'Is the game fair?',
    exploration: 'Our Rare Disease Test puts conditional probability + base-rate fallacy on a 1,000-patient grid. Hurricane Coin extends it to real frequency data. Coin-flip fairness is the first rung of the same ladder.',
    datasetIds: ['hurricanes'],
    strength: 'strong',
  },
];

export function alignmentFor(course: CourseId, topic: number): AlignmentRow | undefined {
  return ALIGNMENT.find((r) => r.course === course && r.topic === topic);
}

export function strengthCount(strength: AlignmentStrength): number {
  return ALIGNMENT.filter((r) => r.strength === strength).length;
}
