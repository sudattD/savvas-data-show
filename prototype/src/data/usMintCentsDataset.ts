// US Mint annual penny (one-cent) production, 1959–2025. 67 years of real
// federal Mint data — a dramatic rise from 1.9 billion in 1959 to a peak
// of 16.7 billion in 1982, then a long decline to 1.3 billion in 2025 as
// US Treasury announced an end to penny production. Anchors the Savvas
// Act-1 "Unwrapping Change" (Algebra 1 Topic 9, polynomials & factoring):
// real polynomial behavior, with roots that are physical events — the
// year production crossed 10 billion, the year it crossed back down.

import type { Dataset } from '../lib/dataset';

interface Row {
  year: number;
  pennies: number;        // total one-cent pieces produced (Philadelphia + Denver)
  penniesBillions: number; // same in billions, for chart readability
  decade: string;
  era: string;
}

const RAW_PAIRS: Array<[number, number]> = [
  [1959, 1_889_475_000], [1960, 2_167_289_000], [1961, 2_506_611_700],
  [1962, 2_399_193_400], [1963, 2_528_130_400], [1964, 6_447_646_500],
  [1965, 1_497_224_900], [1966, 2_188_147_783], [1967, 3_048_667_100],
  [1968, 4_852_420_571], [1969, 5_684_117_200], [1970, 5_480_313_904],
  [1971, 5_355_669_059], [1972, 5_975_265_508], [1973, 7_594_998_883],
  [1974, 8_876_665_183], [1975, 9_956_751_442], [1976, 8_895_884_881],
  [1977, 8_663_992_300], [1978, 9_838_838_400], [1979, 10_157_872_254],
  [1980, 12_554_803_660], [1981, 12_864_985_677], [1982, 16_725_504_368],
  [1983, 14_219_554_428], [1984, 13_720_317_906], [1985, 10_935_889_813],
  [1986, 8_934_262_191], [1987, 9_561_856_445], [1988, 11_346_550_443],
  [1989, 12_607_002_111], [1990, 11_774_659_533], [1991, 9_324_382_076],
  [1992, 9_097_578_300], [1993, 12_111_355_571], [1994, 13_632_615_000],
  [1995, 13_540_000_000], [1996, 13_123_260_000], [1997, 9_199_355_000],
  [1998, 10_257_400_000], [1999, 11_597_665_000], [2000, 14_277_420_000],
  [2001, 10_334_590_000], [2002, 7_288_855_000], [2003, 6_848_000_000],
  [2004, 6_836_000_000], [2005, 7_700_050_500], [2006, 8_234_000_000],
  [2007, 7_401_200_000], [2008, 5_419_200_000], [2009, 2_354_000_000],
  [2010, 4_010_830_000], [2011, 4_938_540_000], [2012, 6_015_200_000],
  [2013, 7_070_000_000], [2014, 8_146_400_000], [2015, 9_365_300_000],
  [2016, 9_118_400_000], [2017, 8_634_020_000], [2018, 7_478_200_000],
  [2019, 7_040_400_000], [2020, 7_596_400_000], [2021, 7_908_620_000],
  [2022, 6_359_600_000], [2023, 4_522_800_000], [2024, 3_225_200_000],
  [2025, 1_300_400_000],
];

function eraOf(y: number): string {
  if (y < 1973) return 'Pre-copper-zinc';   // pennies were 95% copper
  if (y < 1982) return 'Copper era · rising';
  if (y < 1990) return 'Copper-zinc switch'; // 1982 mid-year switch to zinc-core
  if (y < 2009) return 'Steady high production';
  if (y < 2022) return 'Post-GFC recovery';
  return 'Wind-down';                        // 2022+ declining toward halt
}

const RAW: Row[] = RAW_PAIRS.map(([year, pennies]) => ({
  year,
  pennies,
  penniesBillions: Number((pennies / 1e9).toFixed(3)),
  decade: `${Math.floor(year / 10) * 10}s`,
  era: eraOf(year),
}));

