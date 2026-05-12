// Container and packaging recycling rates for all 50 US states, from the
// 2023 "50 States of Recycling 2.0" study (Ball Corporation / Eunomia,
// 2021 data). Anchors the Savvas Act-1 "Collecting Cans" (Algebra 1 ·
// Topic 1 · Solving Equations & Inequalities): four students argue about
// who collected the most cans. Real version: which STATES recycle the
// most cans (and bottles, paper, plastic) — and what policy drives the
// difference?

import type { Dataset } from '../lib/dataset';

interface Row {
  state: string;
  region: string;          // US Census Bureau region
  recyclingRatePct: number;// container & packaging recycling rate, 2021
  bottleBill: string;      // 'yes' if state has container-deposit law
  bottleBillRate: string;  // deposit amount (e.g. "5¢ / 10¢") or "none"
  populationM: number;     // 2020 census population, millions
}

// 2020 US Census state populations in millions (rounded to 1dp)
const POP_M: Record<string, number> = {
  Alabama: 5.0, Alaska: 0.7, Arizona: 7.2, Arkansas: 3.0, California: 39.5,
  Colorado: 5.8, Connecticut: 3.6, Delaware: 1.0, Florida: 21.5, Georgia: 10.7,
  Hawaii: 1.5, Idaho: 1.8, Illinois: 12.8, Indiana: 6.8, Iowa: 3.2,
  Kansas: 2.9, Kentucky: 4.5, Louisiana: 4.7, Maine: 1.4, Maryland: 6.2,
  Massachusetts: 7.0, Michigan: 10.1, Minnesota: 5.7, Mississippi: 3.0,
  Missouri: 6.2, Montana: 1.1, Nebraska: 2.0, Nevada: 3.1, 'New Hampshire': 1.4,
  'New Jersey': 9.3, 'New Mexico': 2.1, 'New York': 20.2, 'North Carolina': 10.4,
  'North Dakota': 0.8, Ohio: 11.8, Oklahoma: 4.0, Oregon: 4.2, Pennsylvania: 13.0,
  'Rhode Island': 1.1, 'South Carolina': 5.1, 'South Dakota': 0.9, Tennessee: 6.9,
  Texas: 29.1, Utah: 3.3, Vermont: 0.6, Virginia: 8.6, Washington: 7.7,
  'West Virginia': 1.8, Wisconsin: 5.9, Wyoming: 0.6,
};

const NORTHEAST = ['Connecticut','Maine','Massachusetts','New Hampshire','New Jersey','New York','Pennsylvania','Rhode Island','Vermont'];
const MIDWEST   = ['Illinois','Indiana','Iowa','Kansas','Michigan','Minnesota','Missouri','Nebraska','North Dakota','Ohio','South Dakota','Wisconsin'];
const SOUTH     = ['Alabama','Arkansas','Delaware','Florida','Georgia','Kentucky','Louisiana','Maryland','Mississippi','North Carolina','Oklahoma','South Carolina','Tennessee','Texas','Virginia','West Virginia'];
const WEST      = ['Alaska','Arizona','California','Colorado','Hawaii','Idaho','Montana','Nevada','New Mexico','Oregon','Utah','Washington','Wyoming'];

function regionOf(s: string): string {
  if (NORTHEAST.includes(s)) return 'Northeast';
  if (MIDWEST.includes(s))   return 'Midwest';
  if (SOUTH.includes(s))     return 'South';
  if (WEST.includes(s))      return 'West';
  return 'Other';
}

// Container-deposit ("bottle bill") states as of 2024. Source: NCSL.
const BOTTLE_BILL: Record<string, string> = {
  California: '5¢ (≤24oz) / 10¢ (>24oz)',
  Connecticut: '5¢ (10¢ on wine/spirits)',
  Hawaii: '5¢',
  Iowa: '5¢',
  Maine: '5¢ (15¢ on wine/spirits)',
  Massachusetts: '5¢',
  Michigan: '10¢',
  'New York': '5¢',
  Oregon: '10¢',
  Vermont: '5¢ (15¢ on liquor)',
};

