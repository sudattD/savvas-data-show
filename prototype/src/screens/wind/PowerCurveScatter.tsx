// The signature interactive for the Wind Power Curve activity — a 2D
// scatter of wind speed (x) against power output (y). Plain hand-built SVG
// (no chart library) so we control the reveal animation, the regime band
// overlays, the fitted-curve overlay and hover precisely. The same
// component runs in Act 1's reveal, Act 2's lenses and Act 3's reveals at
// different sizes and feature flags.

import { useMemo, useState } from 'react';
import type { WindPoint } from '../../data/windTurbine';
import type { ModelFn } from '../../lib/fit';
import { niceTicksWithin } from '../../lib/niceTicks';
import { REGIMES, RATED_POWER } from './regimes';
import { REGIME_BAND_FILL, DOT_COLOR, regimeColor } from './windColors';

interface PowerCurveScatterProps {
  /** Dots to render. Callers pass a growing slice to animate the reveal. */
  points: readonly WindPoint[];
  aspectRatio?: number;
  /** Color each dot by its operating regime instead of one flat accent. */
  colorByRegime?: boolean;
  /** Draw the shaded regime bands + their labels behind the data. */
  regimeBands?: boolean;
  /** Optional fitted curve to overlay. */
  model?: ModelFn | null;
  /** Limit the x-range over which the model line is drawn. */
  modelDomain?: [number, number];
  /** Shade a fit zone [x0, x1] (e.g. the ramp-up band used for a fit). */
  fitZone?: [number, number] | null;
  /** Vertical reference line at a wind speed (e.g. a prediction at v=10). */
  highlightX?: number | null;
  /** Draw the horizontal rated-power ceiling line. */
  ratedLine?: boolean;
  xMax?: number;
  yMax?: number;
  /** Fires as the pointer moves on/off a dot. */
  onHover?: (p: WindPoint | null) => void;
}

const W = 820;
const M = { left: 60, right: 20, top: 20, bottom: 48 };

