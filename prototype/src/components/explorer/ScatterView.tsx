import { useMemo, useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor, uniqueValues, DEFAULT_POINT } from './ColorScale';

interface ScatterViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute;
  yAttr: Attribute;
  colorAttr?: Attribute | null;
}

function axisLabel(a: Attribute): string {
  const base = `${a.label}${a.unit ? ` (${a.unit})` : ''}`;
  return a.axisHint ? `${base} · ${a.axisHint}` : base;
}

function leastSquares(points: Array<{ x: number; y: number }>) {
  const n = points.length;
  if (n < 2) return null;
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXX += p.x * p.x;
    sumXY += p.x * p.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  const denom = sumXX - n * meanX * meanX;
  if (denom === 0) return null;
  const slope = (sumXY - n * meanX * meanY) / denom;
  const intercept = meanY - slope * meanX;
  return { slope, intercept, meanX, meanY };
}

function r2(points: Array<{ x: number; y: number }>, slope: number, intercept: number) {
  const n = points.length;
  if (n < 2) return 0;
  let meanY = 0;
  for (const p of points) meanY += p.y;
  meanY /= n;
  let ssRes = 0;
  let ssTot = 0;
  for (const p of points) {
    const pred = slope * p.x + intercept;
    ssRes += (p.y - pred) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }
  if (ssTot === 0) return 0;
  return Math.max(0, Math.min(1, 1 - ssRes / ssTot));
}

