// Color scale for the wind activity, keyed to the operating regimes in
// regimes.ts. Cut-in is a quiet slate (the turbine is asleep), ramp-up is
// the active blue of the working curve, rated is amber (the protective
// ceiling). Bands use translucent tints of the same hues.

import type { RegimeId } from './regimes';
import { REGIMES, regimeOf } from './regimes';

// Solid dot / line colors.
export const REGIME_COLOR: Record<RegimeId, string> = {
  cutIn: '#94a3b8', // slate-400
  rampUp: '#2563eb', // blue-600
  rated: '#f59e0b', // amber-500
};

// Translucent band-background fills for the scatter.
export const REGIME_BAND_FILL: Record<RegimeId, string> = {
  cutIn: 'rgba(148,163,184,0.10)',
  rampUp: 'rgba(37,99,235,0.07)',
  rated: 'rgba(245,158,11,0.10)',
};

// Single accent used when dots are NOT colored by regime (Act 1 reveal).
export const DOT_COLOR = '#2563eb';

export function regimeColor(windSpeed: number): string {
  return REGIME_COLOR[regimeOf(windSpeed).id];
}

// Inline legend students see beside the scatter. `tone` flips label color
// for dark surfaces.
export function RegimeLegend({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const labelColor = tone === 'dark' ? 'text-slate-200' : 'text-slate-600';
  return (
    <div className={`flex flex-wrap items-center gap-3 text-[10px] font-semibold tracking-wider ${labelColor}`}>
      <span>REGIME:</span>
      {REGIMES.map((r) => (
        <LegendDot key={r.id} color={REGIME_COLOR[r.id]} label={`${r.short} · ${bandText(r.min, r.max)}`} />
      ))}
    </div>
  );
}

function bandText(min: number, max: number): string {
  if (max >= 30) return `${min}+ m/s`;
  if (min === 0) return `< ${max} m/s`;
  return `${min}–${max} m/s`;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-medium tracking-normal">{label}</span>
    </span>
  );
}