export default function PowerCurveScatter({
  points,
  aspectRatio = 16 / 10,
  colorByRegime = false,
  regimeBands = false,
  model = null,
  modelDomain,
  fitZone = null,
  highlightX = null,
  ratedLine = false,
  xMax = 18,
  yMax = 1700,
}: PowerCurveScatterProps) {
  const H = W / aspectRatio;
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const sx = (v: number) => M.left + (v / xMax) * plotW;
  const sy = (p: number) => M.top + plotH - (Math.min(p, yMax) / yMax) * plotH;

  const xTicks = useMemo(() => niceTicksWithin(0, xMax, 10), [xMax]);
  const yTicks = useMemo(() => niceTicksWithin(0, yMax, 6), [yMax]);

  const modelPath = useMemo(() => {
    if (!model) return '';
    const [lo, hi] = modelDomain ?? [0, xMax];
    const steps = 120;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const x = lo + ((hi - lo) * i) / steps;
      const y = Math.max(0, Math.min(yMax, model(x)));
      d += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)} `;
    }
    return d.trim();
  }, [model, modelDomain, xMax, yMax]);

  const [hover, setHover] = useState<{ x: number; y: number; p: WindPoint } | null>(null);

  return (
    <div className="w-full relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
        {/* Plot background */}
        <rect x={M.left} y={M.top} width={plotW} height={plotH} fill="#ffffff" />

        {/* Regime bands */}
        {regimeBands &&
          REGIMES.map((r) => {
            const x0 = sx(Math.max(0, r.min));
            const x1 = sx(Math.min(xMax, r.max));
            if (x1 <= x0) return null;
            return (
              <g key={r.id}>
                <rect
                  x={x0}
                  y={M.top}
                  width={x1 - x0}
                  height={plotH}
                  fill={REGIME_BAND_FILL[r.id]}
                />
                <text
                  x={(x0 + x1) / 2}
                  y={M.top + 14}
                  textAnchor="middle"
                  className="fill-slate-400"
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}
                >
                  {r.short.toUpperCase()}
                </text>
              </g>
            );
          })}

        {/* Fit zone shading */}
        {fitZone && (
          <rect
            x={sx(fitZone[0])}
            y={M.top}
            width={sx(fitZone[1]) - sx(fitZone[0])}
            height={plotH}
            fill="rgba(37,99,235,0.10)"
            stroke="#2563eb"
            strokeOpacity={0.4}
            strokeDasharray="4 4"
          />
        )}

        {/* Grid */}
        {xTicks.map((t) => (
          <line
            key={`gx${t}`}
            x1={sx(t)}
            x2={sx(t)}
            y1={M.top}
            y2={M.top + plotH}
            stroke="#eef2f7"
          />
        ))}
        {yTicks.map((t) => (
          <line
            key={`gy${t}`}
            x1={M.left}
            x2={M.left + plotW}
            y1={sy(t)}
            y2={sy(t)}
            stroke="#eef2f7"
          />
        ))}

        {/* Rated-power ceiling */}
        {ratedLine && (
          <g>
            <line
              x1={M.left}
              x2={M.left + plotW}
              y1={sy(RATED_POWER)}
              y2={sy(RATED_POWER)}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
            <text
              x={M.left + plotW - 4}
              y={sy(RATED_POWER) - 6}
              textAnchor="end"
              className="fill-amber-600"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              Rated ≈ {RATED_POWER} kW
            </text>
          </g>
        )}

        {/* Axes */}
        <line x1={M.left} x2={M.left + plotW} y1={M.top + plotH} y2={M.top + plotH} stroke="#94a3b8" />
        <line x1={M.left} x2={M.left} y1={M.top} y2={M.top + plotH} stroke="#94a3b8" />

        {/* X ticks */}
        {xTicks.map((t) => (
          <g key={`xt${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={M.top + plotH} y2={M.top + plotH + 5} stroke="#94a3b8" />
            <text
              x={sx(t)}
              y={M.top + plotH + 18}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 11 }}
            >
              {t}
            </text>
          </g>
        ))}
        {/* Y ticks */}
        {yTicks.map((t) => (
          <g key={`yt${t}`}>
            <line x1={M.left - 5} x2={M.left} y1={sy(t)} y2={sy(t)} stroke="#94a3b8" />
            <text
              x={M.left - 9}
              y={sy(t) + 3.5}
              textAnchor="end"
              className="fill-slate-500"
              style={{ fontSize: 11 }}
            >
              {t}
            </text>
          </g>
        ))}

        {/* Axis titles */}
        <text
          x={M.left + plotW / 2}
          y={H - 8}
          textAnchor="middle"
          className="fill-slate-600"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          Wind speed (m/s)
        </text>
        <text
          x={16}
          y={M.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${M.top + plotH / 2})`}
          className="fill-slate-600"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          Power output (kW)
        </text>

        {/* Dots — index keys are stable as the reveal slice grows, so each
            new dot mounts fresh and plays the wind-dot pop animation once. */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={sx(p.windSpeed)}
            cy={sy(p.power)}
            r={3.4}
            fill={colorByRegime ? regimeColor(p.windSpeed) : DOT_COLOR}
            fillOpacity={0.52}
            stroke="#ffffff"
            strokeWidth={0.5}
            className="wind-dot"
            onMouseEnter={() => setHover({ x: sx(p.windSpeed), y: sy(p.power), p })}
            onMouseLeave={() => setHover(null)}
          />
        ))}

        {/* Fitted curve */}
        {modelPath && (
          <path d={modelPath} fill="none" stroke="#f97316" strokeWidth={3} strokeLinecap="round" />
        )}

        {/* Highlight wind speed */}
        {highlightX != null && (
          <line
            x1={sx(highlightX)}
            x2={sx(highlightX)}
            y1={M.top}
            y2={M.top + plotH}
            stroke="#f97316"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        )}

        {/* Hover tooltip */}
        {hover && (
          <g pointerEvents="none">
            <circle cx={hover.x} cy={hover.y} r={5} fill="none" stroke="#0f172a" strokeWidth={1.5} />
            <g transform={`translate(${Math.min(hover.x + 10, W - 132)}, ${Math.max(hover.y - 34, M.top)})`}>
              <rect width={122} height={30} rx={5} fill="#0f172a" opacity={0.92} />
              <text x={8} y={13} className="fill-white" style={{ fontSize: 10.5, fontWeight: 600 }}>
                {hover.p.windSpeed.toFixed(2)} m/s
              </text>
              <text x={8} y={24} className="fill-sky-200" style={{ fontSize: 10.5 }}>
                {hover.p.power.toFixed(0)} kW
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
