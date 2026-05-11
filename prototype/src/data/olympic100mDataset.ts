// Olympic 100m Men's gold medal — winning time at every Summer Olympics
// since 1896. Wikipedia + IOC official records, cross-checked against the
// World Athletics historical archive.
//
// The historical record progression is one of the cleanest in sport: a
// near-linear decline punctuated by the 1968 high-altitude/synthetic-track
// breakthrough (Hines, first sub-10 at 9.95) and Bolt's 2008–2012 plateau.
//
// Times prior to 1972 were hand-timed; from 1972 onward they are
// fully-automatic-timed (FAT) to 0.01s. Hand-times were typically reported
// to 0.1s and conventionally adjusted +0.24s when compared with FAT, but
// we report the times as published in their era — see caveats.

import type { Dataset } from '../lib/dataset';

interface Row {
  year: number;
  city: string;
  country: string; // host nation
  athlete: string;
  athleteCountry: string;
  time: number; // seconds
  timing: 'hand' | 'automatic';
  era: string; // decade label, useful for grouping
}

const RAW: Row[] = [
  { year: 1896, city: 'Athens',       country: 'GRE', athlete: 'Tom Burke',         athleteCountry: 'USA', time: 12.00, timing: 'hand',      era: '1890s' },
  { year: 1900, city: 'Paris',        country: 'FRA', athlete: 'Frank Jarvis',      athleteCountry: 'USA', time: 11.00, timing: 'hand',      era: '1900s' },
  { year: 1904, city: 'St. Louis',    country: 'USA', athlete: 'Archie Hahn',       athleteCountry: 'USA', time: 11.00, timing: 'hand',      era: '1900s' },
  { year: 1908, city: 'London',       country: 'GBR', athlete: 'Reggie Walker',     athleteCountry: 'RSA', time: 10.80, timing: 'hand',      era: '1900s' },
  { year: 1912, city: 'Stockholm',    country: 'SWE', athlete: 'Ralph Craig',       athleteCountry: 'USA', time: 10.80, timing: 'hand',      era: '1910s' },
  { year: 1920, city: 'Antwerp',      country: 'BEL', athlete: 'Charley Paddock',   athleteCountry: 'USA', time: 10.80, timing: 'hand',      era: '1920s' },
  { year: 1924, city: 'Paris',        country: 'FRA', athlete: 'Harold Abrahams',   athleteCountry: 'GBR', time: 10.60, timing: 'hand',      era: '1920s' },
  { year: 1928, city: 'Amsterdam',    country: 'NED', athlete: 'Percy Williams',    athleteCountry: 'CAN', time: 10.80, timing: 'hand',      era: '1920s' },
  { year: 1932, city: 'Los Angeles',  country: 'USA', athlete: 'Eddie Tolan',       athleteCountry: 'USA', time: 10.30, timing: 'hand',      era: '1930s' },
  { year: 1936, city: 'Berlin',       country: 'GER', athlete: 'Jesse Owens',       athleteCountry: 'USA', time: 10.30, timing: 'hand',      era: '1930s' },
  { year: 1948, city: 'London',       country: 'GBR', athlete: 'Harrison Dillard',  athleteCountry: 'USA', time: 10.30, timing: 'hand',      era: '1940s' },
  { year: 1952, city: 'Helsinki',     country: 'FIN', athlete: 'Lindy Remigino',    athleteCountry: 'USA', time: 10.40, timing: 'hand',      era: '1950s' },
  { year: 1956, city: 'Melbourne',    country: 'AUS', athlete: 'Bobby Morrow',      athleteCountry: 'USA', time: 10.50, timing: 'hand',      era: '1950s' },
  { year: 1960, city: 'Rome',         country: 'ITA', athlete: 'Armin Hary',        athleteCountry: 'FRG', time: 10.20, timing: 'hand',      era: '1960s' },
  { year: 1964, city: 'Tokyo',        country: 'JPN', athlete: 'Bob Hayes',         athleteCountry: 'USA', time: 10.00, timing: 'hand',      era: '1960s' },
  { year: 1968, city: 'Mexico City',  country: 'MEX', athlete: 'Jim Hines',         athleteCountry: 'USA', time:  9.95, timing: 'automatic', era: '1960s' },
  { year: 1972, city: 'Munich',       country: 'FRG', athlete: 'Valeri Borzov',     athleteCountry: 'URS', time: 10.14, timing: 'automatic', era: '1970s' },
  { year: 1976, city: 'Montreal',     country: 'CAN', athlete: 'Hasely Crawford',   athleteCountry: 'TTO', time: 10.06, timing: 'automatic', era: '1970s' },
  { year: 1980, city: 'Moscow',       country: 'URS', athlete: 'Allan Wells',       athleteCountry: 'GBR', time: 10.25, timing: 'automatic', era: '1980s' },
  { year: 1984, city: 'Los Angeles',  country: 'USA', athlete: 'Carl Lewis',        athleteCountry: 'USA', time:  9.99, timing: 'automatic', era: '1980s' },
  { year: 1988, city: 'Seoul',        country: 'KOR', athlete: 'Carl Lewis',        athleteCountry: 'USA', time:  9.92, timing: 'automatic', era: '1980s' },
  { year: 1992, city: 'Barcelona',    country: 'ESP', athlete: 'Linford Christie',  athleteCountry: 'GBR', time:  9.96, timing: 'automatic', era: '1990s' },
  { year: 1996, city: 'Atlanta',      country: 'USA', athlete: 'Donovan Bailey',    athleteCountry: 'CAN', time:  9.84, timing: 'automatic', era: '1990s' },
  { year: 2000, city: 'Sydney',       country: 'AUS', athlete: 'Maurice Greene',    athleteCountry: 'USA', time:  9.87, timing: 'automatic', era: '2000s' },
  { year: 2004, city: 'Athens',       country: 'GRE', athlete: 'Justin Gatlin',     athleteCountry: 'USA', time:  9.85, timing: 'automatic', era: '2000s' },
  { year: 2008, city: 'Beijing',      country: 'CHN', athlete: 'Usain Bolt',        athleteCountry: 'JAM', time:  9.69, timing: 'automatic', era: '2000s' },
  { year: 2012, city: 'London',       country: 'GBR', athlete: 'Usain Bolt',        athleteCountry: 'JAM', time:  9.63, timing: 'automatic', era: '2010s' },
  { year: 2016, city: 'Rio',          country: 'BRA', athlete: 'Usain Bolt',        athleteCountry: 'JAM', time:  9.81, timing: 'automatic', era: '2010s' },
  { year: 2020, city: 'Tokyo',        country: 'JPN', athlete: 'Marcell Jacobs',    athleteCountry: 'ITA', time:  9.80, timing: 'automatic', era: '2020s' },
  { year: 2024, city: 'Paris',        country: 'FRA', athlete: 'Noah Lyles',        athleteCountry: 'USA', time:  9.79, timing: 'automatic', era: '2020s' },
];

