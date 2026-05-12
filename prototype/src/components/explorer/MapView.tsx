import { useMemo, useRef, useState } from 'react';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor, uniqueValues, DEFAULT_POINT } from './ColorScale';
import { WORLD_LAND_PATH } from './worldLand';

function formatScalar(v: number): string {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  if (Math.abs(v) >= 100) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

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

const MIN_ZOOM = 1;
const MAX_ZOOM = 16;

// Preset regions in [lonMin, lonMax, latMin, latMax].
type Region = { name: string; bounds: [number, number, number, number] };
const REGIONS: Region[] = [
  { name: 'World',        bounds: [-180, 180, -90, 90] },
  { name: 'Atlantic',     bounds: [-100, -10, 5, 50] },
  { name: 'Pacific',      bounds: [120, -80, -40, 50] },
  { name: 'N. America',   bounds: [-130, -60, 15, 55] },
  { name: 'Europe',       bounds: [-15, 40, 35, 70] },
  { name: 'Asia · Pacific', bounds: [60, 180, -10, 50] },
];

// Region bounds (lon/lat degrees) → viewBox state (zoom + center in image px).
function regionToViewBox(b: [number, number, number, number]): { zoom: number; cx: number; cy: number } {
  let [lonMin, lonMax, latMin, latMax] = b;
  // Handle wrap-around: if lonMax < lonMin, treat as crossing antimeridian
  // by shifting longitudes. For simplicity, clamp wrap-around to "World" view.
  if (lonMax < lonMin) return { zoom: 1, cx: W / 2, cy: H / 2 };
  const x1 = ((lonMin + 180) / 360) * W;
  const x2 = ((lonMax + 180) / 360) * W;
  const y1 = ((90 - latMax) / 180) * H;
  const y2 = ((90 - latMin) / 180) * H;
  const w = x2 - x1;
  const h = y2 - y1;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  // Zoom = whichever axis is more constraining, with a 10% padding margin.
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(W / w, H / h) * 0.9));
  return { zoom, cx, cy };
}

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

  // Zoom + pan state. `zoom` = 1 is the full earth; `cx, cy` is the viewport
  // center in image-pixel coordinates (1 unit = 1 SVG-coordinate pixel).
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ cx: W / 2, cy: H / 2 });
  const svgRef = useRef<SVGSVGElement>(null);

  // The visible viewBox derived from zoom + center, clamped so the view
  // doesn't escape the image extent.
  const viewBox = useMemo(() => {
    const vw = W / zoom;
    const vh = H / zoom;
    const minX = Math.max(0, Math.min(W - vw, center.cx - vw / 2));
    const minY = Math.max(0, Math.min(H - vh, center.cy - vh / 2));
    return { minX, minY, vw, vh };
  }, [zoom, center]);

  // Geometry to size dots inversely with zoom so they don't bloat into blobs
  // when zoomed in. radius = base / sqrt(zoom).
  const radius = (size: number | null) => {
    const base = size === null || !sizeBounds
      ? 3
      : (() => {
          const { min, max } = sizeBounds;
          if (max === min) return 3;
          const t = Math.sqrt((size - min) / (max - min));
          return 2 + t * 7;
        })();
    return base / Math.sqrt(zoom);
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

  // Convert a screen-space mouse event into image-pixel coords (so we can
  // zoom centered on the cursor). Uses SVG's intrinsic CTM.
  function eventToImage(e: React.MouseEvent | React.WheelEvent): { ix: number; iy: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = pt.matrixTransform(ctm.inverse());
    return { ix: p.x, iy: p.y };
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const pt = eventToImage(e);
    if (!pt) return;
    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = direction > 0 ? 1.25 : 0.8;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
    if (newZoom === zoom) return;
    // Keep the cursor point fixed in image-space by adjusting center.
    const ratio = zoom / newZoom; // how much smaller new view is
    const dx = pt.ix - center.cx;
    const dy = pt.iy - center.cy;
    setCenter({
      cx: pt.ix - dx * ratio,
      cy: pt.iy - dy * ratio,
    });
    setZoom(newZoom);
  }

  // Drag-to-pan
  const dragRef = useRef<{ startX: number; startY: number; startCx: number; startCy: number } | null>(null);
  function handleMouseDown(e: React.MouseEvent) {
    const pt = eventToImage(e);
    if (!pt) return;
    dragRef.current = { startX: pt.ix, startY: pt.iy, startCx: center.cx, startCy: center.cy };
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const pt = eventToImage(e);
    if (!pt) return;
    const dx = pt.ix - dragRef.current.startX;
    const dy = pt.iy - dragRef.current.startY;
    setCenter({
      cx: dragRef.current.startCx - dx,
      cy: dragRef.current.startCy - dy,
    });
  }
  function handleMouseUp() {
    dragRef.current = null;
  }

  function setRegion(r: Region) {
    const { zoom: z, cx, cy } = regionToViewBox(r.bounds);
    setZoom(z);
    setCenter({ cx, cy });
  }

  function zoomBy(factor: number) {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
    setZoom(newZoom);
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="shrink-0 flex items-center gap-3 flex-wrap text-xs text-ink-muted">
        <span>
          {points.length.toLocaleString()} points · {dataset.name}
        </span>
        {sizeAttr && sizeBounds && (
          <span>
            · dot size = <span className="font-semibold text-ink">{sizeAttr.label}{sizeAttr.unit ? ` (${sizeAttr.unit})` : ''}</span> · {formatScalar(sizeBounds.min)}–{formatScalar(sizeBounds.max)}
          </span>
        )}
        {colorAttr && (
          <span>· color = <span className="font-semibold text-ink">{colorAttr.label}</span></span>
        )}
        <span className="font-mono tabular-nums opacity-70">
          zoom {zoom.toFixed(1)}×
        </span>
        {hovered && (
          <span className="ml-auto font-mono tabular-nums">
            lat {hovered.lat.toFixed(2)}° · lon {hovered.lon.toFixed(2)}°
          </span>
        )}
      </div>

      {/* Region preset + zoom controls */}
      <div className="shrink-0 flex items-center gap-2 flex-wrap">
        <span className="eyebrow text-ink-muted text-[10px] mr-1">Region</span>
        {REGIONS.map((r) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setRegion(r)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle hover:border-brand-300 hover:text-brand-700 transition"
          >
            {r.name}
          </button>
        ))}
        <span className="text-surface-line mx-1">·</span>
        <button
          type="button"
          onClick={() => zoomBy(1.5)}
          className="text-xs font-bold w-7 h-7 rounded-md bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle hover:border-brand-300 transition"
          title="Zoom in"
        >+</button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.5)}
          className="text-xs font-bold w-7 h-7 rounded-md bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle hover:border-brand-300 transition"
          title="Zoom out"
        >−</button>
        <button
          type="button"
          onClick={() => setRegion(REGIONS[0])}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle hover:border-brand-300 transition"
          title="Reset to world view"
        >
          Reset
        </button>
        <span className="text-[10px] text-ink-muted italic ml-auto hidden sm:inline">
          Scroll to zoom · drag to pan
        </span>
      </div>

      <div
        className="flex-1 min-h-0 bg-surface-raised border border-surface-line rounded-lg overflow-hidden"
        style={{ cursor: dragRef.current ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.vw} ${viewBox.vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full block select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Ocean background */}
          <rect x={0} y={0} width={W} height={H} fill="#E5EFFB" />

          {/* Continental landmass underlay — Natural Earth 1:110m.
              Soft warm fill so it reads as "land" without competing with
              colored data points layered above. */}
          <path
            d={WORLD_LAND_PATH}
            fill="#F5EFE4"
            stroke="#C7B89A"
            strokeWidth={0.4 / zoom}
            fillRule="evenodd"
          />

          {/* Graticule — lat/lon grid every 30 degrees, kept very light so
              the land outline is the dominant guide. */}
          <g stroke="#94A3B8" strokeOpacity={0.18} strokeWidth={0.4 / zoom} fill="none">
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
          <g stroke="#64748B" strokeOpacity={0.35} strokeWidth={0.7 / zoom} fill="none">
            <line x1={0} x2={W} y1={H / 2} y2={H / 2} />
            <line x1={W / 2} x2={W / 2} y1={0} y2={H} />
          </g>

          {/* Tropics + arctic/antarctic circles — labels for orientation */}
          <g stroke="#94A3B8" strokeOpacity={0.25} strokeWidth={0.4 / zoom} strokeDasharray={`${2 / zoom} ${3 / zoom}`} fill="none">
            {[-66.5, -23.5, 23.5, 66.5].map((lat) => {
              const y = ((90 - lat) / 180) * H;
              return <line key={`spec${lat}`} x1={0} x2={W} y1={y} y2={y} />;
            })}
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
                  strokeWidth={1.5 / zoom}
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
        Equirectangular projection · graticule every 30° · dashed lines: tropics (±23.5°) and arctic/antarctic (±66.5°). Continental outlines: Natural Earth 1:110m.
      </div>
    </div>
  );
}
