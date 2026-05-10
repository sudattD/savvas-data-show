import { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';

const G = 9.8; // m/s²

interface Trajectory { x: number; y: number; t: number; }

function trajectory(angleDeg: number, velocity: number, x0 = 0, y0 = 0): Trajectory[] {
  const angle = (angleDeg * Math.PI) / 180;
  const vx = velocity * Math.cos(angle);
  const vy = velocity * Math.sin(angle);
  // Time to land back at y0: t = 2·vy / g
  const tEnd = (2 * vy) / G;
  const points: Trajectory[] = [];
  const STEPS = 80;
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * tEnd;
    points.push({
      x: x0 + vx * t,
      y: y0 + vy * t - 0.5 * G * t * t,
      t,
    });
  }
  return points;
}

const TARGETS = [
  { id: 't1', x: 30, label: 'easy' },
  { id: 't2', x: 60, label: 'medium' },
  { id: 't3', x: 95, label: 'far' },
  { id: 't4', x: 120, label: 'long' },
];

export default function HitTheTarget() {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(25);
  const [targetX, setTargetX] = useState(60);
  const [hits, setHits] = useState<Set<string>>(new Set());

  const points = useMemo(() => trajectory(angle, velocity), [angle, velocity]);
  const range = points[points.length - 1].x;
  const peak = Math.max(...points.map((p) => p.y));
  const peakX = points[points.findIndex((p) => p.y === peak)]?.x ?? 0;

  const hitTolerance = 3; // meters
  const hit = Math.abs(range - targetX) <= hitTolerance;

  const recordHit = () => {
    if (!hit) return;
    const target = TARGETS.find((t) => t.x === targetX);
    if (!target) return;
    setHits((s) => new Set(s).add(target.id));
  };

  // SVG dimensions — show range 0..150m on x, 0..50m on y
  const W = 600, H = 240, MARGIN = 30;
  const xScale = (x: number) => MARGIN + (x / 150) * (W - 2 * MARGIN);
  const yScale = (y: number) => H - MARGIN - (y / 50) * (H - 2 * MARGIN);

  const equationStr = `y = (tan(${angle}°))·x − (${G.toFixed(1)} / (2·${velocity}²·cos²(${angle}°)))·x²`;
  // Numeric form
  const a_term = G / (2 * velocity * velocity * Math.cos((angle * Math.PI) / 180) ** 2);
  const m_term = Math.tan((angle * Math.PI) / 180);
  const equationNumeric = `y = ${m_term.toFixed(2)}·x − ${a_term.toFixed(4)}·x²`;

  return (
    <LessonShell number="L9" family="STATISTICAL THINKING" title="Hit the Target" concept="Quadratic trajectories" accent="violet">
      <div className="space-y-6">
        <div>
          <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 leading-tight">
            Every flying thing follows a <em className="not-italic text-accent-600">quadratic</em>.
          </h1>
          <p className="text-ink-soft mt-3 max-w-prose leading-relaxed">
            Throw a ball, kick a soccer ball, fire an arrow, launch a water
            rocket. With air resistance ignored, every projectile follows the
            same shape: a parabola. Adjust angle and velocity to hit each
            target.
          </p>
        </div>

        {/* Game canvas */}
        <div className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
          <div className="bg-gradient-to-b from-sky-50 to-emerald-50 relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
              {/* ground */}
              <line x1={MARGIN} x2={W - MARGIN} y1={H - MARGIN} y2={H - MARGIN} stroke="#67340F" strokeWidth={1.5} />
              {/* x-axis ticks */}
              {[0, 30, 60, 90, 120, 150].map((x) => (
                <g key={x}>
                  <line x1={xScale(x)} x2={xScale(x)} y1={H - MARGIN} y2={H - MARGIN + 5} stroke="#94A3B8" strokeWidth={1} />
                  <text x={xScale(x)} y={H - MARGIN + 16} textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">{x}m</text>
                </g>
              ))}
              {/* Trajectory */}
              <polyline
                points={points.map((p) => `${xScale(p.x)},${yScale(p.y)}`).join(' ')}
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeDasharray="3 3"
              />
              {/* Apex marker */}
              <circle cx={xScale(peakX)} cy={yScale(peak)} r={4} fill="#3B82F6" />
              <text x={xScale(peakX)} y={yScale(peak) - 8} textAnchor="middle" fontSize="9" fill="#3B82F6" fontFamily="monospace">apex {peak.toFixed(1)}m</text>
              {/* Targets */}
              {TARGETS.map((t) => (
                <g key={t.id}>
                  <rect
                    x={xScale(t.x) - 6}
                    y={H - MARGIN - 12}
                    width={12}
                    height={12}
                    fill={hits.has(t.id) ? '#10B981' : t.x === targetX ? '#F59E0B' : '#CBD5E1'}
                    stroke={t.x === targetX ? '#B45309' : '#64748B'}
                    strokeWidth={t.x === targetX ? 2 : 1}
                    rx={1}
                  />
                  <text x={xScale(t.x)} y={H - MARGIN - 18} textAnchor="middle" fontSize="9" fill="#64748B">{t.label}</text>
                </g>
              ))}
              {/* Cannon */}
              <g transform={`translate(${xScale(0)} ${H - MARGIN}) rotate(${-angle})`}>
                <rect x={-6} y={-3} width={20} height={6} fill="#0E1E33" rx={1} />
              </g>
              {/* Range readout */}
              <text x={xScale(range)} y={H - MARGIN - 28} textAnchor="middle" fontSize="11" fill="#3B82F6" fontFamily="monospace" fontWeight="700">
                {range.toFixed(1)}m
              </text>
              {hit && (
                <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="22" fill="#10B981" fontFamily="serif" fontWeight="700" fontStyle="italic">Hit!</text>
              )}
            </svg>
          </div>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 p-5 border-t border-surface-line">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-semibold text-ink">Launch angle</label>
                <span className="font-mono text-sm tabular-nums text-brand-700">{angle}°</span>
              </div>
              <input type="range" min={5} max={85} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-semibold text-ink">Initial velocity</label>
                <span className="font-mono text-sm tabular-nums text-brand-700">{velocity} m/s</span>
              </div>
              <input type="range" min={10} max={45} step={0.5} value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>

        {/* Target picker + hit log */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow text-ink-muted mr-2">Target</span>
          {TARGETS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTargetX(t.x)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                t.x === targetX ? 'bg-accent-500 text-white' : hits.has(t.id) ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300' : 'bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle'
              }`}
            >
              {t.label} · {t.x}m {hits.has(t.id) && '✓'}
            </button>
          ))}
          {hit && (
            <button onClick={recordHit} className="ml-auto px-4 py-1.5 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
              Lock in this hit ({hits.size}/{TARGETS.length})
            </button>
          )}
        </div>

        {/* Equation reveal */}
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-5 space-y-2">
          <div className="eyebrow text-brand-700">The trajectory equation</div>
          <div className="font-mono text-xs text-ink-soft">{equationStr}</div>
          <div className="font-mono text-base text-brand-900">{equationNumeric}</div>
          <div className="text-xs text-ink-muted leading-relaxed pt-2 border-t border-brand-100">
            That second term — the <em>x²</em> coefficient — is gravity divided
            by twice the horizontal velocity squared. The equation falls out
            of physics. Solving for "what x makes y = 0" is solving a
            quadratic — the moment of impact.
          </div>
        </div>

        {/* Lesson */}
        <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-900">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            A projectile's path is a parabola because vertical motion is
            uniformly accelerated (by gravity) while horizontal motion is
            constant-velocity. Combining them produces y as a quadratic
            function of x.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            The roots of that quadratic — the values of x where y = 0 — are
            the launch point and the landing point. Solving the quadratic <em>is</em>{' '}
            asking "where does it land?" Same equation, every flying thing,
            since 1638 when Galileo proved it.
          </p>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm">
            <strong className="text-violet-900">Try this:</strong> hit the
            "long" target with two different launch angles. Why do high and
            low angles both work? (Hint: complementary angles.)
          </div>
        </div>
      </div>
    </LessonShell>
  );
}
