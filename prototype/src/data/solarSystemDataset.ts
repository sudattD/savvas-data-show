// The solar system — every named planet and major dwarf planet, sized
// to make Kepler's Third Law (T² ∝ r³) visible on a log-log plot.
//
// Source: NASA Planetary Fact Sheets (nssdc.gsfc.nasa.gov/planetary/factsheet/).
// Moon counts are IAU-confirmed natural satellites as of 2024 (Saturn jumped
// to 146 in 2023 after Sheppard et al.'s photographic survey).

import type { Dataset } from '../lib/dataset';

interface Row {
  body: string;
  kind: string; // 'Planet' | 'Dwarf planet'
  zone: string; // 'Inner' | 'Outer' | 'Trans-Neptunian'
  distanceAU: number;     // semi-major axis from the sun in AU (1 AU = ~150M km)
  periodYears: number;    // orbital period in Earth years
  massEarths: number;     // mass in Earth masses
  radiusKm: number;       // mean equatorial radius in km
  moons: number;          // IAU-confirmed natural satellites
  surfaceTempC: number;   // mean surface (or 1-bar) temperature in °C
}

const RAW: Row[] = [
  { body: 'Mercury', kind: 'Planet',       zone: 'Inner',           distanceAU: 0.387,  periodYears: 0.241,    massEarths: 0.0553,  radiusKm:  2440, moons: 0,   surfaceTempC: 167 },
  { body: 'Venus',   kind: 'Planet',       zone: 'Inner',           distanceAU: 0.723,  periodYears: 0.615,    massEarths: 0.815,   radiusKm:  6052, moons: 0,   surfaceTempC: 464 },
  { body: 'Earth',   kind: 'Planet',       zone: 'Inner',           distanceAU: 1.000,  periodYears: 1.000,    massEarths: 1.000,   radiusKm:  6371, moons: 1,   surfaceTempC:  15 },
  { body: 'Mars',    kind: 'Planet',       zone: 'Inner',           distanceAU: 1.524,  periodYears: 1.881,    massEarths: 0.107,   radiusKm:  3390, moons: 2,   surfaceTempC: -65 },
  { body: 'Ceres',   kind: 'Dwarf planet', zone: 'Inner',           distanceAU: 2.766,  periodYears: 4.601,    massEarths: 0.000157, radiusKm:  470, moons: 0,   surfaceTempC: -106 },
  { body: 'Jupiter', kind: 'Planet',       zone: 'Outer',           distanceAU: 5.203,  periodYears: 11.862,   massEarths: 317.8,   radiusKm: 69911, moons: 95,  surfaceTempC: -110 },
  { body: 'Saturn',  kind: 'Planet',       zone: 'Outer',           distanceAU: 9.537,  periodYears: 29.457,   massEarths: 95.16,   radiusKm: 58232, moons: 146, surfaceTempC: -140 },
  { body: 'Uranus',  kind: 'Planet',       zone: 'Outer',           distanceAU: 19.191, periodYears: 84.011,   massEarths: 14.54,   radiusKm: 25362, moons: 28,  surfaceTempC: -195 },
  { body: 'Neptune', kind: 'Planet',       zone: 'Outer',           distanceAU: 30.069, periodYears: 164.79,   massEarths: 17.15,   radiusKm: 24622, moons: 16,  surfaceTempC: -200 },
  { body: 'Pluto',   kind: 'Dwarf planet', zone: 'Trans-Neptunian', distanceAU: 39.482, periodYears: 247.94,   massEarths: 0.00218, radiusKm:  1188, moons: 5,   surfaceTempC: -229 },
  { body: 'Eris',    kind: 'Dwarf planet', zone: 'Trans-Neptunian', distanceAU: 67.864, periodYears: 559.07,   massEarths: 0.00278, radiusKm:  1163, moons: 1,   surfaceTempC: -243 },
];

