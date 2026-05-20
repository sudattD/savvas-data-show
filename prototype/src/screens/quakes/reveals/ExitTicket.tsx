import { useState } from 'react';

// Quick check-for-understanding at the end of Act 3. Four chip-based
// multiple-choice questions, each with a single defensible answer plus a
// short "why" that appears after the student picks. After they pick, we
// also show *how* to verify the answer in the data — which lens, which
// steps. That turns the question from a recall check into a method check.
// No grades — this is formative, not summative.

interface Option {
  id: string;
  text: string;
  correct?: boolean;
  why: string;
}

interface VerifyHint {
  lens: 'Map' | 'Histogram' | 'Scatter';
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
    id: 'where',
    stem: 'Earthquakes happen mostly…',
    options: [
      { id: 'a', text: 'Randomly all over Earth', why: 'The dots show clear clusters, not random scatter.' },
      { id: 'b', text: 'At the boundaries of tectonic plates', correct: true, why: 'Yes — quakes happen where plates push, slide, or dive past each other.' },
      { id: 'c', text: 'Mostly in the middle of oceans', why: 'The middle of the Pacific Ocean is one of the quietest places on Earth.' },
      { id: 'd', text: 'Near volcanoes', why: 'Volcanoes and quakes both cluster at plate boundaries — the boundary is the cause, not the volcano.' },
    ],
    verify: {
      lens: 'Map',
      steps: [
        'Open the Map lens in Act 2 (or the reveal globe above).',
        'Look at where dots cluster — they trace curves, not random scatter.',
        'Toggle the Ring of Fire arcs ON.',
        'Eyeball: how many dots sit on the curve vs in the middle of continents?',
      ],
      conclusion: '~80% of all M6+ events sit on the Ring of Fire alone. Boundaries dominate.',
    },
  },
  {
    id: 'predict-where',
    stem: 'The strongest predictor of where the next big quake will happen is…',
    options: [
      { id: 'a', text: 'How long since the last quake there', why: 'Not reliable — quakes don\'t fire on a clock.' },
      { id: 'b', text: 'Whether the location is on a plate boundary', correct: true, why: 'Yes — boundaries are where strain accumulates and releases.' },
      { id: 'c', text: 'How densely populated the area is', why: 'Population has no effect on where quakes happen — it affects how damaging they are.' },
      { id: 'd', text: 'The time of year', why: 'There\'s no seasonality to quakes — the time histogram is steady year-round.' },
    ],
    verify: {
      lens: 'Map',
      steps: [
        'In the Map lens, drag the magnitude slider up to M5+.',
        'Most dots disappear — but the survivors still trace the same curve.',
        'Push to M6+. Same shape. Push to M7+. Still the same shape.',
        'The pattern is location-locked, not magnitude-dependent.',
      ],
      conclusion: 'Past big quakes sit on plate boundaries. Future big quakes will too.',
    },
  },
  {
    id: 'depth-mag',
    stem: 'Does depth predict magnitude?',
    options: [
      { id: 'a', text: 'Yes — deeper quakes are always bigger', why: 'The biggest quakes are actually shallow, not deep.' },
      { id: 'b', text: 'Yes — shallower quakes are always bigger', why: 'There are huge shallow quakes, but also small ones — shallow doesn\'t mean big.' },
      { id: 'c', text: 'No — depth and magnitude are largely independent', correct: true, why: 'Correct. The scatter shows no clean relationship. The biggest events happen to be shallow, but you can\'t predict magnitude from depth.' },
      { id: 'd', text: 'It depends entirely on the region', why: 'Region matters for where, not for how strongly depth predicts magnitude.' },
    ],
    verify: {
      lens: 'Scatter',
      steps: [
        'Open the Scatter lens in Act 2.',
        'Pick Depth (km) for one axis and Magnitude for the other.',
        'Inside the chart, toggle "fit a line" ON.',
        'Read the R² value the chart shows. The closer to 0, the weaker the relationship.',
      ],
      conclusion: 'R² comes out very low here — a line fits, but it doesn\'t explain much.',
    },
  },
  {
    id: 'safer',
    stem: 'Of these places, which one would you NOT pick if you wanted to live in a low-earthquake area?',
    options: [
      { id: 'a', text: 'Central Africa', why: 'Plate interior — very safe seismically.' },
      { id: 'b', text: 'Central Australia', why: 'Plate interior — very safe seismically.' },
      { id: 'c', text: 'Coastal Japan', correct: true, why: 'Yes — Japan sits on top of a subduction zone, one of the most active plate boundaries on Earth.' },
      { id: 'd', text: 'Central Brazil', why: 'Plate interior — very safe seismically.' },
    ],
    verify: {
      lens: 'Map',
      steps: [
        'In the Map lens (or the reveal globe), rotate to bring Japan into view.',
        'Compare the dot density over Japan to central Africa, central Australia, or central Brazil.',
        'Notice which location sits ON a plate boundary and which sit deep inside a plate.',
      ],
      conclusion: 'Japan sits directly on a subduction zone. The others are plate interiors — far from any edge.',
    },
  },
];

export default function ExitTicket() {
  // selectedOptionId per questionId
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
          <div className="text-[10px] font-semibold tracking-widest text-rose-700">
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
                <span className="text-xs font-semibold text-rose-700 tabular-nums">{i + 1}.</span>
                <span className="text-sm font-semibold text-ink">{q.stem}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 pl-6">
                {q.options.map((opt) => {
                  const isPicked = pickedId === opt.id;
                  const showFeedback = !!pickedId;
                  const isCorrect = opt.correct === true;
                  const stylePalette = !showFeedback
                    ? 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700'
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
    Map: 'bg-rose-100 text-rose-800 border-rose-200',
    Histogram: 'bg-amber-100 text-amber-800 border-amber-200',
    Scatter: 'bg-indigo-100 text-indigo-800 border-indigo-200',
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
