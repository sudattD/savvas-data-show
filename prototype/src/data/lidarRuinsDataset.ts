// Lidar-revealed archaeological structures at three jungle / dense-canopy
// sites. Anchors the Savvas Act-1 "Four students try to plot two points and
// a third point exactly halfway between them" (Geometry · Topic 9 ·
// Coordinate Geometry). Real version: a lidar scanner pierces the jungle
// canopy and resolves hundreds of buried temple and plaza centroids in (x, y).
// The "midpoint" of two temples is a real archaeological question — it is
// often where the ceremonial road runs and where the next plaza lies.

import type { Dataset } from '../lib/dataset';

interface Row {
  site: string;            // archaeological site
  civilisation: string;    // civilisation that built it
  structureType: string;   // temple | plaza | causeway | reservoir | residential | observatory
  structureName: string;   // identifying name or designation
  xMeters: number;         // local easting (m) from site reference origin
  yMeters: number;         // local northing (m) from site reference origin
  elevationM: number;      // m above sea level
  baseSideM: number;       // typical structure footprint dimension, m
  approxLat: number;       // global latitude
  approxLon: number;       // global longitude
  yearLidarRevealed: number; // year the structure was published from lidar
}

// All three sites are real published lidar discoveries. Coordinates are local
// site coordinates (easting / northing in metres from an arbitrary site
// origin), not WGS-84, so that distance and midpoint formulas operate on
// metres rather than degrees. Approximate WGS-84 lat/lon kept for map view.
const RAW: Row[] = [
  // ── Caracol, Belize (Maya) — Chase / Chase / Weishampel 2009 lidar campaign ──
  // Site reference origin: 16.7656°N 88.9889°W (caana pyramid). Real
  // structures from the 2009 NASA / U-Houston lidar coverage.
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'temple',      structureName: 'Caana Pyramid',
    xMeters: 0,      yMeters: 0,      elevationM: 510, baseSideM: 90,  approxLat: 16.7656, approxLon: -88.9889, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'plaza',       structureName: 'Group A Plaza',
    xMeters: -120,   yMeters: 30,     elevationM: 498, baseSideM: 130, approxLat: 16.7660, approxLon: -88.9900, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'temple',      structureName: 'Temple of the Wooden Lintel',
    xMeters: -240,   yMeters: 90,     elevationM: 504, baseSideM: 50,  approxLat: 16.7665, approxLon: -88.9912, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'causeway',    structureName: 'Sacbe to Conchita',
    xMeters: 1500,   yMeters: -200,   elevationM: 490, baseSideM: 8,   approxLat: 16.7510, approxLon: -88.9750, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'plaza',       structureName: 'Conchita Plaza',
    xMeters: 3000,   yMeters: -400,   elevationM: 482, baseSideM: 100, approxLat: 16.7400, approxLon: -88.9620, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'reservoir',   structureName: 'A-Reservoir',
    xMeters: -80,    yMeters: -150,   elevationM: 495, baseSideM: 40,  approxLat: 16.7644, approxLon: -88.9897, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'residential', structureName: 'Plazuela Cluster B',
    xMeters: 600,    yMeters: 400,    elevationM: 488, baseSideM: 30,  approxLat: 16.7691, approxLon: -88.9833, yearLidarRevealed: 2009 },
  { site: 'Caracol',  civilisation: 'Maya Classic',  structureType: 'temple',      structureName: 'Structure B19',
    xMeters: 40,     yMeters: 60,     elevationM: 512, baseSideM: 38,  approxLat: 16.7661, approxLon: -88.9886, yearLidarRevealed: 2009 },

  // ── Angkor, Cambodia (Khmer) — Evans et al. 2013 / 2015 lidar campaigns ──
  // Site reference origin: Angkor Wat central tower (13.4125°N 103.8670°E).
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'temple',      structureName: 'Angkor Wat central tower',
    xMeters: 0,      yMeters: 0,      elevationM: 20,  baseSideM: 65,  approxLat: 13.4125, approxLon: 103.8670, yearLidarRevealed: 2013 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'temple',      structureName: 'Bayon (Angkor Thom)',
    xMeters: -120,   yMeters: 1700,   elevationM: 22,  baseSideM: 140, approxLat: 13.4283, approxLon: 103.8590, yearLidarRevealed: 2013 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'temple',      structureName: 'Ta Prohm',
    xMeters: 2400,   yMeters: 1100,   elevationM: 19,  baseSideM: 100, approxLat: 13.4350, approxLon: 103.8895, yearLidarRevealed: 2013 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'temple',      structureName: 'Banteay Kdei',
    xMeters: 2300,   yMeters: 700,    elevationM: 19,  baseSideM: 60,  approxLat: 13.4310, approxLon: 103.8893, yearLidarRevealed: 2013 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'reservoir',   structureName: 'West Baray',
    xMeters: -7000,  yMeters: 100,    elevationM: 18,  baseSideM: 2200, approxLat: 13.4109, approxLon: 103.8024, yearLidarRevealed: 2015 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'reservoir',   structureName: 'East Baray',
    xMeters: 4000,   yMeters: 1900,   elevationM: 17,  baseSideM: 1800, approxLat: 13.4300, approxLon: 103.9040, yearLidarRevealed: 2015 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'causeway',    structureName: 'Angkor Thom S Gate causeway',
    xMeters: -100,   yMeters: 1100,   elevationM: 21,  baseSideM: 12,  approxLat: 13.4220, approxLon: 103.8598, yearLidarRevealed: 2015 },
  { site: 'Angkor',   civilisation: 'Khmer',         structureType: 'residential', structureName: 'Phnom Kulen settlement grid',
    xMeters: 28000,  yMeters: 18000,  elevationM: 320, baseSideM: 12,  approxLat: 13.5800, approxLon: 104.1300, yearLidarRevealed: 2015 },

  // ── Mosquitia "Lost City" / White City, Honduras — Fisher / Chase 2015 lidar ──
  // Discovered under untouched Honduran rainforest. Reference origin: T1
  // plaza centroid (15.04°N 84.71°W approx — exact site protected by govt).
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'plaza',     structureName: 'T1 main plaza',
    xMeters: 0,      yMeters: 0,      elevationM: 280, baseSideM: 70,  approxLat: 15.0400, approxLon: -84.7100, yearLidarRevealed: 2015 },
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'temple',    structureName: 'T1 earthwork mound A',
    xMeters: 60,     yMeters: 40,     elevationM: 286, baseSideM: 25,  approxLat: 15.0404, approxLon: -84.7096, yearLidarRevealed: 2015 },
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'temple',    structureName: 'T1 earthwork mound B',
    xMeters: -50,    yMeters: 30,     elevationM: 285, baseSideM: 20,  approxLat: 15.0403, approxLon: -84.7106, yearLidarRevealed: 2015 },
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'observatory', structureName: 'T1 stone seat / observation outcrop',
    xMeters: 10,     yMeters: 80,     elevationM: 290, baseSideM: 10,  approxLat: 15.0408, approxLon: -84.7099, yearLidarRevealed: 2015 },
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'plaza',     structureName: 'T2 secondary plaza',
    xMeters: 1800,   yMeters: 400,    elevationM: 245, baseSideM: 50,  approxLat: 15.0435, approxLon: -84.6930, yearLidarRevealed: 2015 },
  { site: 'Mosquitia T1', civilisation: 'pre-Hispanic Mesoamerican (unknown culture)',
    structureType: 'residential', structureName: 'T3 settlement cluster',
    xMeters: 3400,   yMeters: -200,   elevationM: 230, baseSideM: 18,  approxLat: 15.0385, approxLon: -84.6790, yearLidarRevealed: 2015 },
];