const RATES: Array<[string, number]> = [
  ['Oregon', 63], ['California', 60], ['Maine', 59], ['Iowa', 56], ['New York', 55],
  ['Massachusetts', 54], ['Vermont', 51], ['Connecticut', 49], ['Michigan', 47], ['New Jersey', 46],
  ['Minnesota', 45], ['Wisconsin', 44], ['Maryland', 44], ['Hawaii', 42], ['Washington', 40],
  ['Pennsylvania', 35], ['Illinois', 34], ['Rhode Island', 34], ['New Hampshire', 32], ['North Carolina', 32],
  ['Ohio', 31], ['Missouri', 30], ['Nebraska', 28], ['Delaware', 27], ['Indiana', 27],
  ['Kansas', 26], ['Virginia', 23], ['North Dakota', 22], ['Florida', 21], ['Kentucky', 21],
  ['South Dakota', 20], ['New Mexico', 19], ['Arkansas', 19], ['Nevada', 18], ['Utah', 17],
  ['Idaho', 17], ['Arizona', 17], ['Georgia', 17], ['Montana', 15], ['Wyoming', 13],
  ['Colorado', 11], ['Texas', 8], ['Alabama', 8], ['Oklahoma', 8], ['Mississippi', 6],
  ['South Carolina', 6], ['Alaska', 6], ['Tennessee', 5], ['Louisiana', 4], ['West Virginia', 2],
];

const RAW: Row[] = RATES.map(([state, rate]) => ({
  state,
  region: regionOf(state),
  recyclingRatePct: rate,
  bottleBill: BOTTLE_BILL[state] ? 'yes' : 'no',
  bottleBillRate: BOTTLE_BILL[state] ?? 'none',
  populationM: POP_M[state] ?? 0,
}));

