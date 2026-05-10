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

export default function ReactionIdentify({ onNext }: IdentifyProps) {
  const [firstQuestion, setFirstQuestion] = useState('');
  const [mainQuestion, setMainQuestion] = useState('How fast can I react?');
  const [conjecture, setConjecture] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [tooLow, setTooLow] = useState('');
  const [tooHigh, setTooHigh] = useState('');

  const c = parseFloat(conjecture);
  const lo = parseFloat(tooLow);
  const hi = parseFloat(tooHigh);
  const valid = firstQuestion.trim().length > 2 && mainQuestion.trim().length > 2 && Number.isFinite(c) && Number.isFinite(lo) && Number.isFinite(hi) && lo < hi && c > 0;

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
          <p className="text-sm text-ink-soft">Watch, wonder, and make a guess.</p>
        </div>
      </div>

      <HostBubble accent="emerald" name="Alex">
        Hey — I'm Alex. Here's a famous number: a typical adult human reaction
        time is around 250 milliseconds. A quarter of a second. That includes
        light hitting your eye, the signal racing up your optic nerve, your
        brain noticing and deciding, and a motor signal going back down your
        arm to your finger. Today we'll measure yours. But before we test it,
        I want you to guess.
      </HostBubble>

      <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-5">
        <Question n={1} label="What is the first question that comes to mind?">
          <textarea
            value={firstQuestion}
            onChange={(e) => setFirstQuestion(e.target.value)}
            placeholder="e.g. Is reaction time the same for everyone? Does coffee help?"
            className="w-full p-3 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>

        <Question n={2} label="Write down the main question you will answer.">
          <input
            value={mainQuestion}
            onChange={(e) => setMainQuestion(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
          />
        </Question>

        <Question n={3} label="Make an initial conjecture (in milliseconds).">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={conjecture}
              onChange={(e) => setConjecture(e.target.value)}
              placeholder="e.g. 250"
              className="w-32 px-3 py-2.5 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none font-mono tabular-nums"
            />
            <span className="text-sm text-ink-muted">ms (median reaction time)</span>
          </div>
        </Question>

        <Question n={4} label="Explain how you arrived at your conjecture." optional>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="One sentence is fine."
            className="w-full p-3 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none"
            rows={2}
          />
        </Question>

        <div className="border-t border-surface-line pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Question n={5} label="A number that's too small (ms).">
              <input
                type="number"
                value={tooLow}
                onChange={(e) => setTooLow(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none font-mono"
              />
            </Question>
            <Question n={6} label="A number that's too large (ms).">
              <input
                type="number"
                value={tooHigh}
                onChange={(e) => setTooHigh(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full px-3 py-2.5 rounded-md border border-surface-line focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none font-mono"
              />
            </Question>
          </div>
          <p className="text-xs text-ink-muted mt-2 italic">You're bracketing the answer, not guessing exactly.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!valid}
          onClick={() => onNext({ firstQuestion, mainQuestion, conjecture: c, reasoning, tooLow: lo, tooHigh: hi })}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          Next: develop a model →
        </button>
      </div>
    </div>
  );
}

function Question({ n, label, optional, children }: { n: number; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[10px] font-mono text-ink-muted">{n}</span>
        <label className="text-sm font-semibold text-ink">{label}</label>
        {optional && <span className="text-[10px] text-ink-muted italic">(optional)</span>}
      </div>
      {children}
    </div>
  );
}
