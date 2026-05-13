import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface MooreWonderProps {
  onStart: (guess: number | null) => void;
}

const MILESTONES = [
  { year: 1971, label: 'Intel 4004', count: 2_250, comment: 'first commercial microprocessor' },
  { year: 1985, label: 'Intel 386', count: 275_000, comment: 'first 32-bit Intel' },
  { year: 2000, label: 'Pentium 4', count: 42_000_000, comment: 'the year you were born — maybe' },
  { year: 2024, label: 'NVIDIA Blackwell', count: 60_000_000_000, comment: 'ChatGPT-class GPUs' },
];

function fmtCount(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} million`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} thousand`;
  return n.toLocaleString();
}

export default function MooreWonder({ onStart }: MooreWonderProps) {
  const [guess, setGuess] = useState('');

  const validGuess = guess !== '' && Number(guess) >= 6 && Number(guess) <= 120;
  const numericGuess = validGuess ? Number(guess) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-emerald-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            How long does it take for tech to double?
          </h1>
          <p className="text-sm text-slate-600">
            Predict the doubling time before you see fifty years of evidence.
          </p>
        </div>
      </div>

      <HostBubble accent="emerald">
        In 1965, an Intel engineer named Gordon Moore wrote a tiny paper.
        He noticed that the number of transistors on a chip had been
        doubling every couple of years — and he guessed it would keep
        going. He turned out to be right for sixty years. Look at these
        four chips, then guess how often the count doubled.
      </HostBubble>

      {/* Milestones */}
      <div className="grid sm:grid-cols-4 gap-2">
        {MILESTONES.map((m) => (
          <div key={m.year} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <div className="text-[10px] font-semibold tracking-widest text-emerald-700">{m.year}</div>
            <div className="font-display text-base font-bold text-ink mt-1">{m.label}</div>
            <div className="font-display text-xl font-bold text-emerald-700 tabular-nums mt-1">
              {fmtCount(m.count)}
            </div>
            <div className="text-[10px] text-slate-600 leading-snug mt-1">{m.comment}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-emerald-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-base font-semibold text-ink">
            How many <strong>months</strong> does the transistor count take to double?
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Hint: from 2,250 (1971) to 60 billion (2024) is roughly{' '}
            <strong className="tabular-nums">25 doublings</strong> in{' '}
            <strong className="tabular-nums">53 years</strong>.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            min={6}
            max={120}
            step={1}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="months"
            className="w-32 px-3 py-2 rounded-md border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm tabular-nums"
          />
          <span className="text-sm text-slate-500">months per doubling</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          219 real microprocessors · 1970 – 2024 · Wikipedia compilations.
        </div>
        <button
          onClick={() => onStart(numericGuess)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Plot 50 years of chips →
        </button>
      </div>
    </div>
  );
}
