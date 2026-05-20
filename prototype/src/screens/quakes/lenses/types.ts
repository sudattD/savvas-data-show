// Shared types for Act 2's multi-lens investigation.
//
// Each lens is independently toggleable; each carries its own "what did this
// view show you?" claim. The orchestrator collects all of them plus a
// synthesis line into the QuakeSummary handed to Act 3.

export type LensId = 'map' | 'histogram' | 'scatter';

export interface LensState {
  enabled: boolean;
  /** Selected chip IDs from the lens's claim catalog. */
  claimChipIds: string[];
}

export interface MapLensState extends LensState {
  minMag: number;
  plateLines: boolean;
}

export type HistogramVariable = 'magnitude' | 'depthKm';

export interface HistogramLensState extends LensState {
  variable: HistogramVariable;
}

export type ScatterVariable = 'magnitude' | 'depthKm' | 'lat' | 'lon';

export interface ScatterLensState extends LensState {
  xKey: ScatterVariable;
  yKey: ScatterVariable;
}

export interface Act2State {
  map: MapLensState;
  histogram: HistogramLensState;
  scatter: ScatterLensState;
  /** Selected chip IDs from SYNTHESIS_CHIPS. */
  synthesisChipIds: string[];
}

export const SCATTER_VAR_LABELS: Record<ScatterVariable, string> = {
  magnitude: 'Magnitude',
  depthKm: 'Depth (km)',
  lat: 'Latitude',
  lon: 'Longitude',
};

export const HISTOGRAM_VAR_LABELS: Record<HistogramVariable, string> = {
  magnitude: 'Magnitude',
  depthKm: 'Depth (km)',
};

export function defaultAct2State(): Act2State {
  return {
    map: { enabled: false, claimChipIds: [], minMag: 2.5, plateLines: false },
    histogram: { enabled: false, claimChipIds: [], variable: 'magnitude' },
    scatter: { enabled: false, claimChipIds: [], xKey: 'depthKm', yKey: 'magnitude' },
    synthesisChipIds: [],
  };
}
