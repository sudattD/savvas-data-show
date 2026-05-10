import { useMemo, useState } from 'react';
import HostBubble from '../components/HostBubble';
import ActHeader from '../components/ActHeader';
import WindChart from '../components/WindChart';
import Slider from '../components/Slider';
import { quadratic, rSquared } from '../lib/fit';
import { WIND_DATA } from '../data/windTurbine';

interface Act2Props {
  onNext: (data: { a: number; b: number; c: number; r2: number; predicted10: number }) => void;
}

export default function Act2Model({ onNext }: Act2Props) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  const fitData = useMemo(
    () => WIND_DATA.filter((d) => d.windSpeed <= 11.5),
    [],
  );

  const model = useMemo(() => quadratic(a, b, c), [a, b, c]);
  const r2 = useMemo(() => rSquared(fitData, model), [fitData, model]);
  const predicted10 = model(10);

  const fitColor =
    r2 > 0.9 ? 'text-emerald-600' : r2 > 0.75 ? 'text-amber-600' : 'text-rose-600';
  const fitLabel = r2 > 0.9 ? 'Excellent fit' : r2 > 0.75 ? 'Pretty good' : 'Keep tuning';

  return (
    <div className="space-y-6">
      <ActHeader
        act={2}
        title="Fit a curve to the data."
        subtitle="Try a quadratic. Find the parameters that match reality."
      />

      <HostBubble accent="sky">
        We're going to use a <strong>quadratic</strong> — that's{' '}
        <code className="bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded text-sm">
          P = a·v² + b·v + c
        </code>{' '}
        where <em>v</em> is wind speed and <em>P</em> is power. Slide the
        knobs until the orange curve hugs the blue dots. The R² number tells
        you how good your fit is — 1.00 is perfect.
      </HostBubble>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <WindChart model={model} showModel highlightWindSpeed={10} />

        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-5 space-y-5">
          <div>
            <div className="text-xs font-semibold tracking-widest text-slate-500 mb-1">
              YOUR EQUATION
            </div>
            <div className="font-mono text-sm bg-slate-50 px-3 py-2 rounded-lg text-ink leading-relaxed">
              P = <span className="text-sky-700 font-semibold">{a.toFixed(2)}</span>v²
              {b >= 0 ? ' + ' : ' − '}
              <span className="text-sky-700 font-semibold">{Math.abs(b).toFixed(2)}</span>v
              {c >= 0 ? ' + ' : ' − '}
              <span className="text-sky-700 font-semibold">{Math.abs(c).toFixed(2)}</span>
            </div>
          </div>

          <Slider label="a" formula="(v² coefficient)" value={a} min={-5} max={20} step={0.1} onChange={setA} />
          <Slider label="b" formula="(v coefficient)" value={b} min={-50} max={50} step={0.5} onChange={setB} />
          <Slider label="c" formula="(constant)" value={c} min={-100} max={100} step={1} onChange={setC} />

          <div className="border-t border-slate-100 pt-4">
            <div className="text-xs font-semibold tracking-widest text-slate-500 mb-1">
              FIT QUALITY (R²)
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`font-display text-3xl font-bold tabular-nums ${fitColor}`}>
                {r2.toFixed(3)}
              </div>
              <div className={`text-sm font-semibold ${fitColor}`}>{fitLabel}</div>
            </div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  r2 > 0.9 ? 'bg-emerald-500' : r2 > 0.75 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, r2 * 100).toFixed(0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-ink">
        <strong className="text-sky-800">Try this:</strong> set <code className="font-mono">a</code> around{' '}
        <code className="font-mono">12</code>, <code className="font-mono">b</code> near{' '}
        <code className="font-mono">0</code>, <code className="font-mono">c</code> near{' '}
        <code className="font-mono">0</code>. Then nudge until the curve sits in the middle of the cloud.
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNext({ a, b, c, r2, predicted10 })}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition"
        >
          Next: see what your model says →
        </button>
      </div>
    </div>
  );
}
