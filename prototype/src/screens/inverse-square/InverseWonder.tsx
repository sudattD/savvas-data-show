import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface InverseWonderProps {
  onStart: (guess: number | null) => void;
}

export default function InverseWonder({ onStart }: InverseWonderProps) {
  const [guess, setGuess] = useState('');
  const numericGuess = guess === '' ? null : Number(guess);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-indigo-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Move a flashlight twice as far. How dim does it get?
          </h1>
          <p className="text-sm text-slate-600">Predict before you push the star.</p>
        </div>
      </div>

      <HostBubble accent="slate">
        Stars have a true brightness (how much light they actually emit)
        and an apparent brightness (how much reaches Earth). The two
        differ for one reason only: distance. Same physics as your
        flashlight in a dark room — but the answer about how much dimmer
        is more interesting than people guess.
      </HostBubble>

      <Demonstration />

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-base font-semibold text-ink">
            If a star moves <strong>twice as far</strong> away, how many times dimmer does it look?
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Common guesses: 2× (linear), 4× (squared), exact same (no change).
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">It looks</span>
          <input
            type="number"
            min={1}
            max={100}
            step={0.5}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="?"
            className="w-24 px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums text-center"
          />
          <span className="text-sm text-slate-600">times dimmer.</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          Real star distances · HYG Database (Hipparcos parallax measurements).
        </div>
        <button
          onClick={() => onStart(numericGuess !== null && !Number.isNaN(numericGuess) ? numericGuess : null)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Pick a star →
        </button>
      </div>
    </div>
  );
}

function Demonstration() {
  // Three identical flashlight cones at distance 1, 2, 3 — area grows as r²
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="text-[10px] font-semibold tracking-widest text-indigo-300 mb-2">
        WHY DISTANCE MATTERS — A FLASHLIGHT METAPHOR
      </div>
      <svg viewBox="0 0 600 160" className="w-full">
        {/* The light source */}
        <circle cx={20} cy={80} r={9} fill="#fbbf24" />
        <circle cx={20} cy={80} r={16} fill="#fbbf24" fillOpacity={0.18} />
        {/* Distance 1 — beam covers area = 1 unit */}
        <line x1={29} y1={75} x2={170} y2={40} stroke="#fbbf24" strokeWidth={0.8} strokeOpacity={0.5} />
        <line x1={29} y1={85} x2={170} y2={120} stroke="#fbbf24" strokeWidth={0.8} strokeOpacity={0.5} />
        <rect x={165} y={55} width={20} height={50} fill="#fbbf24" fillOpacity={0.85} stroke="#fde047" />
        <text x={175} y={130} fontSize={10} textAnchor="middle" fill="#fde047" fontFamily="monospace">r = 1</text>
        <text x={175} y={144} fontSize={9} textAnchor="middle" fill="#fde047" fontFamily="monospace">area = 1</text>
        {/* Distance 2 — area = 4 */}
        <line x1={29} y1={75} x2={330} y2={10} stroke="#fbbf24" strokeWidth={0.8} strokeOpacity={0.3} />
        <line x1={29} y1={85} x2={330} y2={150} stroke="#fbbf24" strokeWidth={0.8} strokeOpacity={0.3} />
        <rect x={325} y={30} width={40} height={100} fill="#fbbf24" fillOpacity={0.5} stroke="#fde047" strokeOpacity={0.7} />
        <text x={345} y={146} fontSize={10} textAnchor="middle" fill="#fde047" fontFamily="monospace">r = 2</text>
        <text x={345} y={158} fontSize={9} textAnchor="middle" fill="#fde047" fontFamily="monospace">area = 4</text>
        {/* Distance 3 — area = 9, mostly clipped */}
        <rect x={485} y={5} width={60} height={150} fill="#fbbf24" fillOpacity={0.25} stroke="#fde047" strokeOpacity={0.5} />
        <text x={515} y={147} fontSize={10} textAnchor="middle" fill="#fde047" fontFamily="monospace">r = 3</text>
        <text x={515} y={159} fontSize={9} textAnchor="middle" fill="#fde047" fontFamily="monospace">area = 9</text>
      </svg>
      <div className="text-xs text-indigo-100 leading-relaxed mt-2">
        Same light source, three distances. The light spreads over a wider area as it travels — and the area grows with the distance <em>squared</em>. So the brightness on any one patch drops with distance squared too.
      </div>
    </div>
  );
}
