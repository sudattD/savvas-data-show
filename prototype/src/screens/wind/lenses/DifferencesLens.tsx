import { useMemo } from 'react';
import { WIND_DATA } from '../../../data/windTurbine';
import { CUT_IN_SPEED, RATED_SPEED } from '../regimes';
import { binnedMeans, differences } from '../quadFit';
import type { DifferencesLensState } from './types';

interface DifferencesLensProps {
  state: DifferencesLensState;
  onChange: (next: DifferencesLensState) => void;
}

const RAMP_UP_DATA = WIND_DATA.filter(
  (d) => d.windSpeed >= CUT_IN_SPEED && d.windSpeed < RATED_SPEED,
);

function fmt(v: number): string {
  return Number.isFinite(v) ? v.toFixed(0) : '—';
}

export default function DifferencesLens({ state, onChange }: DifferencesLensProps) {
  const { bins } = state;
  const binData = useMemo(
    () => binnedMeans(RAMP_UP_DATA, CUT_IN_SPEED, RATED_SPEED, bins),
    [bins],
  );
  const means = binData.map((b) => b.mean);
  const { first, second } = useMemo(() => differences(means), [means]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-600">
            Split the ramp-up zone into equal wind-speed bins
          </span>
          <span className="font-mono font-bold text-sky-700">{bins} bins</span>
        </div>
        <input
          type="range"
          min={4}
          max={9}
          step={1}
          value={bins}
          onChange={(e) => onChange({ ...state, bins: Number(e.target.value) })}
          className="w-full accent-sky-600"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-semibold tracking-widest text-slate-500">
              <th className="text-left px-4 py-2">WIND ≈ (m/s)</th>
              <th className="text-right px-4 py-2">MEAN POWER (kW)</th>
              <th className="text-right px-4 py-2">1ST DIFF (Δ)</th>
              <th className="text-right px-4 py-2 bg-sky-50 text-sky-700">2ND DIFF (ΔΔ)</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {binData.map((b, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">{b.mid.toFixed(1)}</td>
                <td className="px-4 py-2 text-right font-semibold text-ink">{fmt(b.mean)}</td>
                <td className="px-4 py-2 text-right text-slate-600">
                  {i >= 1 ? fmt(first[i - 1]) : ''}
                </td>
                <td className="px-4 py-2 text-right bg-sky-50/60 font-semibold text-sky-800">
                  {i >= 2 ? fmt(second[i - 2]) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Because the bins are equally spaced, the second differences are the
        tell. A <strong>line</strong> has constant <em>first</em> differences;
        a <strong>quadratic</strong> has constant <em>second</em> differences.
        Real sensor data is noisy, so look for "roughly constant," not
        identical.
      </p>
    </div>
  );
}
