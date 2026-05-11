// Operational Earth-orbiting satellites with orbital altitude, period, and
// ground-coverage footprint. Anchors Geometry Topic 10 (Circles) — the
// Savvas 3-Act "Earth Watch" video asks "how many satellites are needed to
// cover the entire equator?" This dataset lets students answer it with the
// actual fleet.
//
// Altitudes are nominal mission altitudes (most LEO satellites drift ±30 km;
// some constellations like Starlink span multiple shells). Coverage radius
// is the half-angle of the line-of-sight cone at the listed altitude,
// converted to ground arc length using Earth radius 6371 km. Values rounded
// to 2 sig figs.

import type { Dataset } from '../lib/dataset';

interface Row {
  satellite: string;
  operator: string;
  type: string;
  altitudeKm: number;       // altitude above sea level
  periodMin: number;        // orbital period in minutes
  coverageRadiusKm: number; // ground arc radius visible from satellite (geometric horizon)
  fleetSize: number;        // number of satellites in the constellation
  launchYear: number;       // first satellite of the constellation
}

// Compute coverage radius from altitude using geometric horizon:
// r_cov = R_earth · arccos(R_earth / (R_earth + h))
// where R_earth = 6371 km. Values rounded to nearest 10 km.
const EARTH_R = 6371;
function horizon(altKm: number): number {
  const theta = Math.acos(EARTH_R / (EARTH_R + altKm));
  return Math.round(EARTH_R * theta / 10) * 10;
}

// Orbital period from altitude via Kepler's third law (circular orbits):
// T = 2π · sqrt((R + h)^3 / GM_earth), GM_earth = 398,600 km^3/s^2
function period(altKm: number): number {
  const r = (EARTH_R + altKm) * 1000; // m
  const T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / 3.986e14);
  return Math.round(T / 60 * 10) / 10; // minutes, 1 dp
}

const FLEET: Array<Omit<Row, 'coverageRadiusKm' | 'periodMin'>> = [
  // LEO
  { satellite: 'ISS',            operator: 'NASA/Roscosmos/JAXA/ESA/CSA', type: 'LEO crewed station', altitudeKm: 410,   fleetSize: 1,     launchYear: 1998 },
  { satellite: 'Hubble',         operator: 'NASA/ESA',                    type: 'LEO telescope',      altitudeKm: 540,   fleetSize: 1,     launchYear: 1990 },
  { satellite: 'Starlink (v2)',  operator: 'SpaceX',                      type: 'LEO broadband',      altitudeKm: 550,   fleetSize: 7800,  launchYear: 2019 },
  { satellite: 'Iridium NEXT',   operator: 'Iridium',                     type: 'LEO comms',          altitudeKm: 780,   fleetSize: 75,    launchYear: 2017 },
  { satellite: 'OneWeb',         operator: 'Eutelsat',                    type: 'LEO broadband',      altitudeKm: 1200,  fleetSize: 650,   launchYear: 2019 },
  { satellite: 'Landsat 9',      operator: 'NASA/USGS',                   type: 'LEO imaging',        altitudeKm: 705,   fleetSize: 1,     launchYear: 2021 },
  { satellite: 'Sentinel-2',     operator: 'ESA',                         type: 'LEO imaging',        altitudeKm: 786,   fleetSize: 2,     launchYear: 2015 },
  // MEO
  { satellite: 'GPS',            operator: 'US Space Force',              type: 'MEO navigation',     altitudeKm: 20180, fleetSize: 31,    launchYear: 1978 },
  { satellite: 'Galileo',        operator: 'EU',                          type: 'MEO navigation',     altitudeKm: 23222, fleetSize: 28,    launchYear: 2011 },
  { satellite: 'GLONASS',        operator: 'Russia',                      type: 'MEO navigation',     altitudeKm: 19130, fleetSize: 24,    launchYear: 1982 },
  { satellite: 'BeiDou (MEO)',   operator: 'China',                       type: 'MEO navigation',     altitudeKm: 21528, fleetSize: 24,    launchYear: 2007 },
  // GEO
  { satellite: 'GOES-18',        operator: 'NOAA',                        type: 'GEO weather',        altitudeKm: 35786, fleetSize: 1,     launchYear: 2022 },
  { satellite: 'Himawari-9',     operator: 'JMA',                         type: 'GEO weather',        altitudeKm: 35786, fleetSize: 1,     launchYear: 2016 },
  { satellite: 'Meteosat-11',    operator: 'EUMETSAT',                    type: 'GEO weather',        altitudeKm: 35786, fleetSize: 1,     launchYear: 2015 },
  { satellite: 'Intelsat 901',   operator: 'Intelsat',                    type: 'GEO comms',          altitudeKm: 35786, fleetSize: 1,     launchYear: 2001 },
  // HEO / specialty
  { satellite: 'James Webb (L2)', operator: 'NASA/ESA/CSA',               type: 'L2 telescope',       altitudeKm: 1500000, fleetSize: 1,   launchYear: 2021 },
];

