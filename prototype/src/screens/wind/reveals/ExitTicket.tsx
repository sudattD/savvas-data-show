import { useState } from 'react';

// Quick check-for-understanding at the end of Act 3. Four chip-based
// multiple-choice questions, each with a single defensible answer plus a
// short "why" that appears after the student picks, then a "how to verify"
// card pointing back to a lens. Formative, not summative — no grades.

interface Option {
  id: string;
  text: string;
  correct?: boolean;
  why: string;
}

interface VerifyHint {
  lens: 'Fit' | 'Differences' | 'Regime';
  steps: string[];
  conclusion: string;
}

interface Question {
  id: string;
  stem: string;
  options: Option[];
  verify: VerifyHint;
}

const QUESTIONS: readonly Question[] = [
  {
    id: 'shape',
    stem: 'Between cut-in and rated speed, the power curve is best modeled by…',
    options: [
      { id: 'a', text: 'A straight line', why: 'A line can\'t bend — and this curve clearly does.' },
      { id: 'b', text: 'A quadratic (parabola)', correct: true, why: 'Yes — a parabola hugs the ramp-up zone with R² near 0.98.' },
      { id: 'c', text: 'A constant value', why: 'Power isn\'t constant here — it climbs steeply with wind speed.' },
      { id: 'd', text: 'Nothing — it\'s pure random scatter', why: 'There is scatter, but a strong curved trend runs right through it.' },
    ],
    verify: {
      lens: 'Fit',
      steps: [
        'Open the Fit lens in Act 2.',
        'Drag a, b and c until the orange curve hugs the shaded ramp-up dots.',
        'Watch the R² readout climb toward 1.000.',
        'Notice no straight line could ever score that high here.',
      ],
      conclusion: 'A quadratic reaches R² ≈ 0.98 on the ramp-up zone — a line cannot.',
    },
  },
  {
    id: 'how-know',
    stem: 'How can you tell data is quadratic and not linear?',
    options: [
      { id: 'a', text: 'The first differences are constant', why: 'Constant FIRST differences mean linear — a straight line.' },
      { id: 'b', text: 'The second differences are constant', correct: true, why: 'Right — constant second differences are the fingerprint of a quadratic.' },
      { id: 'c', text: 'The values go up', why: 'Lots of functions go up — that alone tells you nothing about the shape.' },
      { id: 'd', text: 'It looks curved', why: '"Looks curved" is a hunch; constant second differences are the proof.' },
    ],
    verify: {
      lens: 'Differences',
      steps: [
        'Open the Differences lens in Act 2.',
        'Bin the ramp-up zone into equal wind-speed bins.',
        'Read down the 1st-difference column — it keeps growing.',
        'Read down the 2nd-difference column — it stays roughly constant.',
      ],
      conclusion: 'Constant second differences (not first) is what makes data quadratic.',
    },
  },
  {
    id: 'flatten',
    stem: 'Why does power flatten out at high wind speeds?',
    options: [
      { id: 'a', text: 'The wind stops getting stronger', why: 'The wind keeps rising — the readings past 12 m/s prove it.' },
      { id: 'b', text: 'The turbine caps its output on purpose', correct: true, why: 'Yes — at rated speed it pitches its blades to hold a safe, fixed output.' },
      { id: 'c', text: 'The sensors stop working', why: 'The sensors are fine — they faithfully record the flat rated zone.' },
      { id: 'd', text: 'The math says a parabola must flatten', why: 'A parabola doesn\'t flatten — it keeps curving up. The flattening is engineering, not math.' },
    ],
    verify: {
      lens: 'Regime',
      steps: [
        'Open the Regime lens in Act 2.',
        'Look at the rated zone — the dots sit on a flat ceiling near 1500 kW.',
        'Compare it to a parabola, which would keep curving upward.',
        'The flat top is a design choice, not part of any curve.',
      ],
      conclusion: 'At rated speed, engineers cap output to protect the generator and gearbox.',
    },
  },
  {
    id: 'extrapolate',
    stem: 'Your quadratic predicts power well at 8 m/s. Will it predict well at 20 m/s?',
    options: [
      { id: 'a', text: 'Yes — a good model always works', why: 'No model "always works" — every model has a range where it holds.' },
      { id: 'b', text: 'No — 20 m/s is in the rated zone, outside the model\'s range', correct: true, why: 'Right — the quadratic models the ramp-up zone only; at 20 m/s the curve is flat.' },
      { id: 'c', text: 'Yes — 20 is close enough to 8', why: '20 m/s is in a completely different regime than 8 m/s.' },
      { id: 'd', text: 'No — quadratics never predict anything', why: 'The quadratic predicts the ramp-up zone very well — just not outside it.' },
    ],
    verify: {
      lens: 'Regime',
      steps: [
        'In the Regime lens, fit the ramp-up zone alone — R² is high.',
        'Now add the rated zone to the fit.',
        'Watch R² fall — the same quadratic can no longer keep up.',
        'A model is only trustworthy inside the zone it was built for.',
      ],
      conclusion: 'At 20 m/s the curve is a flat ceiling — the quadratic would badly overshoot.',
    },
  },
];

