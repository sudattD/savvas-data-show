import { useState } from 'react';
import HostBubble from '../components/HostBubble';
import ActHeader from '../components/ActHeader';
import WindChart from '../components/WindChart';

interface Act1Props {
  onNext: (data: { conjecture: string; low: number; high: number }) => void;
}

export default function Act1Identify({ onNext }: Act1Props) {
  const [conjecture, setConjecture] = useState('');
  const [low, setLow] = useState<string>('');
  const [high, setHigh] = useState<string>('');

  const lowN = parseFloat(low);
  const highN = parseFloat(high);
  const valid =
    conjecture.trim().length > 0 &&
    !isNaN(lowN) &&
    !isNaN(highN) &&
    lowN >= 0 &&
    highN > lowN;

  return (
    <div className="space-y-6">
      <ActHeader
        act={1}
        title="What's the question?"
        subtitle="Watch, wonder, and make a first guess."
      />

      <HostBubble accent="sky">
        Hey — I'm Casey. Imagine a wind turbine spinning out on a hill. Bigger
        gusts make more electricity, right? Until they don't. Today we're
        figuring out exactly how much power a real turbine makes at different
        wind speeds. Here's data from one — every dot is one minute of one
        turbine's life.
      </HostBubble>

      <WindChart showModel={false} />

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-ink mb-1">
            Make a conjecture.
          </h2>
          <p className="text-sm text-slate-600 mb-2">
            What does the relationship between wind speed and power look like
            to you? One sentence.
          </p>
          <textarea
            value={conjecture}
            onChange={(e) => setConjecture(e.target.value)}
            placeholder="As wind speed goes up, power…"
            className="w-full p-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
            rows={2}
          />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="font-display text-lg font-bold text-ink mb-1">
            Set your bounds.
          </h2>
          <p className="text-sm text-slate-600 mb-3">
            <span className="font-semibold">If the wind blows at 10 m/s</span>{' '}
            (about 22 mph — a strong breeze), how much power do you think this
            turbine produces?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wide">
                Too low (kW)
              </label>
              <input
                type="number"
                value={low}
                onChange={(e) => setLow(e.target.value)}
                placeholder="e.g. 200"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wide">
                Too high (kW)
              </label>
              <input
                type="number"
                value={high}
                onChange={(e) => setHigh(e.target.value)}
                placeholder="e.g. 3000"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">
            You're not trying to be right — you're bracketing the answer.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!valid}
          onClick={() => valid && onNext({ conjecture, low: lowN, high: highN })}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Next: build a model →
        </button>
      </div>
    </div>
  );
}
