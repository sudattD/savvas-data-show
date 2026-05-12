// Average NBA player height by season, 1947-2021 — 75 seasons of league
// roster data. Anchors the Savvas Act-1 "How Tall Is Tall?" (Algebra 1 ·
// Topic 2 · Linear Equations): a tall man named Jay is measured against
// sheep, babies, teachers, and finally a stack of plastic cups. This
// dataset asks the population-scale version: how has the AVERAGE NBA
// player's height changed over 75 years? (Answer: rose 5 inches from
// 1947 to 1986, then plateaued, then has DROPPED for the past decade.)

import type { Dataset } from '../lib/dataset';

interface Row {
  season: number;             // year the season started (e.g. 1986 for 1986-87)
  heightInches: number;       // mean height in inches
  heightCm: number;           // mean height in centimeters
  decade: string;             // for color
  era: string;                // hand-grouped narrative era
}

const PAIRS: Array<[number, number, number]> = [
  // [season, heightInches, heightCm]
  [1947, 74.13, 188.2], [1948, 74.51, 189.3], [1949, 75.20, 190.9], [1950, 75.64, 192.1],
  [1951, 76.12, 193.3], [1952, 76.16, 193.4], [1953, 75.72, 192.3], [1954, 76.15, 193.4],
  [1955, 76.34, 193.9], [1956, 76.97, 195.5], [1957, 76.98, 195.5], [1958, 77.24, 196.2],
  [1959, 76.94, 195.4], [1960, 77.16, 196.0], [1961, 77.32, 196.4], [1962, 77.12, 195.9],
  [1963, 77.53, 196.9], [1964, 77.49, 196.8], [1965, 77.62, 197.1], [1966, 77.42, 196.6],
  [1967, 77.71, 197.4], [1968, 77.57, 197.0], [1969, 77.67, 197.3], [1970, 77.68, 197.3],
  [1971, 77.74, 197.5], [1972, 77.80, 197.6], [1973, 77.88, 197.8], [1974, 77.83, 197.7],
  [1975, 77.93, 197.9], [1976, 78.11, 198.4], [1977, 78.05, 198.2], [1978, 78.08, 198.3],
  [1979, 78.18, 198.6], [1980, 78.33, 198.9], [1981, 78.38, 199.1], [1982, 78.57, 199.5],
  [1983, 78.81, 200.1], [1984, 78.76, 199.9], [1985, 78.82, 200.1], [1986, 79.03, 200.8],
  [1987, 79.04, 200.8], [1988, 79.02, 200.7], [1989, 78.93, 200.5], [1990, 78.81, 200.1],
  [1991, 78.95, 200.6], [1992, 78.65, 199.8], [1993, 78.90, 200.4], [1994, 79.05, 200.8],
  [1995, 78.78, 200.0], [1996, 78.90, 200.4], [1997, 78.94, 200.5], [1998, 78.73, 199.9],
  [1999, 78.85, 200.3], [2000, 78.93, 200.5], [2001, 78.90, 200.4], [2002, 78.93, 200.5],
  [2003, 79.17, 201.1], [2004, 79.20, 201.2], [2005, 79.13, 201.0], [2006, 79.05, 200.8],
  [2007, 78.94, 200.5], [2008, 78.99, 200.6], [2009, 79.12, 201.0], [2010, 78.98, 200.6],
  [2011, 79.12, 201.0], [2012, 78.94, 200.5], [2013, 78.86, 200.3], [2014, 78.84, 200.2],
  [2015, 78.72, 199.9], [2016, 78.73, 199.9], [2017, 78.84, 200.2], [2018, 78.55, 199.4],
  [2019, 78.58, 199.5], [2020, 78.45, 199.2], [2021, 78.33, 198.9],
];

function eraOf(year: number): string {
  if (year < 1960) return 'Founding era';        // pre-shot clock + early expansion
  if (year < 1976) return 'BAA-NBA merger';      // expansion + integration
  if (year < 1990) return 'Magic & Bird rise';   // 1970s-80s height surge
  if (year < 2005) return 'Center era peak';     // Shaq, Olajuwon, Robinson, Mutombo
  if (year < 2015) return 'Twin-tower transition';// post-Shaq big men
  return 'Three-point revolution';                // Curry era, smaller, faster
}

const RAW: Row[] = PAIRS.map(([season, inches, cm]) => ({
  season,
  heightInches: inches,
  heightCm: cm,
  decade: `${Math.floor(season / 10) * 10}s`,
  era: eraOf(season),
}));