export default function ExitTicket() {
  const [picks, setPicks] = useState<Record<string, string>>({});

  const answered = Object.keys(picks).length;
  const correctCount = QUESTIONS.filter((q) => {
    const pickedId = picks[q.id];
    return pickedId && q.options.find((o) => o.id === pickedId)?.correct;
  }).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-sky-700">
            SHOW WHAT YOU'VE LEARNED · EXIT TICKET
          </div>
          <h3 className="font-display text-xl font-bold text-ink leading-tight mt-1">
            Four quick questions before you go.
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Tap your answer. You'll see why right away. No grades — just a check.
          </p>
        </div>
        {answered > 0 && (
          <div className="text-[10px] font-mono text-slate-500 shrink-0 tabular-nums">
            {answered}/{QUESTIONS.length} answered · {correctCount} on the mark
          </div>
        )}
      </div>

      <div className="space-y-5">
        {QUESTIONS.map((q, i) => {
          const pickedId = picks[q.id];
          return (
            <div key={q.id} className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-sky-700 tabular-nums">{i + 1}.</span>
                <span className="text-sm font-semibold text-ink">{q.stem}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 pl-6">
                {q.options.map((opt) => {
                  const isPicked = pickedId === opt.id;
                  const showFeedback = !!pickedId;
                  const isCorrect = opt.correct === true;
                  const stylePalette = !showFeedback
                    ? 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700'
                    : isPicked && isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : isPicked && !isCorrect
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : !isPicked && isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-500';
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPicks((p) => ({ ...p, [q.id]: opt.id }))}
                      disabled={showFeedback}
                      className={`text-left px-3 py-2 rounded-lg border text-xs leading-snug transition ${stylePalette} disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">
                          {!showFeedback ? '○' : isCorrect ? '✓' : isPicked ? '✗' : '·'}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {pickedId && (
                <>
                  <div className="pl-6 pt-1 text-xs text-slate-600 leading-snug italic">
                    {q.options.find((o) => o.id === pickedId)?.why}
                  </div>
                  <div className="ml-6 mt-3">
                    <VerifyCard verify={q.verify} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerifyCard({ verify }: { verify: VerifyHint }) {
  const lensColor: Record<VerifyHint['lens'], string> = {
    Fit: 'bg-sky-100 text-sky-800 border-sky-200',
    Differences: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Regime: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold tracking-widest text-slate-600">
          🔎 HOW TO VERIFY · USE THE
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${lensColor[verify.lens]}`}
        >
          {verify.lens.toUpperCase()} LENS
        </span>
      </div>
      <ol className="text-xs text-slate-700 leading-snug list-decimal list-inside space-y-1 pl-1">
        {verify.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 leading-snug">
        <span className="font-semibold text-slate-900">→ </span>
        <span>{verify.conclusion}</span>
      </div>
    </div>
  );
}
