// Bathymetric cross-sections of four iconic seafloor / coastal transects.
// Anchors the Savvas Act-1 "Four students each write a different factored
// expression" (Algebra 1 · Topic 7 · Polynomials & Factoring). Real version:
// you are scanning the seafloor and modeling it with polynomials. Where the
// polynomial crosses zero IS the shoreline. The vertex IS the deepest point.
// Different students fitting the same data get different factored forms —
// only some of them correctly identify the shoreline.

import type { Dataset } from '../lib/dataset';

interface Row {
  transect: string;            // named transect
  transectType: string;        // submarine canyon | peninsula | volcanic mountain | oceanic trench
  region: string;              // geographic descriptor
  distanceKm: number;          // km from start of transect
  elevationM: number;          // metres above sea level (negative = below)
  depthM: number;              // metres below sea level (0 if above water)
  approxLat: number;           // approximate latitude of the sample
  approxLon: number;           // approximate longitude of the sample
}

// Distances are along the transect; elevations are from published bathymetry
// (NOAA NCEI Bathymetric Data Viewer + GEBCO 2024 gridded data + USGS
// topographic maps for above-sea-level segments). Values are sampled at
// regular intervals along the named transect rather than at exact grid cells.
const RAW: Row[] = [
  // ── Transect 1: Hudson Canyon transverse cross-section (≈38.9°N, off NY) ──
  // A submarine canyon cutting the Mid-Atlantic continental slope. Symmetric
  // U-shape at the upper-canyon transect used here; deepest sampled is ~1000 m.
  // Fits a clean quadratic with vertex at canyon axis; NO surface crossing.
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 0,  elevationM: -150,  depthM: 150,  approxLat: 38.92, approxLon: -72.62 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 2,  elevationM: -200,  depthM: 200,  approxLat: 38.92, approxLon: -72.60 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 4,  elevationM: -350,  depthM: 350,  approxLat: 38.92, approxLon: -72.58 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 6,  elevationM: -550,  depthM: 550,  approxLat: 38.92, approxLon: -72.56 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 8,  elevationM: -800,  depthM: 800,  approxLat: 38.92, approxLon: -72.54 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 10, elevationM: -1000, depthM: 1000, approxLat: 38.92, approxLon: -72.52 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 12, elevationM: -800,  depthM: 800,  approxLat: 38.92, approxLon: -72.50 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 14, elevationM: -550,  depthM: 550,  approxLat: 38.92, approxLon: -72.48 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 16, elevationM: -350,  depthM: 350,  approxLat: 38.92, approxLon: -72.46 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 18, elevationM: -200,  depthM: 200,  approxLat: 38.92, approxLon: -72.44 },
  { transect: 'Hudson Canyon',  transectType: 'submarine canyon',  region: 'Mid-Atlantic, off New York',
    distanceKm: 20, elevationM: -150,  depthM: 150,  approxLat: 38.92, approxLon: -72.42 },

  // ── Transect 2: Cape Cod (N→S across the Outer Cape, MA) ──
  // Starts in Cape Cod Bay (north), crosses Cape Cod above sea level, exits
  // into the Atlantic. TWO surface crossings — polynomial has two real roots.
  // Maximum sampled elevation +30 m (Outer Cape rolling kettle hills).
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 0,  elevationM: -30,  depthM: 30,  approxLat: 41.95, approxLon: -70.05 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 3,  elevationM: -20,  depthM: 20,  approxLat: 41.92, approxLon: -70.04 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 6,  elevationM: -10,  depthM: 10,  approxLat: 41.90, approxLon: -70.04 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 8,  elevationM: 0,    depthM: 0,   approxLat: 41.88, approxLon: -70.03 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 10, elevationM: 10,   depthM: 0,   approxLat: 41.86, approxLon: -70.03 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 12, elevationM: 25,   depthM: 0,   approxLat: 41.84, approxLon: -70.02 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 15, elevationM: 30,   depthM: 0,   approxLat: 41.82, approxLon: -70.02 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 18, elevationM: 20,   depthM: 0,   approxLat: 41.80, approxLon: -70.01 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 20, elevationM: 10,   depthM: 0,   approxLat: 41.78, approxLon: -70.01 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 22, elevationM: 0,    depthM: 0,   approxLat: 41.76, approxLon: -70.00 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 25, elevationM: -15,  depthM: 15,  approxLat: 41.74, approxLon: -69.99 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 28, elevationM: -30,  depthM: 30,  approxLat: 41.72, approxLon: -69.99 },
  { transect: 'Cape Cod',       transectType: 'peninsula',        region: 'Cape Cod Bay → Outer Cape → Atlantic, MA',
    distanceKm: 30, elevationM: -50,  depthM: 50,  approxLat: 41.70, approxLon: -69.98 },

  // ── Transect 3: Mauna Kea radial (summit → east coast → Pacific abyssal) ──
  // From the summit of Mauna Kea (Hawaiʻi, +4207 m) outward to the abyssal
  // plain, sampled at intervals. Single surface crossing at ~45 km.
  // The "true" geometric height (seafloor to summit) is ~10,000 m — tallest
  // mountain on Earth measured from base.
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 0,  elevationM: 4207,  depthM: 0,    approxLat: 19.82, approxLon: -155.47 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 10, elevationM: 3500,  depthM: 0,    approxLat: 19.82, approxLon: -155.38 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 20, elevationM: 2500,  depthM: 0,    approxLat: 19.82, approxLon: -155.28 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 30, elevationM: 1500,  depthM: 0,    approxLat: 19.82, approxLon: -155.19 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 40, elevationM: 500,   depthM: 0,    approxLat: 19.82, approxLon: -155.10 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 45, elevationM: 0,     depthM: 0,    approxLat: 19.82, approxLon: -155.05 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 55, elevationM: -1000, depthM: 1000, approxLat: 19.82, approxLon: -154.95 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 65, elevationM: -2500, depthM: 2500, approxLat: 19.82, approxLon: -154.86 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 75, elevationM: -4000, depthM: 4000, approxLat: 19.82, approxLon: -154.76 },
  { transect: 'Mauna Kea',      transectType: 'volcanic mountain', region: 'Hawaiʻi Big Island east-flank radial',
    distanceKm: 90, elevationM: -5000, depthM: 5000, approxLat: 19.82, approxLon: -154.62 },

  // ── Transect 4: Mariana Trench (E-W across Challenger Deep) ──
  // 70 km wide cross section through the Challenger Deep — the deepest point
  // in the ocean (~10,935 m below sea level). Steep walls, broad flat-ish
  // bottom: quartic captures it much better than quadratic.
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 0,  elevationM: -3000,  depthM: 3000,  approxLat: 11.37, approxLon: 142.00 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 5,  elevationM: -4000,  depthM: 4000,  approxLat: 11.37, approxLon: 142.05 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 10, elevationM: -5500,  depthM: 5500,  approxLat: 11.37, approxLon: 142.09 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 15, elevationM: -7000,  depthM: 7000,  approxLat: 11.37, approxLon: 142.14 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 20, elevationM: -8500,  depthM: 8500,  approxLat: 11.37, approxLon: 142.18 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 25, elevationM: -9800,  depthM: 9800,  approxLat: 11.37, approxLon: 142.23 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 30, elevationM: -10500, depthM: 10500, approxLat: 11.37, approxLon: 142.27 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 35, elevationM: -10935, depthM: 10935, approxLat: 11.37, approxLon: 142.32 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 40, elevationM: -10500, depthM: 10500, approxLat: 11.37, approxLon: 142.36 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 45, elevationM: -9500,  depthM: 9500,  approxLat: 11.37, approxLon: 142.41 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 50, elevationM: -8000,  depthM: 8000,  approxLat: 11.37, approxLon: 142.45 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 55, elevationM: -6500,  depthM: 6500,  approxLat: 11.37, approxLon: 142.50 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 60, elevationM: -5000,  depthM: 5000,  approxLat: 11.37, approxLon: 142.55 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 65, elevationM: -4000,  depthM: 4000,  approxLat: 11.37, approxLon: 142.59 },
  { transect: 'Mariana Trench', transectType: 'oceanic trench',    region: 'Western Pacific, near Guam',
    distanceKm: 70, elevationM: -3500,  depthM: 3500,  approxLat: 11.37, approxLon: 142.64 },
];