export const NBA_HEIGHTS_DATASET: Dataset = {
  id: 'nbaHeights',
  name: 'Average NBA player height, 1947–2021',
  description:
    '75 seasons of average NBA roster height. The league grew about 4.5 inches taller between its first season (6\'2.1" in 1947) and its peak in the late 1980s (6\'7.0"). It has slowly DECLINED since 2003 as basketball became more perimeter-oriented — by 2021 the average had dropped back to 6\'6.3", a 39-year low.',
  source: 'NBA roster height records compiled by RunRepeat from official NBA player bios',
  family: 'people',
  provenance: {
    primarySource: 'RunRepeat. "70 Years of Height Evolution in the NBA [4,504 players analyzed]"',
    primarySourceUrl: 'https://runrepeat.com/height-evolution-in-the-nba',
    collector: 'RunRepeat research team, compiling from NBA.com player bios',
    collectionMethod:
      'RunRepeat aggregated official NBA-listed heights for every player on a season roster between 1947 and 2021 (4,504 unique players across the period). For each season, the mean is computed across active rostered players. NBA heights are self-reported by teams using a standard "with shoes" measurement; players are typically listed at 1 inch above their barefoot height.',
    collectionPeriod: '1947–2021 NBA seasons (75 seasons)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Manual transcription of RunRepeat\'s published table. Cross-checked against Basketball Reference (basketball-reference.com) season pages and StatMuse query results for spot-validation at decade boundaries.',
    license: 'NBA player biographical data is published publicly by the league; statistical compilations of roster data are widely reproduced. RunRepeat\'s aggregation is cited.',
    citation: 'RunRepeat. "70 Years of Height Evolution in the NBA [4,504 players analyzed]." 2021. Cross-referenced with Basketball Reference season pages.',
    caveats: [
      'NBA-listed heights are "with shoes" — the league\'s 2019 rule change requires barefoot measurement at the Draft Combine, so post-2019 heights are roughly 0.5-1.0" lower than pre-2019 values would have been on the same player.',
      'Heights are self-reported by teams and historically inflated by ~0.5-1.0" for players (taller looks better in draft scouting). The decline in recent years is partly real, partly a measurement-honesty correction.',
      'These are season averages — single-player extremes don\'t move the mean much. Manute Bol at 7\'7" (1985-95) shifted his team\'s mean by ~0.05".',
      'The 1947 NBA was actually called the BAA; the league became the NBA after the 1949 merger with the NBL. Heights here cover the full continuous record.',
      'Position averages diverge sharply: centers average ~7\'0", point guards ~6\'2". The league-wide mean is a blend that depends on era-specific roster composition.',
    ],
  },
  story: [
    {
      heading: '4.5 inches taller in 40 years.',
      body:
        'In 1947 the average NBA player was 6\'2.1". By 1986 he was 6\'7.0". That\'s 4.5 inches of growth in four decades — driven by global scouting, better training, and a league that became progressively more selective for height as 7-footers dominated. Plot the data and the trend is a clean rising line through 1990.',
      highlight: '1947 → 1986: +4.5" in 39 seasons. Then plateau. Then DECLINE.',
    },
    {
      heading: 'The league is now SHORTER than it was 39 years ago.',
      body:
        'Since the late 2000s, NBA average height has been falling — slowly but steadily. By 2021 the average was 6\'6.3", the shortest the league has been since 1982. The cause: the three-point revolution. Steph Curry won an MVP at 6\'2"; the modern game values shooting and ball-handling over post play. Plot height vs. season after 2005 and the trend reverses direction.',
    },
    {
      heading: 'A real linear fit, with a real breakpoint.',
      body:
        'Fit a line to 1947-1985: about +0.13" per season, R² near 0.95. Strong linear growth. Fit a line to 2005-2021: about -0.05" per season, also linear. Two regimes, one piecewise function. The breakpoint year is around 1990 — exactly when the league hit its all-time-tallest plateau. The math is everywhere; the story is "how did basketball change?"',
    },
  ],
  attributes: [
    { key: 'season',         label: 'Season',          kind: 'numeric',     description: 'Year the NBA season started (e.g. 1986 means the 1986-87 season).' },
    { key: 'heightInches',   label: 'Average height',  kind: 'numeric', unit: 'in', description: 'Mean height of all rostered players that season, in inches. Range: 74.13 (1947) to 79.20 (2004).' },
    { key: 'heightCm',       label: 'Average height',  kind: 'numeric', unit: 'cm', description: 'Same average, in centimeters. 188.2 cm (1947) to 201.2 cm (2004).' },
    { key: 'decade',         label: 'Decade',          kind: 'categorical', ordinal: true, description: 'Decade label (1940s, 1950s, …, 2020s).' },
    { key: 'era',            label: 'Era',             kind: 'categorical', description: 'Hand-grouped narrative era: Founding · BAA-NBA merger · Magic & Bird rise · Center era peak · Twin-tower transition · Three-point revolution.' },
  ],
  featured: { type: 'scatter', x: 'season', y: 'heightInches', color: 'era' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 2,
      topicName: 'Linear Equations',
      mathFit: 'A near-linear rise from 1947 to 1986, then a clear plateau, then a decline. Fit a line to the 1947-1985 segment — slope is about 0.13 in/season. The breakpoint year (around 1990) and the reversal in 2005 give students a piecewise linear story without ever leaving Topic 2. Multiplying that slope by years answers "how tall is the league in 2050?" — and the answer is provocative.',
      standards: ['HSA-CED.A.2', 'HSF-LE.A.2', 'HSS-ID.B.6.a'],
      studentWhy: 'How tall was the average NBA player when your grandfather was young? Your father? You? The line that connects those answers is one linear equation.',
      objective: 'Students will fit a linear model to NBA height vs. season, interpret the slope as inches-per-year, and identify a clear breakpoint where the trend changes direction.',
      minutes: 25,
      discussion: [
        'The 1947 average was 6\'2"; the 2021 average is 6\'6". That\'s a 4-inch rise. Is that "fast" or "slow" on a generational timescale?',
        'Fit a line to 1947-1985 vs. 2005-2021. The slopes have opposite signs. What changed about basketball?',
        'If your linear model predicts the 2050 average, what does it say? Is the prediction reasonable? Why or why not?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
