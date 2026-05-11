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
import { categoryColor, uniqueValues, DEFAULT_POINT, numericColor, numericRampStops } from './ColorScale';

interface ScatterViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute;
  yAttr: Attribute;
  colorAttr?: Attribute | null;
  /** Optional controlled scale state. When provided, ExplorerPage owns the
   *  truth (so the URL can encode it). When omitted, ScatterView falls back
   *  to its own state seeded from dataset.featured. */
  xScale?: 'linear' | 'log';
  yScale?: 'linear' | 'log';
  onXScaleChange?: (s: 'linear' | 'log') => void;
  onYScaleChange?: (s: 'linear' | 'log') => void;
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

export default function ScatterView({
  dataset, rows, xAttr, yAttr, colorAttr,
  xScale: controlledXScale, yScale: controlledYScale,
  onXScaleChange, onYScaleChange,
}: ScatterViewProps) {
  const isControlled = controlledXScale !== undefined && controlledYScale !== undefined;
  // Numeric color range — when colorAttr is numeric, we encode each point
  // individually instead of grouping. Compute the min/max once.
  const numericColorRange = useMemo(() => {
    if (!colorAttr || colorAttr.kind !== 'numeric') return null;
    let lo = Infinity;
    let hi = -Infinity;
    for (const r of rows) {
      const v = Number(r[colorAttr.key]);
      if (!Number.isFinite(v)) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) return null;
    return { lo, hi };
  }, [rows, colorAttr]);

  const groups = useMemo(() => {
    if (!colorAttr) {
      return [
        {
          name: dataset.name,
          color: DEFAULT_POINT,
          points: rows.map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r, color: DEFAULT_POINT })),
        },
      ];
    }
    // Numeric color: bin the data into 8 quantized color groups so each gets
    // a uniform Recharts <Scatter> with one fill (cleaner than per-point fill
    // and lets us paint a legend gradient cleanly).
    if (colorAttr.kind === 'numeric' && numericColorRange) {
      const BINS = 8;
      const { lo, hi } = numericColorRange;
      const range = hi - lo;
      const buckets: { name: string; color: string; points: Array<{ x: number; y: number; row: Row; color: string }> }[] = [];
      for (let i = 0; i < BINS; i++) {
        const binLo = lo + (i / BINS) * range;
        const binHi = lo + ((i + 1) / BINS) * range;
        const color = numericColor((i + 0.5) / BINS);
        buckets.push({
          name: `${formatScalar(binLo)}–${formatScalar(binHi)}`,
          color,
          points: [],
        });
      }
      for (const r of rows) {
        const v = Number(r[colorAttr.key]);
        if (!Number.isFinite(v)) continue;
        let i = Math.floor(((v - lo) / range) * BINS);
        if (i === BINS) i = BINS - 1;
        if (i < 0) i = 0;
        buckets[i].points.push({
          x: Number(r[xAttr.key]),
          y: Number(r[yAttr.key]),
          row: r,
          color: buckets[i].color,
        });
      }
      return buckets.filter((b) => b.points.length > 0);
    }
    const isOrdinal = !!colorAttr.ordinal;
    const cats = uniqueValues(rows, colorAttr.key, { ordinal: isOrdinal });
    return cats.map((c) => ({
      name: c,
      color: categoryColor(c, cats, { ordinal: isOrdinal }),
      points: rows
        .filter((r) => String(r[colorAttr.key]) === c)
        .map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r, color: categoryColor(c, cats, { ordinal: isOrdinal }) })),
    }));
  }, [rows, xAttr, yAttr, colorAttr, dataset.name, numericColorRange]);

  // All points flattened, for regression computation.
  const allPoints = useMemo(
    () => groups.flatMap((g) => g.points).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    [groups],
  );

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

  const [regressionOn, setRegressionOn] = useState(false);
  const [autoOverlay, setAutoOverlay] = useState(false);
  // Start manual line at a flat horizontal line through mean(y) — gives a
  // bad R² that students can improve from.
  const [manualSlope, setManualSlope] = useState(0);
  const [manualIntercept, setManualIntercept] = useState(0);
  const [markerOn, setMarkerOn] = useState(false);
  const [markerX, setMarkerX] = useState(0);
  const [meansOn, setMeansOn] = useState(false);
  const [internalXScale, setInternalXScale] = useState<'linear' | 'log'>(dataset.featured?.xScale ?? 'linear');
  const [internalYScale, setInternalYScale] = useState<'linear' | 'log'>(dataset.featured?.yScale ?? 'linear');

  // When the dataset switches in the same Explorer session, pick up its
  // preferred scales so the new view doesn't open looking wrong. Only fires
  // in uncontrolled mode — the parent owns the truth otherwise.
  useEffect(() => {
    if (!isControlled) {
      setInternalXScale(dataset.featured?.xScale ?? 'linear');
      setInternalYScale(dataset.featured?.yScale ?? 'linear');
    }
  }, [dataset.id, isControlled]);

  const xScale = controlledXScale ?? internalXScale;
  const yScale = controlledYScale ?? internalYScale;
  const setXScale = (s: 'linear' | 'log') => {
    if (onXScaleChange) onXScaleChange(s);
    else setInternalXScale(s);
  };
  const setYScale = (s: 'linear' | 'log') => {
    if (onYScaleChange) onYScaleChange(s);
    else setInternalYScale(s);
  };

  // Log scale requires strictly-positive values. Disable the toggle when the
  // axis includes zero or negatives.
  const xCanLog = ranges !== null && ranges.xMin > 0;
  const yCanLog = ranges !== null && ranges.yMin > 0;
  const effectiveXScale = xCanLog ? xScale : 'linear';
  const effectiveYScale = yCanLog ? yScale : 'linear';

  // Fit the regression in the same coordinate space the user is viewing.
  // When both axes are linear, this is raw x/y. When either is log, we
  // transform that axis via log10 before computing slope/intercept/R².
  // For Kepler's third law (solarSystem, log-log) this surfaces the slope of
  // 1.5; for Kleiber's law (heartRate, log-log) the slope of −0.25.
  const fitPoints = useMemo(() => {
    return allPoints
      .map((p) => {
        const x = effectiveXScale === 'log' ? (p.x > 0 ? Math.log10(p.x) : NaN) : p.x;
        const y = effectiveYScale === 'log' ? (p.y > 0 ? Math.log10(p.y) : NaN) : p.y;
        return { x, y };
      })
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  }, [allPoints, effectiveXScale, effectiveYScale]);

  const auto = useMemo(() => leastSquares(fitPoints), [fitPoints]);
  const autoR2 = useMemo(() => (auto ? r2(fitPoints, auto.slope, auto.intercept) : 0), [fitPoints, auto]);

  const fitRanges = useMemo(() => {
    if (fitPoints.length === 0) return null;
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of fitPoints) {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
    return { xMin, xMax, yMin, yMax, xRange: xMax - xMin, yRange: yMax - yMin };
  }, [fitPoints]);

  const slopeBounds = useMemo(() => {
    if (!fitRanges || fitRanges.xRange === 0 || fitRanges.yRange === 0) return { min: -3, max: 3, step: 0.01 };
    const natural = fitRanges.yRange / fitRanges.xRange;
    const max = Math.max(Math.abs(natural * 3), Math.abs(auto?.slope ?? 0) * 2);
    const step = max / 200;
    return { min: -max, max, step };
  }, [fitRanges, auto]);

  const interceptBounds = useMemo(() => {
    if (!fitRanges) return { min: -1, max: 1, step: 0.01 };
    const pad = fitRanges.yRange;
    const min = fitRanges.yMin - pad;
    const max = fitRanges.yMax + pad;
    return { min, max, step: (max - min) / 200 };
  }, [fitRanges]);

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

  // Horizontal y-marker (symmetric with the existing vertical x-marker).
  const [yMarkerOn, setYMarkerOn] = useState(false);
  const [markerY, setMarkerY] = useState(0);
  useEffect(() => {
    if (yMarkerOn && ranges && markerY === 0) {
      setMarkerY((ranges.yMin + ranges.yMax) / 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yMarkerOn, ranges]);

  // Predicted y from the manual line at the marker's x (used as a readout
  // when both features are on).
  const markerYPredicted = manualSlope * markerX + manualIntercept;

  const manualR2 = useMemo(
    () => r2(fitPoints, manualSlope, manualIntercept),
    [fitPoints, manualSlope, manualIntercept],
  );

  // Line endpoints for ReferenceLine: span the data x-range. The slope and
  // intercept are in fit-space (log if scales are log), so we map back to raw
  // chart units when rendering.
  const lineY = (slope: number, intercept: number, xRaw: number): number => {
    const xFit = effectiveXScale === 'log' ? Math.log10(xRaw) : xRaw;
    const yFit = slope * xFit + intercept;
    return effectiveYScale === 'log' ? Math.pow(10, yFit) : yFit;
  };

  const manualSegment = useMemo(() => {
    if (!ranges) return null;
    return {
      x1: ranges.xMin,
      y1: lineY(manualSlope, manualIntercept, ranges.xMin),
      x2: ranges.xMax,
      y2: lineY(manualSlope, manualIntercept, ranges.xMax),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges, manualSlope, manualIntercept, effectiveXScale, effectiveYScale]);

  const autoSegment = useMemo(() => {
    if (!ranges || !auto) return null;
    return {
      x1: ranges.xMin,
      y1: lineY(auto.slope, auto.intercept, ranges.xMin),
      x2: ranges.xMax,
      y2: lineY(auto.slope, auto.intercept, ranges.xMax),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges, auto, effectiveXScale, effectiveYScale]);

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
          {markerOn ? 'x-marker ✓' : 'x-marker'}
        </button>

        <button
          onClick={() => setYMarkerOn((v) => !v)}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            yMarkerOn
              ? 'bg-rose-700 text-white shadow-editorial'
              : 'bg-surface-raised border border-surface-line text-ink hover:border-rose-300'
          }`}
        >
          {yMarkerOn ? 'y-marker ✓' : 'y-marker'}
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

        <ScaleToggle axis="x" enabled={xCanLog} scale={xScale} onChange={setXScale} />
        <ScaleToggle axis="y" enabled={yCanLog} scale={yScale} onChange={setYScale} />

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

        {yMarkerOn && ranges && (
          <label className="flex items-center gap-2">
            <span className="text-ink-muted">y</span>
            <input
              type="range"
              min={ranges.yMin}
              max={ranges.yMax}
              step={(ranges.yMax - ranges.yMin) / 200}
              value={markerY}
              onChange={(e) => setMarkerY(Number(e.target.value))}
              className="w-28 accent-rose-700"
            />
            <span className="font-mono tabular-nums text-ink w-16 text-right">{formatScalar(markerY)}</span>
          </label>
        )}

        {colorAttr && colorAttr.kind === 'numeric' && numericColorRange && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-ink-muted text-[11px]">{colorAttr.label}</span>
            <span className="font-mono tabular-nums text-ink-soft text-[11px]">{formatScalar(numericColorRange.lo)}</span>
            <span
              className="inline-block h-3 w-28 rounded"
              style={{ background: `linear-gradient(90deg, ${numericRampStops()})` }}
              aria-label={`Color scale for ${colorAttr.label}`}
            />
            <span className="font-mono tabular-nums text-ink-soft text-[11px]">{formatScalar(numericColorRange.hi)}</span>
          </div>
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
          <ScatterChart margin={{ top: 16, right: 32, bottom: 48, left: 64 }}>
            <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              scale={effectiveXScale}
              // Recharts' 'auto' domain on log scale ends up including 0 (which
              // log can't render), so points silently drop out. When log is on,
              // pin the domain to the actual positive data range with light
              // padding — that's what gives the data back.
              domain={
                effectiveXScale === 'log' && ranges
                  ? [ranges.xMin * 0.9, ranges.xMax * 1.1]
                  : ['dataMin', 'dataMax']
              }
              allowDataOverflow={false}
              tickFormatter={formatTick}
              stroke="#64748B"
              label={{
                value: axisLabel(xAttr) + (effectiveXScale === 'log' ? ' · log scale' : ''),
                position: 'insideBottom',
                offset: -8,
                fill: '#475569',
                fontSize: 13,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              scale={effectiveYScale}
              domain={
                effectiveYScale === 'log' && ranges
                  ? [ranges.yMin * 0.9, ranges.yMax * 1.1]
                  : ['dataMin', 'dataMax']
              }
              allowDataOverflow={false}
              tickFormatter={formatTick}
              reversed={yAttr.preferReversed === true}
              stroke="#64748B"
              width={56}
              label={{
                value: axisLabel(yAttr) + (effectiveYScale === 'log' ? ' · log scale' : ''),
                angle: -90,
                position: 'insideLeft',
                offset: -2,
                fill: '#475569',
                fontSize: 13,
                style: { textAnchor: 'middle' },
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
            {colorAttr && colorAttr.kind !== 'numeric' && groups.length > 1 && (
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 12, paddingBottom: 4 }}
              />
            )}
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
                ifOverflow="hidden"
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
                ifOverflow="hidden"
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
            {yMarkerOn && (
              <ReferenceLine
                y={markerY}
                stroke="#9F1239"
                strokeWidth={2}
                label={{ value: formatScalar(markerY), fill: '#9F1239', fontSize: 11, position: 'right' }}
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

// Axis tick formatter — clean integers for whole-number-ish data, otherwise
// minimal decimals. Compact notation for big magnitudes.
function formatTick(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e4) return `${(v / 1e3).toFixed(0)}k`;
  if (abs >= 100) return v.toFixed(0);
  if (abs >= 10) return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
  if (abs >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

function ScaleToggle({
  axis, enabled, scale, onChange,
}: { axis: 'x' | 'y'; enabled: boolean; scale: 'linear' | 'log'; onChange: (s: 'linear' | 'log') => void }) {
  if (!enabled) return null;
  const isLog = scale === 'log';
  return (
    <button
      onClick={() => onChange(isLog ? 'linear' : 'log')}
      title={`Toggle ${axis.toUpperCase()} axis between linear and log scale`}
      className={`px-3 py-1.5 rounded-md font-semibold transition border ${
        isLog
          ? 'bg-indigo-700 text-white border-indigo-700 shadow-editorial'
          : 'bg-surface-raised border-surface-line text-ink hover:border-indigo-300'
      }`}
    >
      {axis.toUpperCase()}: {isLog ? 'log' : 'linear'}
    </button>
  );
}
