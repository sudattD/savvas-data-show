import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { ConstellationDraft } from './ConstellationDesign';

interface ConstellationClaimProps {
  draft: ConstellationDraft;
  onRestart: () => void;
}

// Render the drafted polygon at thumbnail size against a tiny starfield.
function ThumbnailSky({ draft }: { draft: ConstellationDraft }) {
  const W = 360;
  const H = 160;
  // Bounding box of the picks in (RA·15, Dec) — fit-to-frame with a margin.
  const xs = draft.vertices.map((v) => -v.raHours * 15);
  const ys = draft.vertices.map((v) => -v.decDeg);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padX = Math.max(8, (maxX - minX) * 0.15);
  const padY = Math.max(8, (maxY - minY) * 0.15);
  const x0 = minX - padX;
  const x1 = maxX + padX;
  const y0 = minY - padY;
  const y1 = maxY + padY;
  const spanX = Math.max(1, x1 - x0);
  const spanY = Math.max(1, y1 - y0);
  const proj = (vx: number, vy: number) => {
    const sx = ((-vx * 15 - x0) / spanX) * W;
    const sy = ((-vy - y0) / spanY) * H;
    return [sx, sy];
  };
  const pts = draft.vertices.map((v) => proj(v.raHours, v.decDeg));
  const pathD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ') + (draft.closed ? ' Z' : '');

  // Decorative starfield (deterministic noise so the card is stable on rerender)
  const stars = Array.from({ length: 70 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed % 1000) / 1000 * W;
    const y = ((seed * 7) % 1000) / 1000 * H;
    const r = ((seed * 3) % 100) / 200 + 0.2;
    const op = ((seed * 5) % 100) / 200 + 0.25;
    return { x, y, r, op };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ background: '#06060e' }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" fillOpacity={s.op} />
      ))}
      <path
        d={pathD}
        fill={draft.closed ? '#a78bfa' : 'none'}
        fillOpacity={0.18}
        stroke="#c4b5fd"
        strokeWidth={1.5}
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.8} fill="#fef3c7" />
      ))}
    </svg>
  );
}

export default function ConstellationClaim({ draft, onRestart }: ConstellationClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const n = draft.vertices.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 3 · CLAIM
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            You made a polygon out of stars.
          </h1>
          <p className="text-sm text-slate-600">
            Real coordinates, real geometry, your name on it.
          </p>
        </div>
      </div>

      <HostBubble accent="purple">
        Here's what the chapter actually proves. Any simple polygon with{' '}
        <strong>n</strong> sides has interior angles that sum to{' '}
        <strong>(n−2)·180°</strong>. Your {draft.shapeName.toLowerCase()} has{' '}
        {n} sides, so the angles inside it add up to{' '}
        <strong className="tabular-nums">{(n - 2) * 180}°</strong> — that holds
        whether you draw it on paper or paste it onto the sky. The IAU has 88
        official constellations. Now there's an 89th.
      </HostBubble>

      <div className="grid md:grid-cols-3 gap-3">
        <ResultCard label="SHAPE" value={draft.shapeName} />
        <ResultCard label="PERIMETER" value={`${draft.perimeterDeg.toFixed(1)}°`} subtle="arc-degrees" />
        <ResultCard label="INTERIOR ∠ SUM" value={`${draft.interiorAngleSum}°`} subtle={`(${n}−2)·180°`} />
      </div>

      <div className="bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="grid md:grid-cols-[auto_1fr] gap-5 items-start">
          <div className="shrink-0 w-full md:w-80 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
            <ThumbnailSky draft={draft} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold tracking-widest text-indigo-100 mb-1">
              DATA CARD · GEO · TOPIC 6 · POLYGONS
            </div>
            <h3 className="font-display text-3xl font-bold mb-1 break-words">{draft.name}</h3>
            <div className="text-sm text-indigo-100 mb-3">
              {draft.shapeName} · {n} vertices · perimeter {draft.perimeterDeg.toFixed(1)}°
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="One line about what your constellation means…"
              className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
              rows={2}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={caption.trim().length === 0}
                  className="px-4 py-2 rounded-lg bg-white text-indigo-800 font-semibold hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save to my notebook
                </button>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">
                  Saved to notebook
                </div>
              )}
              <button
                onClick={onRestart}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20"
              >
                Design another
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900 leading-relaxed">
        <div className="font-semibold mb-1">One honest catch.</div>
        We measured perimeter on a flat (RA, Dec) plane, but the sky is a
        sphere. For tight constellations the error is tiny; spread far enough
        and the spherical correction matters. That's why the angles of a real
        sky polygon actually sum to a little more than (n−2)·180° — and that
        extra bit is its own chapter of geometry.
      </div>
    </div>
  );
}

function ResultCard({ label, value, subtle }: { label: string; value: string; subtle?: string }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <div className="text-[10px] font-semibold tracking-widest text-indigo-700 mb-1">{label}</div>
      <div className="font-display text-2xl font-bold text-indigo-900 tabular-nums">{value}</div>
      {subtle && <div className="text-[10px] text-slate-500 mt-0.5">{subtle}</div>}
    </div>
  );
}
