// Scope-and-sequence map: every chapter across enVision Algebra 1, Geometry,
// and Algebra 2, paired with its activity. Source of record:
// /Users/dereklomas/savvas/chapter_activities.md.
//
// `route` is set when the activity is built. Otherwise the entry is a
// concept-only design and routes to the matching dataset story.

export type CourseId = 'algebra1' | 'geometry' | 'algebra2';

export const COURSE_TITLE: Record<CourseId, string> = {
  algebra1: 'Algebra 1',
  geometry: 'Geometry',
  algebra2: 'Algebra 2',
};

export type FormatCode = 'CDS' | 'SEN' | 'GAM' | 'POL' | 'SIM' | 'IMP' | 'TML';

export const FORMAT_LABEL: Record<FormatCode, string> = {
  CDS: 'Curated dataset',
  SEN: 'Sensor-collected',
  GAM: 'Game-generated',
  POL: 'Class poll',
  SIM: 'Simulation',
  IMP: 'Personal import',
  TML: 'Trained tiny ML',
};

export const FORMAT_BLURB: Record<FormatCode, string> = {
  CDS: 'A real, curated dataset and an explorer / slider-fit.',
  SEN: 'The student collects the data live with their phone or computer.',
  GAM: 'The student plays — the data falls out of the game.',
  POL: 'The whole class contributes; the data aggregates live.',
  SIM: 'A parameter-driven simulation — no curated dataset needed.',
  IMP: 'The student imports their own data (Spotify, screen time, etc.).',
  TML: 'The student trains a tiny machine-learning model in the browser.',
};

export interface ChapterEntry {
  course: CourseId;
  topic: number;
  topicName: string;
  activity: string;
  blurb: string;
  connection: string;
  format: FormatCode[];
  /** Dataset IDs from /data/registry.ts. Empty if the activity uses synthetic/sensor data. */
  datasets: string[];
  /** Built activity URL — set only when the activity ships. */
  route?: string;
  /** Flag for headline demo flagships. */
  flagship?: boolean;
}

