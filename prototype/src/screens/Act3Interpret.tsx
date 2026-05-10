import { useMemo, useState } from 'react';
import HostBubble from '../components/HostBubble';
import ActHeader from '../components/ActHeader';
import WindChart from '../components/WindChart';
import { quadratic } from '../lib/fit';
import { WIND_DATA } from '../data/windTurbine';

interface Act3Props {
  state: {
    conjecture: string;
    low: number;
    high: number;
    a: number;
    b: number;
    c: number;
    r2: number;
    predicted10: number;
  };
  onRestart: () => void;
}

export default function Act3Interpret({ state, onRestart }: Act3Props) {
  const { low, high, a, b, c, r2, predicted10 } = state;
  const model = useMemo(() => quadratic(a, b, c), [a, b, c]);

  const measuredAt10 = useMemo(() => {
    const near = WIND_DATA.filter((d) => d.windSpeed >= 9.5 && d.windSpeed <= 10.5);
    if (near.length === 0) return null;
    return near.reduce((s, d) => s + d.power, 0) / near.length;
  }, []);

  const ratedPower = 1500;
  const inBounds = predicted10 >= low && predicted10 <= high;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <ActHeader
        act={3}
        title="What does it mean?"
        subtitle="Compare your bounds to your model. Then meet reality."
      />

      <HostBubble accent="sky">
        Let's see how you did. You said the answer would be between{' '}
        <strong>{low.toFixed(0)}</strong> and{' '}
        <strong>{high.toFixed(0)}</strong> kW at 10 m/s. Your quadratic model
        predicts <strong>{predicted10.toFixed(0)} kW</strong>. The real
        turbine, averaged over many readings near 10 m/s, was{' '}
        <strong>{measuredAt10?.toFixed(0)} kW</strong>.
      </HostBubble>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Your bounds" value={`${low.toFixed(0)} – ${high.toFixed(0)}`} unit="kW" tone="amber" />
        <Stat
          label="Your model says"
          value={predicted10.toFixed(0)}
          unit="kW"
          tone={inBounds ? 'emerald' : 'rose'}
          sub={inBounds ? 'Inside your bounds' : 'Outside your bounds'}
        />
        <Stat
          label="The real turbine"
          value={measuredAt10?.toFixed(0) ?? '—'}
          unit="kW"
          tone="sky"
          sub={`R² of your fit = ${r2.toFixed(3)}`}
        />
      </div>

      <WindChart model={model} showModel guessLow={low} guessHigh={high} highlightWindSpeed={10} />

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-3">
        <h2 className="font-display text-xl font-bold text-ink">
          The story behind the curve
        </h2>
        <p className="text-sm text-ink leading-relaxed">
          The wind has kinetic energy. A turbine pulls some of that energy out as
          electricity. The math says the power available in the wind grows with{' '}
          <em>v³</em> — but mechanical losses, drag, and the fact that you can't
          extract <em>all</em> of it (Betz limit: ~59%) bend the curve back. In
          the range we modeled (3–11 m/s), a quadratic is a great approximation.
        </p>
        <p className="text-sm text-ink leading-relaxed">
          But notice what happens around <strong>{ratedPower} kW</strong>. The
          curve <em>flattens</em>. That's not a math fact — it's a{' '}
          <strong>design choice</strong>. The turbine's generator can't handle
          more, so above ~12 m/s the blades pitch to{' '}
          <strong>spill</strong> the extra wind. A model is a story about data
          — and where the model breaks tells you something interesting about
          the world.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <strong className="text-amber-800">Try this next:</strong> push your
          slider beyond 12 m/s and watch your quadratic predict{' '}
          <em>way more</em> than the turbine actually makes. That's where this
          model stops being useful.
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-display text-2xl font-bold tracking-tight">
            08
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold tracking-widest text-sky-200 mb-1">
              DATA CARD #08 · QUADRATIC FUNCTIONS
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">Wind Power Curve</h3>
            <p className="text-sm text-sky-100 mb-4">
              Real SCADA data from a 1.5 MW turbine. You fit a quadratic with
              R² = {r2.toFixed(3)}.
            </p>
            <div className="flex flex-wrap gap-2">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-4 py-2 rounded-lg bg-white text-sky-800 font-semibold hover:bg-sky-50 transition"
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
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  tone,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  tone: 'amber' | 'emerald' | 'rose' | 'sky';
  sub?: string;
}) {
  const toneClass = {
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
    sky: 'border-sky-200 bg-sky-50 text-sky-900',
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs font-semibold tracking-widest opacity-70 mb-1">{label}</div>
      <div className="font-display text-3xl font-bold tabular-nums">
        {value} <span className="text-base font-medium opacity-60">{unit}</span>
      </div>
      {sub && <div className="text-xs mt-1 opacity-80">{sub}</div>}
    </div>
  );
}
