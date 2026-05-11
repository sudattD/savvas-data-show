// Snap a data range to round axis ticks. Without these, Recharts pins the
// first/last tick to the literal data min/max (e.g. 0.044, 0.993) and spaces
// the remaining ticks evenly across that ugly range. The standard fix used
// by d3, Vega, matplotlib, etc. is to round to multiples of 1/2/5 × 10^n.

function niceStep(range: number, targetCount: number): number {
  const rough = range / Math.max(1, targetCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
}

// Snaps both the domain (extends outward to nice bounds) and the ticks.
// Use when the chart owns the axis range — e.g. data-driven views.
export function niceTicks(
  min: number,
  max: number,
  targetCount = 5,
): { domain: [number, number]; ticks: number[] } {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    const pad = Math.abs(min) > 0 ? Math.abs(min) * 0.1 : 1;
    return { domain: [min - pad, max + pad], ticks: [min] };
  }
  const step = niceStep(max - min, targetCount);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step / 2; v += step) {
    ticks.push(Number(v.toFixed(decimals + 6)));
  }
  return { domain: [niceMin, niceMax], ticks };
}

// Keeps the caller-supplied domain (e.g. a student-controlled crop) and
// returns nicely-spaced ticks that fall inside [min, max].
export function niceTicksWithin(min: number, max: number, targetCount = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  const step = niceStep(max - min, targetCount);
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = first; v <= max + step * 1e-9; v += step) {
    ticks.push(Number(v.toFixed(decimals + 6)));
  }
  return ticks;
}

// Powers-of-10 ticks for log scale. Recharts' default log behavior includes
// 0 in the domain, which log can't render — points silently drop. Returning
// an explicit positive domain + power-of-10 ticks fixes both.
export function niceLogTicks(min: number, max: number): { domain: [number, number]; ticks: number[] } {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
    return { domain: [min, max], ticks: [] };
  }
  const lo = Math.floor(Math.log10(min));
  const hi = Math.ceil(Math.log10(max));
  const ticks: number[] = [];
  for (let p = lo; p <= hi; p++) ticks.push(Math.pow(10, p));
  return { domain: [Math.pow(10, lo), Math.pow(10, hi)], ticks };
}
