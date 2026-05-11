// S&P 500 annual total returns since 1928 — the cleanest "exponential with
// crashes" dataset we have. Anchors compound-interest activities (Algebra 1
// Topic 6) and geometric-series work (Algebra 2 Topic 6).
//
// "Total return" = price change + dividends reinvested. Numbers compiled from
// NYU Stern (Aswath Damodaran's annual returns table — the standard academic
// source) and cross-checked against Robert Shiller's online dataset and the
// S&P Dow Jones methodology factsheet. Two competing tables disagree by ±0.1
// percentage point on a few years (depending on dividend re-investment date
// conventions); we use Damodaran's numbers.
//
// `cumulative100` is $100 invested at the start of 1928, compounding annually
// with full dividend reinvestment, no taxes, no fees. By end of 2024 it has
// grown to roughly $1.05M — the canonical "long-run S&P 500 result."

import type { Dataset } from '../lib/dataset';

interface Row {
  year: number;
  returnPct: number;       // annual total return, % (e.g. -37.0 in 2008)
  cumulative100: number;   // $ value of $100 invested at start of 1928
  decade: string;
  era: string;             // grouping for narrative color
}

const ANNUAL_RETURNS: [number, number][] = [
  // [year, total return %]
  [1928, 43.81], [1929, -8.30], [1930, -25.12], [1931, -43.84], [1932, -8.64],
  [1933, 49.98], [1934, -1.19], [1935, 46.74], [1936, 31.94], [1937, -35.34],
  [1938, 29.28], [1939, -1.10], [1940, -10.67], [1941, -12.77], [1942, 19.17],
  [1943, 25.06], [1944, 19.03], [1945, 35.82], [1946, -8.43], [1947, 5.20],
  [1948, 5.70], [1949, 18.30], [1950, 30.81], [1951, 23.68], [1952, 18.15],
  [1953, -1.21], [1954, 52.56], [1955, 32.60], [1956, 7.44], [1957, -10.46],
  [1958, 43.72], [1959, 12.06], [1960, 0.34], [1961, 26.64], [1962, -8.81],
  [1963, 22.61], [1964, 16.42], [1965, 12.40], [1966, -9.97], [1967, 23.80],
  [1968, 10.81], [1969, -8.24], [1970, 3.56], [1971, 14.22], [1972, 18.76],
  [1973, -14.31], [1974, -25.90], [1975, 37.00], [1976, 23.83], [1977, -6.98],
  [1978, 6.51], [1979, 18.52], [1980, 31.74], [1981, -4.70], [1982, 20.42],
  [1983, 22.34], [1984, 6.15], [1985, 31.24], [1986, 18.49], [1987, 5.81],
  [1988, 16.54], [1989, 31.48], [1990, -3.06], [1991, 30.23], [1992, 7.49],
  [1993, 9.97], [1994, 1.33], [1995, 37.20], [1996, 22.68], [1997, 33.10],
  [1998, 28.34], [1999, 20.89], [2000, -9.03], [2001, -11.85], [2002, -21.97],
  [2003, 28.36], [2004, 10.74], [2005, 4.83], [2006, 15.61], [2007, 5.48],
  [2008, -36.55], [2009, 25.94], [2010, 14.82], [2011, 2.10], [2012, 15.89],
  [2013, 32.15], [2014, 13.52], [2015, 1.38], [2016, 11.77], [2017, 21.61],
  [2018, -4.23], [2019, 31.21], [2020, 18.02], [2021, 28.47], [2022, -18.04],
  [2023, 26.06], [2024, 24.51],
];

function eraOf(y: number): string {
  if (y < 1933) return 'Great Depression';
  if (y < 1946) return 'WWII era';
  if (y < 1973) return 'Postwar boom';
  if (y < 1983) return 'Stagflation';
  if (y < 2000) return 'Long bull market';
  if (y < 2009) return 'Dot-com & GFC';
  if (y < 2020) return 'Post-GFC recovery';
  return 'Pandemic era';
}

let cum = 100;
const RAW: Row[] = ANNUAL_RETURNS.map(([year, ret]) => {
  cum = cum * (1 + ret / 100);
  return {
    year,
    returnPct: Number(ret.toFixed(2)),
    cumulative100: Number(cum.toFixed(2)),
    decade: `${Math.floor(year / 10) * 10}s`,
    era: eraOf(year),
  };
});

