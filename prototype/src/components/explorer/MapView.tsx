import { useMemo, useState } from 'react';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor, uniqueValues, DEFAULT_POINT } from './ColorScale';

interface MapViewProps {
  dataset: Dataset;
  rows: Row[];
  /** Numeric attribute whose values are latitudes in degrees (–90 to +90). */
  latAttr: Attribute;
  /** Numeric attribute whose values are longitudes in degrees (–180 to +180). */
  lonAttr: Attribute;
  /** Optional categorical attribute to color points by. */
  colorAttr?: Attribute | null;
  /** Optional numeric attribute to size points by (radius scales sqrt(value)). */
  sizeAttr?: Attribute | null;
}

/** Equirectangular projection — simple, distorts at poles but adequate for the
 *  scale we care about (visualizing globe-wide point distributions). */
function project(lat: number, lon: number, width: number, height: number) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

const W = 720;
const H = 360; // 2:1 aspect for equirectangular

export default function MapView({ dataset, rows, latAttr, lonAttr, colorAttr, sizeAttr }: MapViewProps) {
  const points = useMemo(() => {
    return rows
      .map((r) => {
        const lat = Number(r[latAttr.key]);
        const lon = Number(r[lonAttr.key]);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
        const size = sizeAttr ? Number(r[sizeAttr.key]) : null;
        return { lat, lon, row: r, size: Number.isFinite(size as number) ? (size as number) : null };
      })
      .filter((p): p is { lat: number; lon: number; row: Row; size: number | null } => p !== null);
  }, [rows, latAttr, lonAttr, sizeAttr]);

  const sizeBounds = useMemo(() => {
    const vals = points.map((p) => p.size).filter((s): s is number => s !== null);
    if (vals.length === 0) return null;
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [points]);

  const radius = (size: number | null) => {
    if (size === null || !sizeBounds) return 3;
    const { min, max } = sizeBounds;
    if (max === min) return 3;
    const t = Math.sqrt((size - min) / (max - min));
    return 2 + t * 7;
  };

  const cats = useMemo(
    () => (colorAttr ? uniqueValues(rows, colorAttr.key, { ordinal: !!colorAttr.ordinal }) : []),
    [rows, colorAttr],
  );
  const colorOf = (row: Row) => {
    if (!colorAttr) return DEFAULT_POINT;
    return categoryColor(String(row[colorAttr.key]), cats, { ordinal: !!colorAttr.ordinal });
  };

  const [hovered, setHovered] = useState<{ lat: number; lon: number; row: Row } | null>(null);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="shrink-0 flex items-center gap-3 flex-wrap text-xs text-ink-muted">
        <span>
          {points.length.toLocaleString()} points · {dataset.name} ·{' '}
          equirectangular projection
        </span>
        {hovered && (
          <span className="ml-auto font-mono tabular-nums">
            lat {hovered.lat.toFixed(2)}° · lon {hovered.lon.toFixed(2)}°
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
          {/* Ocean background */}
          <rect x={0} y={0} width={W} height={H} fill="#E5EFFB" />

          {/* Graticule — lat/lon grid every 30 degrees */}
          <g stroke="#BFD3EE" strokeWidth={0.5} fill="none">
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = ((90 - lat) / 180) * H;
              return <line key={`lat${lat}`} x1={0} x2={W} y1={y} y2={y} />;
            })}
            {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
              const x = ((lon + 180) / 360) * W;
              return <line key={`lon${lon}`} x1={x} x2={x} y1={0} y2={H} />;
            })}
          </g>

          {/* Equator + prime meridian — emphasized */}
          <g stroke="#94A3B8" strokeWidth={1} fill="none">
            <line x1={0} x2={W} y1={H / 2} y2={H / 2} />
            <line x1={W / 2} x2={W / 2} y1={0} y2={H} />
          </g>

          {/* Tropics + arctic/antarctic circles — labels for orientation */}
          <g stroke="#CBD5E1" strokeWidth={0.5} strokeDasharray="2 3" fill="none">
            {[-66.5, -23.5, 23.5, 66.5].map((lat) => {
              const y = ((90 - lat) / 180) * H;
              return <line key={`spec${lat}`} x1={0} x2={W} y1={y} y2={y} />;
            })}
          </g>

          {/* Axis labels */}
          <g fontFamily="monospace" fontSize={9} fill="#64748B">
            <text x={4} y={H / 2 - 3}>0° (equator)</text>
            <text x={W / 2 + 3} y={H - 4}>0° (prime meridian)</text>
            <text x={4} y={H - 4}>–90°W</text>
            <text x={W - 4} y={H - 4} textAnchor="end">+90°E</text>
            <text x={4} y={10}>+90°N</text>
            <text x={4} y={H - 14}>–90°S</text>
          </g>

          {/* Points */}
          <g>
            {points.map((p, i) => {
              const { x, y } = project(p.lat, p.lon, W, H);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={radius(p.size)}
                  fill={colorOf(p.row)}
                  fillOpacity={0.6}
                  stroke={hovered === p ? '#1A2A52' : 'transparent'}
                  strokeWidth={1.5}
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="shrink-0 text-[10px] text-ink-muted italic">
        Equirectangular projection · graticule every 30° · dashed lines: tropics (±23.5°) and arctic/antarctic (±66.5°). Continental outlines aren't drawn — the data itself traces them.
      </div>
    </div>
  );
}
