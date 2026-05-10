import { useState } from 'react';
import LessonShell from '../../components/LessonShell';

interface Headline {
  id: string;
  text: string;
  context: string;
  // The "real" math behind the claim
  equation: string;
  variable: string; // what the headline is actually about
  values: { label: string; value: number; unit?: string }[];
  question: string;
  answer: number;
  unit?: string;
  reveal: string;
  /** A built-in honesty critique — what's left out of the headline */
  honesty: string;
}

const HEADLINES: Headline[] = [
  {
    id: 'rent',
    text: '"Average rent rose 30% this year."',
    context: 'A real estate company posts this in a press release.',
    equation: 'new rent = old rent × (1 + 0.30)',
    variable: 'New average rent',
    values: [
      { label: 'Old average rent', value: 1850, unit: '$' },
      { label: 'Percent increase', value: 30, unit: '%' },
    ],
    question: 'What is the new average rent?',
    answer: 2405,
    unit: '$',
    reveal: 'old × 1.30 = $1,850 × 1.30 = $2,405',
    honesty: 'The headline reports the *mean*. If a few luxury units skew it, most renters experienced a smaller jump. Median would be a more honest measure for "what most people pay."',
  },
  {
    id: 'streaming',
    text: '"Streaming hit 5 billion hours last month."',
    context: 'A music service quotes this on its homepage.',
    equation: 'total hours / population = hours per person',
    variable: 'Hours per person, on average',
    values: [
      { label: 'Total hours', value: 5_000_000_000 },
      { label: 'US population', value: 332_000_000 },
    ],
    question: 'What\'s the average hours of streaming per person per month?',
    answer: 15.06,
    unit: 'hours',
    reveal: '5,000,000,000 ÷ 332,000,000 ≈ 15.1 hours',
    honesty: 'The denominator includes everyone — babies, elderly, people without internet. The "average user" hours would be much higher. Beware of dividing by populations that don\'t actually use the thing.',
  },
  {
    id: 'climate',
    text: '"Glaciers shrank 25% over the past 50 years."',
    context: 'A climate report opens with this number.',
    equation: 'remaining = original × (1 − 0.25)',
    variable: 'Remaining ice volume',
    values: [
      { label: 'Original ice volume', value: 100_000, unit: 'km³' },
      { label: 'Percent lost', value: 25, unit: '%' },
    ],
    question: 'How much ice remains?',
    answer: 75_000,
    unit: 'km³',
    reveal: '100,000 × (1 − 0.25) = 100,000 × 0.75 = 75,000 km³',
    honesty: 'Past 50 years is a window. Was the loss linear, or accelerating? Always ask for the time series, not just the start and end.',
  },
  {
    id: 'minimum',
    text: '"Minimum wage workers earn $15/hour."',
    context: 'A senator says this on TV.',
    equation: 'annual = hourly × hours/week × weeks/year',
    variable: 'Annual gross income',
    values: [
      { label: 'Hourly wage', value: 15, unit: '$/hr' },
      { label: 'Hours per week', value: 40 },
      { label: 'Weeks per year', value: 52 },
    ],
    question: 'What\'s the annual income for a full-time minimum-wage worker?',
    answer: 31200,
    unit: '$',
    reveal: '15 × 40 × 52 = $31,200',
    honesty: 'Most minimum-wage workers don\'t actually get 40 hrs/week. Many are part-time, or have variable hours. The $31,200 is an upper bound, not a typical experience.',
  },
  {
    id: 'phone',
    text: '"Average teen spends 7 hours a day on their phone."',
    context: 'A study summary in a parenting magazine.',
    equation: 'percent of waking hours = phone hours / waking hours',
    variable: 'Percent of waking hours on phone',
    values: [
      { label: 'Phone hours', value: 7 },
      { label: 'Sleep hours', value: 9 },
      { label: 'Waking hours', value: 24 - 9 },
    ],
    question: 'What percent of their waking time is spent on the phone?',
    answer: 46.67,
    unit: '%',
    reveal: '7 ÷ 15 ≈ 46.7% of waking hours',
    honesty: 'This counts any second the phone is unlocked — including streaming music in the background, GPS while walking, or doing homework. "On the phone" is ambiguous.',
  },
];

interface AnswerStep {
  state: 'guessing' | 'right' | 'close' | 'wrong';
  guess: string;
}

