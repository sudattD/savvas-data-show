import { useMemo, useState } from 'react';
import type { Dataset, Row, Filter, NumericFilter, CategoricalFilter, Attribute } from '../../lib/dataset';
import { numericStats, categoricalCounts } from '../../lib/dataset';

const CHIPS_COLLAPSED = 12;

interface FilterPanelProps {
  dataset: Dataset;
  allRows: Row[];
  filters: Filter[];
  onChange: (f: Filter[]) => void;
}

export default function FilterPanel({ dataset, allRows, filters, onChange }: FilterPanelProps) {
  // Helper: get/set filter for an attribute
  const numFilters = useMemo(() => filters.filter((f): f is NumericFilter => f.kind === 'numeric'), [filters]);
  const catFilters = useMemo(() => filters.filter((f): f is CategoricalFilter => f.kind === 'categorical'), [filters]);

  const updateNumeric = (key: string, min: number, max: number) => {
    const others = filters.filter((f) => !(f.kind === 'numeric' && f.attrKey === key));
    onChange([...others, { kind: 'numeric', attrKey: key, min, max }]);
  };

  const toggleCategory = (key: string, cat: string) => {
    const existing = catFilters.find((f) => f.attrKey === key);
    const excluded = new Set(existing?.excluded ?? []);
    if (excluded.has(cat)) excluded.delete(cat);
    else excluded.add(cat);
    const others = filters.filter((f) => !(f.kind === 'categorical' && f.attrKey === key));
    if (excluded.size === 0) onChange(others);
    else onChange([...others, { kind: 'categorical', attrKey: key, excluded }]);
  };

  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter</div>
        {filters.length > 0 && (
          <button onClick={clearAll} className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold">
            clear all
          </button>
        )}
      </div>

      {dataset.attributes.map((a) => {
        if (a.kind === 'numeric') {
          const stats = numericStats(allRows.map((r) => Number(r[a.key])).filter((n) => Number.isFinite(n)));
          if (!stats) return null;
          const f = numFilters.find((nf) => nf.attrKey === a.key);
          const min = f?.min ?? stats.min;
          const max = f?.max ?? stats.max;
          return (
            <div key={a.key} className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="text-xs font-semibold text-ink mb-2">
                {a.label}
                {a.unit && <span className="text-[10px] text-slate-400 font-normal ml-1">({a.unit})</span>}
              </div>
              <RangeSlider
                min={stats.min}
                max={stats.max}
                value={[min, max]}
                onChange={([lo, hi]) => updateNumeric(a.key, lo, hi)}
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                <span>{min.toFixed(1)}</span>
                <span>{max.toFixed(1)}</span>
              </div>
            </div>
          );
        } else {
          const counts = categoricalCounts(allRows.map((r) => r[a.key] as string | number | null));
          if (counts.size <= 1) return null;
          const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
          const f = catFilters.find((cf) => cf.attrKey === a.key);
          const excluded = f?.excluded ?? new Set<string>();
          return (
            <CategoryFilter
              key={a.key}
              attr={a}
              sorted={sorted}
              excluded={excluded}
              onToggle={(cat) => toggleCategory(a.key, cat)}
            />
          );
        }
      })}
    </div>
  );
}

function CategoryFilter({
  attr,
  sorted,
  excluded,
  onToggle,
}: {
  attr: Attribute;
  sorted: Array<[string, number]>;
  excluded: Set<string>;
  onToggle: (cat: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(([cat]) => cat.toLowerCase().includes(q));
  }, [sorted, query]);

  const overflow = filtered.length > CHIPS_COLLAPSED;
  const visible = expanded || query.trim() ? filtered : filtered.slice(0, CHIPS_COLLAPSED);
  const hiddenCount = filtered.length - visible.length;
  const showSearch = sorted.length > CHIPS_COLLAPSED;

  return (
    <div className="rounded-lg border border-slate-200 p-3 bg-white">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <div className="text-xs font-semibold text-ink">{attr.label}</div>
        <div className="text-[10px] text-slate-400 font-mono shrink-0">{sorted.length} values</div>
      </div>
      {showSearch && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search…"
          className="w-full mb-2 px-2 py-1 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-100 outline-none"
        />
      )}
      <div className="flex flex-wrap gap-1">
        {visible.map(([cat, n]) => {
          const off = excluded.has(cat);
          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                off
                  ? 'bg-slate-100 text-slate-400 line-through'
                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
              }`}
            >
              {cat} <span className="text-[9px] opacity-60">{n}</span>
            </button>
          );
        })}
      </div>
      {overflow && !query.trim() && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[10px] eyebrow text-brand-700 hover:text-accent-700 hover:underline"
        >
          {expanded ? 'show fewer' : `+${hiddenCount} more`}
        </button>
      )}
      {query.trim() && filtered.length === 0 && (
        <div className="text-[10px] text-slate-400 italic mt-1">No matches.</div>
      )}
    </div>
  );
}

function RangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  // Use two stacked inputs as a poor man's range slider — fine for the prototype.
  const [lo, hi] = value;
  return (
    <div className="space-y-1.5">
      <input
        type="range"
        min={min}
        max={max}
        step={(max - min) / 100}
        value={lo}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), hi);
          onChange([v, hi]);
        }}
        className="w-full"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={(max - min) / 100}
        value={hi}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), lo);
          onChange([lo, v]);
        }}
        className="w-full"
      />
    </div>
  );
}
