import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

export interface HurricaneTally {
  minCategoryIndex: number; // 0 = Tropical Storm and up, 5 = Cat 5 only
  minCategoryLabel: string;
  qualifyingStorms: number;
  totalStorms: number;
  qualifyingYears: number;
  totalYears: number;
  pYear: number;
  pStorm: number;
}

interface HurricaneCountProps {
  onNext: (tally: HurricaneTally) => void;
}

// Severity ladder — order matters for the slider semantics
const CATEGORIES = [
  { label: 'Tropical Storm', color: '#0ea5e9' },
  { label: 'Cat 1', color: '#22d3ee' },
  { label: 'Cat 2', color: '#fde047' },
  { label: 'Cat 3', color: '#fb923c' },
  { label: 'Cat 4', color: '#f43f5e' },
  { label: 'Cat 5', color: '#7c1d6f' },
];

function categoryIndex(label: string): number {
  const i = CATEGORIES.findIndex((c) => c.label === label);
  return i < 0 ? 0 : i;
}

interface StormRow {
  year: number;
  catIdx: number;
}

export default function HurricaneCount({ onNext }: HurricaneCountProps) {
  const dataset = getDataset('hurricanes');
  const storms = useMemo<StormRow[]>(
    () =>
      dataset.rows.map((r) => ({
        year: Number(r.year),
        catIdx: categoryIndex(String(r.category ?? 'Tropical Storm')),
      })),
    [dataset],
  );

  const years = useMemo(() => {
    const min = Math.min(...storms.map((s) => s.year));
    const max = Math.max(...storms.map((s) => s.year));
    const arr: number[] = [];
    for (let y = min; y <= max; y++) arr.push(y);
    return arr;
  }, [storms]);

  // Storms by year (always full counts)
  const stormsByYear = useMemo(() => {
    const m = new Map<number, StormRow[]>();
    for (const s of storms) {
      const arr = m.get(s.year) ?? [];
      arr.push(s);
      m.set(s.year, arr);
    }
    return m;
  }, [storms]);

  const [minCatIdx, setMinCatIdx] = useState(4); // default: Cat 4+

  const filtered = useMemo(() => {
    const qualifyingStorms = storms.filter((s) => s.catIdx >= minCatIdx);
    const qualifyingYearsSet = new Set(qualifyingStorms.map((s) => s.year));
    return {
      qualifyingStorms: qualifyingStorms.length,
      qualifyingYears: qualifyingYearsSet.size,
      qualifyingYearsSet,
    };
  }, [storms, minCatIdx]);

  const totalStorms = storms.length;
  const totalYears = years.length;
  const pYear = filtered.qualifyingYears / totalYears;
  const pStorm = filtered.qualifyingStorms / totalStorms;

  const minLabel = CATEGORIES[minCatIdx].label;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-cyan-700">
            ACT 2 · COUNT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Frequency turns into probability.
          </h1>
          <p className="text-sm text-slate-600">
            Slide the severity threshold. Watch two probabilities update.
          </p>
        </div>
      </div>

      <HostBubble accent="sky">
        Every cell below is a year — 75 of them. Each colored stripe is one
        storm, brightest for the strongest. Slide the threshold up and
        you'll see which years "qualify" — meaning at least one storm of
        that strength or above. The two big numbers count the same thing
        in two different ways.
      </HostBubble>

      {/* Threshold slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-cyan-700">SEVERITY THRESHOLD</div>
            <div className="text-sm text-ink">
              Count storms of <strong>{minLabel}</strong> or stronger.
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-md text-white font-semibold text-sm shadow"
            style={{ background: CATEGORIES[minCatIdx].color }}
          >
            {minLabel}+
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={CATEGORIES.length - 1}
          step={1}
          value={minCatIdx}
          onChange={(e) => setMinCatIdx(Number(e.target.value))}
          className="w-full accent-cyan-600"
        />
        <div className="grid grid-cols-6 text-[10px] font-mono text-slate-600 mt-1 text-center">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setMinCatIdx(i)}
              className={`hover:text-cyan-700 ${i === minCatIdx ? 'text-cyan-700 font-bold' : ''}`}
            >
              {c.label.startsWith('Cat') ? c.label.replace('Cat ', 'C') : 'TS'}
            </button>
          ))}
        </div>
      </div>

      {/* Year grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-[10px] font-semibold tracking-widest text-cyan-700 mb-2">
          ONE CELL PER YEAR · 1950 – 2024
        </div>
        <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
          {years.map((y) => (
            <YearCell
              key={y}
              year={y}
              storms={stormsByYear.get(y) ?? []}
              minCatIdx={minCatIdx}
              qualifies={filtered.qualifyingYearsSet.has(y)}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-cyan-300 bg-cyan-50 inline-block" />
            qualifies
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-slate-200 bg-slate-50 inline-block" />
            does not
          </span>
          <span className="text-slate-500 italic">tick marks within each cell = storms ≥ threshold that year</span>
        </div>
      </div>

      {/* Probability cards */}
      <div className="grid md:grid-cols-2 gap-3">
        <ProbCard
          label="P(YEAR HAS ≥ 1 STORM)"
          formula={`${filtered.qualifyingYears} of ${totalYears} years`}
          value={pYear}
          tone="amber"
        />
        <ProbCard
          label="P(ANY GIVEN STORM)"
          formula={`${filtered.qualifyingStorms} of ${totalStorms} named storms`}
          value={pStorm}
          tone="cyan"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
        Two probabilities describe the same data — but they answer
        different questions. "In a random year, what's the chance you see
        one?" is a much higher number than "On any single storm forming,
        what's the chance it's that strong?" Both are real. Which one does
        the news headline usually report?
      </div>

      <div className="flex justify-end">
        <button
          onClick={() =>
            onNext({
              minCategoryIndex: minCatIdx,
              minCategoryLabel: minLabel,
              qualifyingStorms: filtered.qualifyingStorms,
              totalStorms,
              qualifyingYears: filtered.qualifyingYears,
              totalYears,
              pYear,
              pStorm,
            })
          }
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          What this means →
        </button>
      </div>
    </div>
  );
}

