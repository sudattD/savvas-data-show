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
  /** Design brief for concept rows — the Act-1 opening moment and the Act-3 reveal,
   *  in one or two sentences each. Lets unbuilt rows function as real specs. */
  design?: { hook: string; reveal: string };
  /** Teacher-facing pedagogical metadata — used by the Teacher view on /chapters.
   *  All fields optional; rows fall back to sensible defaults when missing. */
  teacher?: {
    objective?: string;
    standards?: string[];
    minutes?: number;
    discussion?: string[];
  };
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
    teacher: {
      objective: 'Students will translate a real-world claim into a one-variable equation and solve for the missing quantity, then evaluate whether the claim is mathematically honest.',
      standards: ['HSA-CED.A.1', 'HSA-REI.B.3'],
      minutes: 25,
      discussion: [
        'Which headlines were ambiguous? What information was missing to make the equation solvable?',
        'When a headline rounds aggressively, does the rounded version still imply the same equation?',
        'How would you write a headline for your own equation that survives this scrutiny?',
      ],
    },
  },
  {
    course: 'algebra1', topic: 2, topicName: 'Linear Equations',
    activity: 'Predict the Twin',
    blurb: 'Pairs measure two correlated body metrics on each other, fit y = mx + b, then test on a stranger.',
    connection: 'Students invent y = mx + b before being told.',
    format: ['POL', 'SEN'], datasets: ['marathon'],
    design: {
      hook: 'You and your partner pick two body measurements (hand-span vs. height, half-marathon pace vs. full pace, age vs. step length) and plot what you find.',
      reveal: 'Your linear equation predicts a stranger from another pair. With 32,000 Boston Marathon finishers, the same line still holds.',
    },
  },
  {
    course: 'algebra1', topic: 3, topicName: 'Linear Functions',
    activity: 'Find Your Slope',
    blurb: 'Phone accelerometer records height vs. time as you walk upstairs. Slope = speed.',
    connection: 'Slope as rate-of-change becomes embodied — your slope is your speed.',
    format: ['SEN'], datasets: [],
    design: {
      hook: 'Phone in pocket, you walk a flight of stairs. The accelerometer logs height vs. time and you keep the trace.',
      reveal: 'Your slope is your speed. The class compares fastest, steepest, and weirdest — and the unit (m/s) falls out for free.',
    },
  },
  {
    course: 'algebra1', topic: 4, topicName: 'Systems of Linear Equations and Inequalities',
    activity: 'The Crossing Point',
    blurb: "Two real time-series that cross — women's vs. men's marathon record, Linda vs. Olivia — fit lines and predict the year.",
    connection: 'Solving simultaneous linear equations is suddenly necessary — they want to know the answer.',
    format: ['CDS'], datasets: ['babyNames', 'population', 'marathon'],
    design: {
      hook: "Pick one of three real time-series that cross: women's vs. men's marathon record, US births vs. deaths, or baby names Linda vs. Olivia.",
      reveal: 'Fit two lines, solve for x. The year they intersect is testable history — sometimes the model nails it, sometimes the world bent.',
    },
  },
  {
    course: 'algebra1', topic: 5, topicName: 'Piecewise Functions',
    activity: 'The Curve That Bends',
    blurb: 'Wind turbine power curves are piecewise: quadratic, plateau, drop-off. Find the breakpoint.',
    connection: 'Real engineering uses piecewise functions because the world bends. Where it bends means something.',
    format: ['CDS'], datasets: ['wind'],
    route: '/wind-turbine',
    teacher: {
      objective: 'Students will identify the wind-speed breakpoints in real SCADA data and define a piecewise function (quadratic rise, rated plateau, cut-out drop) that matches each regime.',
      standards: ['HSF-IF.C.7.b', 'HSF-BF.A.1.b'],
      minutes: 30,
      discussion: [
        'Where exactly is the breakpoint? Is it a sharp transition or a soft one in the data?',
        "Why is the plateau a design choice rather than a math fact? What's being protected?",
        'What other real systems would you model piecewise? (Tax brackets, cell signal, drug dosage.)',
      ],
    },
  },
  {
    course: 'algebra1', topic: 6, topicName: 'Exponents and Exponential Functions',
    activity: 'Doubling Time',
    blurb: "Real exponential growth at scale (Moore's Law / GitHub stars). Estimate the doubling time, predict the next one.",
    connection: 'Doubling time is the human-readable form of exponential growth.',
    format: ['CDS'], datasets: ['moore', 'earthquakes', 'babyNames'],
    design: {
      hook: "Plot Moore's Law (or GitHub stars on a famous repo's first 90 days). The curve climbs absurdly steeply on a linear axis.",
      reveal: 'Find the doubling time — ~24 months for transistors, for decades. Then predict the next doubling and check.',
    },
  },
  {
    course: 'algebra1', topic: 7, topicName: 'Polynomials and Factoring',
    activity: 'Where Does the Curve Cross Zero?',
    blurb: 'Real cubic-shaped data; the roots are physical events — cut-in wind, closest asteroid approach.',
    connection: "Roots aren't abstractions — they're the moment something turns on, lands, or crosses.",
    format: ['CDS'], datasets: ['wind', 'neo'],
    design: {
      hook: "Pick a curve: a wind turbine's power crosses zero at cut-in speed; an asteroid's distance crosses zero at fly-by.",
      reveal: 'Factor the polynomial. The roots are physical events — cut-in wind, closest approach. Math meets the world.',
    },
  },
  {
    course: 'algebra1', topic: 8, topicName: 'Quadratic Functions',
    activity: 'Wind Power Curve',
    blurb: 'Slider-fit P = a·v² + b·v + c against real SCADA log data; R² climbs as you tune.',
    connection: 'The most direct "math fits the data" we have. Kinetic energy is v³, but mechanical losses bend it back to ~v².',
    format: ['CDS'], datasets: ['wind'],
    route: '/wind-turbine',
    flagship: true,
    teacher: {
      objective: 'Students will fit a quadratic model P = a·v² + b·v + c to real wind-turbine SCADA data using interactive sliders, interpret a, b, c in context, and evaluate the fit using R².',
      standards: ['HSF-IF.C.7.a', 'HSF-BF.A.1.a', 'HSS-ID.B.6.a'],
      minutes: 30,
      discussion: [
        "What does each slider control geometrically? Which one is hardest to set well?",
        'Kinetic energy in the wind grows as v³, but our fit is closer to v². Where does the missing factor go?',
        'Where does the model stop being useful? What does that tell you about model scope?',
      ],
    },
  },
  {
    course: 'algebra1', topic: 9, topicName: 'Solving Quadratic Equations',
    activity: 'Hit the Target',
    blurb: 'Virtual launcher; adjust angle and velocity; solve the quadratic to figure out where it lands.',
    connection: '"Find x such that h(x) = 0" is the moment of impact, in the literal sense.',
    format: ['GAM', 'SIM'], datasets: [],
    route: '/lessons/hit-the-target',
    teacher: {
      objective: 'Students will solve quadratic equations h(x) = 0 to predict the landing point of a projectile, then verify by adjusting launch angle and velocity to hit a target.',
      standards: ['HSA-REI.B.4.b', 'HSF-IF.C.7.a'],
      minutes: 25,
      discussion: [
        'Which two solutions does the quadratic give for h(x) = 0, and what does the negative one mean physically?',
        'Why does the same target sometimes have two valid (angle, velocity) pairs? What does that tell you about the function?',
        'How does air resistance, which we ignored, change the landing prediction?',
      ],
    },
  },
  {
    course: 'algebra1', topic: 10, topicName: 'Working with Functions',
    activity: 'Function Fingerprint',
    blurb: "A song is a function. Spotify reduces it to (danceability, energy, valence, tempo) — each axis IS a function of the audio.",
    connection: 'Functions take inputs to outputs — students see this for music they love.',
    format: ['IMP', 'CDS'], datasets: ['spotify'],
    design: {
      hook: 'A song is a function: time → pressure wave. Spotify reduces it to four numbers (danceability, energy, valence, tempo). Bring your own song in.',
      reveal: 'See your song placed in the feature space. Its three nearest neighbors are songs you have probably never heard — but should.',
    },
  },
  {
    course: 'algebra1', topic: 11, topicName: 'Statistics',
    activity: 'Reaction Time Arena + Train-A-Sound',
    blurb: 'Generate your own distribution (visual + audio reaction times), then train a tiny "yes/no" classifier on your own voice.',
    connection: 'Linear regression IS machine learning. Welcome to the field.',
    format: ['TML', 'SEN', 'GAM'], datasets: ['marathon', 'penguins', 'countries'],
    route: '/reaction-time',
    flagship: true,
    teacher: {
      objective: 'Students will generate their own visual and audio reaction-time distributions, compute summary statistics (median, mean, spread), compare the two distributions, and benchmark against published research values.',
      standards: ['HSS-ID.A.1', 'HSS-ID.A.2', 'HSS-ID.A.3'],
      minutes: 35,
      discussion: [
        'When does the median tell a different story than the mean for your trials?',
        'How big does the gap between visual and audio medians have to be before we say it\'s real and not noise?',
        'Whose audio median was the smallest? Was their visual median also the smallest?',
      ],
    },
  },

  // ──────────────── Geometry ────────────────
  {
    course: 'geometry', topic: 1, topicName: 'Foundations of Geometry',
    activity: "Map Earth's Anger",
    blurb: "USGS earthquake feed for the past week — plot lat/long on a world map. The Ring of Fire emerges.",
    connection: 'Coordinates as the foundation of geometric description.',
    format: ['CDS'], datasets: ['earthquakes'],
    design: {
      hook: 'USGS earthquake feed for the past week, one row per quake. Plot lat/long on a world map.',
      reveal: 'Without anyone naming it, the Ring of Fire emerges. Coordinates as the foundation of every geometric thing to come.',
    },
  },
  {
    course: 'geometry', topic: 2, topicName: 'Parallel and Perpendicular Lines',
    activity: 'Tectonic Boundaries',
    blurb: 'Best-fit lines for San Andreas, Mid-Atlantic Ridge, Pacific Rim — check which are parallel, which perpendicular.',
    connection: "Real Earth lines aren't perfectly parallel — but the math says how close they get.",
    format: ['CDS'], datasets: ['earthquakes'],
    design: {
      hook: 'Earthquakes cluster along plate boundaries. Draw your best-fit lines for San Andreas, the Mid-Atlantic Ridge, and the Pacific Rim.',
      reveal: 'Compute the angle between any two. Real Earth lines are not perfectly parallel — but the math measures how close they get.',
    },
  },
  {
    course: 'geometry', topic: 3, topicName: 'Transformations',
    activity: 'Body as Data',
    blurb: 'Webcam pose tracking — apply transformations (rotate 30°, scale half, reflect) to your own body in real time.',
    connection: "Transformations stop being abstract — they're applied to your body.",
    format: ['SEN'], datasets: [],
    flagship: true,
    design: {
      hook: 'Webcam on. MediaPipe tracks 33 keypoints on your body in real time and freezes a pose when you choose.',
      reveal: 'Apply transformations to the captured pose: rotate 30° clockwise, scale to half size, reflect across vertical. Watch yourself transform.',
    },
    teacher: {
      objective: 'Students will apply rigid motions (translation, rotation, reflection) and a dilation to a captured pose, predict each result before executing, and identify which transformations preserve distance, angle, and orientation.',
      standards: ['HSG-CO.A.2', 'HSG-CO.A.3', 'HSG-CO.A.4', 'HSG-CO.A.5'],
      minutes: 35,
      discussion: [
        'Which transformations changed your shape and which only changed your position?',
        'When you composed two transformations, did the order matter? When does it always matter?',
        'How would you describe your final transformation as a single function from (x, y) to (x′, y′)?',
      ],
    },
  },
  {
    course: 'geometry', topic: 4, topicName: 'Triangle Congruence',
    activity: 'Survey the Classroom',
    blurb: 'Pace and measure the room. Each pair claims a triangle. Class compares — are any congruent within tolerance?',
    connection: 'SSS, SAS, ASA become protocols for agreeing across measurements.',
    format: ['SEN', 'POL'], datasets: [],
    design: {
      hook: 'Pace the room. Each pair claims a triangle — corner to corner to corner — and measures sides and angles by phone.',
      reveal: 'Compare across pairs. Which triangles are congruent within tolerance? SSS, SAS, and ASA become protocols for agreeing across measurements.',
    },
  },
  {
    course: 'geometry', topic: 5, topicName: 'Relationships in Triangles',
    activity: 'Triangulate the Quake',
    blurb: 'P-wave arrival times at three real stations. Locate the epicenter geometrically — three circles intersecting.',
    connection: 'This is literally how seismologists locate quakes.',
    format: ['CDS', 'SIM'], datasets: ['earthquakes'],
    design: {
      hook: 'Three real USGS stations report P-wave arrival times for the same quake. Each time gives you a circle of possible source locations.',
      reveal: 'Three circles intersect at one point — the epicenter. The triangle of stations and its medians are exactly how seismologists locate quakes.',
    },
  },
  {
    course: 'geometry', topic: 6, topicName: 'Quadrilaterals and Other Polygons',
    activity: 'Constellation Designer',
    blurb: 'Real bright-star sky data. Pick 5–9 stars, connect them, name your constellation, claim it.',
    connection: 'Constellations are polygons projected on a sphere — perimeter, interior angles, classification all apply.',
    format: ['CDS'], datasets: ['stars'],
    design: {
      hook: 'A sky full of real bright stars. Pick 5–9 that look like something to you, connect them, and name your constellation.',
      reveal: 'Your constellation is a polygon — compute perimeter, interior angles, classification. Compare which constellations the class made compact vs. spread.',
    },
  },
  {
    course: 'geometry', topic: 7, topicName: 'Similarity',
    activity: 'Scale Yourself',
    blurb: 'Side-profile selfie → height vs. mass scaling. Class data shows mass grows with height³, bone strength only with height². That gap is biology.',
    connection: 'Similar shapes scale predictably — and that gap is why we don\'t have giants.',
    format: ['SEN', 'CDS'], datasets: ['penguins'],
    design: {
      hook: 'Side-profile selfie. The phone measures your body proportions. Class data builds a height vs. mass scatter.',
      reveal: 'Mass grows with height³, bone strength only with height². That gap is biology — and the reason giants are impossible.',
    },
  },
  {
    course: 'geometry', topic: 8, topicName: 'Right Triangles and Trigonometry',
    activity: 'Measure a Star',
    blurb: "Given Earth's orbit and a real Hipparcos parallax angle, compute the star's distance with trig.",
    connection: 'Trig is how we know how far away stars are.',
    format: ['CDS'], datasets: ['stars'],
    design: {
      hook: 'Pick a nearby star with a real Hipparcos parallax angle. Earth\'s orbit gives you the baseline (1 AU).',
      reveal: 'Trig gives you the star\'s distance in parsecs. This is not a textbook problem — this is how astronomers actually do it.',
    },
  },
  {
    course: 'geometry', topic: 9, topicName: 'Coordinate Geometry',
    activity: 'Storm Track',
    blurb: "Pick a hurricane. Plot its path on a lat/long grid. Compute heading, distance, speed.",
    connection: 'Lat/long is coordinate geometry on a (slightly curved) plane.',
    format: ['CDS'], datasets: ['hurricanes'],
    design: {
      hook: 'Pick a real Atlantic hurricane. Plot its track on a lat/long grid, position by position.',
      reveal: 'Compute average heading, total distance, average speed. Compare to another storm — same coast, very different paths.',
    },
  },
  {
    course: 'geometry', topic: 10, topicName: 'Circles',
    activity: 'Pizza-Eye Hurricane',
    blurb: "Measure the eye radius from a satellite still. Compute area, circumference. Stronger storms have smaller eyes.",
    connection: 'A circle\'s properties teach you something physical.',
    format: ['CDS'], datasets: ['hurricanes'],
    design: {
      hook: 'A real satellite still of a hurricane. Drag an on-image ruler across the eye to measure its radius.',
      reveal: 'Compute area and circumference, then plot against wind speed. Stronger storms have smaller eyes — a circle teaches you something physical.',
    },
  },
  {
    course: 'geometry', topic: 11, topicName: 'Two- and Three-Dimensional Models',
    activity: 'Volume of Doom',
    blurb: 'Each near-Earth asteroid has a diameter range. Compute volume, then kinetic energy on impact. Rank the threat.',
    connection: 'V = (4/3)π·r³ becomes a real-stakes calculation.',
    format: ['CDS'], datasets: ['neo'],
    design: {
      hook: 'Each near-Earth asteroid has a diameter range — asteroids are lumpy, so the size carries uncertainty.',
      reveal: 'V = (4/3)π·r³ feeds into KE = ½mv². Rank the threats. The numbers are real and unsettling.',
    },
  },
  {
    course: 'geometry', topic: 12, topicName: 'Probability',
    activity: 'The Hurricane Coin',
    blurb: '70+ years of Atlantic hurricane data → empirical probabilities. Chance of Cat 4+ in any year? Major hurricane in October?',
    connection: 'Frequency-based probability becomes calculable from real history.',
    format: ['CDS'], datasets: ['hurricanes'],
    design: {
      hook: '70+ years of Atlantic hurricane records. How often does a Cat 4+ form? How often does one hit the US?',
      reveal: 'Count the events, divide by years. Frequency-based probability becomes a calculable answer instead of a guess.',
    },
  },

  // ──────────────── Algebra 2 ────────────────
  {
    course: 'algebra2', topic: 1, topicName: 'Linear Functions and Systems',
    activity: 'When the Lines Cross',
    blurb: "Plot two slow trends — births vs. deaths, country A's median age vs. country B's. Fit linear best-fits and predict when they cross.",
    connection: 'Systems of linear equations as a forecasting tool.',
    format: ['CDS'], datasets: ['population', 'countries'],
    design: {
      hook: "Two slow trends on the same axes — US births vs. deaths, or country A's median age vs. country B's. Plot both.",
      reveal: 'Fit linear best-fits, solve for the crossing year. Forecasting via systems of equations on data that actually shapes policy.',
    },
  },
  {
    course: 'algebra2', topic: 2, topicName: 'Quadratic Functions and Equations',
    activity: 'Asteroid Energy Calculator',
    blurb: 'KE = ½mv² for each near-Earth asteroid. Convert to TNT equivalent. Solve for the velocity that matches Tunguska.',
    connection: 'Quadratic in v means doubling speed quadruples damage.',
    format: ['CDS'], datasets: ['neo'],
    design: {
      hook: 'Pick a near-Earth asteroid from the catalog. You have its mass and approach velocity.',
      reveal: 'KE = ½mv², convert to TNT equivalent. Then solve: what velocity would make this one as dangerous as Tunguska? Quadratic in v means doubling speed quadruples damage.',
    },
  },
  {
    course: 'algebra2', topic: 3, topicName: 'Polynomial Functions',
    activity: 'Cubic Wind Power',
    blurb: "Return to wind turbines and fit a cubic. Why is v³ the physically true model? When does it fail?",
    connection: 'Polynomials of higher degree describe deeper physics.',
    format: ['CDS'], datasets: ['wind'],
    design: {
      hook: 'Return to wind turbines, but this time fit a cubic instead of a quadratic.',
      reveal: 'Why is v³ the physically true model? (Kinetic flux through swept area scales with v³.) When does cubic fail? (Mechanical limits.) Polynomial degree matches physics.',
    },
  },
  {
    course: 'algebra2', topic: 4, topicName: 'Rational Functions',
    activity: 'Inverse Square',
    blurb: 'Pick a star. If we moved it twice as far away, how dim would it look? The 1/r² law — plot an absolute-magnitude HR diagram.',
    connection: 'Rational functions describe inverse relationships — distance vs. brightness is the cleanest example.',
    format: ['CDS'], datasets: ['stars'],
    design: {
      hook: 'Pick a real star. If we moved it twice as far away, how dim would it look? Three times as far?',
      reveal: '1/r² law in action. Plot apparent magnitude as a rational function of distance, then build the absolute-magnitude HR diagram for all stars at one fixed distance.',
    },
  },
  {
    course: 'algebra2', topic: 5, topicName: 'Rational Exponents and Radical Functions',
    activity: "Kepler's Third Law",
    blurb: 'For every confirmed exoplanet, plot orbital period² vs. semi-major axis³ (log-log). A perfect line.',
    connection: 'T² = (constant)·a³ is a radical/rational-exponent equation living in the data.',
    format: ['CDS'], datasets: ['exoplanets'],
    design: {
      hook: 'Thousands of confirmed exoplanets, each with an orbital period and a semi-major axis. Plot them on a log-log scatter.',
      reveal: "Period² vs. axis³ is a perfect line. Kepler's third law, discovered in 1619, still holds for thousand-light-year-distant worlds.",
    },
  },
  {
    course: 'algebra2', topic: 6, topicName: 'Exponential and Logarithmic Functions',
    activity: 'The Log Trick',
    blurb: "Moore's Law on a linear y-axis is an unreadable wall. Toggle to log y-axis: a clean diagonal. Same trick for earthquake magnitudes, decibels, pH.",
    connection: "Logs aren't a topic — they're a lens. The chapter builds the lens; the activity uses it.",
    format: ['CDS'], datasets: ['moore', 'earthquakes', 'co2'],
    design: {
      hook: "Moore's Law on a linear y-axis is an unreadable wall of growth. Toggle to a log y-axis.",
      reveal: 'A clean diagonal line. The slope IS the doubling time. Same trick reveals earthquake magnitudes, decibels, pH. Logs are a lens, not a topic.',
    },
  },
  {
    course: 'algebra2', topic: 7, topicName: 'Trigonometric Functions',
    activity: 'Voice DNA',
    blurb: 'Live spectrogram via WebAudio. Sums of sines describe all periodic signals (Fourier). Companion: SF tide-fit.',
    connection: 'Trigonometric functions live in your voice and the ocean both.',
    format: ['SEN', 'CDS'], datasets: ['tides', 'co2'],
    route: '/voice-dna',
    flagship: true,
    teacher: {
      objective: 'Students will identify the periodic structure in their own voice as a sum of sinusoids (harmonics and formants), then connect that visual to the family of trigonometric functions used to model periodic signals broadly.',
      standards: ['HSF-TF.B.5', 'HSF-IF.C.7.e'],
      minutes: 30,
      discussion: [
        'Why do two students saying the same vowel produce different-looking spectrograms?',
        'How does pitch change the spacing between the horizontal stripes? What does that tell you about period and frequency?',
        'Where else does a sum-of-sines model the world well? Where does it break?',
      ],
    },
  },
  {
    course: 'algebra2', topic: 8, topicName: 'Trigonometric Equations and Identities',
    activity: "When's High Tide?",
    blurb: 'Solve sin(2π·t/12.42) = 0.8 for when the tide passes a given height. Use identities to find when two tides differ by 2 ft.',
    connection: 'Trig equations as the math of "when does this periodic thing happen?"',
    format: ['CDS'], datasets: ['tides'],
    design: {
      hook: 'SF tide hourly data, plotted as a compound sine wave with the lunar tidal period.',
      reveal: 'Solve sin(2π·t/12.42) = 0.8 for when the tide passes a given height. Use a double-angle identity to find when two tide cycles differ by exactly 2 ft.',
    },
  },
  {
    course: 'algebra2', topic: 9, topicName: 'Conic Sections',
    activity: 'Plot the Orbit',
    blurb: 'Fit ellipses to real exoplanet orbits. Some are wildly elongated (hot Jupiters). Some asteroids have open hyperbolic orbits — escaping forever.',
    connection: 'Ellipse, hyperbola, parabola are the orbit shapes — Newton proved it; Kepler found it first.',
    format: ['CDS'], datasets: ['exoplanets', 'neo'],
    design: {
      hook: 'Real exoplanet orbital parameters. Fit an ellipse to each. Compare eccentricities.',
      reveal: 'Some hot Jupiters have wildly elongated orbits. Some near-Earth asteroids have open hyperbolic orbits — escaping the Sun forever. Conic sections are orbit shapes.',
    },
  },
  {
    course: 'algebra2', topic: 10, topicName: 'Matrices',
    activity: '120 Years of America + Population Forecaster',
    blurb: 'Notice the shape change from 1900 to 2020. Then use a Leslie matrix to project 2030, 2040, 2050 by multiplying matrices.',
    connection: 'Matrix multiplication = applying a year of demography.',
    format: ['CDS', 'SIM'], datasets: ['population'],
    route: '/census-pyramid',
    teacher: {
      objective: 'Students will compare two population pyramids quantitatively, identify which age groups shifted most, then represent a year of demographic change as a matrix-vector multiplication.',
      standards: ['HSN-VM.C.6', 'HSN-VM.C.8', 'HSS-ID.A.1'],
      minutes: 30,
      discussion: [
        'Why did the bottom of the pyramid change more than the top in absolute terms, even though the headline is "the country is aging"?',
        'What does a Leslie matrix encode in each row and column? What real assumption are we making?',
        'How would immigration, modeled separately, change the matrix you would use?',
      ],
    },
  },
  {
    course: 'algebra2', topic: 11, topicName: 'Data Analysis and Statistics',
    activity: 'Train-A-Genre Classifier',
    blurb: 'Train a classifier on Spotify audio features to predict genre. See the confusion matrix. Then a bias hunt — does it fail more on Latin or R&B?',
    connection: 'Real data analysis is iterative; bias is a feature of all models.',
    format: ['TML', 'CDS'], datasets: ['spotify', 'countries'],
    flagship: true,
    design: {
      hook: 'Spotify audio features (danceability, energy, valence, etc.) for tens of thousands of tracks. Train a classifier in the browser to predict genre.',
      reveal: 'See the confusion matrix. Then go bias-hunting: does it fail more on Latin or R&B? Why? Real data analysis is iterative; bias is a feature of all models.',
    },
    teacher: {
      objective: 'Students will train a multi-class classifier on Spotify audio features, interpret a confusion matrix, identify systematic per-class errors, and propose hypotheses about the source of bias.',
      standards: ['HSS-ID.B.6', 'HSS-IC.A.1', 'HSS-IC.B.6'],
      minutes: 40,
      discussion: [
        'Which two genres confused the classifier the most? Why might that make musical sense?',
        'If the training set has 8x more Pop than Latin, how does that shape what the model "knows"?',
        'What would you change about the data — not the model — to fix the worst error pattern?',
      ],
    },
  },
  {
    course: 'algebra2', topic: 12, topicName: 'Probability',
    activity: 'The Rare Disease Test',
    blurb: 'Base-rate fallacy made concrete. A test with 99% sensitivity, 98% specificity for a 1-in-1000 disease — if you test positive, what\'s the chance?',
    connection: "Conditional probability + Bayes' theorem in the most consequential setting.",
    format: ['SIM'], datasets: [],
    route: '/lessons/rare-disease',
    teacher: {
      objective: "Students will use a 1,000-patient grid to compute P(disease | positive test), then connect the grid arithmetic to Bayes' theorem in symbolic form.",
      standards: ['HSS-CP.A.3', 'HSS-CP.B.6', 'HSS-MD.A.4'],
      minutes: 25,
      discussion: [
        "Why is the answer so much lower than the test's accuracy number suggests?",
        'How does the answer change as the base rate moves from 1-in-1000 to 1-in-100? When does the test start to be trustworthy on a positive?',
        'What does this tell you about screening tests for rare conditions in the general population vs. high-risk groups?',
      ],
    },
  },
];

