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
  /** If a fresh dataset is needed (not yet built), describe it here. */
  needsDataset?: string;
  strength: AlignmentStrength;
}

export const ALIGNMENT: AlignmentRow[] = [
  // ─────────── Algebra 1 ───────────
  {
    course: 'algebra1', topic: 1,
    savvasPremise: 'Four students each shake bags of cans, claiming theirs holds the most.',
    savvasQuestion: 'Who collected the most cans?',
    exploration: 'Recycling-drive data from a real school program: weight per bag → unit conversion → fundraising total. Anchors the same English-to-equation translation our Crack the Headline lesson teaches, but on data students could plausibly collect.',
    datasetIds: [],
    needsDataset: 'School recycling-drive weight totals (could be class-collected)',
    strength: 'weak',
  },
  {
    course: 'algebra1', topic: 2,
    savvasPremise: 'A tall man (Jay) is measured in stacks of sheep, babies, teachers, then plastic cups.',
    savvasQuestion: 'How many cups tall is Jay?',
    exploration: 'NBA player height time series — has the average professional basketball player gotten taller, and at what rate? Plot height vs. era; fit a linear trend. Connects unit comparison to a population-scale linear function.',
    datasetIds: [],
    needsDataset: 'NBA player heights by year (publicly available)',
    strength: 'possible',
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
    exploration: 'Real elevator travel-time data (public-building studies) — combine waiting time + travel rate as a linear function. Solve when person A overtakes person B given different starting floors.',
    datasetIds: [],
    needsDataset: 'Elevator wait + travel-time benchmarks (publicly published)',
    strength: 'possible',
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
    exploration: 'Our Wind Power Curve activity is the SAME quadratic-fitting problem on a different domain — fit P = av² + bv + c to real SCADA data and see R² climb. Could also pair with NBA shot-tracking data showing make/miss vs. release angle distribution.',
    datasetIds: ['wind'],
    strength: 'strong',
  },
  {
    course: 'algebra1', topic: 9,
    savvasPremise: 'A young woman spreads out pennies from rolls; many more rolls remain unopened.',
    savvasQuestion: 'How many pennies are in the basket?',
    exploration: 'US Mint penny production by year — billions per year, distinct mints, weight × count math. Real-world counting via weight estimation.',
    datasetIds: [],
    needsDataset: 'US Mint penny production by year + mint',
    strength: 'possible',
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
    exploration: 'Real construction-rate time series — building projects, road resurfacing, or LEGO assembly timing. Each is a linear progress line; intersection answers "when does B catch up to A?"',
    datasetIds: [],
    needsDataset: 'Public construction-project completion records (state DOT data)',
    strength: 'possible',
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
    exploration: 'Real city EMS response-time data + actual hospital/station coordinates. Compute the geometric median (or circumcenter for "fair" equidistance), compare to where the city actually built its station. Real "where to put the fire station" is a published optimization problem.',
    datasetIds: [],
    needsDataset: 'City EMS response times + station locations (NYC, Chicago, SF open data)',
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
    exploration: 'Real architectural-scale data — famous buildings\' actual heights vs. their scale-model versions. Could pair with our stars dataset for the "ratio between brightness and distance" inverse-square companion.',
    datasetIds: [],
    needsDataset: 'Notable buildings + corresponding scale-model heights',
    strength: 'possible',
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
    exploration: 'Real shipping/packaging efficiency data — container packing problems, postal rate structures, ISO container fill rates. Volume math with logistical constraints.',
    datasetIds: [],
    needsDataset: 'Standard container dimensions + common parcel sizes',
    strength: 'possible',
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
    exploration: 'Same quadratic-trajectory problem as A1·T8 (basketball). Could pair with our NEO dataset (asteroid kinetic energy) or build a soccer xG dataset from public match data.',
    datasetIds: ['wind', 'neo'],
    strength: 'possible',
  },
  {
    course: 'algebra2', topic: 3,
    savvasPremise: 'A tennis player serves numbered balls; some land in, some land out (different signed numbers).',
    savvasQuestion: 'Which of the remaining tennis balls will land in?',
    exploration: 'Real ATP tennis serve speed and placement data — predict serve outcome from speed, spin, location. Real polynomial classification flavor.',
    datasetIds: [],
    needsDataset: 'ATP serve placement dataset (public match data)',
    strength: 'possible',
  },
  {
    course: 'algebra2', topic: 4,
    savvasPremise: 'A boy fills a pool with one hose (June), a stronger hose (July), then both (August).',
    savvasQuestion: 'How long will it take with both hoses?',
    exploration: 'Combined-rate problems show up in real irrigation engineering and plumbing. Real flow-rate data plus consumption.',
    datasetIds: [],
    needsDataset: 'Public flow-rate data for residential plumbing fixtures',
    strength: 'possible',
  },
  {
    course: 'algebra2', topic: 5,
    savvasPremise: 'Three friends at a beach debate which path to a snack shack is fastest, mixing sand vs. boardwalk.',
    savvasQuestion: 'Who reaches the shack first?',
    exploration: 'Real running-speed data on different surfaces (track, trail, beach). Minimize total time over a path with two regions. The math is Snell\'s law in disguise — light traveling through two media.',
    datasetIds: [],
    needsDataset: 'Running speed by surface type (existing physiology research)',
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
    exploration: 'Real ADA ramp specs (1:12 max slope) + actual home stair-height distributions. Solve for ramp length given rise; check angle against accessibility code. Trig equations with policy stakes.',
    datasetIds: [],
    needsDataset: 'ADA ramp code requirements + common residential rise heights',
    strength: 'strong',
  },
  {
    course: 'algebra2', topic: 9,
    savvasPremise: 'A man installs three sprinkler heads on a rectangular lawn.',
    savvasQuestion: 'Where should the sprinklers go to cover the entire lawn?',
    exploration: 'Real cell-tower coverage data (3 towers per metro area cover most of a city) or radio-broadcast range patterns. Coverage geometry with overlapping circles.',
    datasetIds: ['satellites'],
    needsDataset: 'Cell-tower locations and coverage radii (FCC database)',
    strength: 'possible',
  },
  {
    course: 'algebra2', topic: 10,
    savvasPremise: 'A customer insists on the "biggest burger" possible at a burger shop.',
    savvasQuestion: 'How many patties are in the big burger?',
    exploration: 'Our 120-Years-of-America Census Pyramid is the matrix-multiplication anchor — Leslie matrix demography. A nutrition-database matrix could be a parallel option.',
    datasetIds: ['population'],
    strength: 'possible',
  },
  {
    course: 'algebra2', topic: 11,
    savvasPremise: 'A girl frustrated by counting coins in her jar wants to estimate the total faster.',
    savvasQuestion: 'How much money is in the jar?',
    exploration: 'Mark-and-recapture is the wildlife-biology technique for estimating populations you can\'t fully count — tag N animals, recapture M later, see what fraction were tagged. Real published studies on salmon, deer, elk. The coin-jar Act 1 is the classroom-scale rehearsal for population inference.',
    datasetIds: [],
    needsDataset: 'Real mark-recapture wildlife studies (NPS / USGS)',
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