function YearCell({
  year,
  storms,
  minCatIdx,
  qualifies,
}: {
  year: number;
  storms: StormRow[];
  minCatIdx: number;
  qualifies: boolean;
}) {
  // Storms ≥ threshold, sorted strongest-first for tick visualization
  const tickStorms = storms.filter((s) => s.catIdx >= minCatIdx).sort((a, b) => b.catIdx - a.catIdx);
  return (
    <div
      className={`relative aspect-square rounded-sm border ${
        qualifies ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-slate-50'
      }`}
      title={`${year}: ${storms.length} storm${storms.length === 1 ? '' : 's'} (${tickStorms.length} ≥ ${CATEGORIES[minCatIdx].label})`}
    >
      <div className="absolute inset-x-0 bottom-0 px-0.5 flex gap-0.5 items-end">
        {tickStorms.slice(0, 6).map((s, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              background: CATEGORIES[s.catIdx].color,
              height: `${30 + s.catIdx * 10}%`,
              minHeight: 2,
            }}
          />
        ))}
      </div>
      {year % 10 === 0 && (
        <div className="absolute top-0 left-0 text-[8px] font-mono text-slate-400 leading-none pt-0.5 pl-0.5">
          {year}
        </div>
      )}
    </div>
  );
}

function ProbCard({
  label,
  formula,
  value,
  tone,
}: {
  label: string;
  formula: string;
  value: number;
  tone: 'cyan' | 'amber';
}) {
  const palette = {
    cyan: ['border-cyan-200', 'bg-cyan-50', 'text-cyan-700', 'text-cyan-900'],
    amber: ['border-amber-200', 'bg-amber-50', 'text-amber-700', 'text-amber-900'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-4xl font-black ${palette[3]} tabular-nums mt-1`}>
        {(value * 100).toFixed(1)}%
      </div>
      <div className="text-xs text-slate-600 mt-1 tabular-nums">{formula}</div>
    </div>
  );
}
