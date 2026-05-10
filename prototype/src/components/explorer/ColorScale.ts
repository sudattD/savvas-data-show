// Color scale for categorical attributes. Rotates through a tasteful palette.

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

export function categoryColor(value: string, allValues: string[]): string {
  const idx = allValues.indexOf(value);
  if (idx < 0) return PALETTE[0];
  return PALETTE[idx % PALETTE.length];
}

export function uniqueValues(rows: Record<string, unknown>[], key: string): string[] {
  const set = new Set<string>();
  for (const r of rows) {
    const v = r[key];
    if (v === null || v === undefined) continue;
    set.add(String(v));
  }
  return Array.from(set).sort();
}

export const DEFAULT_POINT = '#3B82F6';
