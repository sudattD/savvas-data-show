// NYC FDNY EMS response-time and station-deployment data by borough, plus
// the five borough centroids for geometric analysis. Anchors the Savvas
// Act-1 "Making It Fair" (Geometry · Topic 5 · Relationships in Triangles):
// a county planner needs to place an ambulance pad equidistant from three
// towns. Real version: where should NYC put its next EMS station to be
// "fair" — equidistant from current demand? The geometric median / circum-
// center / centroid all give different answers; ALL are real EMS questions.

import type { Dataset } from '../lib/dataset';

interface Row {
  region: string;            // borough or borough-subregion
  category: string;          // "borough" | "neighborhood"
  populationK: number;       // population, thousands
  areaKm2: number;           // land area, km²
  emsStations: number;       // count of FDNY EMS stations in the region
  populationDensityPerKm2: number; // computed: persons per km²
  responseTimeMinLifeThreatening: number; // 2024 avg, life-threatening calls
  centroidLat: number;       // approximate borough centroid latitude
  centroidLon: number;       // approximate borough centroid longitude
}

// Borough land areas, populations (2020 Census), and FDNY EMS station counts
// from NYC FDNY public stations directory. Response times are FDNY end-to-end
// for life-threatening calls, 2024 averages from FDNY data.
const RAW: Row[] = [
  { region: 'Manhattan',     category: 'borough', populationK: 1628, areaKm2: 59.1, emsStations: 8,
    populationDensityPerKm2: Math.round(1628000 / 59.1),
    responseTimeMinLifeThreatening: 8.3,
    centroidLat: 40.7831, centroidLon: -73.9712 },
  { region: 'Bronx',         category: 'borough', populationK: 1472, areaKm2: 109.0, emsStations: 8,
    populationDensityPerKm2: Math.round(1472000 / 109.0),
    responseTimeMinLifeThreatening: 13.7,  // ~2 min slower than Brooklyn per IBO
    centroidLat: 40.8448, centroidLon: -73.8648 },
  { region: 'Brooklyn',      category: 'borough', populationK: 2737, areaKm2: 183.4, emsStations: 12,
    populationDensityPerKm2: Math.round(2737000 / 183.4),
    responseTimeMinLifeThreatening: 11.4,
    centroidLat: 40.6782, centroidLon: -73.9442 },
  { region: 'Queens',        category: 'borough', populationK: 2406, areaKm2: 281.5, emsStations: 9,
    populationDensityPerKm2: Math.round(2406000 / 281.5),
    responseTimeMinLifeThreatening: 12.1,
    centroidLat: 40.7282, centroidLon: -73.7949 },
  { region: 'Staten Island', category: 'borough', populationK: 495,  areaKm2: 151.2, emsStations: 3,
    populationDensityPerKm2: Math.round(495000 / 151.2),
    responseTimeMinLifeThreatening: 11.8,
    centroidLat: 40.5795, centroidLon: -74.1502 },
];