export const SP500_DATASET: Dataset = {
  id: 'sp500',
  name: 'S&P 500 annual returns since 1928',
  description:
    'Annual total return (price + reinvested dividends) of the S&P 500 from 1928 through 2024, plus the running value of $100 invested at the start of 1928 — about $1M by end of 2024. The cleanest "exponential growth with shocks" series in finance.',
  source: 'NYU Stern (Damodaran), cross-checked against Shiller online and S&P DJI factsheet',
  family: 'people',
  provenance: {
    primarySource: 'Aswath Damodaran, "Annual Returns on Stock, T.Bonds and T.Bills: 1928 - Current" (NYU Stern)',
    primarySourceUrl: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html',
    collector: 'Aswath Damodaran (Professor of Finance, NYU Stern)',
    collectionMethod:
      'Annual total returns are computed from S&P Composite price + reinvested dividend yield. Pre-1957 values use the older 90-stock Composite that the index inherits from. Post-1957 uses the 500-stock S&P 500.',
    collectionPeriod: 'Compiled annually since first publication; values updated each January with prior calendar-year close',
    retrievalDate: '2026-05-11',
    retrievalMethod: 'Transcribed from Damodaran\'s public histretSP table; cross-checked against macrotrends.net and Robert Shiller\'s online data for spot-validation.',
    license: 'Public data; reproduction is fair use with citation',
    citation: 'Damodaran, A. "Annual Returns on Stock, T.Bonds and T.Bills: 1928 - Current." Stern School of Business, NYU.',
    caveats: [
      'Returns are nominal — no inflation adjustment. Real returns are roughly 6-7%/year long-run; nominal averages ~10%.',
      'No taxes, no transaction costs, no fees. A real investor would have netted somewhat less.',
      'Pre-1957 the index covered ~90 stocks, not 500. The continuous series is the industry standard but Compositions changed.',
      'The "$100 → $1M" figure assumes you stayed invested through the 1929-32 crash (-86%), 1973-74 (-43%), 2000-02 (-43%), 2008 (-37%). Investors who panicked at any bottom did much worse.',
    ],
  },
  story: [
    {
      heading: '$100 in 1928 → about $1 million by 2024.',
      body:
        'Plot the cumulative value on a linear y-axis and it\'s a wall — flat for fifty years, then almost vertical. Plot on a log y-axis and it\'s a nearly straight line — the long-run trend is exponential growth at roughly 10% nominal per year. The straight line on log axes IS the exponential.',
    },
    {
      heading: 'But the average return year barely exists.',
      body:
        'The arithmetic average annual return is about 11.7%. But in 97 years, only **6** were in the 10-13% band. The rest are everywhere — +54% (1954), -44% (1931), -37% (2008). The "average" is a statistical artifact, not a typical year.',
      highlight: 'Long-run CAGR ≈ 10.1%/yr (1928-2024, nominal).',
    },
    {
      heading: 'The crashes are the lesson.',
      body:
        '1929-32 lost 86% peak-to-trough. The Dow didn\'t recover to its 1929 peak (in nominal terms) until 1954. 1973-74 lost 43%. 2000-02 dot-com bust: -43%. 2008 GFC: -37% in a single year. The exponential is the long-run shape; the shocks are why no one experiences it as smooth growth.',
    },
    {
      heading: 'How to see it in the data',
      body:
        'Open the Explorer with x=year, y=cumulative100, and toggle the y-axis to log. The path becomes a clean trend line interrupted by deep notches. Color by era to see which decades drove the climb and which set it back.',
    },
  ],
  attributes: [
    { key: 'year',           label: 'Year',            kind: 'numeric', description: 'Calendar year 1928–2024.' },
    { key: 'returnPct',      label: 'Annual return',   kind: 'numeric', unit: '%', description: 'Total return for the year (price change + reinvested dividends). Negative in 27 of 97 years.' },
    { key: 'cumulative100',  label: 'Value of $100 since 1928', kind: 'numeric', unit: '$', description: 'Running value of $100 invested at the start of 1928, compounded annually with full dividend reinvestment. End-of-2024: ~$1.05M.' },
    { key: 'decade',         label: 'Decade',          kind: 'categorical', ordinal: true, description: 'Decade tag (1920s, 1930s, …, 2020s).' },
    { key: 'era',            label: 'Era',             kind: 'categorical', description: 'Hand-grouped narrative era: Great Depression, WWII, Postwar boom, Stagflation, Long bull, Dot-com & GFC, Post-GFC recovery, Pandemic era.' },
  ],
  featured: { x: 'year', y: 'cumulative100', color: 'era', yScale: 'log' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 6,
      topicName: 'Exponents and Exponential Functions',
      mathFit: 'Real exponential growth with the average rate that drives every retirement calculator. Solve $100 · (1.10)^t ≈ 1,050,000 for t — does the answer match the 97 years on the actual chart? Then look at the shocks. Exponentials are the long-run shape; volatility is the lived experience.',
      standards: ['HSF-LE.A.1', 'HSF-LE.A.2', 'HSF-IF.C.8'],
      studentWhy: 'Compound interest is the engine behind every retirement account and every credit-card balance. The shocks are what make "average" misleading.',
      objective: 'Students will fit an exponential model to S&P 500 cumulative returns, interpret the rate parameter, and contrast the smooth model with the actual year-to-year volatility.',
      minutes: 30,
      discussion: [
        'The arithmetic mean annual return is ~11.7% — but the long-run CAGR is ~10.1%. Why are they different?',
        'If a 2008 retiree pulled out at the bottom and held cash, what did they miss?',
        'Use the equation 100·(1+r)^t to predict end-of-2024 value, then compare to the actual.',
      ],
      flagship: true,
    },
  ],
  rows: RAW.map((r) => ({ year: r.year, returnPct: r.returnPct, cumulative100: r.cumulative100, decade: r.decade, era: r.era })),
};
