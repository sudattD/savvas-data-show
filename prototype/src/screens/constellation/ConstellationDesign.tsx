import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

export interface ConstellationVertex {
  name: string;
  raHours: number;
  decDeg: number;
  mag: number;
  constellation: string;
}

export interface ConstellationDraft {
  name: string;
  vertices: ConstellationVertex[];
  closed: boolean;
  perimeterDeg: number;
  interiorAngleSum: number;
  shapeName: string;
}

interface ConstellationDesignProps {
  onNext: (draft: ConstellationDraft) => void;
}

// Plot box in viewBox units. 24h RA wide, 180° dec tall.
const VB_W = 1200;
const VB_H = 540;
const RA_MIN = 0;
const RA_MAX = 24;
const DEC_MIN = -90;
const DEC_MAX = 90;

// RA runs right-to-left in sky convention (matches SkyView).
function raToX(ra: number): number {
  return VB_W - ((ra - RA_MIN) / (RA_MAX - RA_MIN)) * VB_W;
}
function decToY(dec: number): number {
  return VB_H - ((dec - DEC_MIN) / (DEC_MAX - DEC_MIN)) * VB_H;
}

// Star marker radius by apparent magnitude (lower mag = brighter = bigger).
function magToRadius(mag: number): number {
  const r = 6 - mag * 0.9;
  return Math.max(0.7, Math.min(7, r));
}

// Spectral-class hue tint — colored "stars" look like real sky.
const STELLAR_FILL = '#f5f5ff';

const SHAPE_NAMES: Record<number, string> = {
  3: 'Triangle',
  4: 'Quadrilateral',
  5: 'Pentagon',
  6: 'Hexagon',
  7: 'Heptagon',
  8: 'Octagon',
  9: 'Nonagon',
};

function shapeNameFor(n: number, closed: boolean): string {
  if (!closed) return n < 2 ? '—' : n === 2 ? 'Segment' : `${n}-vertex path`;
  return SHAPE_NAMES[n] ?? `${n}-gon`;
}

