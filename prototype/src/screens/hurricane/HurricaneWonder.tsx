import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

interface HurricaneWonderProps {
  onStart: (guessCount: number | null) => void;
}

const HEADLINE_YEARS: Array<{ year: number; note: string }> = [
  { year: 1992, note: 'Andrew' },
  { year: 2005, note: 'Katrina' },
  { year: 2020, note: 'ran out of letters' },
  { year: 2024, note: 'Helene + Milton' },
];

export default function HurricaneWonder({ onStart }: HurricaneWonderProps) {
  const dataset = getDataset('hurricanes');

  const years = useMemo(() => {
    const ys = dataset.rows.map((r) => Number(r.year));
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const arr: number[] = [];
    for (let y = min; y <= max; y++) arr.push(y);
    return arr;
  }, [dataset]);

  const total = years.length;
  const headlineYears = useMemo(() => new Set(HEADLINE_YEARS.map((h) => h.year)), []);
  const [guess, setGuess] = useState<number | null>(null);

  const sliderValue = guess ?? Math.round(total / 2);
  const pct = guess === null ? null : Math.round((guess / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-cyan-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            {total} seasons. {total} coin flips.
          </h1>
          <p className="text-sm text-slate-600">
            How many came up Cat 4 or stronger?
          </p>
        </div>
      </div>

      <HostBubble accent="sky">
        Atlantic hurricane records go back to {years[0]} — {total} seasons
        on the books. Treat each one like a coin flip: <em>heads</em> = at
        least one storm hit <strong>Cat 4 or stronger</strong>, <em>tails</em>{' '}
        = nothing that bad. Before you crunch the history, how many of
        these {total} coins do you think came up heads?
      </HostBubble>

      {/* The coin board */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-5 md:p-6 shadow-inner border border-slate-800">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <div className="text-[10px] font-semibold tracking-widest text-amber-200">
            THE HURRICANE COIN · {years[0]}–{years[years.length - 1]}
          </div>
          <div className="text-[10px] font-mono text-slate-400 tabular-nums">
            gold = your guess · dark = still face-down
          </div>
        </div>
        <CoinRow years={years} headlineYears={headlineYears} headsCount={sliderValue} dim={guess === null} />
        <div
          className="grid gap-1.5 mt-1.5 text-[9px] font-mono text-slate-500 tabular-nums"
          style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
        >
          {years.map((y) => (
            <div key={y} className="text-center">
              {y % 10 === 0 ? String(y) : ''}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {HEADLINE_YEARS.map((h) => (
            <span
              key={h.year}
              className="inline-flex items-baseline gap-1.5 px-2 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-xs"
            >
              <strong className="font-display font-bold text-amber-300 tabular-nums">
                {h.year}
              </strong>
              <span className="text-slate-300">{h.note}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Guess slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-cyan-700">
              YOUR GUESS
            </div>
            <div className="text-base font-semibold text-ink">
              Of the {total} seasons, how many had a <strong>Cat 4+</strong>?
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl font-black text-cyan-900 tabular-nums leading-none">
              {guess === null ? '—' : guess}
              <span className="text-base font-normal text-slate-500"> / {total}</span>
            </div>
            <div className="text-xs text-slate-500 tabular-nums mt-1">
              {pct === null ? 'drag the slider' : `≈ ${pct}% of years`}
            </div>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={total}
          step={1}
          value={sliderValue}
          onChange={(e) => setGuess(Number(e.target.value))}
          className="w-full accent-cyan-600"
          aria-label="Predicted number of seasons with a Cat 4 or stronger"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0 — never</span>
          <span className="tabular-nums">{Math.round(total / 2)}</span>
          <span>{total} — every year</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          957 named storms · NOAA HURDAT2 · {years[0]}–{years[years.length - 1]}.
        </div>
        <button
          onClick={() => onStart(guess)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={guess === null}
        >
          Flip the coins →
        </button>
      </div>
    </div>
  );
}

function CoinRow({
  years,
  headlineYears,
  headsCount,
  dim,
}: {
  years: number[];
  headlineYears: Set<number>;
  headsCount: number;
  dim: boolean;
}) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
    >
      {years.map((y, i) => {
        const isHeads = !dim && i < headsCount;
        const isHeadline = headlineYears.has(y);
        return (
          <div
            key={y}
            title={`${y}`}
            className={`aspect-square rounded-full shadow ${
              isHeadline ? 'ring-2 ring-amber-300/60 ring-offset-2 ring-offset-slate-900' : ''
            }`}
            style={{
              background: isHeads
                ? 'radial-gradient(circle at 30% 30%, #fef3c7 0%, #f59e0b 55%, #b45309 100%)'
                : 'radial-gradient(circle at 30% 30%, #475569 0%, #1e293b 60%, #0f172a 100%)',
              border: isHeads
                ? '1px solid rgba(180,83,9,0.6)'
                : '1px solid rgba(0,0,0,0.5)',
              transition: 'background 120ms ease',
            }}
          />
        );
      })}
    </div>
  );
}
