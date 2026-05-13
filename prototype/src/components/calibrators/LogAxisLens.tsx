import { useMemo, useState } from 'react';

// A small calibrator: same data on linear and log axes, side-by-side, with a
// "fade between" slider so students can see one scale morph into the other.
// Drop into any dataset story or walkthrough where a log axis earns its keep.

interface Series {
  id: string;
  label: string;
  unit: string;
  description: string;
  yLabel: string;
  data: Array<{ x: number; y: number; label?: string }>;
  /** Sensible numeric span for the linear axis. */
  yLinearMax: number;
  /** Sensible numeric span for the log axis. */
  yLogMin: number;
  yLogMax: number;
  color: string;
}

// Compact built-in demo data — readable at a glance, points named.
const SERIES: Series[] = [
  {
    id: 'moore',
    label: "Moore's Law (transistors)",
    unit: 'transistors',
    description:
      'Microprocessor transistor counts, 1971–2024. Linear: every chip after 1990 is "off the chart." Log: a clean diagonal — the slope is the doubling time.',
    yLabel: 'transistors',
    color: '#7c3aed',
    yLinearMax: 7e10,
    yLogMin: 1e3,
    yLogMax: 1e11,
    data: [
      { x: 1971, y: 2_250, label: '4004' },
      { x: 1978, y: 29_000, label: '8086' },
      { x: 1985, y: 275_000, label: '386' },
      { x: 1993, y: 3_100_000, label: 'Pentium' },
      { x: 2000, y: 42_000_000, label: 'P4' },
      { x: 2008, y: 731_000_000, label: 'Core 2' },
      { x: 2015, y: 3_200_000_000, label: 'Xeon E5' },
      { x: 2020, y: 39_500_000_000, label: 'M1 Ultra' },
      { x: 2024, y: 60_000_000_000, label: 'Blackwell' },
    ],
  },
  {
    id: 'quakes',
    label: 'Earthquake energy',
    unit: 'joules',
    description:
      'Real quakes by released energy. Linear: only the megaquakes are even visible. Log: every quake has a place on the page — and Tohoku 2011 is just two notches above San Francisco 1906.',
    yLabel: 'energy (J)',
    color: '#ef4444',
    yLinearMax: 2e18,
    yLogMin: 1e7,
    yLogMax: 5e18,
    data: [
      { x: 2.5, y: 6.3e7, label: 'felt' },
      { x: 4.0, y: 6.3e10, label: 'damaging' },
      { x: 5.5, y: 1.1e13, label: 'Napa 2014' },
      { x: 6.7, y: 4.5e14, label: 'Northridge 1994' },
      { x: 7.8, y: 2.0e16, label: 'SF 1906' },
      { x: 8.8, y: 6.3e17, label: 'Chile 2010' },
      { x: 9.1, y: 1.8e18, label: 'Tohoku 2011' },
    ],
  },
  {
    id: 'stars',
    label: 'Star distance',
    unit: 'parsecs',
    description:
      'Distances to bright named stars. Linear: Proxima Centauri sits indistinguishably on top of zero. Log: Sun, neighbors, and supergiants finally share the page.',
    yLabel: 'distance (pc)',
    color: '#0ea5e9',
    yLinearMax: 700,
    yLogMin: 1e-6,
    yLogMax: 1000,
    data: [
      { x: 0, y: 4.85e-6, label: 'Sun' },
      { x: 1, y: 1.30, label: 'Proxima' },
      { x: 2, y: 2.64, label: 'Sirius' },
      { x: 3, y: 7.68, label: 'Vega' },
      { x: 4, y: 11.3, label: 'Arcturus' },
      { x: 5, y: 152.7, label: 'Betelgeuse' },
      { x: 6, y: 432.9, label: 'Deneb' },
    ],
  },
];

const W = 320;
const H = 200;
const PAD = { top: 16, right: 12, bottom: 30, left: 50 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function fmtSci(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e6) {
    const exp = Math.floor(Math.log10(abs));
    const mantissa = v / Math.pow(10, exp);
    return `${mantissa.toFixed(0)}e${exp}`;
  }
  if (abs >= 1000) return `${(v / 1000).toFixed(0)}k`;
  if (abs < 0.01) return v.toExponential(0);
  return v.toString();
}

interface LogAxisLensProps {
  /** Default series to show first. */
  defaultSeries?: string;
  /** Optional title override. */
  title?: string;
  /** Embedded mode (slimmer chrome). */
  compact?: boolean;
}

