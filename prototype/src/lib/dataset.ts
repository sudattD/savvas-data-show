// Dataset abstraction. The explorer is dataset-agnostic — load anything that
// fits this shape and the same UI works.

export type AttributeKind = 'numeric' | 'categorical';

export interface Attribute {
  key: string;
  label: string;
  kind: AttributeKind;
  unit?: string;
  description?: string;
}

export type Row = Record<string, number | string | null>;

/** Where the data came from — required on every dataset. */
export interface Provenance {
  /** Human-readable name of the primary source ("NOAA Global Monitoring Laboratory"). */
  primarySource: string;
  /** Direct link to the dataset / API / page. */
  primarySourceUrl: string;
  /** Who originally collected the data (person, team, instrument). */
  collector?: string;
  /** How the data is measured ("monthly air samples drawn at 11,135 ft elevation…"). */
  collectionMethod?: string;
  /** Time range over which the data was collected (e.g. "1958-present"). */
  collectionPeriod?: string;
  /** When *we* retrieved this snapshot. */
  retrievalDate: string;
  /** How we retrieved it (REST API, CSV download, scraped, …). */
  retrievalMethod: string;
  /** License or rights statement. */
  license: string;
  /** Optional formal citation. */
  citation?: string;
  /** Caveats students should know — known limitations, biases, freshness gaps. */
  caveats?: string[];
}

/** A short narrative beat for the dataset story page. */
export interface StoryBeat {
  heading?: string;
  body: string;
  /** Optional highlighted stat or quotation. */
  highlight?: string;
}

/** High-level subject family the dataset belongs to. Drives spine color in the
 *  library so reviewers can scan-read coverage by subject. */
export type DatasetFamily = 'earth' | 'space' | 'life' | 'people' | 'technology';

export const FAMILY_LABEL: Record<DatasetFamily, string> = {
  earth: 'Earth & climate',
  space: 'Space',
  life: 'Life',
  people: 'People & culture',
  technology: 'Technology',
};

export const FAMILY_ACCENT: Record<DatasetFamily, string> = {
  earth: 'emerald',
  space: 'indigo',
  life: 'teal',
  people: 'rose',
  technology: 'slate',
};

export interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  /** High-level subject family — drives spine color in the library. */
  family?: DatasetFamily;
  /** Tailwind hue family for visual identification — e.g. "sky", "amber", "emerald".
   *  Used when family is not set; otherwise FAMILY_ACCENT[family] wins. */
  accent?: string;
  /** Required: where this data came from and how to verify it. */
  provenance: Provenance;
  /** Optional: stepped narrative shown on the dataset story page. */
  story?: StoryBeat[];
  attributes: Attribute[];
  rows: Row[];
  /** Optional canonical scatter view — used as the Explorer's default X/Y/color. */
  featured?: { x: string; y: string; color?: string };
}

/** Resolve the visual accent for a dataset — prefers family if set. */
export function datasetAccent(d: Dataset): string {
  if (d.family) return FAMILY_ACCENT[d.family];
  return d.accent ?? 'sky';
}

export function getNumericAttrs(d: Dataset) {
  return d.attributes.filter((a) => a.kind === 'numeric');
}

export function getCategoricalAttrs(d: Dataset) {
  return d.attributes.filter((a) => a.kind === 'categorical');
}

export function attrByKey(d: Dataset, key: string): Attribute | undefined {
  return d.attributes.find((a) => a.key === key);
}

// ----- Summary stats -----

export interface NumericStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  sd: number;
  q1: number;
  q3: number;
}

export function numericStats(values: number[]): NumericStats | null {
  const v = values.filter((x) => Number.isFinite(x));
  if (v.length === 0) return null;
  const sorted = [...v].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((s, x) => s + x, 0);
  const mean = sum / n;
  const variance = sorted.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const median = quantile(sorted, 0.5);
  return {
    count: n,
    min: sorted[0],
    max: sorted[n - 1],
    mean,
    median,
    sd: Math.sqrt(variance),
    q1: quantile(sorted, 0.25),
    q3: quantile(sorted, 0.75),
  };
}

export function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]);
}

export function categoricalCounts(values: (string | number | null)[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const v of values) {
    if (v === null || v === undefined) continue;
    const k = String(v);
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
}

// ----- Filters -----

export interface NumericFilter {
  kind: 'numeric';
  attrKey: string;
  min: number;
  max: number;
}

export interface CategoricalFilter {
  kind: 'categorical';
  attrKey: string;
  // empty set means "all included"
  excluded: Set<string>;
}

export type Filter = NumericFilter | CategoricalFilter;

export function applyFilters(rows: Row[], filters: Filter[]): Row[] {
  return rows.filter((row) => {
    for (const f of filters) {
      const val = row[f.attrKey];
      if (f.kind === 'numeric') {
        const n = typeof val === 'number' ? val : Number(val);
        if (!Number.isFinite(n)) continue;
        if (n < f.min || n > f.max) return false;
      } else {
        if (f.excluded.has(String(val))) return false;
      }
    }
    return true;
  });
}
