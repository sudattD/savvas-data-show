import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { QuakeSummary } from './QuakeMap';
import type { PredictionShape } from './QuakeWonder';

interface QuakeClaimProps {
  summary: QuakeSummary;
  prediction: PredictionShape | null;
  onRestart: () => void;
}

const PREDICTION_LABEL: Record<PredictionShape, string> = {
  random: 'Random scatter',
  even: 'Evenly spread',
  lines: 'Clusters along curves',
  'one-blob': 'One giant blob',
};

export default function QuakeClaim({ summary, prediction, onRestart }: QuakeClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correctPrediction = prediction === 'lines';
  const ringPct = Math.round((summary.ringOfFireCount / summary.totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-rose-700">
            ACT 3 · CLAIM
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            That's the Ring of Fire.
          </h1>
          <p className="text-sm text-slate-600">
            You just found the edges of the Pacific plate using nothing but coordinates.
          </p>
        </div>
      </div>

      <HostBubble accent="rose" name="Sol">
        Every quake you plotted has two numbers — latitude and longitude.
        Just two numbers. But put them all on the same plane and{' '}
        <strong className="tabular-nums">{ringPct}%</strong> of them land
        along a horseshoe-shaped band that geologists named the Pacific
        Ring of Fire. That's geometry doing its quiet job:{' '}
        <strong>coordinates carry meaning</strong>. The chapter is called
        Foundations of Geometry for a reason.
      </HostBubble>

      <div className="grid md:grid-cols-3 gap-3">
        <ResultCard
          label="QUAKES YOU PLOTTED"
          value={summary.shownCount.toString()}
          subtle={`M${summary.minMag.toFixed(1)}+, past 7 days`}
        />
        <ResultCard
          label="ON THE RING OF FIRE"
          value={`${summary.ringOfFireCount}`}
          subtle={`${ringPct}% of the total`}
        />
        <ResultCard
          label="YOUR GUESS"
          value={prediction ? PREDICTION_LABEL[prediction] : '—'}
          subtle={correctPrediction ? 'You called it.' : prediction ? 'The pattern was curves.' : 'No guess saved'}
          tone={correctPrediction ? 'emerald' : 'slate'}
        />
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
        <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-2">
          YOUR ONE-SENTENCE PATTERN
        </div>
        <blockquote className="text-base text-rose-900 italic leading-relaxed">
          "{summary.description || 'No observation written.'}"
        </blockquote>
        <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-rose-200 leading-relaxed">
          What you're describing is plate tectonics — the theory that the
          Earth's crust is broken into a dozen rigid pieces sliding past
          each other. Quakes happen where the pieces meet. You found those
          meeting-lines from a CSV.
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-700 via-orange-700 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="text-[10px] font-semibold tracking-widest text-rose-100 mb-1">
          DATA CARD · GEO · TOPIC 1 · FOUNDATIONS OF GEOMETRY
        </div>
        <h3 className="font-display text-3xl font-bold mb-2">Map Earth's Anger</h3>
        <div className="text-sm text-rose-100 mb-3">
          {summary.shownCount} quakes plotted · {summary.ringOfFireCount} on the Ring of Fire ({ringPct}%)
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="One line for your notebook — what did this show you?"
          className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
          rows={2}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={caption.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-white text-rose-800 font-semibold hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="text-xs text-slate-500 leading-relaxed">
        Reality check: the dataset is the past seven days. The pattern is the
        same whether you take seven days or seventy years — plate boundaries
        are slow on a human time scale. Run the activity again next week and
        the dots will land in the same places.
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  subtle,
  tone = 'rose',
}: {
  label: string;
  value: string;
  subtle: string;
  tone?: 'rose' | 'emerald' | 'slate';
}) {
  const palette = {
    rose: ['border-rose-200', 'bg-rose-50', 'text-rose-700', 'text-rose-900'],
    emerald: ['border-emerald-200', 'bg-emerald-50', 'text-emerald-700', 'text-emerald-900'],
    slate: ['border-slate-200', 'bg-slate-50', 'text-slate-600', 'text-slate-800'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-2xl font-bold ${palette[3]} tabular-nums mt-0.5`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{subtle}</div>
    </div>
  );
}