export const RECYCLING_RATES_DATASET: Dataset = {
  id: 'recyclingRates',
  name: 'US state recycling rates · container & packaging',
  description:
    'Container and packaging recycling rates for all 50 US states from the 2023 "50 States of Recycling 2.0" study (2021 data). Ranges from 63% (Oregon) to 2% (West Virginia). The 10 "bottle bill" deposit-law states dominate the top of the list — 9 of the top 12 have one. Real input for the school-recycling-drive math that the Savvas Act-1 video sets up.',
  source: 'Ball Corporation + Eunomia Research & Consulting, "50 States of Recycling 2.0" (2023 publication, 2021 data)',
  family: 'earth',
  provenance: {
    primarySource: 'Ball Corporation / Eunomia Research & Consulting, "50 States of Recycling 2.0" — first standardized US state-by-state recycling-rate study',
    primarySourceUrl: 'https://resource-recycling.com/recycling/2023/02/27/u-s-plastics-pact-estimates-13-3-packaging-recycling-rate/',
    collector: 'Eunomia Research & Consulting (UK) + Ball Corporation (US), with state environmental-agency data',
    collectionMethod:
      'The study computed each state\'s container and packaging recycling rate (glass + plastic + metal + paper + cardboard) using a single standardized methodology. State environmental-agency reports were normalized to a consistent definition of "recycled" (material actually sent to processors, not just collected at curb). 2021 calendar year data. The EPA does not publish standardized state recycling rates; this study fills that gap.',
    collectionPeriod: '2021 calendar year',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'State rates transcribed from Dropcurb\'s summary of the Eunomia/Ball "50 States of Recycling 2.0" study. Cross-checked against Resource Recycling magazine\'s February 2023 coverage of the same report. Bottle-bill information from the National Conference of State Legislatures (NCSL).',
    license: 'Eunomia/Ball study is publicly available; numerical recycling rates are facts about state programs and freely reproducible with citation.',
    citation: 'Ball Corporation & Eunomia Research & Consulting. "50 States of Recycling 2.0." Published February 2023. Data year 2021. https://www.ball.com/sustainability/real-circularity',
    caveats: [
      'The 50-state rates measure container and packaging recycling only. Overall MSW recycling (including organics composting, electronics, textiles) is higher; the EPA national figure for 2018 was 32.1%.',
      'State-level data is notoriously inconsistent. The Eunomia/Ball study normalized methodologies but the underlying data still depends on each state\'s reporting infrastructure.',
      'Bottle bills correlate strongly with high recycling rates, but correlation isn\'t causation — states with bottle bills also tend to have stronger curbside-collection programs and policy infrastructure.',
      'Oregon\'s 63% rate reflects both its 1971 (first-in-the-nation) bottle bill AND California\'s 2024 expansion to wine bottles, which made even higher rates plausible in successor reports.',
      'Florida\'s 21% looks low but covers a state with significant tourism waste, which is harder to recapture for recycling.',
    ],
  },
  story: [
    {
      heading: 'The top 12 states are 9-for-12 bottle-bill states.',
      body:
        'Oregon (63%), California (60%), Maine (59%), Iowa (56%), New York (55%), Massachusetts (54%), Vermont (51%), Connecticut (49%), Michigan (47), Hawaii (42%) — that\'s 9 of the 10 US states with container-deposit laws sitting in the top 14 of the recycling table. The 10th, New Jersey, has no bottle bill but a famously strong curbside program. The policy lever is real, measurable, and visible in the data.',
      highlight: '10 bottle-bill states · avg 53% recycling rate. 40 non-bottle-bill states · avg 17%.',
    },
    {
      heading: 'A 32× range across the country.',
      body:
        'Oregon recycles 63% of its containers. West Virginia recycles 2%. That\'s a 32× ratio — and the gap isn\'t about citizens caring or not caring. It\'s about infrastructure, deposit incentives, and state-level investment. Plot rate vs. region: the Northeast and West dominate the top; the South dominates the bottom.',
    },
    {
      heading: 'The math your school recycling drive runs on.',
      body:
        'If your state recycles at the average rate (~24%), then for every 100 cans collected at school, only 24 are likely actually recycled. The other 76 ride the same truck for a few miles and end up in landfill anyway. The Crack-the-Headline lesson is what to do with that fact: "Our school recycled 5,000 cans!" means about 1,200 cans actually got recycled — if you\'re in a state with average infrastructure.',
    },
  ],
  attributes: [
    { key: 'state',              label: 'State',                kind: 'categorical', description: 'US state name.' },
    { key: 'region',             label: 'Census region',        kind: 'categorical', description: 'Northeast · Midwest · South · West, per US Census Bureau definitions.' },
    { key: 'recyclingRatePct',   label: 'Recycling rate',       kind: 'numeric', unit: '%', description: 'Container and packaging recycling rate, 2021. Range: 63% (Oregon) to 2% (West Virginia).' },
    { key: 'bottleBill',         label: 'Bottle bill state?',   kind: 'categorical', description: '"yes" if the state has a container-deposit law as of 2024; "no" otherwise. 10 states qualify.' },
    { key: 'bottleBillRate',     label: 'Deposit amount',       kind: 'categorical', description: 'Per-container deposit charged at point of sale. Range: 5¢ to 15¢; "none" for non-bottle-bill states.' },
    { key: 'populationM',        label: 'State population',     kind: 'numeric', unit: 'M', description: '2020 US Census population in millions. Useful for weighting state rates by population.' },
  ],
  featured: { type: 'bar', x: 'state', y: 'recyclingRatePct', color: 'bottleBill' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 1,
      topicName: 'Solving Equations and Inequalities',
      mathFit: '"Our school collected 5,000 cans — how many actually got recycled?" is a one-variable equation: total × state-rate = actually-recycled. Filter by your home state to get your local answer; the inequality "what fraction of cans are wasted?" follows directly. Bottle-bill states give the student a follow-up: "what would our state\'s number look like with a deposit law?" — solving a new equation with a new coefficient.',
      standards: ['HSA-CED.A.1', 'HSA-REI.B.3', 'HSS-IC.B.6'],
      studentWhy: 'Every can your school collects has a probability of actually being recycled equal to your state\'s rate. The equation tells you the gap between what you collected and what was saved.',
      objective: 'Students will translate "school collected N cans, state rate r%" into a real-data multiplication problem, compare outcomes across states, and use inequalities to ask how policy could change the math.',
      minutes: 25,
      discussion: [
        'Your state\'s recycling rate is X%. If your class collects 1,000 cans, how many were actually recycled? Multiply by 50,000 schools — what\'s the state-level total?',
        '9 of the top 12 states have bottle bills. What does that say about how individual behavior compares to systemic policy?',
        'West Virginia (2%) and Oregon (63%) are a 32× ratio. What does it take to close that gap — and why hasn\'t it closed?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
