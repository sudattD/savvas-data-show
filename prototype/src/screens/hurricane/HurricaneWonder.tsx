import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface HurricaneWonderProps {
  onStart: (bucket: PredictionBucket | null) => void;
}

export type PredictionBucket = 'low' | 'mid' | 'high';

const BUCKETS: Array<{ id: PredictionBucket; label: string; description: string }> = [
  { id: 'low', label: 'Under 50%', description: 'Most years are quiet — strong storms are rare.' },
  { id: 'mid', label: '50–80%', description: 'About every other year. Sometimes back-to-back.' },
  { id: 'high', label: 'Over 80%', description: 'Almost every year has one. Cat 4+ is the rule, not the exception.' },
];

const HEADLINE_YEARS = [
  { year: 1992, blurb: '7 storms total. One of them was Andrew (Cat 5, Florida).' },
  { year: 2005, blurb: '27 storms — most on record before 2020. Katrina hit New Orleans.' },
  { year: 2020, blurb: '31 storms. The alphabet ran out — they started using Greek letters.' },
  { year: 2024, blurb: '18 storms. Helene + Milton hit Florida six weeks apart.' },
];

export default function HurricaneWonder({ onStart }: HurricaneWonderProps) {
  const [picked, setPicked] = useState<PredictionBucket | null>(null);

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
            How often does a Cat 4 happen?
          </h1>
          <p className="text-sm text-slate-600">
            Probability from a long-enough history book.
          </p>
        </div>
      </div>

      <HostBubble accent="sky" name="Mira">
        Atlantic hurricane records go back to 1950 — about 75 years of
        every named storm, every wind speed, every landfall. That's a long
        coin to flip. Before you crunch it: in a random year picked from
        that history, what are the odds at least one storm reached Cat 4
        or stronger?
      </HostBubble>

      {/* Headlines */}
      <div className="grid sm:grid-cols-2 gap-2">
        {HEADLINE_YEARS.map((h) => (
          <div key={h.year} className="bg-cyan-50 border border-cyan-200 rounded-xl p-3">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-display text-2xl font-bold text-cyan-900 tabular-nums">{h.year}</div>
              <div className="text-[10px] font-semibold tracking-widest text-cyan-700">A LOUD YEAR</div>
            </div>
            <div className="text-xs text-slate-700 leading-snug mt-1">{h.blurb}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-cyan-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-base font-semibold text-ink">
            What fraction of years since 1950 had <strong>at least one Cat 4+</strong> hurricane?
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {BUCKETS.map((b) => (
            <button
              key={b.id}
              onClick={() => setPicked(b.id)}
              className={`text-left rounded-xl border p-3 transition ${
                picked === b.id
                  ? 'border-cyan-400 ring-2 ring-cyan-100 bg-cyan-50'
                  : 'border-slate-200 bg-white hover:border-cyan-200'
              }`}
            >
              <div className="font-display text-lg font-bold text-cyan-900">{b.label}</div>
              <div className="text-xs text-slate-600 leading-snug mt-1">{b.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          957 named storms · 1950–2024 · NOAA HURDAT2.
        </div>
        <button
          onClick={() => onStart(picked)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Count the history →
        </button>
      </div>
    </div>
  );
}
