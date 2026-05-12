// The 30 tallest completed buildings in the world (height to architectural
// top), ranked by the Council on Tall Buildings and Urban Habitat (CTBUH).
// Heights are independently verified by CTBUH. Two chapters lean on this:
//
//   - Geometry · Topic 7 (Similarity): scale up a town model to a real
//     building. What does the proportion math look like across 30 actual
//     buildings spanning 4× the height range?
//   - Algebra 1 · Topic 4 (Linear Functions): if you race two elevators
//     up two of these towers, when does one overtake the other?
//
// Sources: CTBUH Skyscraper Center (the global authority on tall-building
// heights) cross-checked against Wikipedia's "List of tallest buildings"
// which compiles CTBUH's data with additional metadata. Both list the
// 2025 international set.

import type { Dataset } from '../lib/dataset';

interface Row {
  name: string;
  city: string;
  country: string;
  region: string;       // hand-grouped continental region for color
  heightM: number;      // height to architectural top, meters
  heightFt: number;     // same, feet — for US-classroom intuition
  floors: number;       // above-ground floors
  yearCompleted: number;
  use: string;          // primary use category
}

const RAW: Row[] = [
  { name: 'Burj Khalifa',                       city: 'Dubai',            country: 'UAE',          region: 'Middle East',   heightM: 828.0, heightFt: 2717, floors: 163, yearCompleted: 2010, use: 'Mixed' },
  { name: 'Merdeka 118',                        city: 'Kuala Lumpur',     country: 'Malaysia',     region: 'Southeast Asia',heightM: 678.9, heightFt: 2227, floors: 118, yearCompleted: 2024, use: 'Mixed' },
  { name: 'Shanghai Tower',                     city: 'Shanghai',         country: 'China',        region: 'East Asia',     heightM: 632.0, heightFt: 2073, floors: 128, yearCompleted: 2015, use: 'Mixed' },
  { name: 'Makkah Royal Clock Tower',           city: 'Mecca',            country: 'Saudi Arabia', region: 'Middle East',   heightM: 601.0, heightFt: 1972, floors: 120, yearCompleted: 2012, use: 'Mixed' },
  { name: 'Ping An Finance Centre',             city: 'Shenzhen',         country: 'China',        region: 'East Asia',     heightM: 599.1, heightFt: 1966, floors: 115, yearCompleted: 2017, use: 'Office' },
  { name: 'Lotte World Tower',                  city: 'Seoul',            country: 'South Korea',  region: 'East Asia',     heightM: 554.5, heightFt: 1819, floors: 123, yearCompleted: 2017, use: 'Mixed' },
  { name: 'One World Trade Center',             city: 'New York',         country: 'USA',          region: 'North America', heightM: 541.3, heightFt: 1776, floors: 104, yearCompleted: 2014, use: 'Office' },
  { name: 'Guangzhou CTF Finance Centre',       city: 'Guangzhou',        country: 'China',        region: 'East Asia',     heightM: 530.0, heightFt: 1740, floors: 111, yearCompleted: 2016, use: 'Mixed' },
  { name: 'Tianjin CTF Finance Centre',         city: 'Tianjin',          country: 'China',        region: 'East Asia',     heightM: 530.0, heightFt: 1740, floors:  97, yearCompleted: 2019, use: 'Mixed' },
  { name: 'CITIC Tower',                        city: 'Beijing',          country: 'China',        region: 'East Asia',     heightM: 527.7, heightFt: 1731, floors: 109, yearCompleted: 2018, use: 'Office' },
  { name: 'Taipei 101',                         city: 'Taipei',           country: 'Taiwan',       region: 'East Asia',     heightM: 508.0, heightFt: 1667, floors: 101, yearCompleted: 2004, use: 'Mixed' },
  { name: 'Shanghai World Financial Center',    city: 'Shanghai',         country: 'China',        region: 'East Asia',     heightM: 492.0, heightFt: 1614, floors: 101, yearCompleted: 2008, use: 'Mixed' },
  { name: 'International Commerce Centre',      city: 'Hong Kong',        country: 'Hong Kong',    region: 'East Asia',     heightM: 484.0, heightFt: 1588, floors: 108, yearCompleted: 2010, use: 'Mixed' },
  { name: 'Wuhan Greenland Center',             city: 'Wuhan',            country: 'China',        region: 'East Asia',     heightM: 475.6, heightFt: 1560, floors: 101, yearCompleted: 2023, use: 'Mixed' },
  { name: 'Central Park Tower',                 city: 'New York',         country: 'USA',          region: 'North America', heightM: 472.4, heightFt: 1550, floors:  98, yearCompleted: 2021, use: 'Residential' },
  { name: 'Lakhta Center',                      city: 'Saint Petersburg', country: 'Russia',       region: 'Europe',        heightM: 462.0, heightFt: 1516, floors:  87, yearCompleted: 2019, use: 'Office' },
  { name: 'Landmark 81',                        city: 'Ho Chi Minh City', country: 'Vietnam',      region: 'Southeast Asia',heightM: 461.2, heightFt: 1513, floors:  81, yearCompleted: 2018, use: 'Mixed' },
  { name: 'International Land-Sea Center',      city: 'Chongqing',        country: 'China',        region: 'East Asia',     heightM: 458.0, heightFt: 1503, floors:  98, yearCompleted: 2024, use: 'Mixed' },
  { name: 'The Exchange 106',                   city: 'Kuala Lumpur',     country: 'Malaysia',     region: 'Southeast Asia',heightM: 453.6, heightFt: 1488, floors:  95, yearCompleted: 2019, use: 'Office' },
  { name: 'Changsha IFS Tower T1',              city: 'Changsha',         country: 'China',        region: 'East Asia',     heightM: 452.1, heightFt: 1483, floors:  94, yearCompleted: 2018, use: 'Mixed' },
  { name: 'Petronas Tower 1',                   city: 'Kuala Lumpur',     country: 'Malaysia',     region: 'Southeast Asia',heightM: 451.9, heightFt: 1483, floors:  88, yearCompleted: 1998, use: 'Office' },
  { name: 'Petronas Tower 2',                   city: 'Kuala Lumpur',     country: 'Malaysia',     region: 'Southeast Asia',heightM: 451.9, heightFt: 1483, floors:  88, yearCompleted: 1998, use: 'Office' },
  { name: 'Zifeng Tower',                       city: 'Nanjing',          country: 'China',        region: 'East Asia',     heightM: 450.0, heightFt: 1480, floors:  89, yearCompleted: 2010, use: 'Mixed' },
  { name: 'Suzhou IFS',                         city: 'Suzhou',           country: 'China',        region: 'East Asia',     heightM: 450.0, heightFt: 1480, floors:  95, yearCompleted: 2019, use: 'Mixed' },
  { name: 'Wuhan Center Tower',                 city: 'Wuhan',            country: 'China',        region: 'East Asia',     heightM: 443.1, heightFt: 1454, floors:  88, yearCompleted: 2019, use: 'Mixed' },
  { name: 'Willis Tower',                       city: 'Chicago',          country: 'USA',          region: 'North America', heightM: 442.1, heightFt: 1450, floors: 108, yearCompleted: 1974, use: 'Office' },
  { name: 'KK100',                              city: 'Shenzhen',         country: 'China',        region: 'East Asia',     heightM: 441.8, heightFt: 1449, floors:  98, yearCompleted: 2011, use: 'Mixed' },
  { name: 'Guangzhou International Finance Ctr', city: 'Guangzhou',       country: 'China',        region: 'East Asia',     heightM: 438.6, heightFt: 1439, floors: 101, yearCompleted: 2010, use: 'Mixed' },
  { name: '111 West 57th Street',               city: 'New York',         country: 'USA',          region: 'North America', heightM: 435.3, heightFt: 1428, floors:  84, yearCompleted: 2021, use: 'Residential' },
  { name: 'Shandong IFC',                       city: 'Jinan',            country: 'China',        region: 'East Asia',     heightM: 428.0, heightFt: 1404, floors:  88, yearCompleted: 2025, use: 'Mixed' },
];

