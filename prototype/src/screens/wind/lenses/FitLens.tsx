import { useMemo } from 'react';
import { WIND_DATA } from '../../../data/windTurbine';
import { quadratic, rSquared } from '../../../lib/fit';
import PowerCurveScatter from '../PowerCurveScatter';
import { CUT_IN_SPEED, RATED_SPEED } from '../regimes';
import type { FitLensState } from './types';

interface FitLensProps {
  state: FitLensState;
  onChange: (next: FitLensState) => void;
}

// The quadratic is meant to model the ramp-up zone, so that's where R² is
// scored — fitting it against the flat rated zone would punish a good model
// for the turbine's design ceiling.
const RAMP_UP_DATA = WIND_DATA.filter(
  (d) => d.windSpeed >= CUT_IN_SPEED && d.windSpeed < RATED_SPEED,
);

export default function FitLens({ state, onChange }: FitLensProps) {
  const { a, b, c } = state;
  const model = useMemo(() => quadratic(a, b, c), [a, b, c]);
  const r2 = useMemo(() => rSquared(RAMP_UP_DATA, model), [model]);

  const r2Color =
    r2 > 0.9 ? 'text-emerald-600' : r2 > 0.75 ? 'text-amber-600' : 'text-rose-600';
  const r2Label =
    r2 > 0.9 ? 'Excellent fit' : r2 > 0.75 ? 'Pretty good' : 'Keep tuning';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <PowerCurveScatter
          points={WIND_DATA}
          aspectRatio={16 / 9}
          model={model}
          modelDomain={[0, 18]}
          fitZone={[CUT_IN_SPEED, RATED_SPEED]}
        />
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="text-[10px] font-semibold tracking-widest text-sky-700">
            YOUR EQUATION
          </div>
          <div className="font-mono text-sm text-ink bg-sky-50 rounded-lg px-3 py-2">
            P = {a.toFixed(2)}·v² {b >= 0 ? '+' : '−'} {Math.abs(b).toFixed(1)}·v{' '}
            {c >= 0 ? '+' : '−'} {Math.abs(c).toFixed(0)}
          </div>
          <Slider label="a — curvature" value={a} min={0} max={20} step={0.25} onChange={(v) => onChange({ ...state, a: v })} />
          <Slider label="b — tilt" value={b} min={-60} max={120} step={2} onChange={(v) => onChange({ ...state, b: v })} />
          <Slider label="c — offset" value={c} min={-300} max={300} step={10} onChange={(v) => onChange({ ...state, c: v })} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 grid place-items-center min-w-[140px]">
          <div className="text-center">
            <div className="text-[10px] font-semibold tracking-widest text-slate-500">
              R² · RAMP-UP ZONE
            </div>
            <div className={`font-display text-4xl font-bold tabular-nums ${r2Color}`}>
              {r2.toFixed(3)}
            </div>
            <div className={`text-xs font-semibold ${r2Color}`}>{r2Label}</div>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        R² is scored on the ramp-up zone (the shaded band) — that's the stretch
        a quadratic is meant to model. 1.000 would be a perfect fit.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className="font-mono font-bold text-sky-700 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
      />
    </div>
  );
}
