import { useState } from 'react';
import HostBubble from '../components/HostBubble';
import ActHeader from '../components/ActHeader';
import WindChart from '../components/WindChart';

interface Act1Props {
  onNext: (data: { conjecture: string; low: number; high: number }) => void;
}

const NOTICE_OPTIONS = [
  'Power climbs steeply, then flattens near the top.',
  'There’s a minimum wind speed before any power.',
  'The relationship looks curved, not a straight line.',
  'A cloud of dots, not a clean line — lots of scatter.',
];

export default function Act1Identify({ onNext }: Act1Props) {
  const [notice, setNotice] = useState('');
  const [guess, setGuess] = useState('');

  const finish = () => {
    const g = parseFloat(guess);
    onNext({ conjecture: notice, low: Number.isFinite(g) ? g : 0, high: Number.isFinite(g) ? g : 0 });
  };

  return (
    <div className="space-y-6">
      <ActHeader
        act={1}
        title="What's the question?"
        subtitle="Look at the scatter, make a quick guess."
      />

      <HostBubble accent="sky">
        Hey — I'm Casey. Every dot is one minute of one wind turbine's life:
        the wind speed it saw, and the power it made. Take ten seconds with
        the scatter, then make a guess.
      </HostBubble>

      <WindChart showModel={false} />

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-2">
            What do you notice? <span className="text-[10px] text-slate-500 italic font-normal">(pick one)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NOTICE_OPTIONS.map((opt) => {
              const selected = notice === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNotice(opt)}
                  className={`text-left text-sm px-3 py-2.5 rounded-lg border transition ${
                    selected
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-100'
                      : 'border-slate-200 text-ink hover:border-sky-300 hover:bg-sky-50/50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-1">TODAY'S QUESTION</div>
          <div className="text-sm font-semibold text-ink mb-3">
            At a strong breeze (10 m/s ≈ 22 mph), how many kilowatts does this turbine make?
          </div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Predict before you test <span className="text-[10px] text-slate-500 italic font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="e.g. 800"
              className="w-32 px-3 py-2 rounded-md border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none font-mono tabular-nums"
            />
            <span className="text-sm text-slate-600">kW</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">You're not trying to be right — just commit before the model lands.</div>
        <button
          onClick={finish}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition"
        >
          Next: build a model →
        </button>
      </div>
    </div>
  );
}