export const TALLEST_BUILDINGS_DATASET: Dataset = {
  id: 'tallestBuildings',
  name: 'World\'s 30 tallest buildings',
  description:
    'The 30 tallest completed buildings on Earth, ranked by architectural height per CTBUH (Council on Tall Buildings and Urban Habitat). Heights from 828 m (Burj Khalifa, Dubai, 2010) down to 428 m (Shandong IFC, Jinan, 2025) — about a 2× range. The shape of the global skyline since 1998.',
  source: 'CTBUH Skyscraper Center 2025 + Wikipedia "List of tallest buildings" (which mirrors CTBUH data)',
  family: 'technology',
  provenance: {
    primarySource: 'Council on Tall Buildings and Urban Habitat (CTBUH) — Skyscraper Center database',
    primarySourceUrl: 'https://www.skyscrapercenter.com/buildings',
    collector: 'CTBUH (Chicago) — independent professional body that maintains the global standard for measuring tall-building height',
    collectionMethod:
      'CTBUH measures each building\'s height "to architectural top" (excluding antennas and flagpoles but including spires) per its 2018 Heights and Floors Criteria. Numbers are verified directly with developers and architects and cross-checked at completion. Floor counts are above-ground only. Year completed is the date the building reached full occupancy or topped out structurally, whichever the database deems canonical.',
    collectionPeriod: 'Continuously maintained; this snapshot reflects CTBUH\'s 2025 ranking of the top 30 completed buildings',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Manual transcription from Wikipedia\'s "List of tallest buildings" (en.wikipedia.org/wiki/List_of_tallest_buildings), which compiles CTBUH\'s rankings with additional structured metadata. Heights and years cross-checked against individual building entries on skyscrapercenter.com.',
    license: 'Wikipedia compilation is CC BY-SA 4.0; underlying CTBUH heights are facts about the built world (not copyrightable). Reproduction with citation is standard practice.',
    citation: 'Council on Tall Buildings and Urban Habitat. "100 Tallest Completed Buildings in the World." Skyscraper Center. Compiled via Wikipedia, "List of tallest buildings," retrieved 2026-05-12.',
    caveats: [
      'Height is measured "to architectural top," not to roof. The Empire State Building\'s height includes its spire (381 m); without it, the roof is 381 m too — but other towers (e.g. Willis Tower 442 m) have antennas that don\'t count.',
      'Year completed reflects CTBUH\'s "completion" definition, which may lag actual topping-out by 1-2 years. Shandong IFC at 2025 is provisional.',
      'Floor counts vary by definition. Above-ground floors only here; below-ground levels are not included even though they often add 4-6 stories.',
      'Mixed-use is the dominant category because most modern supertalls combine office, residential, hotel, and retail in vertical bands. "Office" or "Residential" here means primary use; nearly all have ancillary other uses.',
      'Several buildings tie. Petronas Tower 1 and Tower 2 are listed as separate rows at rank 21 because they have separate addresses; Guangzhou CTF and Tianjin CTF share rank 8 at exactly 530 m.',
    ],
  },
  story: [
    {
      heading: 'A skyline that mostly didn\'t exist in 2000.',
      body:
        '24 of the world\'s 30 tallest buildings were completed after 2010. Three of them were completed in 2024 alone. Take this set and plot height vs. year completed — you don\'t get a line, you get an explosion. The tallest building in 1998 was the Petronas Towers at 452 m. Twelve years later, the Burj Khalifa nearly doubled that.',
      highlight: 'Tallest in 1998: 452 m · Tallest by 2010: 828 m · 83% growth in 12 years.',
    },
    {
      heading: 'Floors aren\'t height.',
      body:
        'Tianjin CTF Finance Centre has 97 floors at 530 m — averaging 5.5 m per floor. The Empire State Building has 102 floors at 381 m — 3.7 m per floor. Modern supertalls have taller floor-to-floor heights because mechanical floors, sky lobbies, and ventilation needs eat space. Plot floors vs. total height: it\'s linear with significant scatter, and the slope tells you how much height each extra story buys.',
    },
    {
      heading: 'And ~70% of them are in China.',
      body:
        '21 of the top 30 are in mainland China, Hong Kong, or Taiwan. None are in Africa, Australia, or Latin America. The geography of the modern skyline is a story about where capital + density + ambition converge. Color the scatter by region and the bias is impossible to miss.',
    },
  ],
  attributes: [
    { key: 'name',           label: 'Building',           kind: 'categorical', description: 'Building name as listed in the CTBUH database.' },
    { key: 'city',           label: 'City',               kind: 'categorical', description: 'City where the building stands. New York, Kuala Lumpur, and Chicago each appear multiple times.' },
    { key: 'country',        label: 'Country',            kind: 'categorical', description: 'Country (or territory — Hong Kong, Taiwan are listed separately from mainland China).' },
    { key: 'region',         label: 'Region',             kind: 'categorical', description: 'Continental region: East Asia, Southeast Asia, Middle East, North America, Europe.' },
    { key: 'heightM',        label: 'Height',             kind: 'numeric', unit: 'm', description: 'Height to architectural top in meters, per CTBUH 2018 Heights and Floors Criteria. Includes spires; excludes antennas and flagpoles.' },
    { key: 'heightFt',       label: 'Height',             kind: 'numeric', unit: 'ft', description: 'Same height converted to feet — useful for US-classroom intuition.' },
    { key: 'floors',         label: 'Floors',             kind: 'numeric', description: 'Number of above-ground occupied floors. Excludes mechanical mezzanines and below-ground levels.' },
    { key: 'yearCompleted',  label: 'Year completed',     kind: 'numeric', description: 'Year of CTBUH-declared completion (typically structural topping-out + curtainwall completion).' },
    { key: 'use',            label: 'Primary use',        kind: 'categorical', description: 'Primary occupied function: Mixed, Office, or Residential. Most supertalls are formally "Mixed" since modern construction stacks all three.' },
  ],
  featured: { type: 'scatter', x: 'yearCompleted', y: 'heightM', color: 'region' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 7,
      topicName: 'Similarity',
      mathFit: 'Plot floors vs. height in meters. A nearly-linear relationship — modern supertalls run ~4-5 m per floor. The 5-m-per-floor average is a similarity invariant: scale the floors up, scale the height up by the same factor. But the scatter around the line is biology — Tianjin CTF Finance Centre at 5.5 m/floor vs. Empire State at 3.7 m/floor is why one looks slim and tall.',
      standards: ['HSG-SRT.A.1', 'HSG-SRT.A.2', 'HSG-MG.A.1'],
      studentWhy: 'Why do modern skyscrapers look "stretched"? Because their floor-to-floor heights got taller. Same proportion math you use on a paper model scales to 800-meter towers.',
      objective: 'Students will fit a linear similarity relationship between number of floors and total building height, identify scatter around the line as building-specific design choices, and connect proportional reasoning to skyscraper engineering constraints.',
      minutes: 30,
      discussion: [
        'What\'s your slope (m per floor)? Compare a 2024 tower to a 1974 one — has it changed?',
        'The Empire State Building (381 m, 102 floors, 1931) is ~3.7 m/floor. Burj Khalifa is ~5 m/floor. What drives the difference — engineering or fashion?',
        'If a new tower has 200 floors, how tall does your model predict? Now check: is that physically possible with current materials?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
