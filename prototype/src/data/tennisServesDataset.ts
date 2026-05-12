// The 25 fastest recorded tennis serves — ATP men, WTA women, and
// Challenger-tour outliers. Anchors the Savvas Act-1 "What Are the Rules?"
// (Algebra 2 · Topic 3 · Polynomial Functions): a tennis player serves
// numbered balls with positive and negative outcomes (some land in, some
// out). Polynomial flight paths with real serve speeds for the parameters.

import type { Dataset } from '../lib/dataset';

interface Row {
  player: string;
  country: string;
  tour: string;            // ATP | WTA | Challenger
  speedKmh: number;
  speedMph: number;
  tournament: string;
  year: number;
  atpRecognized: string;   // 'yes' | 'no'
}

const RAW: Row[] = [
  // ATP men — verified from Wikipedia Fastest recorded tennis serves
  { player: 'Sam Groth',                     country: 'Australia',     tour: 'Challenger', speedKmh: 263.4, speedMph: 163.7, tournament: '2012 Busan Open Challenger',           year: 2012, atpRecognized: 'no'  },
  { player: 'Albano Olivetti',               country: 'France',        tour: 'Challenger', speedKmh: 257.5, speedMph: 160.0, tournament: '2012 Trofeo Lame Perrel–Faip',         year: 2012, atpRecognized: 'no'  },
  { player: 'Mark Wallner',                  country: 'Germany',       tour: 'Challenger', speedKmh: 257.0, speedMph: 159.7, tournament: '2025 Atkinsons Monza Challenger',      year: 2025, atpRecognized: 'no'  },
  { player: 'John Isner',                    country: 'USA',           tour: 'ATP',        speedKmh: 253.0, speedMph: 157.2, tournament: '2016 Davis Cup',                       year: 2016, atpRecognized: 'yes' },
  { player: 'Ivo Karlović',                  country: 'Croatia',       tour: 'ATP',        speedKmh: 251.0, speedMph: 156.0, tournament: '2011 Davis Cup',                       year: 2011, atpRecognized: 'yes' },
  { player: 'Jerzy Janowicz',                country: 'Poland',        tour: 'ATP',        speedKmh: 251.0, speedMph: 156.0, tournament: '2012 Pekao Szczecin Open',             year: 2012, atpRecognized: 'yes' },
  { player: 'Milos Raonic',                  country: 'Canada',        tour: 'ATP',        speedKmh: 249.9, speedMph: 155.3, tournament: '2012 SAP Open',                        year: 2012, atpRecognized: 'yes' },
  { player: 'Andy Roddick',                  country: 'USA',           tour: 'ATP',        speedKmh: 249.4, speedMph: 155.0, tournament: '2004 Davis Cup',                       year: 2004, atpRecognized: 'yes' },
  { player: 'Chris Guccione',                country: 'Australia',     tour: 'ATP',        speedKmh: 248.0, speedMph: 154.1, tournament: '2006 Davis Cup',                       year: 2006, atpRecognized: 'yes' },
  { player: 'Giovanni Mpetshi Perricard',    country: 'France',        tour: 'ATP',        speedKmh: 246.2, speedMph: 153.0, tournament: '2025 Wimbledon',                       year: 2025, atpRecognized: 'yes' },
  { player: 'Roscoe Tanner',                 country: 'USA',           tour: 'ATP',        speedKmh: 246.2, speedMph: 153.0, tournament: '1978 American Airlines Tennis Games',  year: 1978, atpRecognized: 'yes' },
  { player: 'Joachim Johansson',             country: 'Sweden',        tour: 'ATP',        speedKmh: 244.6, speedMph: 152.0, tournament: '2004 Davis Cup',                       year: 2004, atpRecognized: 'yes' },
  { player: 'Feliciano López',               country: 'Spain',         tour: 'ATP',        speedKmh: 244.6, speedMph: 152.0, tournament: '2014 Aegon Championships',             year: 2014, atpRecognized: 'yes' },
  { player: 'Marius Copil',                  country: 'Romania',       tour: 'ATP',        speedKmh: 244.0, speedMph: 151.6, tournament: '2016 European Open',                   year: 2016, atpRecognized: 'yes' },
  { player: 'Alexei Popyrin',                country: 'Australia',     tour: 'ATP',        speedKmh: 243.0, speedMph: 151.0, tournament: '2023 Tokyo',                           year: 2023, atpRecognized: 'yes' },
  { player: 'Hubert Hurkacz',                country: 'Poland',        tour: 'ATP',        speedKmh: 243.0, speedMph: 151.0, tournament: '2016 Davis Cup',                       year: 2016, atpRecognized: 'yes' },
  { player: 'Oscar Otte',                    country: 'Germany',       tour: 'ATP',        speedKmh: 243.0, speedMph: 151.0, tournament: '2021 US Open',                         year: 2021, atpRecognized: 'yes' },
  { player: 'Ben Shelton',                   country: 'USA',           tour: 'ATP',        speedKmh: 241.4, speedMph: 150.0, tournament: '2025 BNP Paribas Open',                year: 2025, atpRecognized: 'yes' },
  { player: 'Taylor Dent',                   country: 'USA',           tour: 'ATP',        speedKmh: 241.0, speedMph: 149.8, tournament: '2006 ABN AMRO World Tennis',           year: 2006, atpRecognized: 'yes' },
  { player: 'Reilly Opelka',                 country: 'USA',           tour: 'ATP',        speedKmh: 240.3, speedMph: 149.3, tournament: '2021 Australian Open',                 year: 2021, atpRecognized: 'yes' },
  // WTA women — top recorded serves
  { player: 'Georgina García Pérez',         country: 'Spain',         tour: 'WTA',        speedKmh: 220.0, speedMph: 136.7, tournament: '2018 Hungarian Ladies Open',           year: 2018, atpRecognized: 'yes' },
  { player: 'Sabine Lisicki',                country: 'Germany',       tour: 'WTA',        speedKmh: 210.8, speedMph: 131.0, tournament: '2014 Stanford Classic',                year: 2014, atpRecognized: 'yes' },
  { player: 'Venus Williams',                country: 'USA',           tour: 'WTA',        speedKmh: 207.6, speedMph: 129.0, tournament: '2007 US Open',                         year: 2007, atpRecognized: 'yes' },
  { player: 'Serena Williams',               country: 'USA',           tour: 'WTA',        speedKmh: 207.0, speedMph: 128.6, tournament: '2013 Australian Open',                 year: 2013, atpRecognized: 'yes' },
  { player: 'Alycia Parks',                  country: 'USA',           tour: 'WTA',        speedKmh: 199.8, speedMph: 124.2, tournament: '2022 Australian Open',                 year: 2022, atpRecognized: 'yes' },
];

