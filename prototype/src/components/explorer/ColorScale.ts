// Color scale for categorical attributes.
//
// Nominal categories rotate through a tasteful palette.
// Ordinal categories (decade, age band, hurricane category, …) use a
// sequential ramp from light to dark within a single hue so adjacent levels
// read as adjacent.

const PALETTE = [
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#10B981', // emerald
  '#EF4444', // rose
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#84CC16', // lime
  '#06B6D4', // cyan
  '#A855F7', // purple
  '#EAB308', // yellow
  '#64748B', // slate
  '#DC2626', // red
  '#0EA5E9', // sky
  '#22C55E', // green
  '#D946EF', // fuchsia
  '#7C3AED', // indigo
];

// Sequential ramp — Tailwind sky 200 → 950, sampled linearly. Light to dark.
const SEQUENTIAL = [
  '#BAE6FD', // sky-200
  '#7DD3FC', // sky-300
  '#38BDF8', // sky-400
  '#0EA5E9', // sky-500
  '#0284C7', // sky-600
  '#0369A1', // sky-700
  '#075985', // sky-800
  '#0C4A6E', // sky-900
  '#082F49', // sky-950
];

export interface CategoryColorOptions {
  /** When true, use the sequential ramp instead of the nominal palette. */
  ordinal?: boolean;
}

export function categoryColor(value: string, allValues: string[], opts: CategoryColorOptions = {}): string {
  const idx = allValues.indexOf(value);
  if (idx < 0) return opts.ordinal ? SEQUENTIAL[0] : PALETTE[0];
  if (opts.ordinal && allValues.length > 1) {
    const t = idx / (allValues.length - 1);
    const i = Math.round(t * (SEQUENTIAL.length - 1));
    return SEQUENTIAL[i];
  }
  return PALETTE[idx % PALETTE.length];
}

/** Categories present in `rows` for the given key. By default returns them
 *  alphabetically sorted; pass `ordinal: true` (plus the original rows in the
 *  same order they were loaded) to get first-occurrence order — which
 *  preserves natural orderings like 1950s → 1960s or 0-4 → 5-9 → 10-14. */
export function uniqueValues(
  rows: Record<string, unknown>[],
  key: string,
  opts: { ordinal?: boolean } = {},
): string[] {
  if (opts.ordinal) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      const v = r[key];
      if (v === null || v === undefined) continue;
      const s = String(v);
      if (!seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
    return out;
  }
  const set = new Set<string>();
  for (const r of rows) {
    const v = r[key];
    if (v === null || v === undefined) continue;
    set.add(String(v));
  }
  return Array.from(set).sort();
}

export const DEFAULT_POINT = '#3B82F6';

// Continuous numeric ramp — viridis-inspired, light cool to dark warm.
// Good perceptual uniformity and colorblind-safer than a rainbow.
const NUMERIC_RAMP = [
  '#FDE68A', // amber-200
  '#FCD34D', // amber-300
  '#FBBF24', // amber-400
  '#F59E0B', // amber-500
  '#D97706', // amber-600
  '#B45309', // amber-700
  '#92400E', // amber-800
  '#7C2D12', // orange-900 (deep)
];

/** Map a normalized t in [0, 1] to a color from the numeric ramp. */
export function numericColor(t: number): string {
  if (!Number.isFinite(t)) return DEFAULT_POINT;
  const clamped = Math.max(0, Math.min(1, t));
  const i = clamped * (NUMERIC_RAMP.length - 1);
  const lo = Math.floor(i);
  const hi = Math.min(NUMERIC_RAMP.length - 1, lo + 1);
  if (lo === hi) return NUMERIC_RAMP[lo];
  return interpolateHex(NUMERIC_RAMP[lo], NUMERIC_RAMP[hi], i - lo);
}

/** Return the gradient stops as CSS so a legend swatch matches the chart. */
export function numericRampStops(): string {
  return NUMERIC_RAMP.join(', ');
}

function interpolateHex(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t).toString(16).padStart(2, '0');
  const g = Math.round(ag + (bg - ag) * t).toString(16).padStart(2, '0');
  const c = Math.round(ab + (bb - ab) * t).toString(16).padStart(2, '0');
  return `#${r}${g}${c}`;
}