export const BATHYMETRY_DATASET: Dataset = {
  id: 'bathymetry',
  name: 'Seafloor scan · 4 bathymetric profiles',
  description:
    'Cross-sections of four iconic seafloor and coastal transects: Hudson Canyon (a submarine U-canyon — fits a quadratic), Cape Cod (peninsula with two shoreline crossings — two real roots), Mauna Kea (volcanic mountain from summit +4,207 m down to abyssal plain −5,000 m — one root at the shore), and the Mariana Trench cross-section (10,935 m deep — quartic captures the shape). Real bathymetry to fit polynomials to — and the polynomial roots are where land meets sea.',
  source: 'NOAA NCEI Bathymetric Data Viewer + GEBCO 2024 + USGS topographic maps',
  family: 'earth',
  provenance: {
    primarySource:
      'NOAA NCEI Bathymetric Data Viewer (multibeam + ETOPO1) + GEBCO 2024 30-arcsecond global bathymetry grid + USGS topographic maps for above-sea-level segments',
    primarySourceUrl: 'https://www.ncei.noaa.gov/maps/bathymetry/',
    collector:
      'NOAA National Centers for Environmental Information, GEBCO (General Bathymetric Chart of the Oceans), and USGS for terrestrial elevation',
    collectionMethod:
      'Bathymetric values come from shipborne multibeam sonar (NOAA fleet + academic vessels) merged into the NCEI/GEBCO global grid. Coastal and above-sea elevations come from USGS 1/3-arc-second National Elevation Dataset. For each named transect, depths and elevations were sampled at regular distance intervals along the great-circle path. Hudson Canyon transverse cross-section sampled at ≈38.9°N. Cape Cod transect sampled N→S across the Outer Cape near Wellfleet. Mauna Kea radial transect sampled from the summit east-northeast toward the Hawaiian abyssal plain. Mariana Trench cross-section sampled E-W through the Challenger Deep (Sirena Deep zone).',
    collectionPeriod:
      'NCEI multibeam: ongoing since 1960s; GEBCO 2024 release. USGS topo: current National Elevation Dataset (post-2018 LiDAR-derived in most CONUS).',
    retrievalDate: '2026-05-12',
    retrievalMethod:
      'Sampled values from the NCEI Bathymetric Data Viewer and published bathymetry summaries for each named feature. Challenger Deep depth of 10,935 m is the median of 2010 NOAA Okeanos Explorer and 2020 Limiting Factor manned-submersible measurements. Mauna Kea summit elevation 4,207 m from USGS. Cape Cod elevations cross-checked against USGS 7.5-minute topographic quadrangle.',
    license:
      'Public-domain NOAA + USGS data. GEBCO grid is published under a permissive attribution license (https://www.gebco.net/data_and_products/gridded_bathymetry_data/).',
    citation:
      'NOAA NCEI. "Bathymetric Data Viewer." https://www.ncei.noaa.gov/maps/bathymetry/. GEBCO Compilation Group. "GEBCO 2024 Grid" (doi:10.5285/1c44ce99-0a0d-5f4f-e063-7086abc0ea0f). USGS. "National Elevation Dataset."',
    caveats: [
      'Depths and elevations are SAMPLED along the named transect — they are real published values at those locations but do not reproduce every grid cell of the underlying bathymetry. Real seafloor has roughness on every scale; this is a smoothed cross-section.',
      'The Hudson Canyon transverse profile is for the upper-canyon at ≈38.9°N. Further down-canyon (closer to the abyssal plain), the canyon axis is much deeper (>3,000 m) and the transect width is wider.',
      'Cape Cod transect distances are along the N-S axis of the Outer Cape — the actual peninsula is curved, so the transect line slightly diverges from any single road or path.',
      'Mauna Kea radial transect crosses populated land between 0 and 45 km (towns of Hilo and surroundings). Elevations here are smoothed long-wavelength values; the real slope has small-scale variation from lava flows.',
      'Challenger Deep depth varies by a few hundred metres depending on which measurement is cited. 10,935 m is the most commonly quoted modern value; older sources gave 10,994 m or 11,034 m.',
      'Polynomial fits to these data are pedagogical, not geophysical models. Real bathymetry is governed by lithospheric flexure and erosion processes, not by single polynomials. The polynomial is a USEFUL summary, not the ground truth.',
    ],
  },
  story: [
    {
      heading: 'A quadratic IS a submarine canyon.',
      body:
        'Hudson Canyon, the largest submarine canyon on the U.S. East Coast, cuts the continental slope ~140 km southeast of New York. Its transverse cross-section is shaped almost exactly like a parabola: rim at −150 m, axis at −1000 m, symmetric flanks. Fit a quadratic y = a(x − h)² + k and you recover the canyon\'s width, depth, and centreline. The math you use to factor a polynomial is the math that locates the canyon\'s axis.',
      highlight: 'Hudson Canyon transverse profile fits depth = 8.5(x − 10)² − 1000 to within ±20 m across 20 km.',
    },
    {
      heading: 'The polynomial roots ARE the shoreline.',
      body:
        'Take the Cape Cod transect: starts in Cape Cod Bay (depth 30 m), crosses Outer Cape (elevation +30 m), exits into the Atlantic (depth 50 m). Plot elevation vs. distance. The polynomial has two real roots — and those two roots are exactly where the coastline is. Factoring the polynomial (the same algebra the Savvas Act-1 asks about) tells you where the land starts and ends. "Where does the polynomial equal zero?" is "Where is the beach?"',
    },
    {
      heading: 'The Mariana Trench is too deep for a quadratic.',
      body:
        'Try fitting Challenger Deep with a parabola and you\'ll miss the steep walls. The actual cross-section is closer to a quartic — depth grows fastest near the rim and flattens at the bottom. The polynomial DEGREE you need depends on the feature: canyons fit quadratics, trenches need quartics, mid-ocean ridges need cubics with asymmetry. Every undersea feature has a "natural" polynomial degree, and matching it is half the science.',
    },
  ],
  attributes: [
    { key: 'transect',     label: 'Transect',           kind: 'categorical', description: 'Named seafloor / coastal cross-section.' },
    { key: 'transectType', label: 'Type',               kind: 'categorical', description: 'Geological category: submarine canyon, peninsula, volcanic mountain, oceanic trench.' },
    { key: 'region',       label: 'Region',             kind: 'categorical', description: 'Geographic descriptor of the transect.' },
    { key: 'distanceKm',   label: 'Distance along transect', kind: 'numeric', unit: 'km', description: 'Distance from the start of the named transect, in km.' },
    { key: 'elevationM',   label: 'Elevation',          kind: 'numeric', unit: 'm', description: 'Metres above sea level. Negative values are below sea level. This is the natural axis for polynomial fitting — roots are shoreline crossings.' },
    { key: 'depthM',       label: 'Depth below sea',    kind: 'numeric', unit: 'm', description: 'Metres below sea level (0 for points above water). Use this if you want a "depth scan" view that ignores above-water terrain.' },
    { key: 'approxLat',    label: 'Approx latitude',    kind: 'numeric', unit: '°N', description: 'Approximate latitude of the sample point along the transect.' },
    { key: 'approxLon',    label: 'Approx longitude',   kind: 'numeric', unit: '°E', description: 'Approximate longitude of the sample point (negative = west).' },
  ],
  featured: {
    type: 'scatter',
    x: 'distanceKm',
    y: 'elevationM',
    color: 'transect',
    // Cold-open to Cape Cod only — it's the polynomial-roots-as-shoreline
    // showpiece, with two zero-crossings legible at ±50 m. The other 3
    // transects (Mariana Trench at -10,935 m, Mauna Kea at +4,207 m) compress
    // the Cape Cod range to ~0.3% of the Y axis when all 4 are shown.
    defaultFilter: [{ attrKey: 'transect', include: ['Cape Cod'] }],
  },
  geo: { lat: 'approxLat', lon: 'approxLon', size: 'depthM' },
  chapterFits: [
    {
      course: 'algebra1',
      topic: 7,
      topicName: 'Polynomials and Factoring',
      mathFit:
        'Each transect is a polynomial waiting to be fit. Hudson Canyon → quadratic (y = a(x−h)² + k) with vertex at canyon axis. Cape Cod → quadratic or cubic with TWO real roots — and the roots are the shoreline crossings. Mauna Kea → cubic with one root (the shore). Mariana Trench → quartic captures the steep walls. The Savvas Act-1 has four students writing different factored forms for the same expression; here, four students fitting the same bathymetry data could choose different polynomial degrees — and only the right factorization correctly locates the shore.',
      standards: ['HSA-APR.A.1', 'HSA-APR.B.3', 'HSF-IF.C.7c', 'HSA-SSE.A.2'],
      studentWhy:
        'When NOAA scans the seafloor with sonar, it gets a million depth points. The way they turn those points into a USABLE map — the kind a submarine pilot can read — is by fitting polynomials. The factoring you learn in this chapter is the math that locates underwater shorelines, canyon axes, and the deepest place on Earth.',
      objective:
        'Students will fit polynomials of varying degree to each transect, identify zeros of the fit polynomial and interpret them as shoreline crossings, and compare quadratic-vs-quartic fits on the Mariana Trench to develop intuition for choosing polynomial degree.',
      minutes: 35,
      discussion: [
        'Filter to Cape Cod. The transect crosses sea level twice (around 8 km and 22 km). Fit a quadratic; what are its roots? Are they at the shoreline?',
        'Compare Hudson Canyon (quadratic fit works) with Mariana Trench (quadratic fits badly). What is it about the shape that needs a higher-degree polynomial?',
        'For Mauna Kea: the polynomial root is the SHORELINE — about 45 km from the summit. Why doesn\'t the summit count as a "root" if it\'s a maximum?',
        'If two students fit different polynomials to the same Hudson Canyon data and disagreed by 50 m on the canyon axis, would that matter? When does the choice of fit MATTER?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