export const OLYMPIC_100M_DATASET: Dataset = {
  id: 'olympic100m',
  name: 'Olympic 100m — Men\'s gold medal time',
  description:
    'Winning time at the men\'s Olympic 100m sprint at every Summer Games since 1896. The clearest historical record progression in sport: from 12.0s at Athens to 9.79s at Paris 2024 — nearly two and a half seconds shaved over 128 years.',
  source: 'Wikipedia + IOC Historical Results · cross-checked with World Athletics',
  family: 'people',
  provenance: {
    primarySource: 'International Olympic Committee — Historical Results',
    primarySourceUrl: 'https://olympics.com/en/olympic-games/olympic-results',
    collector: 'IOC official timekeepers (Omega since 1932; hand timing prior)',
    collectionMethod:
      '1896–1964: hand-timed by judges with stopwatches, reported to the nearest 0.1 second. From 1968 onward: fully-automatic-timing (FAT) via electronic photocells, reported to 0.01 second. The first FAT-recorded Olympic 100m gold was Jim Hines at Mexico City 1968 (9.95).',
    collectionPeriod: '1896–2024 (every Summer Olympics; missing 1916, 1940, 1944 due to world wars)',
    retrievalDate: '2026-05-11',
    retrievalMethod: 'Hand-transcribed from the IOC results portal and Wikipedia\'s "List of Olympic medalists in athletics" page; cross-checked against World Athletics\' historical record.',
    license: 'Public-domain historical facts',
    citation: 'IOC. "Athletics — 100 metres (men) — Olympic results." olympics.com.',
    caveats: [
      'Hand-timed results (pre-1968) and fully-automatic results are not directly comparable: human reaction adds ~0.24s of variability. Times here are reported as published in their era — adjusting hand-times +0.24s would shift pre-1968 entries downward to FAT-equivalent.',
      'The 1968 Mexico City Games were at altitude (2,250m), which thins the air and assists sprinters — Hines\'s 9.95 might have been slower at sea level. Subsequent rules require wind-assist disclosure (>2.0 m/s is illegal) but altitude is not regulated.',
      'No Olympics held in 1916 (WWI), 1940, or 1944 (WWII) — gaps in the time series.',
      'Carl Lewis was promoted to gold in 1988 after Ben Johnson\'s doping disqualification. Lewis\'s actual race time was 9.92; Johnson crossed first in 9.79 (DQ\'d).',
    ],
  },
  story: [
    {
      heading: 'A century of getting faster',
      body:
        'The 100-meter sprint is the simplest race in sport: a straight line, a starting gun, ten seconds of effort. The Olympic record is the cleanest measuring stick we have for human speed — and it\'s been bending downward for 128 years.',
    },
    {
      heading: 'Hand-timed to electronically-timed',
      body:
        'Before 1968, results were called by human judges holding stopwatches. Reaction error alone added about a quarter-second of fuzz. Mexico City 1968 was the first fully-automatic Olympic 100m, and Jim Hines\'s 9.95 was the first under-10 in Olympic history — but at altitude. Comparing pre-1968 to post-1968 times directly is comparing measurement systems, not just runners.',
      highlight: '1968: Mexico City introduces FAT timing. Hines runs 9.95 — first sub-10 in Olympic history.',
    },
    {
      heading: 'Bolt\'s era',
      body:
        'Usain Bolt won three consecutive Olympic golds (2008, 2012, 2016) at a level the rest of the world hadn\'t approached. His 9.63 at London 2012 remains the Olympic record. Since Bolt retired (2017), winning times have settled around 9.79–9.81 — clearly fast, but visibly off the 2008–2012 plateau.',
    },
    {
      heading: 'How fast can a human run?',
      body:
        'Plot time vs year and fit a line. The slope says we shave about 0.02 seconds per Olympics, decreasing. Extrapolate naively and a sub-9.0 result lands around 2080. But physiologists estimate the human limit is somewhere between 9.0 and 9.3 — the curve must asymptote. This dataset is the place where students can SEE the difference between fitting a line and fitting reality.',
    },
  ],
  attributes: [
    { key: 'year',           label: 'Year',           kind: 'numeric',     description: 'Year of the Summer Olympics. World wars cancelled 1916, 1940, 1944.' },
    { key: 'time',           label: 'Winning time',   kind: 'numeric', unit: 's', axisHint: 'lower = faster', description: 'Winning time in seconds. Hand-timed pre-1968 (0.1s precision); fully-automatic-timed from 1968 (0.01s precision).' },
    { key: 'athlete',        label: 'Athlete',        kind: 'categorical', description: 'Name of the gold medalist.' },
    { key: 'athleteCountry', label: 'Athlete country', kind: 'categorical', description: 'IOC three-letter country code of the athlete (e.g. USA, JAM, GBR).' },
    { key: 'city',           label: 'Host city',      kind: 'categorical', description: 'Host city of the Summer Olympics.' },
    { key: 'country',        label: 'Host country',   kind: 'categorical', description: 'IOC three-letter country code of the host nation.' },
    { key: 'timing',         label: 'Timing system',  kind: 'categorical', description: 'How the time was measured: hand-timed (pre-1968) or fully-automatic (1968–).' },
    { key: 'era',            label: 'Decade',         kind: 'categorical', ordinal: true, description: 'Decade the games were held — useful for grouping by era.' },
  ],
  featured: { x: 'year', y: 'time', color: 'timing' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 2,
      topicName: 'Linear Equations',
      mathFit: 'Pick a slope and intercept that fits — see if the trend looks linear. Notice the kink at 1968 (timing system change) and discuss whether to fit one line or two.',
      standards: ['HSF-LE.A.2', 'HSS-ID.B.6'],
      studentWhy: 'Did sprinters really get faster at a steady rate? Or did the rules of timing change the answer?',
      objective: 'Students will fit a linear model to time vs year, interpret slope as the rate of improvement (seconds per Olympics), and discuss whether one line or two lines fits the 128-year record.',
      minutes: 25,
      discussion: [
        'What does the slope mean in plain English — "we shave X seconds every Y years"?',
        'If you fit one line vs. two lines (split at 1968), which has higher R²? Does that mean two lines is the right answer, or just the better fit?',
        'When does extrapolation stop making sense? At what year does the line predict a negative time?',
      ],
      flagship: true,
    },
    {
      course: 'algebra1',
      topic: 3,
      topicName: 'Linear Functions',
      mathFit: 'Use the fitted line to predict when the 100m might hit 9.5s or 9.0s. Compare against the human physiological limit (estimated ~9.0s) to discuss extrapolation limits.',
      standards: ['HSF-IF.B.4', 'HSF-LE.B.5'],
      studentWhy: 'If runners keep getting faster, when will the 100m hit 9 seconds? What does the math say vs. what does biology say?',
      objective: 'Students will use a linear model to make predictions, then critique those predictions against domain-specific constraints (physiology).',
      minutes: 20,
      discussion: [
        'What is your prediction for the 2032 Olympics? How confident are you?',
        'A pure linear fit says we hit 0 seconds around year 2400. Why is that obviously wrong?',
      ],
    },
  ],
  rows: RAW.map((r) => ({
    year: r.year,
    city: r.city,
    country: r.country,
    athlete: r.athlete,
    athleteCountry: r.athleteCountry,
    time: r.time,
    timing: r.timing,
    era: r.era,
  })),
};