export const SOLAR_SYSTEM_DATASET: Dataset = {
  id: 'solarSystem',
  name: 'The Solar System',
  description:
    'Distance, orbital period, mass, radius, moon count, and surface temperature for every IAU-recognized planet and the four largest dwarf planets. Eleven bodies; the cleanest demonstration of Kepler\'s third law (T² ∝ r³) you can hand a student.',
  source: 'NASA Planetary Fact Sheets',
  family: 'space',
  provenance: {
    primarySource: 'NASA Planetary Fact Sheet (NSSDC)',
    primarySourceUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    collector: 'NASA Goddard Space Flight Center · National Space Science Data Center · Dr. David R. Williams',
    collectionMethod:
      'Values aggregated from spacecraft measurements (Voyagers, Pioneers, Mariners, New Horizons, Cassini, Juno) and ground/space telescopic observations. Orbital elements are osculating values at standard epoch J2000.0.',
    collectionPeriod: 'J2000.0 epoch; fact-sheet last updated for major bodies in 2023 (post-Sheppard Saturn-moon survey)',
    retrievalDate: '2026-05-11',
    retrievalMethod: 'Hand-transcribed from the NASA NSSDC fact sheets, cross-checked with the IAU\'s Working Group for Planetary System Nomenclature for moon counts.',
    license: 'Public domain (NASA work product)',
    citation:
      'Williams, D. R. "Planetary Fact Sheet." NASA NSSDC, accessed 2026-05-11.',
    caveats: [
      'Moon counts as of 2024 — Saturn jumped to 146 in 2023 with the Sheppard et al. photographic survey. Counts continue to grow as small irregular moons are discovered.',
      'Surface temperatures: for the gas giants, this is the temperature at the 1-bar pressure level (they have no solid surface). Mean values; Venus has a strong day-night contrast despite its slow rotation because of its thick atmosphere.',
      'Dwarf-planet classification was redefined by the IAU in 2006. Pluto was demoted then; Eris was promoted (it had been called "the tenth planet" briefly). Many trans-Neptunian objects are candidate dwarf planets but unconfirmed.',
      'Distances are semi-major axes — average distance averaged over the orbit. Highly eccentric bodies like Pluto vary substantially (29.7 to 49.3 AU).',
    ],
  },
  story: [
    {
      heading: 'A law that even Newton needed Kepler to find.',
      body:
        'In 1619 Johannes Kepler published a strange-looking relation: if you square the orbital period of a planet (in years) and cube its distance from the sun (in AU), you get the same number for every planet. Earth: 1² = 1³. Mars: 1.881² = 3.54 ≈ 1.524³ = 3.54. Jupiter: 11.862² ≈ 5.203³. The pattern held for all the planets Kepler knew.',
    },
    {
      heading: 'Why this dataset matters for math class',
      body:
        'On linear axes, the relationship looks bewildering — Mercury crowds the origin, Neptune fills the page. On log-log axes it becomes a perfect straight line with slope 1.5. That\'s Kepler\'s third law: log(T) = 1.5 · log(r), or T² = r³. The dataset is the cleanest power-law example in the sciences — a perfect log-log linearization exercise.',
      highlight: 'log T = 1.5 · log r. The slope IS the 3/2 in Kepler\'s "T squared equals r cubed."',
    },
    {
      heading: 'Newton finished the work',
      body:
        'Kepler had the relation but not the why. Sixty years later Newton derived it from his law of gravity (F = G m₁m₂/r²). The fact that the same equation describes a falling apple and a wandering Mars was the original "unification" moment in physics — and it started with someone fitting a line.',
    },
    {
      heading: 'What other patterns hide here?',
      body:
        'Mass vs radius will look like a power law too (radius ≈ mass^(1/3) for the rocky bodies, less neat for the gas giants since they\'re mostly compressed gas). Moon count vs mass shows a faint trend — bigger planets sweep up more moons gravitationally. Temperature vs distance is the inverse-square cooling: log T drops as 0.5 · log r increases. The dataset rewards exploration.',
    },
  ],
  attributes: [
    { key: 'body',          label: 'Body',                  kind: 'categorical', description: 'Name of the planet or dwarf planet.' },
    { key: 'kind',          label: 'Kind',                  kind: 'categorical', description: 'IAU classification: Planet (8) or Dwarf planet (3 included here, of 5 currently recognized).' },
    { key: 'zone',          label: 'Zone',                  kind: 'categorical', ordinal: true, description: 'Inner (rocky), Outer (gas giants), or Trans-Neptunian (the Kuiper belt and beyond).' },
    { key: 'distanceAU',    label: 'Distance from Sun',     kind: 'numeric', unit: 'AU', description: 'Semi-major axis of the orbit, in astronomical units (1 AU = 149.6 million km = Earth\'s distance).' },
    { key: 'periodYears',   label: 'Orbital period',        kind: 'numeric', unit: 'years', description: 'Time to complete one orbit, in Earth years. Mercury 0.24, Earth 1, Neptune 165, Eris 559.' },
    { key: 'massEarths',    label: 'Mass',                  kind: 'numeric', unit: 'Earth masses', description: 'Mass relative to Earth. Earth = 1. Pluto ≈ 0.002. Jupiter ≈ 318.' },
    { key: 'radiusKm',      label: 'Radius',                kind: 'numeric', unit: 'km', description: 'Mean equatorial radius in kilometers.' },
    { key: 'moons',         label: 'Moons',                 kind: 'numeric', unit: 'count', description: 'IAU-confirmed natural satellites. Saturn leads at 146 after the 2023 Sheppard survey.' },
    { key: 'surfaceTempC',  label: 'Surface temperature',   kind: 'numeric', unit: '°C', description: 'Mean surface (or 1-bar atmospheric) temperature in Celsius. Venus is famously hotter than Mercury thanks to its CO₂ atmosphere.' },
  ],
  featured: { x: 'distanceAU', y: 'periodYears', color: 'zone' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 6,
      topicName: 'Exponential and Logarithmic Functions',
      mathFit: 'Plot orbital period vs distance on log-log axes. Fit a line. The slope is 1.5 — that\'s Kepler\'s third law. T² = r³ becomes log T = 1.5 · log r, which is a straight line with slope 3/2.',
      standards: ['HSF-LE.A.4', 'HSF-BF.B.4'],
      studentWhy: 'Why does Pluto take 248 years to go around the sun, but Mercury takes three months? The same equation explains both — and Kepler figured it out in 1619.',
      objective: 'Students will linearize a power-law relationship via log-log transformation, fit a line by eye and least-squares, and interpret the slope as the exponent in Kepler\'s third law.',
      minutes: 30,
      discussion: [
        'On linear axes you can\'t see the relationship. On log-log you can. Why does log "unsquash" the data?',
        'If a comet has a period of 76 years (Halley\'s), what should its semi-major axis be?',
        'What other planetary attributes lie on a power-law? Try mass vs radius.',
      ],
      flagship: true,
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