// Great-circle-ish distance in degrees treating the (RA·15, Dec) plane
// as Cartesian. Honest at Algebra-1/Geometry level; spherical correction
// is one of the chapter-end discussion questions.
function arcDeg(a: ConstellationVertex, b: ConstellationVertex): number {
  const dx = (a.raHours - b.raHours) * 15;
  const dy = a.decDeg - b.decDeg;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function ConstellationDesign({ onNext }: ConstellationDesignProps) {
  const dataset = getDataset('stars');
  const allStars = useMemo(
    () =>
      dataset.rows.map((r) => ({
        name: String(r.name ?? ''),
        raHours: Number(r.raHours),
        decDeg: Number(r.decDeg),
        mag: Number(r.mag ?? 5),
        constellation: String(r.constellation ?? ''),
      })),
    [dataset],
  );

  const [selected, setSelected] = useState<ConstellationVertex[]>([]);
  const [closed, setClosed] = useState(false);
  const [name, setName] = useState('');

  // Limit picks so the math stays tractable.
  const MAX_PICKS = 9;

  const onPick = (s: ConstellationVertex) => {
    if (closed) return;
    // Toggle: deselecting a vertex pops the polygon back to before that pick.
    const idx = selected.findIndex((v) => v.name === s.name);
    if (idx >= 0) {
      setSelected(selected.slice(0, idx));
      return;
    }
    if (selected.length >= MAX_PICKS) return;
    setSelected([...selected, s]);
  };

  const undo = () => {
    if (closed) {
      setClosed(false);
      return;
    }
    setSelected(selected.slice(0, -1));
  };

  const reset = () => {
    setSelected([]);
    setClosed(false);
  };

  const closePolygon = () => {
    if (selected.length < 3) return;
    setClosed(true);
  };

  // Geometry stats
  const n = selected.length;
  const perimeterDeg = useMemo(() => {
    if (n < 2) return 0;
    let total = 0;
    for (let i = 0; i < n - 1; i++) total += arcDeg(selected[i], selected[i + 1]);
    if (closed && n >= 3) total += arcDeg(selected[n - 1], selected[0]);
    return total;
  }, [selected, closed, n]);
  const interiorAngleSum = closed && n >= 3 ? (n - 2) * 180 : 0;
  const shapeName = shapeNameFor(n, closed);

  // Build polyline d-string in viewBox coords
  const polylineD = useMemo(() => {
    if (n === 0) return '';
    let d = `M${raToX(selected[0].raHours)},${decToY(selected[0].decDeg)}`;
    for (let i = 1; i < n; i++) {
      d += ` L${raToX(selected[i].raHours)},${decToY(selected[i].decDeg)}`;
    }
    if (closed) d += ' Z';
    return d;
  }, [selected, closed, n]);

  const canSubmit = closed && n >= 3 && name.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onNext({
      name: name.trim(),
      vertices: selected,
      closed,
      perimeterDeg,
      interiorAngleSum,
      shapeName,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 2 · DESIGN
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Pick stars. Make a shape.
          </h1>
          <p className="text-sm text-slate-600">
            Click 3–9 stars to set your vertices. Brighter dots are brighter stars.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        The dark canvas is the whole sky. Right ascension runs left-to-right
        (0–24 hours), declination runs top-to-bottom (+90° at the north pole,
        −90° at the south). Pick a star to start a polygon; pick another to
        add an edge. When you have at least 3 vertices, close it.
      </HostBubble>

      <div className="relative bg-[#06060e] rounded-xl border border-slate-800 overflow-hidden">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full block touch-none select-none"
          preserveAspectRatio="none"
        >
          {/* Grid every 3 RA hours and 30° Dec */}
          {[3, 6, 9, 12, 15, 18, 21].map((h) => (
            <line
              key={`vh-${h}`}
              x1={raToX(h)}
              x2={raToX(h)}
              y1={0}
              y2={VB_H}
              stroke="#1f2240"
              strokeWidth={0.5}
              strokeDasharray="3 6"
            />
          ))}
          {[-60, -30, 0, 30, 60].map((d) => (
            <line
              key={`hd-${d}`}
              x1={0}
              x2={VB_W}
              y1={decToY(d)}
              y2={decToY(d)}
              stroke="#1f2240"
              strokeWidth={0.5}
              strokeDasharray="3 6"
            />
          ))}
          {/* Celestial equator slightly stronger */}
          <line
            x1={0}
            x2={VB_W}
            y1={decToY(0)}
            y2={decToY(0)}
            stroke="#2c2c4a"
            strokeWidth={0.8}
          />

          {/* Stars */}
          {allStars.map((s) => {
            const cx = raToX(s.raHours);
            const cy = decToY(s.decDeg);
            const r = magToRadius(s.mag);
            const isSelected = selected.some((v) => v.name === s.name);
            return (
              <g key={s.name} onClick={() => onPick(s)} className="cursor-pointer">
                {/* invisible hit target */}
                <circle cx={cx} cy={cy} r={Math.max(r + 6, 10)} fill="transparent" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={STELLAR_FILL}
                  fillOpacity={0.95}
                />
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 5}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={1.6}
                  />
                )}
              </g>
            );
          })}

          {/* Polygon edges + fill */}
          {n >= 2 && (
            <path
              d={polylineD}
              fill={closed ? '#a78bfa' : 'none'}
              fillOpacity={closed ? 0.12 : 0}
              stroke="#a78bfa"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Vertex labels — order numbers */}
          {selected.map((v, i) => (
            <g key={`label-${v.name}`}>
              <circle cx={raToX(v.raHours) + 9} cy={decToY(v.decDeg) - 9} r={7} fill="#1e1b4b" stroke="#fbbf24" strokeWidth={1} />
              <text
                x={raToX(v.raHours) + 9}
                y={decToY(v.decDeg) - 6}
                textAnchor="middle"
                fontSize={9}
                fontWeight="bold"
                fill="#fde68a"
              >
                {i + 1}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={12} y={VB_H - 8} fontSize={11} fill="#a8a8c0" fontFamily="monospace">
            RA →
          </text>
          <text x={VB_W - 12} y={VB_H - 8} fontSize={11} fill="#a8a8c0" fontFamily="monospace" textAnchor="end">
            ← RA 0h
          </text>
          <text x={12} y={16} fontSize={11} fill="#a8a8c0" fontFamily="monospace">
            +90° Dec (north)
          </text>
          <text x={12} y={VB_H - 22} fontSize={11} fill="#a8a8c0" fontFamily="monospace">
            −90° Dec (south)
          </text>
        </svg>

        {/* Toolbar overlay */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-2">
          <button
            onClick={undo}
            disabled={n === 0 && !closed}
            className="px-3 py-1.5 rounded-md bg-slate-900/70 text-slate-100 text-xs font-semibold backdrop-blur border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={reset}
            disabled={n === 0 && !closed}
            className="px-3 py-1.5 rounded-md bg-slate-900/70 text-slate-100 text-xs font-semibold backdrop-blur border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={closePolygon}
            disabled={n < 3 || closed}
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold border border-indigo-400 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {closed ? 'Closed ✓' : 'Close polygon'}
          </button>
        </div>
      </div>

      {/* Live stats */}
      <div className="grid md:grid-cols-4 gap-3">
        <StatCard label="VERTICES" value={n === 0 ? '—' : String(n)} subtle={n < 3 ? `pick ${3 - n} more` : closed ? 'closed' : 'click "close polygon"'} />
        <StatCard label="SHAPE" value={shapeName} subtle={closed ? 'simple polygon' : 'open path'} />
        <StatCard
          label="PERIMETER"
          value={n < 2 ? '—' : `${perimeterDeg.toFixed(1)}°`}
          subtle={n < 2 ? '' : 'arc-degrees on the sky'}
        />
        <StatCard
          label="INTERIOR ∠ SUM"
          value={!closed || n < 3 ? '—' : `${interiorAngleSum}°`}
          subtle={!closed || n < 3 ? 'close to compute' : `(n−2)·180° with n=${n}`}
        />
      </div>

      {/* Vertex list */}
      {n > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 text-[11px] font-semibold tracking-widest text-slate-600 bg-slate-50 border-b border-slate-200">
            VERTICES ({n})
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 tracking-widest">
              <tr>
                <th className="text-left px-4 py-1.5 w-8">#</th>
                <th className="text-left px-4 py-1.5">STAR</th>
                <th className="text-left px-4 py-1.5">CONSTELLATION</th>
                <th className="text-right px-4 py-1.5">RA</th>
                <th className="text-right px-4 py-1.5 pr-4">DEC</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((v, i) => (
                <tr key={v.name} className="border-t border-slate-100">
                  <td className="px-4 py-1.5 font-mono text-amber-700 font-bold">{i + 1}</td>
                  <td className="px-4 py-1.5 font-semibold text-ink">{v.name}</td>
                  <td className="px-4 py-1.5 text-slate-600">{v.constellation}</td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-700 tabular-nums">{v.raHours.toFixed(2)}h</td>
                  <td className="px-4 py-1.5 text-right font-mono text-slate-700 tabular-nums pr-4">
                    {v.decDeg > 0 ? '+' : ''}
                    {v.decDeg.toFixed(2)}°
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Name + advance */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <label className="block text-sm font-semibold text-ink">
          Name your constellation
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Coffee Cup"
          className="w-full px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
          maxLength={40}
        />
        <div className="flex justify-end pt-1">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-semibold shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition"
          >
            {n < 3
              ? `Pick at least ${3 - n} more star${3 - n === 1 ? '' : 's'}`
              : !closed
                ? 'Close your polygon first'
                : name.trim().length === 0
                  ? 'Name it to continue'
                  : 'Claim it →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtle }: { label: string; value: string; subtle: string }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
      <div className="text-[10px] font-semibold tracking-widest text-indigo-700">{label}</div>
      <div className="font-display text-xl font-bold text-indigo-900 tabular-nums mt-0.5">{value}</div>
      {subtle && <div className="text-[10px] text-slate-500 mt-0.5">{subtle}</div>}
    </div>
  );
}