export const CHAPTERS: ChapterEntry[] = [
  // ──────────────── Algebra 1 ────────────────
  {
    course: 'algebra1', topic: 1, topicName: 'Solving Equations and Inequalities',
    activity: 'Crack the Headline',
    blurb: 'Reverse-engineer the equation hiding inside a news headline.',
    connection: 'Real-world equations almost always arrive as English. Translating English into x and = is the whole skill.',
    format: ['SIM'], datasets: [],
    route: '/lessons/crack-the-headline',
  },
  {
    course: 'algebra1', topic: 2, topicName: 'Linear Equations',
    activity: 'Predict the Twin',
    blurb: 'Pairs measure two correlated body metrics on each other, fit y = mx + b, then test on a stranger.',
    connection: 'Students invent y = mx + b before being told.',
    format: ['POL', 'SEN'], datasets: ['marathon'],
  },
  {
    course: 'algebra1', topic: 3, topicName: 'Linear Functions',
    activity: 'Find Your Slope',
    blurb: 'Phone accelerometer records height vs. time as you walk upstairs. Slope = speed.',
    connection: 'Slope as rate-of-change becomes embodied — your slope is your speed.',
    format: ['SEN'], datasets: [],
  },
  {
    course: 'algebra1', topic: 4, topicName: 'Systems of Linear Equations and Inequalities',
    activity: 'The Crossing Point',
    blurb: "Two real time-series that cross — women's vs. men's marathon record, Linda vs. Olivia — fit lines and predict the year.",
    connection: 'Solving simultaneous linear equations is suddenly necessary — they want to know the answer.',
    format: ['CDS'], datasets: ['babyNames', 'population', 'marathon'],
  },
  {
    course: 'algebra1', topic: 5, topicName: 'Piecewise Functions',
    activity: 'The Curve That Bends',
    blurb: 'Wind turbine power curves are piecewise: quadratic, plateau, drop-off. Find the breakpoint.',
    connection: 'Real engineering uses piecewise functions because the world bends. Where it bends means something.',
    format: ['CDS'], datasets: ['wind'],
    route: '/wind-turbine',
  },
  {
    course: 'algebra1', topic: 6, topicName: 'Exponents and Exponential Functions',
    activity: 'Doubling Time',
    blurb: "Real exponential growth at scale (Moore's Law / GitHub stars). Estimate the doubling time, predict the next one.",
    connection: 'Doubling time is the human-readable form of exponential growth.',
    format: ['CDS'], datasets: ['moore'],
  },
  {
    course: 'algebra1', topic: 7, topicName: 'Polynomials and Factoring',
    activity: 'Where Does the Curve Cross Zero?',
    blurb: 'Real cubic-shaped data; the roots are physical events — cut-in wind, closest asteroid approach.',
    connection: "Roots aren't abstractions — they're the moment something turns on, lands, or crosses.",
    format: ['CDS'], datasets: ['wind', 'neo'],
  },
  {
    course: 'algebra1', topic: 8, topicName: 'Quadratic Functions',
    activity: 'Wind Power Curve',
    blurb: 'Slider-fit P = a·v² + b·v + c against real SCADA log data; R² climbs as you tune.',
    connection: 'The most direct "math fits the data" we have. Kinetic energy is v³, but mechanical losses bend it back to ~v².',
    format: ['CDS'], datasets: ['wind'],
    route: '/wind-turbine',
    flagship: true,
  },
  {
    course: 'algebra1', topic: 9, topicName: 'Solving Quadratic Equations',
    activity: 'Hit the Target',
    blurb: 'Virtual launcher; adjust angle and velocity; solve the quadratic to figure out where it lands.',
    connection: '"Find x such that h(x) = 0" is the moment of impact, in the literal sense.',
    format: ['GAM', 'SIM'], datasets: [],
    route: '/lessons/hit-the-target',
  },
  {
    course: 'algebra1', topic: 10, topicName: 'Working with Functions',
    activity: 'Function Fingerprint',
    blurb: "A song is a function. Spotify reduces it to (danceability, energy, valence, tempo) — each axis IS a function of the audio.",
    connection: 'Functions take inputs to outputs — students see this for music they love.',
    format: ['IMP', 'CDS'], datasets: ['spotify'],
  },
  {
    course: 'algebra1', topic: 11, topicName: 'Statistics',
    activity: 'Reaction Time Arena + Train-A-Sound',
    blurb: 'Generate your own distribution (visual + audio reaction times), then train a tiny "yes/no" classifier on your own voice.',
    connection: 'Linear regression IS machine learning. Welcome to the field.',
    format: ['TML', 'SEN', 'GAM'], datasets: ['marathon'],
    route: '/reaction-time',
    flagship: true,
  },

  // ──────────────── Geometry ────────────────
  {
    course: 'geometry', topic: 1, topicName: 'Foundations of Geometry',
    activity: "Map Earth's Anger",
    blurb: "USGS earthquake feed for the past week — plot lat/long on a world map. The Ring of Fire emerges.",
    connection: 'Coordinates as the foundation of geometric description.',
    format: ['CDS'], datasets: ['earthquakes'],
  },
  {
    course: 'geometry', topic: 2, topicName: 'Parallel and Perpendicular Lines',
    activity: 'Tectonic Boundaries',
    blurb: 'Best-fit lines for San Andreas, Mid-Atlantic Ridge, Pacific Rim — check which are parallel, which perpendicular.',
    connection: "Real Earth lines aren't perfectly parallel — but the math says how close they get.",
    format: ['CDS'], datasets: ['earthquakes'],
  },
  {
    course: 'geometry', topic: 3, topicName: 'Transformations',
    activity: 'Body as Data',
    blurb: 'Webcam pose tracking — apply transformations (rotate 30°, scale half, reflect) to your own body in real time.',
    connection: "Transformations stop being abstract — they're applied to your body.",
    format: ['SEN'], datasets: [],
    flagship: true,
  },
  {
    course: 'geometry', topic: 4, topicName: 'Triangle Congruence',
    activity: 'Survey the Classroom',
    blurb: 'Pace and measure the room. Each pair claims a triangle. Class compares — are any congruent within tolerance?',
    connection: 'SSS, SAS, ASA become protocols for agreeing across measurements.',
    format: ['SEN', 'POL'], datasets: [],
  },
  {
    course: 'geometry', topic: 5, topicName: 'Relationships in Triangles',
    activity: 'Triangulate the Quake',
    blurb: 'P-wave arrival times at three real stations. Locate the epicenter geometrically — three circles intersecting.',
    connection: 'This is literally how seismologists locate quakes.',
    format: ['CDS', 'SIM'], datasets: ['earthquakes'],
  },
  {
    course: 'geometry', topic: 6, topicName: 'Quadrilaterals and Other Polygons',
    activity: 'Constellation Designer',
    blurb: 'Real bright-star sky data. Pick 5–9 stars, connect them, name your constellation, claim it.',
    connection: 'Constellations are polygons projected on a sphere — perimeter, interior angles, classification all apply.',
    format: ['CDS'], datasets: ['stars'],
  },
  {
    course: 'geometry', topic: 7, topicName: 'Similarity',
    activity: 'Scale Yourself',
    blurb: 'Side-profile selfie → height vs. mass scaling. Class data shows mass grows with height³, bone strength only with height². That gap is biology.',
    connection: 'Similar shapes scale predictably — and that gap is why we don\'t have giants.',
    format: ['SEN', 'CDS'], datasets: ['penguins'],
  },
  {
    course: 'geometry', topic: 8, topicName: 'Right Triangles and Trigonometry',
    activity: 'Measure a Star',
    blurb: "Given Earth's orbit and a real Hipparcos parallax angle, compute the star's distance with trig.",
    connection: 'Trig is how we know how far away stars are.',
    format: ['CDS'], datasets: ['stars'],
  },
  {
    course: 'geometry', topic: 9, topicName: 'Coordinate Geometry',
    activity: 'Storm Track',
    blurb: "Pick a hurricane. Plot its path on a lat/long grid. Compute heading, distance, speed.",
    connection: 'Lat/long is coordinate geometry on a (slightly curved) plane.',
    format: ['CDS'], datasets: ['hurricanes'],
  },
  {
    course: 'geometry', topic: 10, topicName: 'Circles',
    activity: 'Pizza-Eye Hurricane',
    blurb: "Measure the eye radius from a satellite still. Compute area, circumference. Stronger storms have smaller eyes.",
    connection: 'A circle\'s properties teach you something physical.',
    format: ['CDS'], datasets: ['hurricanes'],
  },
  {
    course: 'geometry', topic: 11, topicName: 'Two- and Three-Dimensional Models',
    activity: 'Volume of Doom',
    blurb: 'Each near-Earth asteroid has a diameter range. Compute volume, then kinetic energy on impact. Rank the threat.',
    connection: 'V = (4/3)π·r³ becomes a real-stakes calculation.',
    format: ['CDS'], datasets: ['neo'],
  },
  {
    course: 'geometry', topic: 12, topicName: 'Probability',
    activity: 'The Hurricane Coin',
    blurb: '70+ years of Atlantic hurricane data → empirical probabilities. Chance of Cat 4+ in any year? Major hurricane in October?',
    connection: 'Frequency-based probability becomes calculable from real history.',
    format: ['CDS'], datasets: ['hurricanes'],
  },

  // ──────────────── Algebra 2 ────────────────
  {
    course: 'algebra2', topic: 1, topicName: 'Linear Functions and Systems',
    activity: 'When the Lines Cross',
    blurb: "Plot two slow trends — births vs. deaths, country A's median age vs. country B's. Fit linear best-fits and predict when they cross.",
    connection: 'Systems of linear equations as a forecasting tool.',
    format: ['CDS'], datasets: ['population', 'countries'],
  },
  {
    course: 'algebra2', topic: 2, topicName: 'Quadratic Functions and Equations',
    activity: 'Asteroid Energy Calculator',
    blurb: 'KE = ½mv² for each near-Earth asteroid. Convert to TNT equivalent. Solve for the velocity that matches Tunguska.',
    connection: 'Quadratic in v means doubling speed quadruples damage.',
    format: ['CDS'], datasets: ['neo'],
  },
  {
    course: 'algebra2', topic: 3, topicName: 'Polynomial Functions',
    activity: 'Cubic Wind Power',
    blurb: "Return to wind turbines and fit a cubic. Why is v³ the physically true model? When does it fail?",
    connection: 'Polynomials of higher degree describe deeper physics.',
    format: ['CDS'], datasets: ['wind'],
  },
  {
    course: 'algebra2', topic: 4, topicName: 'Rational Functions',
    activity: 'Inverse Square',
    blurb: 'Pick a star. If we moved it twice as far away, how dim would it look? The 1/r² law — plot an absolute-magnitude HR diagram.',
    connection: 'Rational functions describe inverse relationships — distance vs. brightness is the cleanest example.',
    format: ['CDS'], datasets: ['stars'],
  },
  {
    course: 'algebra2', topic: 5, topicName: 'Rational Exponents and Radical Functions',
    activity: "Kepler's Third Law",
    blurb: 'For every confirmed exoplanet, plot orbital period² vs. semi-major axis³ (log-log). A perfect line.',
    connection: 'T² = (constant)·a³ is a radical/rational-exponent equation living in the data.',
    format: ['CDS'], datasets: ['exoplanets'],
  },
  {
    course: 'algebra2', topic: 6, topicName: 'Exponential and Logarithmic Functions',
    activity: 'The Log Trick',
    blurb: "Moore's Law on a linear y-axis is an unreadable wall. Toggle to log y-axis: a clean diagonal. Same trick for earthquake magnitudes, decibels, pH.",
    connection: "Logs aren't a topic — they're a lens. The chapter builds the lens; the activity uses it.",
    format: ['CDS'], datasets: ['moore', 'earthquakes'],
  },
  {
    course: 'algebra2', topic: 7, topicName: 'Trigonometric Functions',
    activity: 'Voice DNA',
    blurb: 'Live spectrogram via WebAudio. Sums of sines describe all periodic signals (Fourier). Companion: SF tide-fit.',
    connection: 'Trigonometric functions live in your voice and the ocean both.',
    format: ['SEN', 'CDS'], datasets: ['tides'],
    route: '/voice-dna',
    flagship: true,
  },
  {
    course: 'algebra2', topic: 8, topicName: 'Trigonometric Equations and Identities',
    activity: "When's High Tide?",
    blurb: 'Solve sin(2π·t/12.42) = 0.8 for when the tide passes a given height. Use identities to find when two tides differ by 2 ft.',
    connection: 'Trig equations as the math of "when does this periodic thing happen?"',
    format: ['CDS'], datasets: ['tides'],
  },
  {
    course: 'algebra2', topic: 9, topicName: 'Conic Sections',
    activity: 'Plot the Orbit',
    blurb: 'Fit ellipses to real exoplanet orbits. Some are wildly elongated (hot Jupiters). Some asteroids have open hyperbolic orbits — escaping forever.',
    connection: 'Ellipse, hyperbola, parabola are the orbit shapes — Newton proved it; Kepler found it first.',
    format: ['CDS'], datasets: ['exoplanets', 'neo'],
  },
  {
    course: 'algebra2', topic: 10, topicName: 'Matrices',
    activity: '120 Years of America + Population Forecaster',
    blurb: 'Notice the shape change from 1900 to 2020. Then use a Leslie matrix to project 2030, 2040, 2050 by multiplying matrices.',
    connection: 'Matrix multiplication = applying a year of demography.',
    format: ['CDS', 'SIM'], datasets: ['population'],
    route: '/census-pyramid',
  },
  {
    course: 'algebra2', topic: 11, topicName: 'Data Analysis and Statistics',
    activity: 'Train-A-Genre Classifier',
    blurb: 'Train a classifier on Spotify audio features to predict genre. See the confusion matrix. Then a bias hunt — does it fail more on Latin or R&B?',
    connection: 'Real data analysis is iterative; bias is a feature of all models.',
    format: ['TML', 'CDS'], datasets: ['spotify'],
    flagship: true,
  },
  {
    course: 'algebra2', topic: 12, topicName: 'Probability',
    activity: 'The Rare Disease Test',
    blurb: 'Base-rate fallacy made concrete. A test with 99% sensitivity, 98% specificity for a 1-in-1000 disease — if you test positive, what\'s the chance?',
    connection: "Conditional probability + Bayes' theorem in the most consequential setting.",
    format: ['SIM'], datasets: [],
    route: '/lessons/rare-disease',
  },
];

export const COURSE_TOPIC_COUNT: Record<CourseId, number> = {
  algebra1: 11, geometry: 12, algebra2: 12,
};

export function chaptersForCourse(course: CourseId): ChapterEntry[] {
  return CHAPTERS.filter((c) => c.course === course).sort((a, b) => a.topic - b.topic);
}

export const BUILT_COUNT = CHAPTERS.filter((c) => c.route).length;