const RAW: Row[] = FLEET.map((s) => ({
  ...s,
  periodMin: period(s.altitudeKm),
  coverageRadiusKm: horizon(s.altitudeKm),
}));

export const SATELLITE_ORBITS_DATASET: Dataset = {
  id: 'satellites',
  name: 'Earth-orbiting satellites (operational fleet)',
  description:
    '16 representative satellites and constellations — LEO (ISS, Starlink, Iridium, Landsat), MEO (GPS, Galileo, GLONASS, BeiDou), GEO (GOES, Himawari, Meteosat, Intelsat), and one at L2 (Webb). Orbital period and ground-coverage radius computed from altitude via Kepler\'s third law and geometric horizon.',
  source: 'NASA Earthdata, NOAA NESDIS, ESA Sentinel, SpaceX, Eutelsat — current as of 2025',
  family: 'space',
  provenance: {
    primarySource: 'Constellation operator websites (NASA, ESA, NOAA, SpaceX, Eutelsat, Iridium, US Space Force, ROSCOSMOS, CNSA) + UN Office for Outer Space Affairs (UNOOSA) registry',
    primarySourceUrl: 'https://www.unoosa.org/oosa/en/spaceobjectregister/index.html',
    collector: 'Hand-curated from operator fact sheets',
    collectionMethod:
      'For each constellation, the mission altitude was taken from the operator\'s public fact sheet. Period and coverage radius are computed deterministically: period from Kepler\'s third law (T = 2π·sqrt(r³/GM)) and coverage from geometric horizon (r_cov = R·arccos(R/(R+h))). Fleet sizes are end-of-2025 operational counts where known; Starlink count is approximate as the constellation is still growing.',
    collectionPeriod: 'Spans 1978 (GPS first launch) - 2025; values are end-of-2025 operational state',
    retrievalDate: '2026-05-11',
    retrievalMethod: 'Operator websites + UNOOSA registry cross-check',
    license: 'Public data; reproduction with citation is fair use',
    citation: 'UN Registry of Objects Launched into Outer Space + individual operator fact sheets',
    caveats: [
      'Altitudes are nominal mission altitudes; individual satellites drift ±30 km. Starlink uses multiple shells (550, 570, 540 km) — we list the most populous.',
      'Coverage radius is the geometric line-of-sight horizon. Useful coverage is smaller (typically 1/2 to 2/3 of geometric) because low-elevation links lose signal to the atmosphere.',
      'GEO satellites are stationary over a fixed longitude. LEO satellites move at 7.7 km/s and any one point on Earth sees a given LEO satellite for only 5-10 minutes per pass.',
      'Fleet sizes change. As of late 2025: Starlink ~7800 operational, OneWeb ~650, Iridium NEXT 66 (+9 spares).',
    ],
  },
  story: [
    {
      heading: 'How many satellites do you need to cover the equator?',
      body:
        'A GEO satellite at 35,786 km has a line-of-sight footprint roughly 9,000 km wide. Earth\'s equator is 40,030 km around. So ~3 GEO satellites can see the whole equator at once. That\'s why every weather provider uses 3-4 of them (GOES east + west, Himawari, Meteosat). It\'s a geometry problem with a deeply practical answer.',
      highlight: 'GEO coverage radius ≈ 9,000 km · 3 satellites → full equatorial coverage.',
    },
    {
      heading: 'LEO is a different game.',
      body:
        'A Starlink at 550 km has a footprint only 2,400 km wide — and it\'s moving, so any fixed point on Earth sees it for only ~5 minutes before it disappears. To give continuous coverage at every point on Earth, you need thousands of satellites in dozens of orbital planes — exactly what SpaceX is building.',
    },
    {
      heading: 'How to see it in the data',
      body:
        'Plot altitude (log) vs. coverage radius. The points line up — coverage radius scales with the geometric arccos formula, smoothly from ~2,000 km (LEO) to ~9,000 km (GEO). Then overlay fleet size: Starlink has 7800 satellites at 550 km; the GEO weather constellation has 4 at 35,786 km. Coverage × fleet size ≈ constant for full Earth coverage.',
    },
  ],
  attributes: [
    { key: 'satellite',        label: 'Satellite / constellation', kind: 'categorical', description: '16 operational satellite systems.' },
    { key: 'operator',         label: 'Operator',                  kind: 'categorical', description: 'Owning agency or company.' },
    { key: 'type',             label: 'Orbit type',                kind: 'categorical', description: 'LEO (< 2000 km), MEO (2000-35000 km), GEO (35,786 km geostationary), or L2 (1.5M km, Sun-Earth Lagrange point).' },
    { key: 'altitudeKm',       label: 'Altitude',                  kind: 'numeric', unit: 'km', description: 'Nominal mission altitude above sea level. Spans 410 km (ISS) to 1.5M km (Webb).' },
    { key: 'periodMin',        label: 'Orbital period',            kind: 'numeric', unit: 'min', description: 'Time for one full orbit, computed from Kepler\'s third law. 92 min (ISS) to 1436 min (GEO = 24 h).' },
    { key: 'coverageRadiusKm', label: 'Coverage radius',           kind: 'numeric', unit: 'km', description: 'Ground arc visible from the satellite (geometric horizon). 2,200 km (ISS) to 9,000 km (GEO).' },
    { key: 'fleetSize',        label: 'Constellation size',        kind: 'numeric', description: 'Operational satellites in this constellation (end-2025).' },
    { key: 'launchYear',       label: 'First launch year',         kind: 'numeric', description: 'Year the first satellite in this constellation reached orbit.' },
  ],
  featured: { x: 'altitudeKm', y: 'coverageRadiusKm', color: 'type', xScale: 'log' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 10,
      topicName: 'Circles',
      mathFit: 'Coverage footprint is a circular cap on the sphere; its radius is the geometric horizon arccos(R/(R+h)). For full equatorial coverage, the cap radii must tile the great circle of length 2πR. The geometry of "how many satellites?" is the geometry of "how many chords cover the circle?"',
      standards: ['HSG-C.A.2', 'HSG-C.B.5', 'HSG-MG.A.3'],
      studentWhy: 'Every GPS fix, every weather satellite image, every video call routed by Starlink runs on this geometry. Three satellites is enough to watch the entire equator at once — but only because we put them 22,000 miles up.',
      objective: 'Students will compute satellite ground-coverage radius from orbital altitude using the geometric-horizon formula, and determine the minimum constellation size to cover a great circle of the Earth.',
      minutes: 30,
      discussion: [
        'Why does coverage radius increase so much slower than altitude? Hint: it\'s an arccos, not linear.',
        'Why do GEO satellites work for weather but not GPS?',
        'If a Starlink satellite covers 2400 km and Earth\'s equator is 40,030 km, why does SpaceX need 7,800 satellites instead of 17?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
