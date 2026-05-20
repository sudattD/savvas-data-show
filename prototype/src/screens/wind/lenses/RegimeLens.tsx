import { useMemo } from 'react';
import { WIND_DATA } from '../../../data/windTurbine';
import { quadratic, rSquared } from '../../../lib/fit';
import PowerCurveScatter from '../PowerCurveScatter';
import { REGIMES, regimeOf } from '../regimes';
import type { RegimeId } from '../regimes';
import { REGIME_COLOR } from '../windColors';
import { fitQuadratic } from '../quadFit';
import type { RegimeLensState } from './types';

interface RegimeLensProps {
  state: RegimeLensState;
  onChange: (next: RegimeLensState) => void;
}

export default function RegimeLens({ state, onChange }: RegimeLensProps) {
  const included = state.included;

  // Least-squares quadratic on whatever regimes the student has switched on,
  // scored against those same points. Add the flat zones and the fit decays.
  const { model, r2, subsetCount } = useMemo(() => {
    const subset = WIND_DATA.filter((d) => included.includes(regimeOf(d.windSpeed).id));
    const coeffs = fitQuadratic(subset);
    const m = quadratic(coeffs.a, coeffs.b, coeffs.c);
    return { model: m, r2: rSquared(subset, m), subsetCount: subset.length };
  }, [included]);

  const toggle = (id: RegimeId) => {
    const next = included.includes(id)
      ? included.filter((x) => x !== id)
      : [...included, id];
    // Never let the student fit nothing.
    if (next.length === 0) return;
    onChange({ ...state, included: next });
  };

  const r2Color =
    r2 > 0.9 ? 'text-emerald-600' : r2 > 0.6 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-2">
          INCLUDE THESE ZONES IN THE FIT
        </div>
        <div className="flex flex-wrap gap-2">
          {REGIMES.map((r) => {
            const on = included.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => toggle(r.id)}
                aria-pressed={on}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                  on
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
                style={on ? { backgroundColor: REGIME_COLOR[r.id] } : undefined}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: on ? 'rgba(255,255,255,0.85)' : REGIME_COLOR[r.id] }}
                />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <PowerCurveScatter
          points={WIND_DATA}
          aspectRatio={16 / 9}
          colorByRegime
          regimeBands
          model={model}
          modelDomain={[0, 18]}
          ratedLine
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-600 leading-snug">
          Best-fit quadratic over{' '}
          <strong>
            {included.length} zone{included.length === 1 ? '' : 's'}
          </strong>{' '}
          · {subsetCount} readings
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold tracking-widest text-slate-500">R²</div>
          <div className={`font-display text-3xl font-bold tabular-nums ${r2Color}`}>
            {r2.toFixed(3)}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Watch R² as you add zones. A quadratic is the right model for the
        ramp-up zone — fold in the flat cut-in or rated zones and the same
        curve can no longer keep up.
      </p>
    </div>
  );
}
