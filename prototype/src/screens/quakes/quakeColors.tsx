// Depth-tiered color scale for earthquake dots — matches the standard
// seismology convention used by USGS/NOAA: shallow events (crustal) are
// red, intermediate (~70–300 km, top of the subducting slab) are amber,
// deep (>300 km, deep slab) are indigo.

export const DEPTH_COLOR_SHALLOW = '#f87171'; // red
export const DEPTH_COLOR_MID = '#fbbf24'; // amber
export const DEPTH_COLOR_DEEP = '#818cf8'; // indigo

export function depthColor(depthKm: number): string {
  if (!Number.isFinite(depthKm) || depthKm < 70) return DEPTH_COLOR_SHALLOW;
  if (depthKm < 300) return DEPTH_COLOR_MID;
  return DEPTH_COLOR_DEEP;
}

// Magnitude → dot radius. Scaled so M6 looks visible at globe size (~2.5px),
// M7 starts to feel substantial (~4.5px), M8+ are clearly dramatic (~7px+).
export function magnitudeRadius(mag: number): number {
  if (!Number.isFinite(mag)) return 1.5;
  return Math.max(1.5, (mag - 5) * 2);
}

// Inline legend students see while looking at the globe. Compact enough to
// sit on either a light card or a dark map surface; the `tone` prop flips
// label color.
export function DepthLegend({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const labelColor = tone === 'dark' ? 'text-slate-200' : 'text-slate-600';
  return (
    <div className={`flex items-center gap-3 text-[10px] font-semibold tracking-wider ${labelColor}`}>
      <span>DEPTH:</span>
      <LegendDot color={DEPTH_COLOR_SHALLOW} label="< 70 km · shallow" />
      <LegendDot color={DEPTH_COLOR_MID} label="70–300 km · intermediate" />
      <LegendDot color={DEPTH_COLOR_DEEP} label="> 300 km · deep" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-medium tracking-normal">{label}</span>
    </span>
  );
}
