import { useState } from 'react';
import LessonShell from '../../components/LessonShell';

// Bullet hole positions on a fictional plane diagram (returning planes)
// Coordinates in 0..100 for a simple plane silhouette
const BULLET_HOLES = [
  // wings
  { x: 22, y: 42 }, { x: 28, y: 44 }, { x: 32, y: 41 }, { x: 36, y: 43 }, { x: 25, y: 47 },
  { x: 70, y: 42 }, { x: 75, y: 44 }, { x: 78, y: 41 }, { x: 82, y: 43 }, { x: 73, y: 47 },
  // tail
  { x: 92, y: 38 }, { x: 95, y: 42 }, { x: 91, y: 46 },
  // fuselage middle
  { x: 50, y: 50 }, { x: 54, y: 49 }, { x: 47, y: 51 }, { x: 56, y: 52 },
  // a couple stragglers
  { x: 42, y: 45 }, { x: 60, y: 45 },
];

// Engine and cockpit positions — where the armor SHOULD go
const VITAL_AREAS = [
  { id: 'engines', x: 18, y: 38, w: 12, h: 14, label: 'engines' },
  { id: 'cockpit', x: 48, y: 38, w: 8, h: 14, label: 'cockpit' },
];

interface ArmorMark { x: number; y: number; }

export default function SurvivorshipBias() {
  const [armor, setArmor] = useState<ArmorMark[]>([]);
  const [revealed, setRevealed] = useState(false);

  const placeArmor = (e: React.MouseEvent<SVGSVGElement>) => {
    if (revealed) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setArmor((prev) => [...prev, { x, y }]);
  };

  const reset = () => { setArmor([]); setRevealed(false); };

  // Score: how many armor marks fall inside vital areas
  const goodArmor = armor.filter((a) =>
    VITAL_AREAS.some((v) => a.x >= v.x && a.x <= v.x + v.w && a.y >= v.y && a.y <= v.y + v.h),
  ).length;

  return (
    <LessonShell number="L6" family="VISUAL DECEPTION" title="The Bullet Holes That Aren't There" concept="Survivorship bias" accent="rose">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            World War II. Where do you put the armor?
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Engineers studied bomber planes returning from missions and
            mapped where they were hit by enemy fire. Some places had{' '}
            <em>tons</em> of bullet holes. Others were spotless. Click on the
            plane to mark where you'd put extra armor.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-semibold tracking-widest text-slate-500 mb-3 px-2">
            BOMBERS THAT RETURNED FROM MISSIONS · BULLET HOLE MAP
          </div>
          <div className="relative bg-slate-50 rounded-lg overflow-hidden" style={{ aspectRatio: '5/2' }}>
            <svg
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
              onClick={placeArmor}
              className={`w-full h-full ${revealed ? 'cursor-default' : 'cursor-crosshair'}`}
            >
              {/* Plane silhouette */}
              <g fill="#E2E8F0" stroke="#94A3B8" strokeWidth={0.3}>
                {/* fuselage */}
                <ellipse cx="50" cy="45" rx="48" ry="3.2" />
                {/* wings */}
                <polygon points="20,42 80,42 88,46 12,46" />
                {/* tail */}
                <polygon points="92,40 100,38 100,50 92,50" />
                {/* tail fin */}
                <polygon points="93,30 96,30 99,40 95,40" fill="#CBD5E1" />
                {/* cockpit */}
                <ellipse cx="8" cy="44" rx="4" ry="2.5" fill="#CBD5E1" />
                {/* engines */}
                <ellipse cx="22" cy="46" rx="3" ry="1.5" fill="#94A3B8" />
                <ellipse cx="78" cy="46" rx="3" ry="1.5" fill="#94A3B8" />
              </g>

              {/* Vital areas (only shown after reveal) */}
              {revealed && VITAL_AREAS.map((v) => (
                <g key={v.id}>
                  <rect x={v.x} y={v.y} width={v.w} height={v.h} fill="#FEF08A" fillOpacity={0.45} stroke="#CA8A04" strokeWidth={0.4} strokeDasharray="1.5 1" />
                  <text x={v.x + v.w / 2} y={v.y + v.h + 3} textAnchor="middle" fontSize={2.5} fontWeight="700" fill="#854D0E">{v.label}</text>
                </g>
              ))}

              {/* Bullet holes */}
              {BULLET_HOLES.map((h, i) => (
                <circle key={i} cx={h.x} cy={h.y} r={0.9} fill="#0F172A" fillOpacity={0.7} />
              ))}

              {/* Armor placements */}
              {armor.map((a, i) => (
                <g key={i}>
                  <rect x={a.x - 1.6} y={a.y - 1.6} width={3.2} height={3.2} fill="none" stroke="#3B82F6" strokeWidth={0.5} />
                  <rect x={a.x - 1} y={a.y - 1} width={2} height={2} fill="#3B82F6" fillOpacity={0.4} />
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-900/70" />
                bullet holes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-blue-500/40 border border-blue-500" />
                your armor ({armor.length})
              </span>
              {revealed && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 bg-yellow-200/70 border border-yellow-700 border-dashed" />
                  what should have been armored
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  disabled={armor.length === 0}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  Reveal the answer
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>

        {revealed && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-0.5">THE TWIST</div>
            <h2 className="font-display text-2xl font-bold text-ink leading-tight">
              Armor goes where the bullet holes <em className="text-amber-700">aren't.</em>
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              You only see bullet holes on the planes that <strong>came back</strong>.
              The planes that got hit in the engines or the cockpit didn't return — so
              their bullet holes never made it onto the diagram. The empty
              spaces aren't safe; they're <em>fatal</em>.
            </p>
            <p className="text-sm text-ink leading-relaxed">
              You placed <strong>{goodArmor}</strong> of {armor.length} armor patches
              on a vital area. {goodArmor === 0 ? 'Most people armor the bullet holes — and most people are wrong.' : goodArmor === armor.length ? 'You spotted it. Mathematician Abraham Wald spotted it too, in 1942.' : 'Half-right is honest — most people armor at least some of the holes.'}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            This is <strong>survivorship bias</strong>. When you only have data
            from the survivors of a process, you miss everything the process
            killed. The dataset has a hole shaped exactly like the answer.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            The story is real: in 1942, statistician Abraham Wald (Statistical
            Research Group, Columbia) was asked where to add armor to bombers.
            Engineers wanted to armor the holes. Wald said no — armor where
            there <em>aren't</em> any holes. The planes hit there never came
            back to be measured. He was right.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Survivorship bias shows up everywhere. When someone says
            "successful CEOs all dropped out of college" — count the dropouts
            who failed. When a mutual fund advertises 10-year returns —
            count the funds that closed. The samples in front of you are{' '}
            <em>never</em> the whole story.
          </p>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm">
            <strong className="text-rose-900">Always ask:</strong> who isn't in
            this dataset? What got filtered out before it reached me?
          </div>
        </div>
      </div>
    </LessonShell>
  );
}
