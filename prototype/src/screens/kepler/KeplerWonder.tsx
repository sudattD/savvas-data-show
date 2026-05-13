import HostBubble from '../../components/HostBubble';

interface KeplerWonderProps {
  onStart: (guess: number | null) => void;
}

interface PlanetSample {
  body: string;
  emoji: string;
  distanceAU: number;
  periodLabel: string;
}

const SAMPLES: PlanetSample[] = [
  { body: 'Mercury', emoji: '☿', distanceAU: 0.39, periodLabel: '88 days' },
  { body: 'Earth', emoji: '🜨', distanceAU: 1.00, periodLabel: '1 year' },
  { body: 'Mars', emoji: '♂', distanceAU: 1.52, periodLabel: '1.9 years' },
  { body: 'Jupiter', emoji: '♃', distanceAU: 5.20, periodLabel: '12 years' },
  { body: 'Neptune', emoji: '♆', distanceAU: 30.1, periodLabel: '165 years' },
];

interface PredictionOption {
  value: number;
  label: string;
  anchor: string;
  tip: string;
}

const PREDICTIONS: PredictionOption[] = [
  { value: 10,  label: 'Linear',         anchor: '~10 years',  tip: '10× farther = 10× slower.' },
  { value: 15,  label: 'A little curve', anchor: '~15 years',  tip: 'Distance pulls a bit harder than linear.' },
  { value: 35,  label: 'A strong curve', anchor: '~35 years',  tip: 'Distance pulls a lot harder than linear.' },
  { value: 100, label: 'A wild curve',   anchor: '100+ years', tip: 'Distance compounds — far stuff crawls.' },
];

export default function KeplerWonder({ onStart }: KeplerWonderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-amber-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Farther = slower. But by how much?
          </h1>
          <p className="text-sm text-slate-600">Predict before you plot.</p>
        </div>
      </div>

      <HostBubble accent="amber">
        Every planet orbits the same Sun. The closer ones whip around in
        weeks. The far ones take centuries. Kepler spotted the pattern
        in 1619 with just the six planets he could see. Look at these
        five, then take a guess — no wrong answers, we'll plot the real
        data next.
      </HostBubble>

      {/* Teaser table */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
          A FEW PLANETS · DISTANCE → ORBIT TIME
        </div>
        <div className="grid grid-cols-5 gap-2">
          {SAMPLES.map((s) => (
            <div key={s.body} className="bg-white/80 backdrop-blur rounded-lg border border-amber-100 p-3 text-center">
              <div className="text-2xl mb-1" aria-hidden>{s.emoji}</div>
              <div className="font-semibold text-ink text-sm">{s.body}</div>
              <div className="text-xs text-slate-600 mt-0.5 tabular-nums">{s.distanceAU} AU</div>
              <div className="text-xs font-semibold text-amber-800 tabular-nums">{s.periodLabel}</div>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-amber-900/70 mt-3 italic">
          AU = Astronomical Unit. 1 AU is Earth's distance from the Sun (~150 million km).
        </div>
      </div>

      {/* The prediction prompt — pick a bucket, no free-input */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">
            YOUR HUNCH
          </div>
          <div className="text-base font-semibold text-ink">
            A planet at <span className="tabular-nums">10 AU</span> — 10× farther than Earth.
            One orbit takes about how long?
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Pick the bucket that feels right. We'll plot the real answer next.
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PREDICTIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => onStart(p.value)}
              className="text-left bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl p-3 transition shadow-sm hover:shadow-md"
            >
              <div className="text-[10px] font-semibold tracking-widest text-amber-700">
                {p.label.toUpperCase()}
              </div>
              <div className="font-display text-lg font-bold text-ink tabular-nums mt-0.5">
                {p.anchor}
              </div>
              <div className="text-xs text-slate-600 mt-1 leading-snug">{p.tip}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Real distances and orbital periods · IAU / NASA Horizons.
      </div>
    </div>
  );
}
