import { useEffect, useRef, useState } from 'react';
import { NarratorIntro, NarratorSays } from './Narrator';
import { ReactionActFrame } from './ReactionClassicShell';
import type { ReactionAdvanceState } from './ReactionClassicShell';

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
  onAdvanceStateChange?: (state: ReactionAdvanceState) => void;
}

type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: 'Meet Dr. Reyes',
  2: 'Make a prediction',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2]];

const WONDER_OPTIONS = [
  'Is reaction time the same for everyone?',
  'Does it get faster with practice?',
  'Are your eyes faster than your ears?',
  'Does coffee or sleep change it?',
];

export default function ReactionIdentify({ onNext, onAdvanceStateChange }: IdentifyProps) {
  const [step, setStep] = useState<Step>(1);
  const [notice, setNotice] = useState('');
  const [conjecture, setConjecture] = useState('');

  const canAdvance =
    step === 1 ? true :
    notice !== '' && conjecture.trim().length > 0;

  const hint =
    step === 2 && notice === ''
      ? 'Pick a wondering before continuing.'
      : step === 2 && conjecture.trim().length === 0
      ? 'Enter your predicted reaction time.'
      : '';

  const nextLabel =
    step === 1 ? 'Next: Make a prediction →' :
    'Next: Start trials →';

  const backLabel =
    step === 2 ? 'Back to meet Dr. Reyes' :
    undefined;

  const handleAdvance = () => {
    if (step === 1) {
      setStep(2);
    } else {
      const c = parseFloat(conjecture);
      onNext({
        firstQuestion: notice,
        mainQuestion: 'How fast can I react?',
        conjecture: Number.isFinite(c) ? c : 0,
        reasoning: '',
        tooLow: 0,
        tooHigh: 0,
      });
    }
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint,
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep((s) => (s - 1) as Step) : undefined,
      backLabel,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, hint, nextLabel, backLabel, onAdvanceStateChange, notice, conjecture]);

  const stepSubhead =
    step === 1
      ? 'Your guide for the Reaction Time Arena.'
      : 'What do you wonder? Take a guess before the test.';

  return (
    <ReactionActFrame
      actNumber={1}
      eyebrow="NOTICE & WONDER · WHOLE CLASS"
      title="How fast are you?"
      step={step}
      stepTotal={2}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <NarratorIntro />
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-emerald-50 p-5">
            <div className="text-[10px] font-bold tracking-widest text-violet-700">TODAY'S DATA STORY</div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-brand-900">
              Your nervous system becomes the dataset.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Each tap becomes one measurement in milliseconds. First you react to light,
              then to sound, and the shape of those two small distributions tells the story.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <MiniMetric label="Visual" value="10" sub="trials" tone="violet" />
              <MiniMetric label="Audio" value="10" sub="trials" tone="emerald" />
              <MiniMetric label="Compare" value="2" sub="medians" tone="amber" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act1Predict" />

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-surface-line bg-surface-raised p-5">
              <div className="mb-4">
                <div className="text-[10px] font-bold tracking-widest text-violet-700">PICK YOUR WONDER</div>
                <h2 className="mt-1 font-display text-xl font-bold text-brand-900">
                  What are you curious to test?
                </h2>
              </div>
              <div className="grid gap-2">
                {WONDER_OPTIONS.map((opt, index) => {
                  const selected = notice === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNotice(opt)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                        selected
                          ? 'border-violet-500 bg-violet-50 text-violet-950 shadow-sm ring-2 ring-violet-100'
                          : 'border-surface-line bg-white text-ink hover:border-violet-300 hover:bg-violet-50/40'
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          selected ? 'bg-violet-600 text-white' : 'bg-surface-subtle text-ink-muted'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-700 to-brand-900 p-5 text-white shadow-editorial">
              <div className="text-[10px] font-bold tracking-widest text-violet-200">PREDICTION LOCK-IN</div>
              <div className="mt-2 font-display text-2xl font-bold leading-tight">
                How fast is your visual reaction time?
              </div>
              <label className="mt-4 block text-xs font-bold tracking-widest text-violet-200">
                MY GUESS
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={conjecture}
                  onChange={(e) => setConjecture(e.target.value)}
                  placeholder="250"
                  className="w-36 rounded-xl border border-white/20 bg-white px-4 py-3 font-mono text-2xl font-bold tabular-nums text-brand-900 outline-none focus:ring-4 focus:ring-violet-300/35"
                />
                <span className="text-sm font-semibold text-violet-100">ms</span>
              </div>
              <div className="mt-3 rounded-xl border border-white/15 bg-white/10 p-3 text-xs leading-relaxed text-violet-100">
                Typical visual reactions often land near 250-270 ms, but practice,
                attention, hardware, and anticipation all move the number.
              </div>
            </div>
          </div>
        </>
      )}
    </ReactionActFrame>
  );
}

function MiniMetric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: 'violet' | 'emerald' | 'amber';
}) {
  const cls = {
    violet: 'border-violet-200 bg-violet-50 text-violet-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
  }[tone];
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="text-[9px] font-bold tracking-widest opacity-70">{label.toUpperCase()}</div>
      <div className="font-display text-3xl font-bold leading-none">{value}</div>
      <div className="text-xs opacity-75">{sub}</div>
    </div>
  );
}
