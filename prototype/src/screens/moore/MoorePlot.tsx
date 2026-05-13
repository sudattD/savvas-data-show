import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

export interface MooreFit {
  doublingMonths: number;
  r2: number;
}

interface MoorePlotProps {
  guess: number | null;
  onNext: (fit: MooreFit) => void;
}

const VB_W = 720;
const VB_H = 420;
const PAD = { top: 24, right: 24, bottom: 56, left: 64 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;

const DECADE_COLOR: Record<string, string> = {
  '1970s': '#a78bfa',
  '1980s': '#60a5fa',
  '1990s': '#34d399',
  '2000s': '#fbbf24',
  '2010s': '#f97316',
  '2020s': '#f43f5e',
};

export default function MoorePlot({ guess, onNext }: MoorePlotProps) {
  const dataset = getDataset('moore');
  const points = useMemo(
    () =>
      dataset.rows.map((r) => ({
        name: String(r.name ?? ''),
        year: Number(r.year),
        transistors: Number(r.transistors),
        decade: String(r.decade ?? ''),
      })),
    [dataset],
  );

  const [logAxis, setLogAxis] = useState(false);
  // Doubling time in months. 24 = Moore's original 1965 conjecture.
  const [doublingMonths, setDoublingMonths] = useState(24);

  const xMin = 1970;
  const xMax = 2025;
  const yLinearMax = 7e10;
  const yLogMin = 1e3;
  const yLogMax = 1e11;

  const projectX = (yr: number) => PAD.left + ((yr - xMin) / (xMax - xMin)) * PLOT_W;
  const projectY = (t: number) => {
    if (logAxis) {
      const tt =
        (Math.log10(Math.max(yLogMin / 2, t)) - Math.log10(yLogMin)) /
        (Math.log10(yLogMax) - Math.log10(yLogMin));
      return PAD.top + PLOT_H - tt * PLOT_H;
    }
    return PAD.top + PLOT_H - (Math.min(t, yLinearMax) / yLinearMax) * PLOT_H;
  };

  // Student's fit line: T(year) = T₀ · 2^((year - 1971)·12 / doublingMonths)
  // Anchored at (1971, 2250) — the Intel 4004.
  const fitLine = useMemo(() => {
    const yrs: number[] = [];
    for (let y = 1971; y <= 2025; y += 1) yrs.push(y);
    return yrs.map((y) => ({
      year: y,
      transistors: 2250 * Math.pow(2, ((y - 1971) * 12) / doublingMonths),
    }));
  }, [doublingMonths]);

  // R² of the fit in log space (so it's stable regardless of axis toggle)
  const r2 = useMemo(() => {
    const logYs = points.map((p) => Math.log10(p.transistors));
    const meanY = logYs.reduce((s, v) => s + v, 0) / logYs.length;
    const k = Math.log10(2) / (doublingMonths / 12);
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < points.length; i++) {
      const pred = Math.log10(2250) + k * (points[i].year - 1971);
      const act = logYs[i];
      ssRes += (act - pred) ** 2;
      ssTot += (act - meanY) ** 2;
    }
    return Math.max(0, 1 - ssRes / ssTot);
  }, [doublingMonths, points]);

  // X ticks every 10 years
  const xTicks = [1970, 1980, 1990, 2000, 2010, 2020];
  const yTicks = logAxis
    ? [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11]
    : [0, 1.75e10, 3.5e10, 5.25e10, 7e10];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-emerald-700">
            ACT 2 · FIT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Slide the doubling time until the line fits.
          </h1>
          <p className="text-sm text-slate-600">
            Try the log axis when the linear view gives up.
          </p>
        </div>
      </div>

      <HostBubble accent="emerald">
        219 microprocessors plotted by year. On a linear y-axis, every chip
        before 1995 looks like zero — the recent ones are just unreadably
        big. Flip to log and they all share the page. Now slide the{' '}
        <strong>doubling time</strong> slider until your dashed line passes
        through every dot.
      </HostBubble>

      {/* Plot */}
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-500">Y-AXIS</span>
            <button
              onClick={() => setLogAxis(false)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                !logAxis ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setLogAxis(true)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                logAxis ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Log
            </button>
          </div>
          <div className="text-xs text-slate-500 italic">
            {logAxis ? 'Log y — exponentials become straight lines.' : 'Linear y — the past 30 years swallow everything before.'}
          </div>
        </div>

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block">
          {/* Axes */}
          <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#94a3b8" />
          <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={PAD.top + PLOT_H} y2={PAD.top + PLOT_H} stroke="#94a3b8" />

          {/* Y grid + ticks */}
          {yTicks.map((t, i) => {
            const y = projectY(t);
            return (
              <g key={`yt-${i}`}>
                <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={0.5} />
                <text x={PAD.left - 8} y={y + 3} fontSize={10} textAnchor="end" fill="#64748b" fontFamily="monospace">
                  {logAxis ? `10^${Math.round(Math.log10(t))}` : t === 0 ? '0' : `${(t / 1e9).toFixed(0)}B`}
                </text>
              </g>
            );
          })}

          {/* X grid + ticks */}
          {xTicks.map((yr) => {
            const x = projectX(yr);
            return (
              <g key={`xt-${yr}`}>
                <line x1={x} x2={x} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#f1f5f9" strokeWidth={0.5} />
                <text x={x} y={PAD.top + PLOT_H + 16} fontSize={11} textAnchor="middle" fill="#64748b" fontFamily="monospace">
                  {yr}
                </text>
              </g>
            );
          })}

          <text x={PAD.left + PLOT_W / 2} y={VB_H - 8} fontSize={13} fontWeight="bold" textAnchor="middle" fill="#475569">
            Year
          </text>
          <text
            x={18}
            y={PAD.top + PLOT_H / 2}
            fontSize={13}
            fontWeight="bold"
            textAnchor="middle"
            fill="#475569"
            transform={`rotate(-90, 18, ${PAD.top + PLOT_H / 2})`}
          >
            Transistors
          </text>

          {/* Fit line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="6 4"
            points={fitLine
              .filter((p) => projectY(p.transistors) >= PAD.top - 4 && projectY(p.transistors) <= PAD.top + PLOT_H + 4)
              .map((p) => `${projectX(p.year)},${projectY(p.transistors)}`)
              .join(' ')}
          />

          {/* Points */}
          {points.map((p, i) => {
            const cx = projectX(p.year);
            const cy = projectY(p.transistors);
            if (cy < PAD.top - 4 || cy > PAD.top + PLOT_H + 4) return null;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={2.4}
                fill={DECADE_COLOR[p.decade] ?? '#475569'}
                fillOpacity={0.85}
                stroke="#fff"
                strokeWidth={0.4}
              />
            );
          })}
        </svg>
      </div>

      {/* Slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-emerald-700">DOUBLING TIME</div>
            <div className="text-sm text-ink">slide until your dashed line lands on every dot</div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold text-emerald-700 tabular-nums">
              {doublingMonths} mo
            </div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-500">
              R² ={' '}
              <span className={r2 > 0.95 ? 'text-emerald-600' : r2 > 0.8 ? 'text-amber-600' : 'text-rose-600'}>
                {r2.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
        <input
          type="range"
          min={6}
          max={60}
          step={1}
          value={doublingMonths}
          onChange={(e) => setDoublingMonths(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>6 mo (6 months)</span>
          <span>24 mo (Moore's 1965)</span>
          <span>60 mo (5 years)</span>
        </div>
        {guess !== null && (
          <div className="text-xs text-slate-600 italic border-t border-slate-100 pt-3">
            Your guess: <strong className="tabular-nums">{guess} months</strong>. Adjust the slider until the line passes through every chip.
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNext({ doublingMonths, r2 })}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          What does Moore say? →
        </button>
      </div>
    </div>
  );
}
