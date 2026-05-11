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
