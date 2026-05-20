// Act 1 reveal dataset — USGS M6+ "devastating" earthquakes since 1990.
//
// This is intentionally a separate dataset from `earthquakesDataset` (which
// is M2.5+ past-7-days, used by Acts 2/3 and Explorer). Act 1 shows ~5,500
// dots accumulated over 35+ years for a denser, more dramatic Ring of Fire
// reveal; Acts 2/3 zoom into "and this is still happening now" with the
// recent slice.
//
// Refresh: `node scripts/fetchHistoricalEarthquakes.mjs` rewrites the JSON.

import raw from './historicalEarthquakes.json';

export interface HistoricalQuake {
  lat: number;
  lon: number;
  mag: number;
  depthKm: number;
  place: string;
  time: number; // epoch ms
}

interface RawPayload {
  source: string;
  sourceUrl: string;
  query: { minMagnitude: number; startTime: string; endTime: string };
  retrievedAt: string;
  count: number;
  events: HistoricalQuake[];
}

const payload = raw as RawPayload;

export const HISTORICAL_EARTHQUAKES: readonly HistoricalQuake[] = payload.events;
export const HISTORICAL_SOURCE = payload.source;
export const HISTORICAL_QUERY = payload.query;
export const HISTORICAL_RETRIEVED_AT = payload.retrievedAt;
