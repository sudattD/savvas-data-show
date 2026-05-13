import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

export interface IdentifyState {
  firstQuestion: string;
  mainQuestion: string;
  conjecture: number;
  reasoning: string;
  tooLow: number;
  tooHigh: number;
}

interface IdentifyProps {
  onNext: (data: IdentifyState) => void;
}

const WONDER_OPTIONS = [
  'Is reaction time the same for everyone?',
  'Does it get faster with practice?',
  'Are your eyes faster than your ears?',
  'Does coffee or sleep change it?',
];

export default function ReactionIdentify({ onNext }: IdentifyProps) {
  const [notice, setNotice] = useState('');
  const [conjecture, setConjecture] = useState('');

  const finish = () => {
    const c = parseFloat(conjecture);
    onNext({
      firstQuestion: notice,
      mainQuestion: 'How fast can I react?',
      conjecture: Number.isFinite(c) ? c : 0,
      reasoning: '',
      tooLow: 0,
      tooHigh: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">1</div>
        </div>
        <div>
          <div className="eyebrow text-violet-700">IDENTIFY THE PROBLEM</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            How fast are you?
          </h1>
          <p className="text-sm text-ink-soft">Make a quick guess, then test it.</p>
        </div>
      </div>

      <HostBubble accent="emerald" name="Alex">
        Hey — I'm Alex. A typical adult reaction time is around 250 ms — a
        quarter of a second. Light has to hit your eye, race up your optic
        nerve, your brain has to notice and decide, and the motor signal has
        to come back down to your finger. Before we measure yours, take a
        guess.
      </HostBubble>

      <div className="bg-surface-raised border border-surface-line rounded-lg p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-2">
            What do you wonder? <span className="text-[10px] text-ink-muted italic font-normal">(pick one)</span>
          </label>
          <div className="flex flex-col gap-1.5">
            {WONDER_OPTIONS.map((opt) => {
              const selected = notice === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNotice(opt)}
                  className={`text-left text-sm px-3 py-2 rounded-md border transition ${
                    selected
                      ? 'border-violet-500 bg-violet-50 text-violet-900 ring-2 ring-violet-100'
                      : 'border-surface-line text-ink hover:border-violet-300 hover:bg-violet-50/40'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-surface-line pt-4">
          <div className="eyebrow text-violet-700 mb-1">TODAY'S QUESTION</div>
          <div className="text-sm font-semibold text-ink mb-3">
            How fast is your reaction time, in milliseconds?
          </div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">
            Predict before you test <span className="text-[10px] text-ink-muted italic font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={conjecture}
              onChange={(e) => setConjecture(e.target.value)}
              placeholder="e.g. 250"
              className="w-32 px-3 py-2 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none font-mono tabular-nums"
            />
            <span className="text-sm text-ink-muted">ms</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-ink-muted">10 trials with your eyes, then 10 with your ears.</div>
        <button
          onClick={finish}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition"
        >
          Next: start trials →
        </button>
      </div>
    </div>
  );
}
