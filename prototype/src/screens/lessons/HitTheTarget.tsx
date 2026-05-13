import { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';

const G = 9.8; // m/s²

interface Trajectory { x: number; y: number; t: number; }

function trajectory(angleDeg: number, velocity: number, x0 = 0, y0 = 0): Trajectory[] {
  const angle = (angleDeg * Math.PI) / 180;
  const vx = velocity * Math.cos(angle);
  const vy = velocity * Math.sin(angle);
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

const CONJECTURE_OPTIONS = [
  { label: 'Low and fast — about 20°', angle: 20 },
  { label: 'Mid-low — about 35°', angle: 35 },
  { label: 'Right at 45°', angle: 45 },
  { label: 'High arc — about 60°', angle: 60 },
  { label: 'Almost straight up — about 75°', angle: 75 },
];

export default function HitTheTarget() {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(25);
  const [targetX, setTargetX] = useState(60);
  const [hits, setHits] = useState<Set<string>>(new Set());

  // Act 1 capture — student's prediction before they touch the sliders
  const [conjectureAngle, setConjectureAngle] = useState<number | null>(null);
  // Act 3 capture — student's claim after running the experiment
  const [claim, setClaim] = useState('');

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

  const W = 600, H = 240, MARGIN = 30;
  const xScale = (x: number) => MARGIN + (x / 150) * (W - 2 * MARGIN);
  const yScale = (y: number) => H - MARGIN - (y / 50) * (H - 2 * MARGIN);

  const equationStr = `y = (tan(${angle}°))·x − (${G.toFixed(1)} / (2·${velocity}²·cos²(${angle}°)))·x²`;
  const a_term = G / (2 * velocity * velocity * Math.cos((angle * Math.PI) / 180) ** 2);
  const m_term = Math.tan((angle * Math.PI) / 180);
  const equationNumeric = `y = ${m_term.toFixed(2)}·x − ${a_term.toFixed(4)}·x²`;

  return (
    <LessonShell number="L9" family="STATISTICAL THINKING" title="Hit the Target" concept="Quadratic trajectories" accent="violet" envisionChapter={{ course: 'algebra1', topic: 9 }}>
      <div className="space-y-10">
        {/* ─── ACT 1 · Identify the Problem ──────────────────────────────── */}
        <ActSection n={1} kicker="Identify the Problem">
          <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 leading-tight mb-4">
            Every flying thing follows a <em className="not-italic text-accent-600">quadratic</em>.
          </h1>
          <p className="text-ink-soft max-w-prose leading-relaxed mb-6">
            Throw a ball, kick a soccer ball, fire an arrow, launch a water
            rocket. With air resistance ignored, every projectile traces the
            same shape — a parabola. Before you touch the cannon, take a
            guess.
          </p>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5 max-w-2xl">
            <div className="eyebrow text-violet-700 mb-1">The question</div>
            <p className="text-base font-display font-semibold text-brand-900 mb-4">
              Which launch angle gives the longest throw, at a fixed speed?
            </p>
            <div className="eyebrow text-violet-700 mb-2 text-[10px]">Your conjecture</div>
            <div className="space-y-1.5">
              {CONJECTURE_OPTIONS.map((opt) => {
                const selected = conjectureAngle === opt.angle;
                return (
                  <button
                    key={opt.angle}
                    type="button"
                    onClick={() => setConjectureAngle(opt.angle)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-md border transition ${
                      selected
                        ? 'border-violet-500 bg-white text-violet-900 ring-2 ring-violet-100'
                        : 'border-surface-line bg-white text-ink hover:border-violet-300 hover:bg-violet-50/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {conjectureAngle !== null && (
              <p className="text-xs text-violet-800 mt-3 italic">
                Conjecture saved: about {conjectureAngle}°. Now go test it.
              </p>
            )}
          </div>
        </ActSection>

        {/* ─── ACT 2 · Develop a Model ───────────────────────────────────── */}
        <ActSection n={2} kicker="Develop a Model">
          <p className="text-ink-soft max-w-prose leading-relaxed mb-5">
            Adjust angle and velocity to hit each of the four targets. Watch
            the equation update as you move the sliders — the math <em>is</em> the
            trajectory.
          </p>

          {/* Game canvas */}
          <div className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
            <div className="bg-gradient-to-b from-sky-50 to-emerald-50 relative">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
                <line x1={MARGIN} x2={W - MARGIN} y1={H - MARGIN} y2={H - MARGIN} stroke="#67340F" strokeWidth={1.5} />
                {[0, 30, 60, 90, 120, 150].map((x) => (
                  <g key={x}>
                    <line x1={xScale(x)} x2={xScale(x)} y1={H - MARGIN} y2={H - MARGIN + 5} stroke="#94A3B8" strokeWidth={1} />
                    <text x={xScale(x)} y={H - MARGIN + 16} textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">{x}m</text>
                  </g>
                ))}
                <polyline
                  points={points.map((p) => `${xScale(p.x)},${yScale(p.y)}`).join(' ')}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="3 3"
                />
                <circle cx={xScale(peakX)} cy={yScale(peak)} r={4} fill="#3B82F6" />
                <text x={xScale(peakX)} y={yScale(peak) - 8} textAnchor="middle" fontSize="9" fill="#3B82F6" fontFamily="monospace">apex {peak.toFixed(1)}m</text>
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
                <g transform={`translate(${xScale(0)} ${H - MARGIN})`}>
                  <line x1={-2} y1={-3} x2={-16} y2={2} stroke="#475569" strokeWidth={2.5} strokeLinecap="round" />
                  <g transform={`rotate(${-angle})`}>
                    <rect x={2} y={-3} width={22} height={6} fill="#1F2937" rx={1} />
                    <rect x={22} y={-4} width={3} height={8} fill="#0F172A" rx={0.5} />
                    <circle cx={3} cy={0} r={1.4} fill="#475569" />
                  </g>
                  <circle cx={0} cy={-2} r={7} fill="#1F2937" stroke="#0F172A" strokeWidth={1} />
                  <circle cx={0} cy={-2} r={1.5} fill="#94A3B8" />
                  {[0, 60, 120].map((deg) => (
                    <line
                      key={deg}
                      x1={0} y1={-2}
                      x2={Math.cos((deg * Math.PI) / 180) * 6}
                      y2={-2 + Math.sin((deg * Math.PI) / 180) * 6}
                      stroke="#94A3B8" strokeWidth={0.8}
                    />
                  ))}
                </g>
                <text x={xScale(range)} y={H - MARGIN - 28} textAnchor="middle" fontSize="11" fill="#3B82F6" fontFamily="monospace" fontWeight="700">
                  {range.toFixed(1)}m
                </text>
                {hit && (
                  <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="22" fill="#10B981" fontFamily="serif" fontWeight="700" fontStyle="italic">Hit!</text>
                )}
              </svg>
            </div>

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

          <div className="flex flex-wrap items-center gap-2 mt-4">
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
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-5 space-y-2 mt-5">
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
        </ActSection>

        {/* ─── ACT 3 · Interpret the Results ─────────────────────────────── */}
        <ActSection n={3} kicker="Interpret the Results">
          <p className="text-ink-soft max-w-prose leading-relaxed mb-5">
            Now look at what you found. Hit all four targets if you haven't
            yet, then come back to interpret.
          </p>

          {/* Conjecture check — only if Act 1 was answered */}
          {conjectureAngle !== null && (
            <ConjectureCheck conjectureAngle={conjectureAngle} hitsCount={hits.size} />
          )}

          {/* What did you notice — claim input */}
          <div className="bg-surface-raised border border-surface-line rounded-lg p-5 max-w-2xl mb-5">
            <div className="eyebrow text-brand-700 mb-2">What did you notice?</div>
            <p className="text-sm text-ink-soft mb-3 leading-relaxed">
              Write one sentence about what changed as you adjusted angle vs. velocity. Stays on your device.
            </p>
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={3}
              placeholder="e.g. 'Doubling speed quadrupled the range, but doubling angle just made the throw shorter past 45°…'"
              className="w-full px-3 py-2 rounded-md border border-surface-line text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none resize-y"
            />
          </div>

          {/* Reveal — the math behind what they saw */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5 space-y-3 max-w-2xl">
            <div className="eyebrow text-violet-700">The reveal</div>
            <p className="text-sm text-ink leading-relaxed">
              With no air resistance, <strong>45° wins</strong> for maximum
              range — every time. Galileo proved this in 1638. The math:
              range = (v²·sin(2θ)) / g. The sine of double the angle peaks at
              90°, which means 2θ = 90°, which means θ = 45°.
            </p>
            <p className="text-sm text-ink leading-relaxed">
              And complementary angles match: 30° and 60° throw the same
              distance. So do 20° and 70°. The parabola is symmetric around
              45° — that's why "high arc" and "line drive" can both hit the
              same target.
            </p>
          </div>

          {/* Closing prompt */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm mt-5 max-w-2xl">
            <strong className="text-violet-900">Try this:</strong> hit the
            "long" target with two <em>different</em> launch angles. Why do
            high and low both work?
          </div>
        </ActSection>
      </div>
    </LessonShell>
  );
}

function ActSection({ n, kicker, children }: { n: 1 | 2 | 3; kicker: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <header className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-violet-100">
        <div className="inline-flex items-center gap-2 bg-violet-700 text-white px-3 py-1.5 rounded-md font-display font-bold text-sm shadow-sm">
          <span className="text-[10px] eyebrow opacity-80">ACT</span>
          <span className="text-base leading-none">{n}</span>
        </div>
        <h2 className="font-display text-lg md:text-xl font-bold text-violet-900 uppercase tracking-wide">{kicker}</h2>
      </header>
      {children}
    </section>
  );
}

function ConjectureCheck({ conjectureAngle, hitsCount }: { conjectureAngle: number; hitsCount: number }) {
  const distanceFrom45 = Math.abs(conjectureAngle - 45);
  const verdict =
    conjectureAngle === 45 ? 'right' :
    distanceFrom45 <= 15 ? 'close' :
    'off';

  const message = {
    right: 'Right on the money. At 45°, range is maximized for any given speed.',
    close: `Close — the answer is 45°, you were ${distanceFrom45}° away. The parabola is symmetric around 45°, so a guess on either side gets close.`,
    off: `Off the mark — the answer is 45°. You guessed ${conjectureAngle}°, which is ${distanceFrom45}° away. Common intuition: lower angles "look faster." But for range alone, 45° wins.`,
  }[verdict];

  const tone = {
    right: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    close: 'bg-amber-50 border-amber-200 text-amber-900',
    off: 'bg-rose-50 border-rose-200 text-rose-900',
  }[verdict];

  return (
    <div className={`rounded-lg border p-5 mb-5 max-w-2xl ${tone}`}>
      <div className="eyebrow opacity-70 mb-1">Your Act 1 conjecture</div>
      <div className="text-sm leading-relaxed">
        You guessed <strong>about {conjectureAngle}°</strong>. {message}
      </div>
      {hitsCount < TARGETS.length && (
        <div className="text-xs italic mt-3 opacity-80">
          You've hit {hitsCount} of {TARGETS.length} targets. Try the others — same physics, different starting velocities.
        </div>
      )}
    </div>
  );
}
