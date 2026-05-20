// Pulls USGS M6+ historical catalog and writes a compact JSON for Act 1's
// reveal animation. ~5,500 events globally, 1990 → present.
//
// Source: USGS FDSN event service.
// Run: `node scripts/fetchHistoricalEarthquakes.mjs`
// Refresh whenever the prototype is rebuilt for a demo.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const START = '1990-01-01';
const END = new Date().toISOString().slice(0, 10);
const MIN_MAG = 6;

const URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${START}&endtime=${END}&minmagnitude=${MIN_MAG}&orderby=time-asc`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../src/data/historicalEarthquakes.json');

console.log(`Fetching M${MIN_MAG}+ events from ${START} to ${END}...`);
const res = await fetch(URL);
if (!res.ok) {
  console.error(`USGS responded ${res.status} ${res.statusText}`);
  process.exit(1);
}
const geojson = await res.json();
const features = Array.isArray(geojson.features) ? geojson.features : [];
console.log(`Received ${features.length} features.`);

// Compact shape — only what Act 1's reveal needs. Lat/lon/mag/depth carry the
// visual story; place + time stay so a future feature (tooltip on cluster
// tap, "deadliest of the year" callout) can use them without a refetch.
const rows = features
  .map((f) => {
    const coords = f?.geometry?.coordinates;
    const props = f?.properties;
    if (!Array.isArray(coords) || coords.length < 3 || !props) return null;
    const [lon, lat, depthKm] = coords;
    if (typeof lon !== 'number' || typeof lat !== 'number') return null;
    return {
      lat: Number(lat.toFixed(3)),
      lon: Number(lon.toFixed(3)),
      mag: Number(Number(props.mag ?? 0).toFixed(2)),
      depthKm: Number(Number(depthKm ?? 0).toFixed(1)),
      place: typeof props.place === 'string' ? props.place : '',
      time: typeof props.time === 'number' ? props.time : 0,
    };
  })
  .filter(Boolean);

const payload = {
  source: 'USGS Earthquake Hazards Program — FDSN event service',
  sourceUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/',
  query: { minMagnitude: MIN_MAG, startTime: START, endTime: END },
  retrievedAt: new Date().toISOString(),
  count: rows.length,
  events: rows,
};

await writeFile(OUT_PATH, JSON.stringify(payload), 'utf8');
console.log(`Wrote ${rows.length} events to ${OUT_PATH}`);