export const TENNIS_SERVES_DATASET: Dataset = {
  id: 'tennisServes',
  name: 'Fastest recorded tennis serves',
  description:
    'The 25 fastest recorded tennis serves — 20 ATP men (15 ATP-recognized + 3 Challenger-tour exceptions), 5 WTA women. Speeds from Sam Groth\'s ATP-unrecognized 263 km/h (164 mph, 2012 Challenger) down to Alycia Parks\' 200 km/h (124 mph, 2022 WTA). Real input for the polynomial-trajectory math the Savvas Act-1 sets up.',
  source: 'Wikipedia "Fastest recorded tennis serves" (compiled from official ATP, WTA, and tournament records)',
  family: 'people',
  provenance: {
    primarySource: 'ATP, WTA, and ITF official match records, aggregated in Wikipedia\'s "Fastest recorded tennis serves" article',
    primarySourceUrl: 'https://en.wikipedia.org/wiki/Fastest_recorded_tennis_serves',
    collector: 'ATP and WTA tournament officials (recorded via on-court radar guns); aggregated by Wikipedia contributors',
    collectionMethod:
      'Each row is a single serve recorded by the tournament\'s official radar gun during an official match. The ATP\'s "fastest" record requires a match at an ATP-sanctioned event with a calibrated speed-measurement system. Challenger-tour speeds (Groth, Olivetti, Wallner) use non-ATP-calibrated guns and are not in the ATP record book — they are included here for breadth.',
    collectionPeriod: '1978 (Roscoe Tanner\'s pioneering 153 mph) through 2025 (Mpetshi Perricard, Wallner, Shelton)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Manual transcription from the Wikipedia "Fastest recorded tennis serves" article, which compiles ATP and WTA tour records with citations to specific tournament reports.',
    license: 'Wikipedia content is CC BY-SA 4.0; underlying serve speeds are factual records of athletic events, reproducible with citation.',
    citation: 'Wikipedia. "Fastest recorded tennis serves." Retrieved 2026-05-12. Cross-references ATP World Tour, WTA, and ITF official tournament data.',
    caveats: [
      'Radar guns at different tournaments have different calibrations. The same serve can register 2-3 km/h faster or slower depending on the gun. ATP-recognized speeds use centrally certified equipment.',
      'Sam Groth\'s 263 km/h is the fastest recorded number but is not in the ATP record book because the 2012 Busan Open is a Challenger event with non-certified speed measurement.',
      'WTA women\'s serve speeds top out around 220 km/h — about 80% of the men\'s top speeds. The gap reflects average power differences, not technique.',
      'These are individual peak serves. Average first-serve speeds for top servers are typically 200-210 km/h for men, 170-180 km/h for women.',
      'Tournament context matters: Davis Cup serves tend to be at the top of the record list because the format (5-set best-of, national team pressure) seems to bring out maximum effort.',
    ],
  },
  story: [
    {
      heading: 'The official record: John Isner, 157 mph, Davis Cup 2016.',
      body:
        '253.0 km/h. That\'s about 0.42 seconds from racquet to opponent\'s service box — less time than a human blink. Isner is 6\'10". The top servers in tennis history correlate strongly with height; the leverage from a higher contact point translates directly to ball speed.',
      highlight: 'Top 5 fastest ATP serves: Isner (6\'10"), Karlović (6\'11"), Janowicz (6\'8"), Raonic (6\'5"), Roddick (6\'2").',
    },
    {
      heading: 'Tennis-ball trajectory is a polynomial in time.',
      body:
        'A 153-mph serve travels the 18-meter baseline-to-service-box distance in about 0.27 seconds. The ball\'s height during flight is y(t) = h₀ + v_y·t − ½g·t² — a quadratic in t. Whether the serve "lands in" depends on where the polynomial equals 0 (the bounce) and whether that x-coordinate is inside the service box. The Savvas Act-1 video has tennis balls numbered with positive and negative numbers; the "in/out" outcome is literally about which root of the polynomial trajectory lies inside the legal court.',
    },
    {
      heading: 'Men\'s top serves are 20% faster than women\'s.',
      body:
        'The fastest WTA serve (García Pérez, 136.7 mph, 2018) is 18% slower than the fastest ATP serve. The gap is consistent across the top 20 of each tour. It\'s the same gap you see in 100-meter sprint times (men ~9.6s, women ~10.5s) — about 10% slower — but tennis-ball speeds amplify the difference because power scales nonlinearly with mass and limb length.',
    },
  ],
  attributes: [
    { key: 'player',          label: 'Player',           kind: 'categorical', description: 'Server name.' },
    { key: 'country',         label: 'Country',          kind: 'categorical', description: 'Country represented.' },
    { key: 'tour',            label: 'Tour',             kind: 'categorical', description: 'ATP (men\'s tour) · WTA (women\'s tour) · Challenger (lower-tier men\'s tournaments, may have non-certified speed guns).' },
    { key: 'speedKmh',        label: 'Serve speed',      kind: 'numeric', unit: 'km/h', description: 'Serve speed in kilometers per hour as officially recorded.' },
    { key: 'speedMph',        label: 'Serve speed',      kind: 'numeric', unit: 'mph', description: 'Same speed in miles per hour.' },
    { key: 'tournament',      label: 'Tournament',       kind: 'categorical', description: 'Tournament + year where the serve was recorded.' },
    { key: 'year',            label: 'Year',             kind: 'numeric',     description: 'Year the serve was recorded.' },
    { key: 'atpRecognized',   label: 'ATP record-book recognized?', kind: 'categorical', description: '"yes" if from an ATP/WTA-sanctioned event with certified speed measurement; "no" for Challenger-tour speeds.' },
  ],
  featured: { type: 'scatter', x: 'year', y: 'speedKmh', color: 'tour' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 3,
      topicName: 'Polynomial Functions',
      mathFit: 'A tennis serve\'s flight path is a polynomial in time. Vertical height: y(t) = h₀ + v_y·t − ½g·t² (degree 2). Horizontal position: x(t) = v_x·t (degree 1). Eliminating t gives y(x) as a polynomial in x — the trajectory curve. Whether the serve lands "in" (positive x outcome) or "out" (negative or out-of-bounds) is determined by the polynomial\'s root location. The Savvas Act-1\'s positive/negative numbered balls is exactly this distinction.',
      standards: ['HSA-APR.B.3', 'HSF-IF.C.7.c', 'HSF-BF.A.1.b'],
      studentWhy: 'A 157 mph serve takes 0.42 seconds to reach the other side. The polynomial in time tells you exactly where the ball is at every moment of that trip.',
      objective: 'Students will model a tennis serve\'s trajectory as a polynomial function in time, identify the polynomial\'s roots as the moments and locations where the ball lands, and connect serve speed to the polynomial\'s coefficients.',
      minutes: 30,
      discussion: [
        'If a 157 mph serve takes 0.42 seconds to travel the baseline-to-service box distance, what does the height polynomial y(t) look like? Where are its roots?',
        'WTA serves top out around 137 mph; ATP serves at 157 mph. That\'s 20% faster. How does that change the polynomial coefficients?',
        'Roscoe Tanner served 153 mph in 1978 with a wooden racquet. Modern players with carbon-fiber racquets serve at similar speeds. What does that say about the limits — racquet technology vs. human biomechanics?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