export default function CrackTheHeadline() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerStep>>({});
  const [revealed, setRevealed] = useState(false);

  const headline = HEADLINES[idx];
  const state = answers[headline.id] ?? { state: 'guessing', guess: '' };

  const submit = () => {
    const guess = parseFloat(state.guess);
    if (!Number.isFinite(guess)) return;
    const tol = Math.abs(headline.answer * 0.05);
    let next: AnswerStep['state'];
    if (Math.abs(guess - headline.answer) <= tol) next = 'right';
    else if (Math.abs(guess - headline.answer) <= headline.answer * 0.2) next = 'close';
    else next = 'wrong';
    setAnswers((a) => ({ ...a, [headline.id]: { ...state, state: next } }));
    setRevealed(true);
  };

  const nextHeadline = () => {
    setIdx((i) => (i + 1) % HEADLINES.length);
    setRevealed(false);
  };

  return (
    <LessonShell number="L8" family="STATISTICAL THINKING" title="Crack the Headline" concept="Algebra in disguise" accent="emerald">
      <div className="space-y-6">
        <div>
          <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 leading-tight">
            Every headline is an <em className="not-italic text-accent-600">equation</em><br />
            in disguise.
          </h1>
          <p className="text-ink-soft mt-3 max-w-prose leading-relaxed">
            Read the headline. Identify what's known and what's missing. Set up
            the equation. Solve it. Then check whether the headline was being
            honest about its math.
          </p>
        </div>

        {/* Headline card */}
        <div className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
          <div className="px-6 py-3 border-b border-surface-line bg-surface-subtle/40 flex items-center justify-between">
            <div className="eyebrow text-ink-muted">Headline · {idx + 1} of {HEADLINES.length}</div>
            <div className="text-xs text-ink-muted">{headline.context}</div>
          </div>
          <div className="p-6">
            <div className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-snug mb-5">
              {headline.text}
            </div>

            {/* Givens */}
            <div className="space-y-2 mb-5">
              <div className="eyebrow text-ink-muted">What we know</div>
              {headline.values.map((v, i) => (
                <div key={i} className="flex items-baseline justify-between border-b border-surface-line py-1.5 text-sm">
                  <span className="text-ink-soft">{v.label}</span>
                  <span className="font-mono tabular-nums text-ink">
                    {v.unit && v.unit.startsWith('$') ? v.unit : ''}
                    {v.value.toLocaleString()}
                    {v.unit && !v.unit.startsWith('$') ? ` ${v.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Question */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5">
              <div className="eyebrow text-emerald-800 mb-2">Solve for</div>
              <div className="font-display text-lg font-bold text-ink mb-3">{headline.question}</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={state.guess}
                  onChange={(e) => setAnswers((a) => ({ ...a, [headline.id]: { ...(a[headline.id] ?? state), guess: e.target.value } }))}
                  placeholder="Your answer…"
                  className="flex-1 px-3 py-2.5 rounded-md bg-surface-raised border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-mono"
                  disabled={revealed}
                />
                {!revealed ? (
                  <button onClick={submit} disabled={!state.guess.trim()} className="px-5 py-2.5 rounded-md bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 disabled:bg-slate-300 transition">
                    Check
                  </button>
                ) : (
                  <button onClick={nextHeadline} className="px-5 py-2.5 rounded-md bg-brand-900 text-white font-semibold text-sm hover:bg-brand-700 transition">
                    Next →
                  </button>
                )}
              </div>
              {revealed && state.state !== 'guessing' && (
                <div className={`mt-3 text-sm font-semibold ${state.state === 'right' ? 'text-emerald-700' : state.state === 'close' ? 'text-amber-700' : 'text-rose-700'}`}>
                  {state.state === 'right' ? '✓ Correct.' : state.state === 'close' ? 'Close — within 20%.' : 'Off by more than 20%.'}
                </div>
              )}
            </div>

            {/* Reveal */}
            {revealed && (
              <div className="space-y-4">
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                  <div className="eyebrow text-brand-700 mb-1.5">The math</div>
                  <div className="font-mono text-sm text-ink mb-2">{headline.equation}</div>
                  <div className="font-display text-xl font-bold text-ink tabular-nums">
                    {headline.unit?.startsWith('$') ? '$' : ''}
                    {headline.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    {headline.unit && !headline.unit.startsWith('$') ? ` ${headline.unit}` : ''}
                  </div>
                  <div className="text-xs text-ink-muted mt-1 font-mono">{headline.reveal}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="eyebrow text-amber-800 mb-1.5">But was the headline honest?</div>
                  <p className="text-sm text-ink leading-relaxed">{headline.honesty}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Headline picker */}
        <div className="flex flex-wrap gap-2">
          {HEADLINES.map((h, i) => (
            <button
              key={h.id}
              onClick={() => { setIdx(i); setRevealed(answers[h.id]?.state !== undefined && answers[h.id]?.state !== 'guessing'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                i === idx ? 'bg-brand-900 text-white' : 'bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle'
              }`}
            >
              {i + 1}. {h.text.slice(1, 24)}…
            </button>
          ))}
        </div>

        {/* Lesson */}
        <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-900">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            Most "math problems" in life don't arrive with x and y. They arrive
            as English claims with the math hidden. The skill is the
            <strong> translation</strong>: what's known, what's missing, what
            equation connects them. Then solve. Then ask whether the equation
            was the right one.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
            <strong className="text-emerald-900">A reading habit:</strong>{' '}
            every time you see a number in a headline, ask "what equation
            produced this, and what did it leave out?"
          </div>
        </div>
      </div>
    </LessonShell>
  );
}