export default function LogAxisLens({ defaultSeries = 'moore', title, compact = false }: LogAxisLensProps) {
  const [activeId, setActiveId] = useState(defaultSeries);
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];

  const xMin = useMemo(() => Math.min(...series.data.map((p) => p.x)), [series]);
  const xMax = useMemo(() => Math.max(...series.data.map((p) => p.x)), [series]);
  const xSpan = xMax - xMin || 1;

  const projectX = (x: number) => PAD.left + ((x - xMin) / xSpan) * PLOT_W;
  const projectYLinear = (y: number) =>
    PAD.top + PLOT_H - (Math.max(0, y) / series.yLinearMax) * PLOT_H;
  const projectYLog = (y: number) => {
    const t =
      (Math.log10(Math.max(series.yLogMin / 2, y)) - Math.log10(series.yLogMin)) /
      (Math.log10(series.yLogMax) - Math.log10(series.yLogMin));
    return PAD.top + PLOT_H - t * PLOT_H;
  };

  const logYTicks = useMemo(() => {
    const ticks: number[] = [];
    const lo = Math.floor(Math.log10(series.yLogMin));
    const hi = Math.ceil(Math.log10(series.yLogMax));
    for (let e = lo; e <= hi; e++) ticks.push(Math.pow(10, e));
    return ticks;
  }, [series]);

  const linearYTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) ticks.push((series.yLinearMax * i) / 4);
    return ticks;
  }, [series]);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${compact ? '' : 'shadow-sm'}`}>
      <div className="px-4 py-3 border-b border-slate-100 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-violet-700">
            CALIBRATOR · LOG AXIS LENS
          </div>
          <div className="font-display font-semibold text-ink text-sm">
            {title ?? 'Same data, two scales. One picture is honest only in one of them.'}
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {SERIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                s.id === activeId
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-0 divide-x divide-slate-100">
        <MiniChart
          axisLabel="Linear"
          series={series}
          ticks={linearYTicks}
          projectX={projectX}
          projectY={projectYLinear}
          xMin={xMin}
          xMax={xMax}
        />
        <MiniChart
          axisLabel="Log₁₀"
          series={series}
          ticks={logYTicks}
          projectX={projectX}
          projectY={projectYLog}
          xMin={xMin}
          xMax={xMax}
          logAxis
        />
      </div>

      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
        {series.description}
      </div>
    </div>
  );
}

function MiniChart({
  axisLabel,
  series,
  ticks,
  projectX,
  projectY,
  xMin,
  xMax,
  logAxis = false,
}: {
  axisLabel: string;
  series: Series;
  ticks: number[];
  projectX: (x: number) => number;
  projectY: (y: number) => number;
  xMin: number;
  xMax: number;
  logAxis?: boolean;
}) {
  return (
    <div className="p-2">
      <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-1 ml-12">
        {axisLabel} y-axis
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
        {/* Axes */}
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#94a3b8" strokeWidth={0.6} />
        <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={PAD.top + PLOT_H} y2={PAD.top + PLOT_H} stroke="#94a3b8" strokeWidth={0.6} />

        {/* Y ticks + grid */}
        {ticks.map((t) => {
          const y = projectY(t);
          if (y < PAD.top - 1 || y > PAD.top + PLOT_H + 1) return null;
          return (
            <g key={`${axisLabel}-y-${t}`}>
              <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={0.5} />
              <text x={PAD.left - 5} y={y + 3} fontSize={8} textAnchor="end" fill="#64748b" fontFamily="monospace">
                {logAxis ? `10^${Math.round(Math.log10(t))}` : fmtSci(t)}
              </text>
            </g>
          );
        })}

        {/* X ticks at endpoints + midpoint */}
        {[xMin, (xMin + xMax) / 2, xMax].map((t, i) => (
          <text
            key={`xt-${i}`}
            x={projectX(t)}
            y={PAD.top + PLOT_H + 14}
            fontSize={8}
            textAnchor="middle"
            fill="#64748b"
            fontFamily="monospace"
          >
            {t % 1 === 0 ? t : t.toFixed(1)}
          </text>
        ))}

        {/* Points + labels */}
        {series.data.map((p, i) => {
          const cx = projectX(p.x);
          const cy = projectY(p.y);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={3.5} fill={series.color} fillOpacity={0.85} stroke="#fff" strokeWidth={0.7} />
              {p.label && (
                <text x={cx + 5} y={cy - 4} fontSize={7} fill="#475569">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