export default function ScatterView({ dataset, rows, xAttr, yAttr, colorAttr }: ScatterViewProps) {
  const groups = useMemo(() => {
    if (!colorAttr) {
      return [
        {
          name: dataset.name,
          color: DEFAULT_POINT,
          points: rows.map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r })),
        },
      ];
    }
    const isOrdinal = !!colorAttr.ordinal;
    const cats = uniqueValues(rows, colorAttr.key, { ordinal: isOrdinal });
    return cats.map((c) => ({
      name: c,
      color: categoryColor(c, cats, { ordinal: isOrdinal }),
      points: rows
        .filter((r) => String(r[colorAttr.key]) === c)
        .map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r })),
    }));
  }, [rows, xAttr, yAttr, colorAttr, dataset.name]);

  // All points flattened, for regression computation.
  const allPoints = useMemo(
    () => groups.flatMap((g) => g.points).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    [groups],
  );

  const auto = useMemo(() => leastSquares(allPoints), [allPoints]);
  const autoR2 = useMemo(() => (auto ? r2(allPoints, auto.slope, auto.intercept) : 0), [allPoints, auto]);

  // Data ranges for slider bounds.
  const ranges = useMemo(() => {
    if (allPoints.length === 0) return null;
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of allPoints) {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
    return { xMin, xMax, yMin, yMax, xRange: xMax - xMin, yRange: yMax - yMin };
  }, [allPoints]);

  // Slope slider: centered on auto.slope when available, bounded to 3× the
  // natural rise/run so the line doesn't fly off-screen on extreme drags.
  const slopeBounds = useMemo(() => {
    if (!ranges || ranges.xRange === 0 || ranges.yRange === 0) return { min: -1, max: 1, step: 0.01 };
    const natural = ranges.yRange / ranges.xRange;
    const max = Math.max(Math.abs(natural * 3), Math.abs(auto?.slope ?? 0) * 2);
    const step = max / 100;
    return { min: -max, max, step };
  }, [ranges, auto]);

  const interceptBounds = useMemo(() => {
    if (!ranges) return { min: -1, max: 1, step: 0.01 };
    const pad = ranges.yRange;
    const min = ranges.yMin - pad;
    const max = ranges.yMax + pad;
    return { min, max, step: (max - min) / 200 };
  }, [ranges]);

  const [regressionOn, setRegressionOn] = useState(false);
  const [autoOverlay, setAutoOverlay] = useState(false);
  // Start manual line at a flat horizontal line through mean(y) — gives a
  // bad R² that students can improve from.
  const [manualSlope, setManualSlope] = useState(0);
  const [manualIntercept, setManualIntercept] = useState(0);
  const [markerOn, setMarkerOn] = useState(false);
  const [markerX, setMarkerX] = useState(0);
  const [meansOn, setMeansOn] = useState(false);

  // Mean and median for both axes — for the cross-hair overlay.
  const meanMedian = useMemo(() => {
    if (allPoints.length === 0) return null;
    const xs = allPoints.map((p) => p.x).sort((a, b) => a - b);
    const ys = allPoints.map((p) => p.y).sort((a, b) => a - b);
    const sum = (arr: number[]) => arr.reduce((s, v) => s + v, 0);
    const median = (arr: number[]) => {
      const n = arr.length;
      if (n === 0) return 0;
      return n % 2 ? arr[(n - 1) / 2] : (arr[n / 2 - 1] + arr[n / 2]) / 2;
    };
    return {
      meanX: sum(xs) / xs.length,
      meanY: sum(ys) / ys.length,
      medianX: median(xs),
      medianY: median(ys),
    };
  }, [allPoints]);

  // When regression is turned on, initialize to flat line at mean(y).
  useEffect(() => {
    if (regressionOn && auto) {
      setManualSlope(0);
      setManualIntercept(auto.meanY);
    }
  }, [regressionOn, auto]);

  // Initialize marker to the midpoint of x when toggled on.
  useEffect(() => {
    if (markerOn && ranges && markerX === 0) {
      setMarkerX((ranges.xMin + ranges.xMax) / 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerOn, ranges]);

  // Predicted y from the manual line at the marker's x (used as a readout
  // when both features are on).
  const markerYPredicted = manualSlope * markerX + manualIntercept;

  const manualR2 = useMemo(
    () => r2(allPoints, manualSlope, manualIntercept),
    [allPoints, manualSlope, manualIntercept],
  );

  // Line endpoints for ReferenceLine: span the data x-range.
  const manualSegment = useMemo(() => {
    if (!ranges) return null;
    return {
      x1: ranges.xMin,
      y1: manualSlope * ranges.xMin + manualIntercept,
      x2: ranges.xMax,
      y2: manualSlope * ranges.xMax + manualIntercept,
    };
  }, [ranges, manualSlope, manualIntercept]);

  const autoSegment = useMemo(() => {
    if (!ranges || !auto) return null;
    return {
      x1: ranges.xMin,
      y1: auto.slope * ranges.xMin + auto.intercept,
      x2: ranges.xMax,
      y2: auto.slope * ranges.xMax + auto.intercept,
    };
  }, [ranges, auto]);

  const snapToAuto = () => {
    if (!auto) return;
    setManualSlope(auto.slope);
    setManualIntercept(auto.intercept);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="shrink-0 flex items-center gap-3 flex-wrap text-xs">
        <button
          onClick={() => {
            const next = !regressionOn;
            setRegressionOn(next);
            if (!next) setAutoOverlay(false);
          }}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            regressionOn
              ? 'bg-brand-900 text-white shadow-editorial'
              : 'bg-surface-raised border border-surface-line text-ink hover:border-brand-300'
          }`}
        >
          {regressionOn ? 'Fit a line ✓' : 'Fit a line'}
        </button>

        <button
          onClick={() => setMarkerOn((v) => !v)}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            markerOn
              ? 'bg-rose-700 text-white shadow-editorial'
              : 'bg-surface-raised border border-surface-line text-ink hover:border-rose-300'
          }`}
        >
          {markerOn ? 'Drop a marker ✓' : 'Drop a marker'}
        </button>

        <button
          onClick={() => setMeansOn((v) => !v)}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            meansOn
              ? 'bg-emerald-700 text-white shadow-editorial'
              : 'bg-surface-raised border border-surface-line text-ink hover:border-emerald-300'
          }`}
          title="Show mean and median crosshairs on both axes"
        >
          {meansOn ? 'Mean / median ✓' : 'Mean / median'}
        </button>

        {markerOn && ranges && (
          <label className="flex items-center gap-2">
            <span className="text-ink-muted">x</span>
            <input
              type="range"
              min={ranges.xMin}
              max={ranges.xMax}
              step={(ranges.xMax - ranges.xMin) / 200}
              value={markerX}
              onChange={(e) => setMarkerX(Number(e.target.value))}
              className="w-28 accent-rose-700"
            />
            <span className="font-mono tabular-nums text-ink w-16 text-right">{formatScalar(markerX)}</span>
            {regressionOn && (
              <span className="font-mono tabular-nums text-ink-soft">→ <span className="text-rose-700 font-bold">y = {formatScalar(markerYPredicted)}</span></span>
            )}
          </label>
        )}

        {regressionOn && (
          <>
            <label className="flex items-center gap-2">
              <span className="text-ink-muted">slope</span>
              <input
                type="range"
                min={slopeBounds.min}
                max={slopeBounds.max}
                step={slopeBounds.step}
                value={manualSlope}
                onChange={(e) => setManualSlope(Number(e.target.value))}
                className="w-32 accent-brand-700"
              />
              <span className="font-mono tabular-nums text-ink w-16 text-right">{formatSlope(manualSlope)}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-ink-muted">intercept</span>
              <input
                type="range"
                min={interceptBounds.min}
                max={interceptBounds.max}
                step={interceptBounds.step}
                value={manualIntercept}
                onChange={(e) => setManualIntercept(Number(e.target.value))}
                className="w-32 accent-brand-700"
              />
              <span className="font-mono tabular-nums text-ink w-20 text-right">{formatScalar(manualIntercept)}</span>
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <div className="font-mono tabular-nums text-ink-soft">
                your R² <span className="font-bold text-brand-900">{manualR2.toFixed(3)}</span>
              </div>
              <button
                onClick={() => setAutoOverlay((v) => !v)}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  autoOverlay
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-raised border border-surface-line text-ink hover:border-accent-400'
                }`}
              >
                {autoOverlay ? 'Hide best fit' : 'Show best fit'}
              </button>
              {autoOverlay && auto && (
                <div className="font-mono tabular-nums text-ink-soft">
                  best R² <span className="font-bold text-accent-700">{autoR2.toFixed(3)}</span>
                </div>
              )}
              {autoOverlay && (
                <button
                  onClick={snapToAuto}
                  className="px-2.5 py-1 rounded-md font-semibold text-ink hover:text-brand-900 underline-offset-2 hover:underline"
                >
                  Snap to best fit
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 36, left: 24 }}>
            <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={['dataMin', 'dataMax']}
              stroke="#64748B"
              label={{
                value: axisLabel(xAttr),
                position: 'insideBottom',
                offset: -16,
                fill: '#475569',
                fontSize: 13,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={['dataMin', 'dataMax']}
              reversed={yAttr.preferReversed === true}
              stroke="#64748B"
              label={{
                value: axisLabel(yAttr),
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                fill: '#475569',
                fontSize: 13,
                dy: 60,
              }}
            />
            <Tooltip
              cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #DBEAFE', fontSize: 12 }}
              formatter={(val, name) => {
                if (name === 'x') return [Number(val).toFixed(2), xAttr.label];
                if (name === 'y') return [Number(val).toFixed(2), yAttr.label];
                return [val, name];
              }}
            />
            {colorAttr && groups.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            {groups.map((g) => (
              <Scatter key={g.name} name={g.name} data={g.points} fill={g.color} fillOpacity={0.6} />
            ))}
            {regressionOn && manualSegment && (
              <ReferenceLine
                segment={[
                  { x: manualSegment.x1, y: manualSegment.y1 },
                  { x: manualSegment.x2, y: manualSegment.y2 },
                ]}
                stroke="#1A2A52"
                strokeWidth={2.5}
                ifOverflow="extendDomain"
              />
            )}
            {regressionOn && autoOverlay && autoSegment && (
              <ReferenceLine
                segment={[
                  { x: autoSegment.x1, y: autoSegment.y1 },
                  { x: autoSegment.x2, y: autoSegment.y2 },
                ]}
                stroke="#E18809"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                ifOverflow="extendDomain"
              />
            )}
            {markerOn && (
              <ReferenceLine
                x={markerX}
                stroke="#9F1239"
                strokeWidth={2}
                label={{ value: formatScalar(markerX), fill: '#9F1239', fontSize: 11, position: 'top' }}
              />
            )}
            {meansOn && meanMedian && (
              <>
                <ReferenceLine x={meanMedian.meanX}   stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" label={{ value: 'mean x',   fill: '#F59E0B', fontSize: 10, position: 'top' }} />
                <ReferenceLine x={meanMedian.medianX} stroke="#10B981" strokeWidth={1.5} strokeDasharray="3 3" label={{ value: 'median x', fill: '#10B981', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={meanMedian.meanY}   stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" label={{ value: 'mean y',   fill: '#F59E0B', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={meanMedian.medianY} stroke="#10B981" strokeWidth={1.5} strokeDasharray="3 3" label={{ value: 'median y', fill: '#10B981', fontSize: 10, position: 'insideBottomRight' }} />
              </>
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatSlope(s: number): string {
  const abs = Math.abs(s);
  if (abs === 0) return '0';
  if (abs >= 1000 || abs < 0.001) return s.toExponential(1);
  if (abs >= 100) return s.toFixed(0);
  if (abs >= 10) return s.toFixed(1);
  if (abs >= 1) return s.toFixed(2);
  return s.toFixed(3);
}

function formatScalar(s: number): string {
  const abs = Math.abs(s);
  if (abs === 0) return '0';
  if (abs >= 1000) return s.toFixed(0);
  if (abs >= 10) return s.toFixed(1);
  return s.toFixed(2);
}
