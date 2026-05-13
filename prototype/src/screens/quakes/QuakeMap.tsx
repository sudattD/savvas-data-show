import { useEffect, useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';
import { WORLD_LAND_PATH, WORLD_W, WORLD_H } from '../../components/explorer/worldLand';

interface QuakeMapProps {
  onNext: (summary: QuakeSummary) => void;
}

export interface QuakeSummary {
  totalCount: number;
  shownCount: number;
  minMag: number;
  description: string;
  ringOfFireCount: number;
}

interface QuakePoint {
  lat: number;
  lon: number;
  magnitude: number;
  depthKm: number;
  place: string;
  region: string;
}

function project(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * WORLD_W;
  const y = ((90 - lat) / 180) * WORLD_H;
  return [x, y];
}

// The Pacific Ring of Fire — coarse bounding regions used to count how many
// of the student's visible quakes fall along it.
function isRingOfFire(lat: number, lon: number): boolean {
  // Western Pacific (Japan, Philippines, Indonesia, Tonga)
  if (lon >= 90 && lon <= 180 && lat >= -45 && lat <= 60) return true;
  // Eastern Pacific (Aleutians, US West Coast, Central + South America)
  if (lon >= -180 && lon <= -65 && lat >= -55 && lat <= 65) return true;
  return false;
}

const SAMPLE_TICKS = 24; // animation steps for the drop-in
const DROP_MS = 1100;

export default function QuakeMap({ onNext }: QuakeMapProps) {
  const dataset = getDataset('earthquakes');
  const allPoints = useMemo<QuakePoint[]>(() => {
    return dataset.rows.map((r) => ({
      lat: Number(r.lat),
      lon: Number(r.lon),
      magnitude: Number(r.magnitude),
      depthKm: Number(r.depthKm),
      place: String(r.place ?? ''),
      region: String(r.region ?? ''),
    }));
  }, [dataset]);

  const [minMag, setMinMag] = useState(2.5);
  const [description, setDescription] = useState('');
  const [hoverPoint, setHoverPoint] = useState<QuakePoint | null>(null);
  // Reveal animation: count of dots currently visible
  const [revealed, setRevealed] = useState(0);
  const [plateLines, setPlateLines] = useState(false);

  const filteredPoints = useMemo(
    () => allPoints.filter((p) => p.magnitude >= minMag),
    [allPoints, minMag],
  );

  // Drop-in animation when component mounts
  useEffect(() => {
    if (filteredPoints.length === 0) return;
    const tickMs = DROP_MS / SAMPLE_TICKS;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      const visibleCount = Math.min(
        filteredPoints.length,
        Math.floor((tick / SAMPLE_TICKS) * filteredPoints.length),
      );
      setRevealed(visibleCount);
      if (tick >= SAMPLE_TICKS) {
        setRevealed(filteredPoints.length);
        window.clearInterval(id);
      }
    }, tickMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the user changes the mag filter, snap to fully revealed.
  useEffect(() => {
    setRevealed(filteredPoints.length);
  }, [filteredPoints.length]);

  const shown = filteredPoints.slice(0, revealed);
  const ringOfFireCount = filteredPoints.filter((p) => isRingOfFire(p.lat, p.lon)).length;

  const canAdvance = description.trim().length >= 4;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-rose-700">
            ACT 2 · PLOT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            One week of earthquakes.
          </h1>
          <p className="text-sm text-slate-600">
            Each dot is a real event. Size is magnitude. Drag the slider to filter strong ones.
          </p>
        </div>
      </div>

      <HostBubble accent="rose" name="Sol">
        Coordinates are about to do a lot of work. Latitude is the Y axis,
        longitude is the X — exactly like your math class. The faint
        outline is continents. Every dot is a real place where the ground
        moved this past week.
      </HostBubble>

      {/* Map */}
      <div className="bg-[#0c0c1e] rounded-xl border border-slate-800 overflow-hidden">
        <svg
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          className="w-full block"
          onMouseLeave={() => setHoverPoint(null)}
        >
          {/* Lat/lon grid */}
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line
              key={`lat-${lat}`}
              x1={0}
              x2={WORLD_W}
              y1={project(lat, 0)[1]}
              y2={project(lat, 0)[1]}
              stroke="#1f2240"
              strokeWidth={0.4}
            />
          ))}
          {[-120, -60, 0, 60, 120].map((lon) => (
            <line
              key={`lon-${lon}`}
              x1={project(0, lon)[0]}
              x2={project(0, lon)[0]}
              y1={0}
              y2={WORLD_H}
              stroke="#1f2240"
              strokeWidth={0.4}
            />
          ))}
          {/* Equator */}
          <line
            x1={0}
            x2={WORLD_W}
            y1={WORLD_H / 2}
            y2={WORLD_H / 2}
            stroke="#2c2c4a"
            strokeWidth={0.8}
          />

          {/* World land outline */}
          <path d={WORLD_LAND_PATH} fill="#1a1a30" stroke="#2c2c4a" strokeWidth={0.4} />

          {/* Optional plate-boundary curves (Ring of Fire emphasis) */}
          {plateLines && (
            <g stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 3" fill="none" opacity={0.85}>
              {/* Eastern Pacific arc — rough sketch */}
              <path d="M 100,40 Q 110,90 130,140 T 150,260 T 170,330" />
              {/* Western Pacific arc */}
              <path d="M 555,80 Q 585,110 605,150 T 625,220 T 605,290 T 575,330" />
            </g>
          )}

          {/* Quake dots */}
          {shown.map((p, i) => {
            const [x, y] = project(p.lat, p.lon);
            const r = Math.max(1.2, (p.magnitude - 2) * 0.9);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill="#fb7185"
                fillOpacity={0.75}
                stroke="#fef2f2"
                strokeWidth={0.2}
                onMouseEnter={() => setHoverPoint(p)}
              />
            );
          })}

          {/* Tooltip for hovered point */}
          {hoverPoint && (
            <g>
              <rect
                x={project(hoverPoint.lat, hoverPoint.lon)[0] + 6}
                y={project(hoverPoint.lat, hoverPoint.lon)[1] - 28}
                width={210}
                height={26}
                fill="#0c0c1e"
                stroke="#f59e0b"
                strokeWidth={0.4}
                rx={3}
              />
              <text
                x={project(hoverPoint.lat, hoverPoint.lon)[0] + 11}
                y={project(hoverPoint.lat, hoverPoint.lon)[1] - 16}
                fontSize={7}
                fill="#fef3c7"
                fontFamily="monospace"
              >
                M{hoverPoint.magnitude.toFixed(1)} · {hoverPoint.depthKm.toFixed(0)}km deep
              </text>
              <text
                x={project(hoverPoint.lat, hoverPoint.lon)[0] + 11}
                y={project(hoverPoint.lat, hoverPoint.lon)[1] - 7}
                fontSize={6.5}
                fill="#e2e8f0"
                fontFamily="monospace"
              >
                {hoverPoint.place.slice(0, 38)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[10px] font-semibold tracking-widest text-rose-700">MIN MAGNITUDE</div>
            <div className="font-display text-xl font-bold text-rose-700 tabular-nums">M{minMag.toFixed(1)}+</div>
          </div>
          <input
            type="range"
            min={2.5}
            max={6}
            step={0.1}
            value={minMag}
            onChange={(e) => setMinMag(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>2.5 · felt</span>
            <span>4.5 · damaging</span>
            <span>6.0 · destructive</span>
          </div>
          <div className="text-xs text-slate-600 mt-2">
            <strong className="tabular-nums">{filteredPoints.length}</strong> of{' '}
            <strong className="tabular-nums">{allPoints.length}</strong> quakes this week.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-2">OVERLAY</div>
          <button
            onClick={() => setPlateLines((p) => !p)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              plateLines
                ? 'bg-amber-500 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {plateLines ? 'Hide plate-boundary arcs' : 'Show plate-boundary arcs'}
          </button>
          <div className="text-xs text-slate-600 mt-2 leading-snug">
            The arcs are the Pacific Ring of Fire — where plates push under each other.
            Toggle them on and see whether your dots match.
          </div>
        </div>
      </div>

      {/* Describe-the-pattern */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="text-[10px] font-semibold tracking-widest text-rose-700">YOUR OBSERVATION</div>
        <label className="text-sm font-semibold text-ink">
          Describe the pattern in one sentence.
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Most quakes line the edges of the Pacific. Hardly any in the middle of oceans or continents."
          className="w-full px-3 py-2 rounded-md border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-sm resize-none"
          rows={2}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() =>
            onNext({
              totalCount: allPoints.length,
              shownCount: filteredPoints.length,
              minMag,
              description: description.trim(),
              ringOfFireCount,
            })
          }
          disabled={!canAdvance}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold shadow-md hover:shadow-lg disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition"
        >
          {canAdvance ? 'See what you found →' : 'Write one sentence to continue'}
        </button>
      </div>
    </div>
  );
}