export const US_MINT_CENTS_DATASET: Dataset = {
  id: 'usMintCents',
  name: 'US Mint penny production, 1959–2025',
  description:
    'Total US one-cent coins produced each year, 1959 through 2025 — 67 years of federal mintage data. Rose from 1.9 billion in 1959 to a peak of 16.7 billion in 1982, then declined to 1.3 billion in 2025 as the US Treasury announced the end of penny production. A real polynomial whose roots are policy events.',
  source: 'United States Mint annual production figures',
  family: 'people',
  provenance: {
    primarySource: 'United States Mint, "Circulating Coins Production" annual reports',
    primarySourceUrl: 'https://www.usmint.gov/about/production-sales-figures/circulating-coins-production',
    collector: 'US Department of the Treasury / United States Mint, Office of Public Affairs',
    collectionMethod:
      'The US Mint publishes annual circulating-coin production by denomination and facility as part of its public reporting obligations under the Coinage Act (31 U.S.C. § 5111). Each row here sums Philadelphia + Denver facility production for one calendar year. San Francisco produced cents through 1974; all later cents come exclusively from Philadelphia and Denver.',
    collectionPeriod: '1959–2025 calendar years',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Compiled from the Wikipedia "United States Mint coin production" article (https://en.wikipedia.org/wiki/United_States_Mint_coin_production), which mirrors the Mint\'s own annual production tables. Spot-checked against US Mint\'s 2024 fiscal-year report and CoinNews aggregated production figures.',
    license: 'Public-domain US government data — works of the federal government are not subject to copyright under 17 U.S.C. § 105',
    citation: 'United States Mint. "Circulating Coins Production, Annual Reports (1959–2025)." US Department of the Treasury, Washington DC. Available at https://www.usmint.gov/about/production-sales-figures/.',
    caveats: [
      'Per-mint split (Philadelphia vs. Denver) is available year-by-year on the Mint\'s site but not stored here — totals only.',
      'Numbers represent circulating coins only; proof-set and uncirculated-mint-set cents are reported separately by the Mint and are excluded from this dataset.',
      'The 1982 figure includes both the old 95%-copper alloy and the new copper-plated-zinc penny — the Mint switched composition mid-year. The total still reflects all one-cent coins struck that year.',
      '2025 production is provisional (year-to-date as of May 2026); the final annual figure will be published in January 2027.',
      'In May 2024 the US Treasury announced it would halt penny production; 2025 mintage of 1.3 billion is the lowest annual figure since 1957 and reflects that decision.',
    ],
  },
  story: [
    {
      heading: '67 years, ~580 billion pennies.',
      body:
        'In total, the US Mint has produced about 580 billion one-cent coins since 1959. If you stacked them, the column would reach the moon and back twice. They cost more to produce than their face value — the Treasury loses about 3¢ on every penny minted.',
      highlight: 'Peak year: 1982 · 16.7 billion cents · the switch from copper to copper-plated zinc.',
    },
    {
      heading: 'The shape isn\'t a line. It\'s a curve.',
      body:
        'Production rose sharply through the 1970s as inflation made small change valuable again, hit its all-time peak in 1982 at 16.7 billion, then settled into a long decline. The pattern fits a third-degree polynomial — rise, peak, decline — better than any straight line. Where does the curve cross 10 billion? Twice: once on the way up (1979), once on the way down (around 2001).',
    },
    {
      heading: 'And then, the wind-down.',
      body:
        'In 2024 the US Treasury announced it would stop producing pennies. 2025 production fell to 1.3 billion, the lowest since 1957. The penny\'s polynomial has a final root coming — the year production crosses zero. The math you fit to this curve isn\'t academic. It\'s policy.',
    },
  ],
  attributes: [
    { key: 'year',             label: 'Year',              kind: 'numeric', description: 'Calendar year, 1959–2025.' },
    { key: 'pennies',          label: 'Pennies produced',  kind: 'numeric', description: 'Total one-cent coins minted that year (Philadelphia + Denver, sometimes + San Francisco).' },
    { key: 'penniesBillions',  label: 'Pennies (billions)',kind: 'numeric', unit: 'B', description: 'Same as `pennies`, divided by one billion. Easier to read on a chart.' },
    { key: 'decade',           label: 'Decade',            kind: 'categorical', ordinal: true, description: 'Decade tag (1950s, 1960s, …, 2020s).' },
    { key: 'era',              label: 'Era',               kind: 'categorical', description: 'Hand-grouped narrative era: Pre-copper-zinc, Copper era rising, Copper-zinc switch, Steady high, Post-GFC, Wind-down.' },
  ],
  featured: { type: 'scatter', x: 'year', y: 'penniesBillions', color: 'era' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 9,
      topicName: 'Polynomials and Factoring',
      mathFit: 'A cubic-shaped real-world time series. Fit a polynomial; identify the roots — the years production crossed 5 billion, crossed 10 billion. The peak (vertex) is at 1982; the imminent zero is the policy decision to stop. Factoring becomes "when does this hit a meaningful number?" — and the answers are dates.',
      standards: ['HSA-APR.B.3', 'HSF-IF.C.7.c', 'HSS-ID.B.6'],
      studentWhy: 'Every penny in your pocket came from this curve. The curve\'s zero is the date pennies stop existing.',
      objective: 'Students will fit a polynomial to US Mint penny-production data, identify roots of the model (years production crossed specific thresholds), and connect the cubic shape to historical and policy events.',
      minutes: 30,
      discussion: [
        'Where does your polynomial cross 10 billion? Compare to 1979 and 2001 — does the model nail it?',
        'The 1982 peak isn\'t a coincidence — that\'s the year the Mint switched the penny from copper to copper-plated zinc. Why might production spike during a material switch?',
        'If the Treasury halts penny production after 2025, what does that mean for the polynomial? Where\'s the final root?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
