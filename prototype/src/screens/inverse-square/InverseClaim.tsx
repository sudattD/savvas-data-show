import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { InversePick } from './InversePlay';

interface InverseClaimProps {
  pick: InversePick;
  guess: number | null;
  onRestart: () => void;
}

export default function InverseClaim({ pick, guess, onRestart }: InverseClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const factor = pick.newDistancePc / pick.actualDistancePc;
  const dimmerBy = factor * factor;
  const guessClose = guess !== null && Math.abs(guess - 4) <= 0.5; // 4 = 2² for the canonical case

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-indigo-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 3 · 1 / r²
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            The whole universe runs on rational functions.
          </h1>
          <p className="text-sm text-slate-600">
            Light, gravity, sound, radio. Same denominator. Same chapter.
          </p>
        </div>
      </div>

      <HostBubble accent="slate">
        Your push to{' '}
        <strong className="tabular-nums">{factor.toFixed(2)}×</strong> distance
        made <strong>{pick.starName}</strong> look{' '}
        <strong className="tabular-nums">{dimmerBy.toFixed(2)}×</strong>{' '}
        dimmer — exactly factor-squared.{' '}
        {guess !== null
          ? guessClose
            ? "And your prediction was 4× for the doubled case — you saw the squared pattern."
            : `(You guessed ${guess}× for doubling; the truth is 4×. Now you know why.)`
          : ''}{' '}
        The same 1/r² rule controls gravity (Newton), radio signal strength,
        and how loud a speaker sounds across a stadium. One rational
        function, four physics fields.
      </HostBubble>

      <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-200 rounded-2xl p-8 text-center">
        <div className="text-[10px] font-semibold tracking-widest text-indigo-700 mb-3">
          THE INVERSE-SQUARE LAW
        </div>
        <div className="font-display text-4xl md:text-5xl font-black text-ink mb-2 tracking-tight">
          brightness ∝{' '}
          <span className="inline-block align-middle">
            <span className="block text-center border-b-4 border-ink leading-none pb-1">1</span>
            <span className="block text-center leading-none pt-1">r<sup className="text-2xl">2</sup></span>
          </span>
        </div>
        <div className="text-sm text-slate-600 max-w-md mx-auto">
          A rational function with <code className="font-mono bg-white px-1 rounded">r²</code> in the denominator. Your chapter is the math behind it.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Card label="DISTANCE FACTOR" value={`${factor.toFixed(2)}×`} subtle="how much further" />
        <Card label="THAT SQUARED" value={`${dimmerBy.toFixed(2)}×`} subtle="r² is the bridge" />
        <Card
          label="YOUR GUESS"
          value={guess !== null ? `${guess}×` : '—'}
          subtle={
            guess === null
              ? 'no guess saved'
              : guessClose
                ? 'matched the rule'
                : 'now you know — it is squared'
          }
          tone={guessClose ? 'emerald' : 'slate'}
        />
      </div>

      <div className="bg-gradient-to-br from-slate-800 via-indigo-800 to-purple-800 rounded-2xl shadow-lg p-6 text-white">
        <div className="text-[10px] font-semibold tracking-widest text-indigo-200 mb-1">
          DATA CARD · ALG 2 · TOPIC 4 · RATIONAL FUNCTIONS
        </div>
        <h3 className="font-display text-3xl font-bold mb-3">Inverse Square</h3>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
          <div className="text-center mb-2">
            <div className="text-[10px] font-semibold tracking-widest text-indigo-200">YOU PUSHED</div>
            <div className="font-display text-xl font-bold">{pick.starName}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-white/20">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-indigo-200">DISTANCE</div>
              <div className="font-display text-2xl font-bold tabular-nums">{factor.toFixed(2)}×</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-indigo-200">DIMMER</div>
              <div className="font-display text-2xl font-bold tabular-nums">{dimmerBy.toFixed(2)}×</div>
            </div>
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="One sentence — where else have you seen 1/r² in the world?"
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
            Push a different star
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  subtle,
  tone = 'indigo',
}: {
  label: string;
  value: string;
  subtle: string;
  tone?: 'indigo' | 'emerald' | 'slate';
}) {
  const palette = {
    indigo: ['border-indigo-200', 'bg-indigo-50', 'text-indigo-700', 'text-indigo-900'],
    emerald: ['border-emerald-200', 'bg-emerald-50', 'text-emerald-700', 'text-emerald-900'],
    slate: ['border-slate-200', 'bg-slate-50', 'text-slate-600', 'text-slate-800'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-2xl font-bold ${palette[3]} tabular-nums mt-0.5`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{subtle}</div>
    </div>
  );
}
