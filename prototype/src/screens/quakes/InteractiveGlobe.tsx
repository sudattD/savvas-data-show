// Reusable interactive globe for the earthquakes activity. Renders an
// orthographic projection (so you see exactly half the planet at a time)
// with three layers: continents, optional overlay paths (Ring of Fire),
// and dots. Drag rotates, scroll/pinch zooms. Same component runs in
// Act 1's reveal, Act 2's Map lens, and Act 3's Revelation — different
// sizes and feature flags.

import { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import landTopo from 'world-atlas/land-110m.json';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { FeatureCollection } from 'geojson';

export interface GlobeDot {
  lat: number;
  lon: number;
  radius?: number;
  /** Optional id so callers can identify the dot on hover. */
  id?: string | number;
  /** Per-dot fill color. Falls back to InteractiveGlobe's dotFill prop. */
  color?: string;
}

export interface GlobeOverlay {
  /** Array of [lat, lon] pairs forming a polyline. */
  points: ReadonlyArray<readonly [number, number]>;
}

interface InteractiveGlobeProps {
  /** Dots to plot on the surface. */
  dots: readonly GlobeDot[];
  /** Optional polylines (e.g. Ring of Fire arcs). */
  overlays?: readonly GlobeOverlay[];
  /** Initial rotation [yaw, pitch] in degrees. */
  initialRotation?: [number, number];
  /** Initial scale (fraction of half-height). 1 = fits the sphere. */
  initialZoom?: number;
  /** Container aspect ratio (width / height). */
  aspectRatio?: number;
  /** Dot fill + stroke. */
  dotFill?: string;
  dotStroke?: string;
  /** Hover callback when a dot is hovered (or null on leave). */
  onHover?: (dot: GlobeDot | null) => void;
  /** Disable user interaction (drag + zoom). */
  locked?: boolean;
  /** Auto-rotate at this many degrees per second (only when no drag). 0 disables. */
  autoRotateDegPerSec?: number;
  /** Background sphere fill. */
  sphereFill?: string;
  /** Land fill. */
  landFill?: string;
}

// Extract the GeoJSON FeatureCollection of land from world-atlas TopoJSON.
const LAND_FC: FeatureCollection = (() => {
  const topology = landTopo as unknown as Topology;
  const obj = topology.objects.land as GeometryCollection;
  return feature(topology, obj) as unknown as FeatureCollection;
})();

const SPHERE = { type: 'Sphere' as const };
const GRATICULE = geoGraticule10();

export default function InteractiveGlobe({
  dots,
  overlays = [],
  initialRotation = [-150, -20],
  initialZoom = 1,
  aspectRatio = 16 / 9,
  dotFill = '#fb7185',
  dotStroke = 'rgba(255,255,255,0.85)',
  onHover,
  locked = false,
  autoRotateDegPerSec = 0,
  sphereFill = '#1e4d8b',
  landFill = '#6b8e3d',
}: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 800, h: 800 / aspectRatio });
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [zoom, setZoom] = useState(initialZoom);
  const dragRef = useRef<{ x: number; y: number; rot: [number, number] } | null>(null);
  const isInteractingRef = useRef(false);

  // Resize observer keeps the projection synced to the container.
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const w = el.clientWidth;
      const h = w / aspectRatio;
      setSize({ w, h });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspectRatio]);

  // Auto-rotation tick — only runs when no interaction.
  useEffect(() => {
    if (autoRotateDegPerSec === 0 || locked) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!isInteractingRef.current) {
        setRotation(([yaw, pitch]) => [yaw + autoRotateDegPerSec * dt, pitch]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotateDegPerSec, locked]);

  // Build the projection + geoPath fresh whenever rotation, zoom, or size changes.
  const projection = useMemo(() => {
    const base = geoOrthographic()
      .scale((size.h / 2) * zoom)
      .translate([size.w / 2, size.h / 2])
      .rotate([rotation[0], rotation[1], 0])
      .clipAngle(90);
    return base;
  }, [rotation, zoom, size.w, size.h]);

  const path = useMemo(() => geoPath(projection), [projection]);

  // Project each dot to pixel space; cull dots on the far hemisphere.
  const projectedDots = useMemo(() => {
    const out: { x: number; y: number; r: number; dot: GlobeDot; color: string }[] = [];
    for (const dot of dots) {
      const p = projection([dot.lon, dot.lat]);
      if (!p) continue;
      out.push({ x: p[0], y: p[1], r: dot.radius ?? 2, dot, color: dot.color ?? dotFill });
    }
    return out;
  }, [dots, projection, dotFill]);

  // Project overlay polylines (e.g. Ring of Fire). For each polyline, emit
  // an SVG path string that breaks at the visible/invisible boundary so a
  // single arc that wraps around the limb renders as two segments.
  const overlayPaths = useMemo(() => {
    return overlays.map((overlay) => {
      let d = '';
      let prevVisible = false;
      for (const [lat, lon] of overlay.points) {
        const p = projection([lon, lat]);
        const visible = !!p;
        if (visible && p) {
          d += `${!prevVisible ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)} `;
        }
        prevVisible = visible;
      }
      return d.trim();
    });
  }, [overlays, projection]);

  // --- Interaction handlers ---
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isInteractingRef.current = true;
    dragRef.current = { x: e.clientX, y: e.clientY, rot: rotation };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (locked) return;
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    // Sensitivity: half a degree per pixel feels right; reduce when zoomed in.
    const sensitivity = 0.5 / zoom;
    const yaw = dragRef.current.rot[0] + dx * sensitivity;
    let pitch = dragRef.current.rot[1] - dy * sensitivity;
    pitch = Math.max(-89, Math.min(89, pitch));
    setRotation([yaw, pitch]);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (locked) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
    dragRef.current = null;
    // Slight delay so autoRotate doesn't kick in jarringly.
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 150);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (locked) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setZoom((z) => Math.max(0.6, Math.min(6, z * factor)));
  };

  const handleDoubleClick = () => {
    if (locked) return;
    setZoom(initialZoom);
    setRotation(initialRotation);
  };

  return (
    <div ref={containerRef} className="w-full relative select-none" style={{ touchAction: locked ? 'auto' : 'none' }}>
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        width="100%"
        height={size.h}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: locked ? 'default' : dragRef.current ? 'grabbing' : 'grab', display: 'block' }}
      >
        <defs>
          {/* Spherical shading: bright highlight upper-left, deepening to
              shadow at the limb on the opposite side. Gives the disc a
              clear 3D feel without obscuring the data. */}
          <radialGradient id="globe-shade" cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          {/* Outer atmospheric glow ring just beyond the sphere edge. */}
          <radialGradient id="globe-atmo" cx="50%" cy="50%" r="58%">
            <stop offset="88%" stopColor="rgba(140,200,255,0)" />
            <stop offset="95%" stopColor="rgba(140,200,255,0.55)" />
            <stop offset="100%" stopColor="rgba(140,200,255,0)" />
          </radialGradient>
        </defs>

        {/* Atmospheric halo painted behind the sphere */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={(size.h / 2) * zoom * 1.08}
          fill="url(#globe-atmo)"
          pointerEvents="none"
        />

        {/* Sphere (ocean) */}
        <path d={path(SPHERE) ?? ''} fill={sphereFill} />

        {/* Graticule grid — very faint, suggests sphere without looking
            like a wireframe. */}
        <path
          d={path(GRATICULE) ?? ''}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={0.4}
        />

        {/* Land */}
        <path d={path(LAND_FC) ?? ''} fill={landFill} stroke="rgba(0,0,0,0.35)" strokeWidth={0.4} />

        {/* Overlays (e.g. Ring of Fire) */}
        {overlayPaths.length > 0 && (
          <g stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" fill="none" opacity={0.9}>
            {overlayPaths.map((d, i) => (d ? <path key={i} d={d} /> : null))}
          </g>
        )}

        {/* Dots — fresh DOM nodes get a brief "flash" animation on mount,
            mimicking the NOAA SOS look where each event pops bright then
            settles. The animation is keyed off the dot.id so React only
            remounts when a new event appears. */}
        {projectedDots.map((d, i) => (
          <circle
            key={d.dot.id ?? i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.color}
            fillOpacity={0.85}
            stroke={dotStroke}
            strokeWidth={0.35}
            className="quake-dot"
            onMouseEnter={onHover ? () => onHover(d.dot) : undefined}
            onMouseLeave={onHover ? () => onHover(null) : undefined}
          />
        ))}

        {/* Spherical shading — adds depth without obscuring data */}
        <path d={path(SPHERE) ?? ''} fill="url(#globe-shade)" pointerEvents="none" />
      </svg>

      {!locked && (
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/50 pointer-events-none">
          drag · scroll · double-click to reset
        </div>
      )}
    </div>
  );
}