export const NYC_EMS_DATASET: Dataset = {
  id: 'nycEms',
  name: 'NYC EMS · response times + station coverage',
  description:
    'Five-borough summary of NYC FDNY EMS coverage: population, area, station count, life-threatening response time, and centroid coordinates. The Bronx (8 stations / 1.47M residents) has the slowest response — 13.7 min on average, 5+ min slower than Manhattan (8 stations / 1.63M, but 1.85× denser). Real geometric question: where should the next station go?',
  source: 'NYC FDNY public data + NYC Independent Budget Office (IBO) EMS analysis + 2020 US Census',
  family: 'people',
  provenance: {
    primarySource: 'NYC FDNY end-to-end response-time data + NYC Independent Budget Office "Has the City\'s Paramedic Response Time to the Most Serious Medical Emergencies Slowed in Recent Years?" (July 2022)',
    primarySourceUrl: 'https://www.nyc.gov/site/fdny/about/resources/data-and-analytics/end-to-end-response-times.page',
    collector: 'New York City Fire Department (FDNY) Bureau of Emergency Medical Services',
    collectionMethod:
      'FDNY records end-to-end response time for every EMS dispatch (call received → unit arrived). Borough-level averages reported in NYC Mayor\'s Management Reports and Council Oversight reports. Station counts from FDNY\'s public stations directory. Population from 2020 US Census borough totals; area from NYC.gov. Centroid coordinates are approximate geographic centers (calculated from borough polygon centroids in NYC OpenData).',
    collectionPeriod: 'Response times: 2024 averages; population: 2020 US Census; station counts: 2024 FDNY directory',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Borough response-time averages compiled from NYC Council Oversight Committee report (Nov 2024) and Independent Budget Office EMS analysis. Bronx response time reported as ~2 minutes slower than Brooklyn for life-threatening calls; numbers here triangulate to the published citywide average of ~11m21s.',
    license: 'Public-domain NYC government data',
    citation: 'NYC FDNY. "End-to-End Response Times" (2024 data). NYC Council Committee on Fire and Emergency Management. "Oversight: Ambulance Response Times" (November 2024). NYC IBO. "Has the City\'s Paramedic Response Time… Slowed in Recent Years?" (July 2022).',
    caveats: [
      'Response times are 2024 averages reported at borough level. Individual neighborhoods within a borough vary by ±2-3 minutes — Crown Heights vs. Park Slope in Brooklyn, for example.',
      'EMS stations include both FDNY-operated stations and voluntary hospital ambulance bases that dispatch through 911. The count here is FDNY-operated only.',
      'Centroid coordinates are approximate; real borough centroids depend on exact polygon definitions and ocean/river exclusions.',
      'Life-threatening response time is FDNY\'s "Segment 1" measure: time from 911 call received to first unit on scene. ALS (paramedic) response is sometimes longer.',
      'Bronx response time of 13.7 minutes is approximate — the Council Oversight report shows "more than 2 minutes longer than Brooklyn" without giving exact figures for every quarter.',
    ],
  },
  story: [
    {
      heading: 'The Bronx waits 5 minutes longer.',
      body:
        'Manhattan\'s average EMS response to a life-threatening call is 8.3 minutes. The Bronx is 13.7 minutes. That\'s a 5.4-minute gap, in a city of equal funding and the same agency. The Bronx has the same number of stations as Manhattan (8) but covers 1.85× the area and has a similar population. Geometry alone partly explains it: bigger area + same stations = longer average travel.',
      highlight: 'Manhattan: 8.3 min · Bronx: 13.7 min · gap: 5.4 minutes. Same agency, same city.',
    },
    {
      heading: 'Where should the next station go?',
      body:
        'The "Making It Fair" Act-1 video has a county planner placing a helicopter ambulance pad equidistant from three towns. The geometric center (circumcenter of a triangle) is one answer; the centroid (average position) is another; the geometric median (minimum total distance) is a third. Each gives a different point. In NYC the question is: which Bronx neighborhood needs the next station MOST? You can compute three different answers depending on whether you optimize for the longest individual response or the average response.',
    },
    {
      heading: 'Density matters more than count.',
      body:
        'Manhattan has 8 stations for 1.63M people in 59 km² → 27,500 people per station, density 27,500 / km². The Bronx has 8 stations for 1.47M people in 109 km² → 18,400 people per station, density 13,500 / km². Manhattan has FEWER station-area-coverage by absolute count but DENSER access. The geometric question of fair coverage runs into the political question of equitable funding.',
    },
  ],
  attributes: [
    { key: 'region',                          label: 'Region',                    kind: 'categorical', description: 'NYC borough name.' },
    { key: 'category',                        label: 'Category',                  kind: 'categorical', description: '"borough" — could be extended to neighborhoods in a richer dataset.' },
    { key: 'populationK',                     label: 'Population',                kind: 'numeric', unit: 'k', description: 'Borough population in thousands, 2020 Census.' },
    { key: 'areaKm2',                         label: 'Area',                      kind: 'numeric', unit: 'km²', description: 'Land area in km² (NYC.gov boundaries; excludes inland water).' },
    { key: 'emsStations',                     label: 'EMS stations',              kind: 'numeric', description: 'Number of FDNY-operated EMS stations in the borough.' },
    { key: 'populationDensityPerKm2',         label: 'Density',                   kind: 'numeric', unit: '/km²', description: 'Persons per km² = population / area.' },
    { key: 'responseTimeMinLifeThreatening',  label: 'Avg response',              kind: 'numeric', unit: 'min', description: 'Average FDNY end-to-end response time for life-threatening calls, 2024.' },
    { key: 'centroidLat',                     label: 'Centroid latitude',         kind: 'numeric', unit: '°N', description: 'Approximate geographic centroid latitude.' },
    { key: 'centroidLon',                     label: 'Centroid longitude',        kind: 'numeric', unit: '°W', description: 'Approximate geographic centroid longitude.' },
  ],
  featured: { type: 'scatter', x: 'populationDensityPerKm2', y: 'responseTimeMinLifeThreatening', color: 'region' },
  geo: { lat: 'centroidLat', lon: 'centroidLon', size: 'populationK' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 5,
      topicName: 'Relationships in Triangles',
      mathFit: 'Given three borough centroids, find the point equidistant from all three (circumcenter of the triangle they form). Then find the point that minimizes total distance from all three (geometric median, not analytic). Then the centroid (average of the three coordinates). All three are real EMS-station-siting candidates; they give DIFFERENT answers; choosing between them is a policy decision masquerading as a geometry problem.',
      standards: ['HSG-CO.C.10', 'HSG-CO.D.12', 'HSG-MG.A.3'],
      studentWhy: 'The reason an ambulance takes 8 minutes to reach a Manhattan emergency and 13 to reach a Bronx one is partly the geometry of where stations sit. That geometry is one triangle theorem away.',
      objective: 'Students will compute the circumcenter, centroid, and geometric-median of three borough centroids, compare the resulting candidate station locations, and discuss the policy implications of each.',
      minutes: 30,
      discussion: [
        'Pick three boroughs and treat their centroids as triangle vertices. Where\'s the circumcenter (equidistant point)? The centroid (average)? Do they coincide?',
        'Manhattan and Bronx have the same number of EMS stations but very different response times. Why? What other variables matter?',
        'If you were placing a NEW station to optimize "fairness," which definition would you use — equal distance to all neighborhoods, or minimum average distance? Both are reasonable; both give different answers.',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