export const COURSE_TOPIC_COUNT: Record<CourseId, number> = {
  algebra1: 11, geometry: 12, algebra2: 12,
};

export function chaptersForCourse(course: CourseId): ChapterEntry[] {
  return CHAPTERS.filter((c) => c.course === course).sort((a, b) => a.topic - b.topic);
}

export function chaptersForDataset(datasetId: string): ChapterEntry[] {
  return CHAPTERS.filter((c) => c.datasets.includes(datasetId));
}

// Pull the richest teacher-facing metadata available for a chapter:
// prefer the matching dataset.chapterFits entry (authored by the user),
// fall back to the embedded ChapterEntry.teacher, then to nothing.
// Returns a shape compatible with the TeacherPanel renderer.
import { DATASETS } from './registry';
import type { ChapterFit } from '../lib/dataset';

export interface ResolvedTeacherInfo {
  objective?: string;
  standards: string[];
  minutes?: number;
  discussion: string[];
  mathFit?: string;
  studentWhy?: string;
  source: 'chapterFit' | 'embedded' | 'none';
}

export function resolveTeacherInfo(entry: ChapterEntry): ResolvedTeacherInfo {
  // Scan every dataset's chapterFits for a course+topic match
  for (const ds of DATASETS) {
    const fits = (ds as { chapterFits?: ChapterFit[] }).chapterFits;
    if (!fits) continue;
    const hit = fits.find((f) => f.course === entry.course && f.topic === entry.topic);
    if (hit) {
      return {
        objective: hit.objective,
        standards: hit.standards,
        minutes: hit.minutes,
        discussion: hit.discussion,
        mathFit: hit.mathFit,
        studentWhy: hit.studentWhy,
        source: 'chapterFit',
      };
    }
  }
  if (entry.teacher) {
    return {
      objective: entry.teacher.objective,
      standards: entry.teacher.standards ?? [],
      minutes: entry.teacher.minutes,
      discussion: entry.teacher.discussion ?? [],
      source: 'embedded',
    };
  }
  return { standards: [], discussion: [], source: 'none' };
}

const COURSE_SLUG: Record<CourseId, string> = {
  algebra1: 'alg1', geometry: 'geo', algebra2: 'alg2',
};

/** Stable anchor id for a chapter row, used both as the DOM id on the chapters
 *  page and as the hash target when linking in from a dataset story. */
export function chapterAnchorId(entry: Pick<ChapterEntry, 'course' | 'topic'>): string {
  return `${COURSE_SLUG[entry.course]}-t${entry.topic}`;
}

export const BUILT_COUNT = CHAPTERS.filter((c) => c.route).length;
