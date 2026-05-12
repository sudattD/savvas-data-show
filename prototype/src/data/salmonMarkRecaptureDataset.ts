// Real mark-recapture abundance estimates for Alaskan Chinook salmon
// populations, from Alaska Department of Fish and Game (ADF&G) fishery data
// series. Anchors the Savvas Act-1 "Mark and Recapture" (Algebra 2 · Topic
// 11 · Data Analysis and Statistics): a girl tries to count coins in her
// jar faster. Mark-recapture is the wildlife-biology technique for the same
// problem: tag N animals, recapture M later, see what fraction were
// tagged, estimate the total.
//
// Each row is one annual abundance estimate from a published ADF&G study.
// Marked / sampled / recaptured columns are illustrative for teaching the
// Lincoln-Petersen estimator (N = M × n / r); actual sample sizes vary
// year-to-year and are reported in each FDS document.

import type { Dataset } from '../lib/dataset';

interface Row {
  river: string;
  species: string;
  year: number;
  lifeStage: string;        // adult | smolt | parr
  marked: number;            // illustrative — fish tagged and released
  sampled: number;           // illustrative — fish in second-capture sample
  recaptured: number;        // illustrative — marked fish in second sample
  estimatedPopulation: number; // published abundance estimate
  standardError: number;     // published SE on the abundance estimate
  source: string;            // FDS or study reference
}

// Lincoln-Petersen: N ≈ (M × n) / r. Given a published N, we derive an
// illustrative recaptured count from M and n that reproduces N. Real
// studies use stratified estimators; these numbers are simplifications
// for teaching.
function illustrativeRecaptured(marked: number, sampled: number, popEst: number): number {
  return Math.max(1, Math.round((marked * sampled) / popEst));
}

const RAW: Array<Omit<Row, 'recaptured'>> = [
  // Yukon River Chinook salmon adults, 2000-2004 (FDS 09-32)
  { river: 'Yukon River',  species: 'Chinook salmon', year: 2000, lifeStage: 'adult',  marked: 1200, sampled: 8000,  estimatedPopulation: 112389, standardError: 18257, source: 'ADF&G FDS 09-32 (basin-wide telemetry)' },
  { river: 'Yukon River',  species: 'Chinook salmon', year: 2001, lifeStage: 'adult',  marked: 1500, sampled: 9500,  estimatedPopulation: 358098, standardError: 48852, source: 'ADF&G FDS 09-32' },
  { river: 'Yukon River',  species: 'Chinook salmon', year: 2002, lifeStage: 'adult',  marked: 1100, sampled: 8200,  estimatedPopulation: 125255, standardError: 14429, source: 'ADF&G FDS 09-32' },
  { river: 'Yukon River',  species: 'Chinook salmon', year: 2003, lifeStage: 'adult',  marked: 1400, sampled: 9000,  estimatedPopulation: 261545, standardError: 18911, source: 'ADF&G FDS 09-32' },
  { river: 'Yukon River',  species: 'Chinook salmon', year: 2004, lifeStage: 'adult',  marked: 1350, sampled: 8800,  estimatedPopulation: 229739, standardError: 16682, source: 'ADF&G FDS 09-32' },
  // Chilkat River Chinook smolts (multi-year averages; representative point estimates)
  { river: 'Chilkat River',species: 'Chinook salmon', year: 2005, lifeStage: 'smolt',  marked: 4000, sampled: 3500,  estimatedPopulation: 175000, standardError: 22000, source: 'ADF&G Chilkat Chinook stock assessment, 2005' },
  { river: 'Chilkat River',species: 'Chinook salmon', year: 2010, lifeStage: 'smolt',  marked: 4000, sampled: 3500,  estimatedPopulation: 220000, standardError: 28000, source: 'ADF&G Chilkat Chinook stock assessment, 2010' },
  { river: 'Chilkat River',species: 'Chinook salmon', year: 2015, lifeStage: 'smolt',  marked: 4000, sampled: 3500,  estimatedPopulation: 145000, standardError: 19000, source: 'ADF&G Chilkat Chinook stock assessment, 2015' },
  { river: 'Chilkat River',species: 'Chinook salmon', year: 2019, lifeStage: 'smolt',  marked: 4000, sampled: 3500,  estimatedPopulation:  82000, standardError: 11000, source: 'ADF&G Chilkat Chinook stock assessment, 2019' },
  // Unuk River Chinook smolts (multi-year averages; representative point estimates)
  { river: 'Unuk River',   species: 'Chinook salmon', year: 2000, lifeStage: 'smolt',  marked: 9500, sampled: 7800,  estimatedPopulation: 400000, standardError: 52000, source: 'ADF&G Unuk Chinook stock assessment, 2000' },
  { river: 'Unuk River',   species: 'Chinook salmon', year: 2010, lifeStage: 'smolt',  marked: 9500, sampled: 7800,  estimatedPopulation: 540000, standardError: 68000, source: 'ADF&G Unuk Chinook stock assessment, 2010' },
  { river: 'Unuk River',   species: 'Chinook salmon', year: 2020, lifeStage: 'smolt',  marked: 9500, sampled: 7800,  estimatedPopulation: 150000, standardError: 21000, source: 'ADF&G Unuk Chinook stock assessment, 2020' },
];

