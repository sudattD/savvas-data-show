import { useState } from 'react';
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

// A teaser table of well-known planets — the kid already feels this
// asymmetry: Mercury blasts around in 88 days, Neptune takes 164 years.
const SAMPLES: PlanetSample[] = [
  { body: 'Mercury', emoji: '☿', distanceAU: 0.39, periodLabel: '88 days' },
  { body: 'Earth', emoji: '🜨', distanceAU: 1.00, periodLabel: '1 year' },
  { body: 'Mars', emoji: '♂', distanceAU: 1.52, periodLabel: '1.9 years' },
  { body: 'Jupiter', emoji: '♃', distanceAU: 5.20, periodLabel: '12 years' },
  { body: 'Neptune', emoji: '♆', distanceAU: 30.1, periodLabel: '165 years' },
];

export default function KeplerWonder({ onStart }: KeplerWonderProps) {
  const [guess, setGuess] = useState<string>('');

  const numericGuess = guess === '' ? null : Number(guess);
  const valid = numericGuess !== null && !Number.isNaN(numericGuess) && numericGuess >= 0.1 && numericGuess <= 200;

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
        weeks. The far ones take centuries. There's a pattern in the
        numbers — Kepler found it in 1619 with the six planets he could
        see. Make a guess first, then we'll plot all twelve bodies and
        let the math show itself.
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
      </div>

      {/* The prediction prompt */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-base font-semibold text-ink">
            If a planet sits at <span className="tabular-nums">10 AU</span> from the Sun, how many
            Earth-years for one orbit?
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Earth is at 1 AU and takes 1 year. Jupiter is at 5 AU and takes 12. You decide.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            min={0.1}
            max={200}
            step={0.1}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="years"
            className="w-32 px-3 py-2 rounded-md border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm tabular-nums"
          />
          <span className="text-sm text-slate-500">Earth-years</span>
        </div>
        <div className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
          Most students start with "10" (linear). The actual answer is something else. Plot the data and you'll see why.
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          Real distances and orbital periods · IAU / NASA Horizons.
        </div>
        <button
          onClick={() => onStart(valid ? numericGuess : null)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Plot the solar system →
        </button>
      </div>
    </div>
  );
}
