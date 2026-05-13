import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

export interface KeplerPick {
  body: string;
  distanceAU: number;
  periodYears: number;
  predictedYears: number;
}

interface KeplerPlotProps {
  guess: number | null;
  onNext: (pick: KeplerPick, exponent: number) => void;
}

// Viewbox for the plot
const VB_W = 720;
const VB_H = 420;
const PADDING = { top: 24, right: 32, bottom: 56, left: 64 };
const PLOT_W = VB_W - PADDING.left - PADDING.right;
const PLOT_H = VB_H - PADDING.top - PADDING.bottom;

const ZONE_COLOR: Record<string, string> = {
  Inner: '#f97316',
  Outer: '#84cc16',
  'Trans-Neptunian': '#06b6d4',
};

export default function KeplerPlot({ guess, onNext }: KeplerPlotProps) {
  const dataset = getDataset('solarSystem');
  const points = useMemo(
    () =>
      dataset.rows.map((r) => ({
        body: String(r.body ?? ''),
        zone: String(r.zone ?? ''),
        distanceAU: Number(r.distanceAU),
        periodYears: Number(r.periodYears),
      })),
    [dataset],
  );

  const [logAxes, setLogAxes] = useState(false);
  const [exponent, setExponent] = useState(1.0);
  const [pickedBody, setPickedBody] = useState<string>('Mars');

  // Reasonable domains for both scales
  const xMin = logAxes ? 0.3 : 0;
  const xMax = logAxes ? 100 : 70;
  const yMin = logAxes ? 0.2 : 0;
  const yMax = logAxes ? 700 : 600;

  const projectX = (au: number) => {
    if (logAxes) {
      const t = (Math.log10(au) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin));
      return PADDING.left + t * PLOT_W;
    }
    return PADDING.left + ((au - xMin) / (xMax - xMin)) * PLOT_W;
  };
  const projectY = (yr: number) => {
    if (logAxes) {
      const t = (Math.log10(yr) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin));
      return PADDING.top + PLOT_H - t * PLOT_H;
    }
    return PADDING.top + PLOT_H - ((yr - yMin) / (yMax - yMin)) * PLOT_H;
  };

  // Fit line: y = a^exponent (anchored at Earth = (1, 1) so the line always passes through 1,1)
  const fitLine = useMemo(() => {
    const samples = 100;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const au = logAxes
        ? Math.pow(10, Math.log10(xMin) + t * (Math.log10(xMax) - Math.log10(xMin)))
        : xMin + t * (xMax - xMin);
      if (au <= 0) continue;
      const yr = Math.pow(au, exponent);
      pts.push([au, yr]);
    }
    return pts;
  }, [exponent, logAxes]);

  // R² of student's fit (in log-log space — invariant to scale toggle)
  const r2 = useMemo(() => {
    const logYs = points.map((p) => Math.log10(p.periodYears));
    const meanY = logYs.reduce((s, v) => s + v, 0) / logYs.length;
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < points.length; i++) {
      const predLog = exponent * Math.log10(points[i].distanceAU);
      const actLog = logYs[i];
      ssRes += (actLog - predLog) ** 2;
      ssTot += (actLog - meanY) ** 2;
    }
    return Math.max(0, 1 - ssRes / ssTot);
  }, [exponent, points]);

  const pick = points.find((p) => p.body === pickedBody) ?? points[0];
  const predictedYears = Math.pow(pick.distanceAU, exponent);

  const linearGuess = guess; // The student's Act-1 prediction at 10 AU
  const trueAt10 = Math.pow(10, 1.5);

  const xTicks = logAxes ? [0.3, 1, 3, 10, 30, 100] : [0, 10, 20, 30, 40, 50, 60];
  const yTicks = logAxes ? [0.3, 1, 3, 10, 30, 100, 300] : [0, 100, 200, 300, 400, 500];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-amber-700">
            ACT 2 · PLOT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Find the exponent.
          </h1>
          <p className="text-sm text-slate-600">
            Slide until the line lands on every dot. Toggle log axes when you're stuck.
          </p>
        </div>
      </div>

      <HostBubble accent="amber" name="Tycho">
        That's all twelve bodies plotted: distance from the Sun on X, orbit
        time on Y. The slider sets the <strong>exponent</strong>: the line
        is <code className="font-mono text-sm bg-amber-100 px-1 rounded">T = a^k</code>.
        Try k = 1 first — that's everyone's first guess. Then try 2. Then
        slide between them.
      </HostBubble>

      {linearGuess !== null && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-amber-900">
            You predicted <strong className="tabular-nums">{linearGuess}</strong> years for a planet at 10 AU.
          </span>
          <span className="text-slate-700 text-xs">
            The real answer is <strong className="tabular-nums">{trueAt10.toFixed(1)}</strong> years.
            {linearGuess === 10 ? ' (Classic "linear" guess — the truth bends differently.)' : ''}
          </span>
        </div>
      )}

      {/* Plot */}
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-500">AXES</span>
            <button
              onClick={() => setLogAxes(false)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                !logAxes ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setLogAxes(true)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                logAxes ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Log–log
            </button>
          </div>
          <div className="text-xs text-slate-500 italic">
            {logAxes ? 'Log axes — a power law becomes a straight line.' : 'Linear axes — inner planets crowd the corner.'}
          </div>
        </div>

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block">
          {/* Axes */}
          <line
            x1={PADDING.left}
            x2={PADDING.left}
            y1={PADDING.top}
            y2={PADDING.top + PLOT_H}
            stroke="#94a3b8"
            strokeWidth={1}
          />
          <line
            x1={PADDING.left}
            x2={PADDING.left + PLOT_W}
            y1={PADDING.top + PLOT_H}
            y2={PADDING.top + PLOT_H}
            stroke="#94a3b8"
            strokeWidth={1}
          />

          {/* Grid + tick labels */}
          {xTicks.map((t) => {
            const x = projectX(t);
            if (x < PADDING.left - 1 || x > PADDING.left + PLOT_W + 1) return null;
            return (
              <g key={`xt-${t}`}>
                <line x1={x} x2={x} y1={PADDING.top} y2={PADDING.top + PLOT_H} stroke="#e2e8f0" strokeWidth={0.5} />
                <text x={x} y={PADDING.top + PLOT_H + 16} fontSize={11} textAnchor="middle" fill="#64748b" fontFamily="monospace">
                  {t}
                </text>
              </g>
            );
          })}
          {yTicks.map((t) => {
            const y = projectY(t);
            if (y < PADDING.top - 1 || y > PADDING.top + PLOT_H + 1) return null;
            return (
              <g key={`yt-${t}`}>
                <line x1={PADDING.left} x2={PADDING.left + PLOT_W} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />
                <text x={PADDING.left - 8} y={y + 3} fontSize={11} textAnchor="end" fill="#64748b" fontFamily="monospace">
                  {t}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={PADDING.left + PLOT_W / 2}
            y={VB_H - 8}
            fontSize={13}
            textAnchor="middle"
            fill="#475569"
            fontWeight="bold"
          >
            Distance from Sun (AU)
          </text>
          <text
            x={16}
            y={PADDING.top + PLOT_H / 2}
            fontSize={13}
            textAnchor="middle"
            fill="#475569"
            fontWeight="bold"
            transform={`rotate(-90, 16, ${PADDING.top + PLOT_H / 2})`}
          >
            Orbital period (years)
          </text>

          {/* Fit line */}
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth={2}
            strokeDasharray="6 4"
            points={fitLine.map(([au, yr]) => `${projectX(au)},${projectY(yr)}`).join(' ')}
          />

          {/* Points */}
          {points.map((p) => {
            const cx = projectX(p.distanceAU);
            const cy = projectY(p.periodYears);
            if (cx < PADDING.left - 4 || cy < PADDING.top - 4 || cx > PADDING.left + PLOT_W + 4 || cy > PADDING.top + PLOT_H + 4) return null;
            const isPick = p.body === pickedBody;
            return (
              <g key={p.body} onClick={() => setPickedBody(p.body)} className="cursor-pointer">
                <circle cx={cx} cy={cy} r={isPick ? 8 : 5} fill={ZONE_COLOR[p.zone] ?? '#475569'} stroke="#fff" strokeWidth={1.5} />
                <text x={cx + 9} y={cy - 6} fontSize={10} fill="#334155" fontWeight={isPick ? 'bold' : 'normal'}>
                  {p.body}
                </text>
              </g>
            );
          })}

          {/* Legend (top-right) */}
          <g transform={`translate(${PADDING.left + PLOT_W - 110}, ${PADDING.top + 4})`}>
            {(['Inner', 'Outer', 'Trans-Neptunian'] as const).map((z, i) => (
              <g key={z} transform={`translate(0, ${i * 16})`}>
                <circle cx={6} cy={6} r={4} fill={ZONE_COLOR[z]} />
                <text x={16} y={9} fontSize={10} fill="#475569">{z}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Slope slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-amber-700">EXPONENT k</div>
            <div className="text-sm text-ink">
              <code className="font-mono text-base bg-amber-50 px-2 py-0.5 rounded">T = a<sup>k</sup></code>
              <span className="text-slate-500 ml-2">slide to fit every dot</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold text-amber-700 tabular-nums">{exponent.toFixed(2)}</div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-500">
              R² ={' '}
              <span className={r2 > 0.999 ? 'text-emerald-600' : r2 > 0.99 ? 'text-amber-600' : 'text-rose-600'}>
                {r2.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
        <input
          type="range"
          min={0.5}
          max={2.5}
          step={0.01}
          value={exponent}
          onChange={(e) => setExponent(Number(e.target.value))}
          className="w-full accent-amber-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0.50</span>
          <span>1.00 (linear)</span>
          <span>1.50</span>
          <span>2.00 (square)</span>
          <span>2.50</span>
        </div>
        <div className="text-xs text-slate-600 italic border-t border-slate-100 pt-3">
          When the line passes through every point, you've found the exponent that the entire solar system obeys.
        </div>
      </div>

      {/* Pick + check */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
          CHECK YOUR FIT
        </div>
        <div className="flex items-baseline gap-3 flex-wrap text-sm">
          <span>For</span>
          <select
            value={pickedBody}
            onChange={(e) => setPickedBody(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-amber-300 bg-white font-semibold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            {points.map((p) => (
              <option key={p.body} value={p.body}>{p.body}</option>
            ))}
          </select>
          <span>at <strong className="tabular-nums">{pick.distanceAU.toFixed(2)} AU</strong>:</span>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg border border-amber-200 p-3">
            <div className="text-[10px] font-semibold tracking-widest text-slate-500">YOUR FIT PREDICTS</div>
            <div className="font-display text-2xl font-bold text-amber-700 tabular-nums">{predictedYears.toFixed(2)} yr</div>
          </div>
          <div className="bg-white rounded-lg border border-emerald-200 p-3">
            <div className="text-[10px] font-semibold tracking-widest text-slate-500">ACTUAL</div>
            <div className="font-display text-2xl font-bold text-emerald-700 tabular-nums">{pick.periodYears.toFixed(2)} yr</div>
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-2">
          Error: {Math.abs(predictedYears - pick.periodYears).toFixed(2)} years
          {Math.abs(predictedYears - pick.periodYears) < 0.5 ? ' — nailed it.' : ' — adjust the exponent.'}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNext({ body: pick.body, distanceAU: pick.distanceAU, periodYears: pick.periodYears, predictedYears }, exponent)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          What is this number? →
        </button>
      </div>
    </div>
  );
}
