// Shared types for Act 2's multi-lens investigation.
//
// Each lens is independently toggleable; each carries its own "what did this
// view show you?" claim chips. The orchestrator collects all of them plus a
// synthesis line into the WindSummary handed to Act 3.

import type { RegimeId } from '../regimes';

export type LensId = 'fit' | 'differences' | 'regime';

export interface LensState {
  enabled: boolean;
  /** Selected chip IDs from the lens's claim catalog. */
  claimChipIds: string[];
}

// Fit lens — student drags the three coefficients of P = a·v² + b·v + c.
export interface FitLensState extends LensState {
  a: number;
  b: number;
  c: number;
}

// Differences lens — student chooses how many evenly-spaced bins to split
// the ramp-up zone into before reading off first/second differences.
export interface DifferencesLensState extends LensState {
  bins: number;
}

// Regime lens — student toggles which operating regimes are folded into a
// least-squares quadratic fit, and watches R² react.
export interface RegimeLensState extends LensState {
  included: RegimeId[];
}

export interface Act2State {
  fit: FitLensState;
  differences: DifferencesLensState;
  regime: RegimeLensState;
  /** Selected chip IDs from SYNTHESIS_CHIPS. */
  synthesisChipIds: string[];
}

export const LENS_LABELS: Record<LensId, string> = {
  fit: 'Fit',
  differences: 'Differences',
  regime: 'Regime',
};

export function defaultAct2State(): Act2State {
  return {
    fit: { enabled: false, claimChipIds: [], a: 5, b: 0, c: 0 },
    differences: { enabled: false, claimChipIds: [], bins: 7 },
    regime: { enabled: false, claimChipIds: [], included: ['rampUp'] },
    synthesisChipIds: [],
  };
}
