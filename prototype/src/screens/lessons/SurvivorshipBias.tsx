import { useState } from 'react';
import LessonShell from '../../components/LessonShell';

// Engine and cockpit positions — where the armor SHOULD go.
// Coordinates in 0..100 over the Wald/McGeddon diagram (nose up, tail down).
const VITAL_AREAS = [
  { id: 'cockpit', x: 45, y: 16, w: 10, h: 14, label: 'cockpit' },
  { id: 'engine-l', x: 31, y: 10, w: 12, h: 24, label: 'engine' },
  { id: 'engine-r', x: 57, y: 10, w: 12, h: 24, label: 'engine' },
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
          <div className="relative bg-slate-50 rounded-lg overflow-hidden" style={{ aspectRatio: '377/281' }}>
            <img
              src="/survivorship-bias.svg"
              alt="Bullet hole map of bombers that returned from WW2 missions"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              onClick={placeArmor}
              className={`relative w-full h-full ${revealed ? 'cursor-default' : 'cursor-crosshair'}`}
            >
              {/* Vital areas (only shown after reveal) */}
              {revealed && VITAL_AREAS.map((v) => (
                <g key={v.id}>
                  <rect x={v.x} y={v.y} width={v.w} height={v.h} fill="#FEF08A" fillOpacity={0.45} stroke="#CA8A04" strokeWidth={0.5} strokeDasharray="2 1.2" />
                  <text x={v.x + v.w / 2} y={v.y + v.h + 4} textAnchor="middle" fontSize={3} fontWeight="700" fill="#854D0E">{v.label}</text>
                </g>
              ))}

              {/* Armor placements */}
              {armor.map((a, i) => (
                <g key={i}>
                  <rect x={a.x - 2.5} y={a.y - 2.5} width={5} height={5} fill="none" stroke="#3B82F6" strokeWidth={0.6} />
                  <rect x={a.x - 1.6} y={a.y - 1.6} width={3.2} height={3.2} fill="#3B82F6" fillOpacity={0.45} />
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600" />
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