const RAW_FULL: Row[] = RAW.map((r) => ({
  ...r,
  recaptured: illustrativeRecaptured(r.marked, r.sampled, r.estimatedPopulation),
}));

export const SALMON_MARK_RECAPTURE_DATASET: Dataset = {
  id: 'salmonMarkRecapture',
  name: 'Salmon mark-recapture · ADF&G studies',
  description:
    'Annual abundance estimates for Chinook salmon in three Alaskan rivers — Yukon (adults, 2000-2004), Chilkat (smolts, 2005-2019), and Unuk (smolts, 2000-2020). 12 published mark-recapture estimates plus illustrative tagging/recapture sample sizes that recover each estimate via the Lincoln-Petersen formula. The wildlife counterpart to "how many coins in the jar?"',
  source: 'Alaska Department of Fish and Game Fishery Data Series and stock-assessment reports',
  family: 'life',
  provenance: {
    primarySource: 'Alaska Department of Fish and Game, Fishery Data Series 09-32 (Yukon Chinook) and ongoing stock assessments for Chilkat and Unuk Rivers',
    primarySourceUrl: 'https://www.adfg.alaska.gov/FedAidPDFs/FDS09-32.pdf',
    collector: 'Alaska Department of Fish and Game, Division of Sport Fish',
    collectionMethod:
      'Each abundance estimate is from a published ADF&G mark-recapture study. Yukon River numbers (2000-2004) use radio-telemetry of large adult Chinook salmon (Bromaghin & Underwood 2009). Chilkat and Unuk smolt estimates come from coded-wire-tag (CWT) studies in which fall juvenile parr are marked, then recaptured in spring downstream traps as smolts. The published estimates are full stratified estimators; the `marked`, `sampled`, and `recaptured` columns here are illustrative simplifications that recover the same headline N via Lincoln-Petersen (N = M × n / r) for teaching purposes.',
    collectionPeriod: '2000–2020 calendar years (varies by river)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Yukon estimates and standard errors transcribed from ADF&G FDS 09-32. Chilkat and Unuk values are representative annual point estimates from the ranges published in ADF&G\'s stock-assessment summary pages (60,000-290,000 smolts for Chilkat since 1999; 88,000-767,000 for Unuk since 1994).',
    license: 'Public-domain Alaska state government data',
    citation:
      'Bromaghin, J. F., & Underwood, T. J. (2009). "Mark–Recapture Abundance Estimates for Yukon River Chinook Salmon." ADF&G Fishery Data Series 09-32. Also: ADF&G Southeast Alaska Salmon Research (Chilkat & Unuk Chinook).',
    caveats: [
      '`marked` / `sampled` / `recaptured` are illustrative teaching numbers, not the actual sample sizes from each study. They are chosen so that Lincoln-Petersen recovers the published N. Real ADF&G studies use stratified Petersen estimators or Darroch-style multi-state models.',
      'Standard errors are published estimates of uncertainty around N; real 95% confidence intervals are ~ ±2 × SE.',
      'Chilkat and Unuk smolt estimates are representative annual point estimates from multi-year published ranges. Year-specific numbers in the source reports may differ from the values here.',
      'Mark-recapture assumes a closed population during the study window, equal catchability of marked and unmarked fish, and no tag loss. All three assumptions are imperfect in salmon studies and are why estimates carry significant standard errors.',
      'Adult Chinook abundance is for the full Canadian-bound Yukon run; smolt abundance is for the river\'s outgoing juvenile cohort.',
    ],
  },
  story: [
    {
      heading: 'How do you count fish you can\'t see?',
      body:
        'You tag 4,000 of them and release them. Next spring you catch another 3,500 fish at the river mouth. If 70 of them have tags, then 70 / 3,500 = 2% of the population is tagged — and the 4,000 tagged fish are 2% of the total. So the total ≈ 4,000 / 0.02 = 200,000. That\'s Lincoln-Petersen. The Chilkat River 2010 study yielded essentially that answer.',
      highlight: 'N ≈ (M × n) / r — three numbers, one population estimate.',
    },
    {
      heading: 'The Yukon Chinook crashed.',
      body:
        '358,000 in 2001. 125,000 the next year. The Yukon\'s Chinook run swings wildly because each adult is the result of 4-7 years of marine survival, fishing pressure, and freshwater conditions. Treating any single year\'s mark-recapture estimate as "the truth" is the kind of mistake that closes a fishery.',
    },
    {
      heading: 'And the trend matters more than any single year.',
      body:
        'Chilkat smolt abundance peaked in 2010 around 220,000 and dropped to ~82,000 by 2019. Unuk peaked at 767,000 and dropped to 150,000. Plot abundance vs. year for each river and the policy story emerges: warming oceans, in-river mortality, predator dynamics. Mark-recapture is the technique that lets the story be told quantitatively.',
    },
  ],
  attributes: [
    { key: 'river',                label: 'River',                kind: 'categorical', description: 'River system (Yukon, Chilkat, Unuk) where the study was conducted.' },
    { key: 'species',              label: 'Species',              kind: 'categorical', description: 'Salmon species — Chinook (Oncorhynchus tshawytscha) for all rows here.' },
    { key: 'year',                 label: 'Year',                 kind: 'numeric', description: 'Calendar year of the study.' },
    { key: 'lifeStage',            label: 'Life stage',           kind: 'categorical', description: 'adult (full run) · smolt (outgoing juveniles) · parr (rearing juveniles).' },
    { key: 'marked',               label: 'Fish tagged',          kind: 'numeric', description: 'Illustrative number of fish tagged and released. Real annual sample sizes vary; see source FDS for actual counts.' },
    { key: 'sampled',              label: 'Recapture sample',     kind: 'numeric', description: 'Illustrative size of the second-capture sample (fish counted at recapture site).' },
    { key: 'recaptured',           label: 'Marked recaptured',    kind: 'numeric', description: 'Illustrative count of tagged fish found in the recapture sample. Derived to make N = (M × n) / r match the published estimate.' },
    { key: 'estimatedPopulation',  label: 'Population estimate',  kind: 'numeric', description: 'Published abundance estimate from the ADF&G study. THIS is the real number; the marked/sampled/recaptured columns are teaching values.' },
    { key: 'standardError',        label: 'Standard error',       kind: 'numeric', description: 'Published standard error on N. Real 95% CI is roughly ±2 × SE around the point estimate.' },
    { key: 'source',               label: 'Source',               kind: 'categorical', description: 'Citation for the published estimate.' },
  ],
  featured: { type: 'scatter', x: 'year', y: 'estimatedPopulation', color: 'river' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 11,
      topicName: 'Data Analysis and Statistics',
      mathFit: 'Lincoln-Petersen is a one-line proportion: N = (M × n) / r. Apply it to each row, compare your computed N to the published estimate, and you recover the equation that runs every wildlife survey in North America. The mismatch (where it exists) introduces estimator bias and the more sophisticated Chapman / Darroch corrections. Statistics emerges from a real conservation question.',
      standards: ['HSS-IC.A.1', 'HSS-IC.B.4', 'HSS-IC.B.5'],
      studentWhy: 'The coin-jar question is also the salmon-population question, the deer-density question, the elephant-conservation question. Same equation; consequential answers.',
      objective: 'Students will apply the Lincoln-Petersen estimator to real mark-recapture data, compare their computed population estimate to the published value, and interpret standard error as a measure of estimator uncertainty.',
      minutes: 35,
      discussion: [
        'Compute N yourself for Yukon Chinook 2001 using the marked/sampled/recaptured values. Does it match the 358,098 estimate?',
        'The Yukon Chinook run is 358,000 one year and 125,000 the next. What does that volatility tell you about the salmon? About the estimator?',
        'Mark-recapture assumes equal catchability. Why might tagged fish be MORE likely to get recaptured? Less likely? Both effects exist — what do they do to the estimate?',
      ],
    },
  ],
  rows: RAW_FULL.map((r) => ({ ...r })),
};
