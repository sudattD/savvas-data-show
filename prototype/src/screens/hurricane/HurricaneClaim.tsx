import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { HurricaneTally } from './HurricaneCount';
import type { PredictionBucket } from './HurricaneWonder';

interface HurricaneClaimProps {
  tally: HurricaneTally;
  prediction: PredictionBucket | null;
  onRestart: () => void;
}

const PREDICTION_LABEL: Record<PredictionBucket, string> = {
  low: 'Under 50%',
  mid: '50–80%',
  high: 'Over 80%',
};

function bucketContains(bucket: PredictionBucket, p: number): boolean {
  if (bucket === 'low') return p < 0.5;
  if (bucket === 'mid') return p >= 0.5 && p <= 0.8;
  return p > 0.8;
}

export default function HurricaneClaim({ tally, prediction, onRestart }: HurricaneClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const correctPrediction = prediction !== null && bucketContains(prediction, tally.pYear);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-cyan-700">
            ACT 3 · CLAIM
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            That's empirical probability.
          </h1>
          <p className="text-sm text-slate-600">
            Count the events. Divide by the trials. Done.
          </p>
        </div>
      </div>

      <HostBubble accent="sky">
        You just computed two probabilities from real history — no formula,
        no theory, just counting. A coin or a die has{' '}
        <em>theoretical</em> probabilities (½, ⅙) we can derive from
        symmetry. Hurricanes don't. The only way to know how often a Cat 4
        forms is to count past Cat 4s. That's the difference your chapter
        is teaching: when the math is missing, the data fills in.
      </HostBubble>

      <div className="grid md:grid-cols-2 gap-3">
        <ResultCard
          label={`P(YEAR HAS ≥ 1 ${tally.minCategoryLabel.toUpperCase()})`}
          value={`${(tally.pYear * 100).toFixed(1)}%`}
          subtle={`${tally.qualifyingYears} of ${tally.totalYears} years`}
          tone="amber"
        />
        <ResultCard
          label={`P(ANY ${tally.minCategoryLabel.toUpperCase()})`}
          value={`${(tally.pStorm * 100).toFixed(1)}%`}
          subtle={`${tally.qualifyingStorms} of ${tally.totalStorms} storms`}
          tone="cyan"
        />
      </div>

      {prediction && (
        <div className={`rounded-xl border p-4 text-sm ${
          correctPrediction ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="text-[10px] font-semibold tracking-widest mb-1">
            {correctPrediction ? 'YOU CALLED IT' : 'YOUR GUESS WAS'}
          </div>
          <div className="text-base">
            <strong>{PREDICTION_LABEL[prediction]}</strong> · the truth was{' '}
            <strong className="tabular-nums">{(tally.pYear * 100).toFixed(1)}%</strong>
            {correctPrediction
              ? ' — your bucket contained the real answer.'
              : ' — the real number landed outside your bucket. Worth a second guess at a new severity.'}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-cyan-700 via-sky-700 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="text-[10px] font-semibold tracking-widest text-cyan-100 mb-1">
          DATA CARD · GEO · TOPIC 12 · PROBABILITY
        </div>
        <h3 className="font-display text-3xl font-bold mb-3">The Hurricane Coin</h3>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
          <div className="text-center mb-2">
            <div className="text-[10px] font-semibold tracking-widest text-cyan-100">YOUR THRESHOLD</div>
            <div className="font-display text-xl font-bold">{tally.minCategoryLabel}+</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-white/20">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-cyan-100">PER YEAR</div>
              <div className="font-display text-2xl font-bold tabular-nums">{(tally.pYear * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-cyan-100">PER STORM</div>
              <div className="font-display text-2xl font-bold tabular-nums">{(tally.pStorm * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="One sentence — which of those two probabilities matters more for an insurance company?"
          className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
          rows={2}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={caption.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-white text-cyan-800 font-semibold hover:bg-cyan-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save to my notebook
            </button>
          ) : (
            <div className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">
              Saved to notebook
            </div>
          )}
          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  subtle,
  tone,
}: {
  label: string;
  value: string;
  subtle: string;
  tone: 'cyan' | 'amber';
}) {
  const palette = {
    cyan: ['border-cyan-200', 'bg-cyan-50', 'text-cyan-700', 'text-cyan-900'],
    amber: ['border-amber-200', 'bg-amber-50', 'text-amber-700', 'text-amber-900'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-3xl font-bold ${palette[3]} tabular-nums mt-1`}>{value}</div>
      <div className="text-xs text-slate-600 mt-1 tabular-nums">{subtle}</div>
    </div>
  );
}
