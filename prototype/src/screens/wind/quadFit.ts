// Least-squares quadratic regression + binning helpers for the Wind Power
// Curve activity. lib/fit.ts already gives us `quadratic` (build a model fn)
// and `rSquared` (score one); this adds the missing piece — solving for the
// best-fit coefficients directly from the data.

import type { WindPoint } from '../../data/windTurbine';

export interface QuadCoeffs {
  a: number;
  b: number;
  c: number;
}

// Fit P = a·v² + b·v + c by ordinary least squares. Solves the 3×3 normal
// equations with Cramer's rule. Returns zeros if the system is degenerate
// (e.g. fewer than 3 distinct points).
export function fitQuadratic(points: readonly WindPoint[]): QuadCoeffs {
  let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0;
  let t0 = 0, t1 = 0, t2 = 0;
  for (const p of points) {
    const x = p.windSpeed;
    const y = p.power;
    const x2 = x * x;
    s0 += 1;
    s1 += x;
    s2 += x2;
    s3 += x2 * x;
    s4 += x2 * x2;
    t0 += y;
    t1 += x * y;
    t2 += x2 * y;
  }
  // [s4 s3 s2][a]   [t2]
  // [s3 s2 s1][b] = [t1]
  // [s2 s1 s0][c]   [t0]
  const det = det3(s4, s3, s2, s3, s2, s1, s2, s1, s0);
  if (Math.abs(det) < 1e-9) return { a: 0, b: 0, c: 0 };
  const a = det3(t2, s3, s2, t1, s2, s1, t0, s1, s0) / det;
  const b = det3(s4, t2, s2, s3, t1, s1, s2, t0, s0) / det;
  const c = det3(s4, s3, t2, s3, s2, t1, s2, s1, t0) / det;
  return { a, b, c };
}

function det3(
  m11: number, m12: number, m13: number,
  m21: number, m22: number, m23: number,
  m31: number, m32: number, m33: number,
): number {
  return (
    m11 * (m22 * m33 - m23 * m32) -
    m12 * (m21 * m33 - m23 * m31) +
    m13 * (m21 * m32 - m22 * m31)
  );
}

export interface Bin {
  /** Bin midpoint wind speed, m/s. */
  mid: number;
  /** Mean power of readings that fell in the bin, kW. */
  mean: number;
  count: number;
}

// Split [lo, hi] into `bins` equal-width wind-speed bins and average the
// power in each. Evenly-spaced bins are what make first/second differences
// meaningful — that's the whole point of the Differences lens.
export function binnedMeans(
  points: readonly WindPoint[],
  lo: number,
  hi: number,
  bins: number,
): Bin[] {
  const width = (hi - lo) / bins;
  const sums = new Array(bins).fill(0);
  const counts = new Array(bins).fill(0);
  for (const p of points) {
    if (p.windSpeed < lo || p.windSpeed >= hi) continue;
    const idx = Math.min(bins - 1, Math.floor((p.windSpeed - lo) / width));
    sums[idx] += p.power;
    counts[idx] += 1;
  }
  const out: Bin[] = [];
  for (let i = 0; i < bins; i++) {
    out.push({
      mid: lo + width * (i + 0.5),
      mean: counts[i] > 0 ? sums[i] / counts[i] : NaN,
      count: counts[i],
    });
  }
  return out;
}

// First and second differences of a series of bin means. Evenly-spaced x
// values are assumed (binnedMeans guarantees it).
export function differences(values: number[]): {
  first: number[];
  second: number[];
} {
  const first: number[] = [];
  for (let i = 1; i < values.length; i++) first.push(values[i] - values[i - 1]);
  const second: number[] = [];
  for (let i = 1; i < first.length; i++) second.push(first[i] - first[i - 1]);
  return { first, second };
}