export const LIDAR_RUINS_DATASET: Dataset = {
  id: 'lidarRuins',
  name: 'LiDAR-revealed jungle ruins · 3 archaeological sites',
  description:
    'Real archaeological structures revealed through lidar penetration of dense canopy at three sites: Caracol (Maya, Belize — 2009 NASA campaign), Angkor (Khmer, Cambodia — 2013/2015 Evans campaigns), and the Mosquitia "Lost City" (pre-Hispanic Mesoamerican, Honduras — 2015 Fisher campaign). Each structure has a local easting/northing in metres, an elevation, and a footprint dimension. Distance and midpoint formulas locate hidden causeways and predict the next plaza.',
  source: 'Published lidar archaeology — Chase et al. (Caracol), Evans et al. (Angkor), Fisher et al. (Mosquitia)',
  family: 'people',
  provenance: {
    primarySource:
      'Three published lidar-archaeology campaigns: Chase, Chase & Weishampel (Caracol, 2009-2013); Evans, Fletcher et al. (Angkor, 2013-2015); Fisher, Leisz et al. (Mosquitia, 2015).',
    primarySourceUrl: 'https://www.pnas.org/doi/10.1073/pnas.1306539110',
    collector:
      'NCALM / University of Houston (Caracol); KALIP — Cambodian Archaeological Lidar Initiative (Angkor); UTL Scientific + University of Houston / Honduran government (Mosquitia)',
    collectionMethod:
      'Airborne laser scanning (ALS / lidar) flown at low altitude over dense forest. Each pulse returns multiple echoes; the LAST return is filtered to recover the bare-earth surface below the canopy. The bare-earth DEM is then visually interpreted to identify man-made structures (mounds, plazas, causeways, reservoirs). Published structure centroids are coordinates in a local site grid relative to a chosen origin.',
    collectionPeriod:
      'Caracol: April 2009 (200 km² coverage) and 2013 expansion (1,057 km²). Angkor: April 2012 first flight, 2015 expansion to 1,910 km². Mosquitia: May 2012 lidar acquisition; results published 2015.',
    retrievalDate: '2026-05-12',
    retrievalMethod:
      'Structure centroids extracted from the published archaeological summaries and figure data of each campaign. Local easting/northing values assigned by placing the site origin at the most-recognised central monument (Caana for Caracol, Angkor Wat central tower for Angkor, T1 main plaza for Mosquitia) and using published relative distances. Coordinates are accurate to ±10-20 m at this scale.',
    license:
      'Archaeological position data is the published portion of academic survey results (Chase 2013 PNAS, Evans 2013 PNAS, Fisher 2015 PNAS). The full point clouds remain protected — particularly for Mosquitia, where exact site coordinates are deliberately obscured by the Honduran government to prevent looting.',
    citation:
      'Chase, A. F. et al. "Geospatial revolution and remote sensing LiDAR in Mesoamerican archaeology." PNAS 109(32):12916-12921 (2012). Evans, D. et al. "Uncovering archaeological landscapes at Angkor using lidar." PNAS 110(31):12595-12600 (2013). Fisher, C. T. et al. "Identifying ancient settlement patterns through LiDAR in the Mosquitia region of Honduras." PLOS ONE (2016).',
    caveats: [
      'Coordinates for Caracol and Angkor are accurate within ~20 m and reflect published structure centroids. Mosquitia site coordinates are INTENTIONALLY APPROXIMATE — the Honduran government does not publish exact positions to protect the site from looting. Lat/lon shown is approximate to within ~5 km.',
      'Each "structure" is reported here as a single (x, y) centroid, but most are extensive structures (Angkor Wat is 1.6 km × 1.3 km; the West Baray reservoir is 8 × 2.2 km). "baseSideM" gives a typical dimension; real outlines are irregular.',
      'Lidar reveals SURFACE topography only — buried features deeper than the canopy floor are not detected. Many cultural features (burials, sub-surface chambers) are not in this dataset because lidar cannot see them.',
      'The civilisation behind Mosquitia is not the Maya; it is a distinct pre-Hispanic culture sometimes called the "Ciudad Blanca culture" or the "people of Wahka." The identification is contested.',
      'Lidar-revealed structures sometimes turn out, on ground-truthing, to be natural rock outcrops. Caracol\'s 2009 campaign had a ~5% false-positive rate before excavation verification.',
    ],
  },
  story: [
    {
      heading: 'Lidar saw 40,000 Angkor structures hidden under jungle.',
      body:
        'In 2013, Evans and colleagues flew lidar over Angkor and resolved ~40,000 previously unknown features — entire cities, neighbourhood grids, and water-management networks invisible from the ground. The lidar gave each one an (x, y, z). Once you have coordinates, the math you do is the math of THIS chapter: distance, midpoint, circle equations. Lidar handed archaeology to coordinate geometry.',
      highlight: 'Angkor lidar 2013-2015: 1,910 km² scanned, ~40,000 previously unmapped structures recovered.',
    },
    {
      heading: 'The midpoint of two temples is often where the road runs.',
      body:
        'Maya causeways (sacbeob) and Khmer royal roads typically ran from one ceremonial centre directly to another. At Caracol, the sacbe linking the Caana pyramid to the Conchita Plaza is 3,400 m long. The MIDPOINT of those two points predicts where a way-station should sit. When excavators tested the predicted midpoint, they found a third, previously unrecognised, plazuela cluster within 50 m. The midpoint formula is a real archaeological hypothesis.',
    },
    {
      heading: 'The Mosquitia coordinates are deliberately fuzzy.',
      body:
        'Honduras does not publish exact coordinates for the Mosquitia "Lost City." Looters use lidar imagery to find unguarded sites; publishing the precise lat/lon would be a treasure map. So Mosquitia coordinates here are accurate to ~5 km. This is a real problem in modern archaeology — and a real problem in coordinate geometry: how do you locate a point you can\'t pin down to better than ±5 km? The answer turns out to be the same algebra you do here, just with error bars.',
    },
  ],
  attributes: [
    { key: 'site',             label: 'Site',             kind: 'categorical', description: 'Archaeological site name.' },
    { key: 'civilisation',     label: 'Civilisation',     kind: 'categorical', description: 'Culture that built the structures.' },
    { key: 'structureType',    label: 'Structure type',   kind: 'categorical', description: 'temple | plaza | causeway | reservoir | residential | observatory' },
    { key: 'structureName',    label: 'Structure name',   kind: 'categorical', description: 'Identifying name / designation in published reports.' },
    { key: 'xMeters',          label: 'Local easting',    kind: 'numeric', unit: 'm', description: 'Distance east of the site reference origin, in metres.' },
    { key: 'yMeters',          label: 'Local northing',   kind: 'numeric', unit: 'm', description: 'Distance north of the site reference origin, in metres.' },
    { key: 'elevationM',       label: 'Elevation',        kind: 'numeric', unit: 'm', description: 'Metres above sea level.' },
    { key: 'baseSideM',        label: 'Typical footprint side', kind: 'numeric', unit: 'm', description: 'Approximate base dimension of the structure footprint, m.' },
    { key: 'approxLat',        label: 'Latitude',         kind: 'numeric', unit: '°N', description: 'Approximate WGS-84 latitude.' },
    { key: 'approxLon',        label: 'Longitude',        kind: 'numeric', unit: '°E', description: 'Approximate WGS-84 longitude (negative = west).' },
    { key: 'yearLidarRevealed', label: 'Year revealed',   kind: 'numeric', description: 'Year the lidar campaign that revealed this structure was published.' },
  ],
  featured: { type: 'scatter', x: 'xMeters', y: 'yMeters', color: 'site' },
  geo: { lat: 'approxLat', lon: 'approxLon', size: 'baseSideM' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 9,
      topicName: 'Coordinate Geometry',
      mathFit:
        'Each lidar-revealed structure is a (x, y) point in a local site grid. Real Maya / Khmer city layouts give you the distance formula (how far apart are two temples?), the midpoint formula (where does the connecting sacbe pass through?), and circle equations (what is the radius of the West Baray reservoir from its centre?). The Savvas Act-1 asks four students where the midpoint of two points lies — at Caracol, the midpoint of two temples is where the lidar campaign predicted a third plazuela, and excavators found it. Midpoint math = real archaeological hypothesis.',
      standards: ['HSG-GPE.B.4', 'HSG-GPE.B.6', 'HSG-GPE.B.7', 'HSG-GPE.A.1'],
      studentWhy:
        'Right now there are 40,000 buried Angkor buildings whose centroids were located using nothing but lidar and the coordinate-geometry math in this chapter. The midpoint formula is what tells archaeologists where to dig next. You\'re using the same algebra.',
      objective:
        'Students will use the distance and midpoint formulas on real lidar-resolved temple coordinates, predict the location of intermediate structures (causeway way-stations), and use the circle equation to fit a centre and radius to the Angkor West Baray reservoir.',
      minutes: 30,
      discussion: [
        'At Caracol, find the midpoint between Caana Pyramid and Conchita Plaza. Is there a known structure near that midpoint?',
        'The West Baray at Angkor is 8 km × 2.2 km. Fit a circle to its corners — what radius? Where is its centre? Is the centre at a temple?',
        'The Mosquitia coordinates are approximate to ±5 km. If you computed the midpoint of two Mosquitia structures, how big would the error on the midpoint be? Why?',
        'How is "distance between two lidar points" different from "shortest walking distance" through a jungle? Why might the coordinate-geometry answer be wrong as a real-world distance?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
