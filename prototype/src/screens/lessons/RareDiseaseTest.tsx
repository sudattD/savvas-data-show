import { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';

export default function RareDiseaseTest() {
  // Disease prevalence: how many in 1000 actually have it
  const [prevalence, setPrevalence] = useState(10); // 10 in 1000 = 1%
  // Test characteristics
  const [sensitivity, setSensitivity] = useState(99); // % of sick correctly flagged
  const [specificity, setSpecificity] = useState(95); // % of healthy correctly cleared

  const N = 1000;
  const sick = prevalence;
  const healthy = N - sick;
  const truePos = Math.round(sick * sensitivity / 100);
  const falseNeg = sick - truePos;
  const falsePos = Math.round(healthy * (100 - specificity) / 100);
  const trueNeg = healthy - falsePos;

  const totalPositive = truePos + falsePos;
  const ppv = totalPositive > 0 ? (truePos / totalPositive) * 100 : 0;

  // Build a 50x20 grid of patients
  const grid = useMemo(() => {
    const cells: Array<'TP' | 'FN' | 'FP' | 'TN'> = [];
    for (let i = 0; i < truePos; i++) cells.push('TP');
    for (let i = 0; i < falseNeg; i++) cells.push('FN');
    for (let i = 0; i < falsePos; i++) cells.push('FP');
    for (let i = 0; i < trueNeg; i++) cells.push('TN');
    // shuffle deterministically so the layout looks random but stable
    let seed = 42;
    for (let i = cells.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    return cells;
  }, [truePos, falseNeg, falsePos, trueNeg]);

  const COLOR: Record<string, string> = {
    TP: 'bg-rose-500',
    FN: 'bg-rose-200 ring-1 ring-rose-400',
    FP: 'bg-amber-400',
    TN: 'bg-surface-line',
  };

  return (
    <LessonShell number="L7" family="STATISTICAL THINKING" title="The Rare Disease Test" concept="Base-rate fallacy" accent="amber" envisionChapter={{ course: 'algebra2', topic: 12 }}>
      <div className="space-y-6">
        <div>
          <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 leading-tight">
            You tested positive.<br />
            <em className="not-italic text-accent-600">Should you panic?</em>
          </h1>
          <p className="text-ink-soft mt-3 max-w-prose leading-relaxed">
            Imagine 1,000 people lined up. A small fraction of them have a rare
            disease. The rest are healthy. Everyone takes a test that's mostly
            but not perfectly accurate. Slide the parameters to set up the
            scenario, then look at the grid.
          </p>
        </div>

        {/* Sliders */}
        <div className="grid sm:grid-cols-3 gap-4 bg-surface-raised border border-surface-line rounded-lg p-5">
          <Slider label="Disease prevalence" value={prevalence} setValue={setPrevalence} min={1} max={200} step={1} unit={`in 1000 = ${(prevalence/10).toFixed(1)}%`} />
          <Slider label="Test sensitivity" value={sensitivity} setValue={setSensitivity} min={50} max={100} step={1} unit="% of sick correctly flagged" />
          <Slider label="Test specificity" value={specificity} setValue={setSpecificity} min={50} max={100} step={1} unit="% of healthy correctly cleared" />
        </div>

        {/* Patient grid */}
        <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
          <div className="eyebrow text-ink-muted mb-3">1,000 PATIENTS · ONE DOT EACH</div>
          <div className="grid grid-cols-50 gap-px" style={{ gridTemplateColumns: 'repeat(50, minmax(0, 1fr))' }}>
            {grid.map((kind, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${COLOR[kind]}`}
                title={kind === 'TP' ? 'Has disease, tested positive (true positive)' : kind === 'FN' ? 'Has disease, tested negative (false negative)' : kind === 'FP' ? 'No disease, tested positive (false positive)' : 'No disease, tested negative (true negative)'}
              />
            ))}
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mt-5 text-xs">
            <Legend color="rose-500" label="True positive" count={truePos} sub="has disease + tested positive" />
            <Legend color="rose-200" label="False negative" count={falseNeg} sub="has disease + tested negative (missed)" outline />
            <Legend color="amber-400" label="False positive" count={falsePos} sub="no disease + tested positive (mistake)" />
            <Legend color="surface-line" label="True negative" count={trueNeg} sub="no disease + tested negative" />
          </div>
        </div>

        {/* The reveal */}
        <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
          <div className="eyebrow text-accent-700 mb-2">The number that matters</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            If you tested positive, your chance of actually having the disease is{' '}
            <span className="text-accent-700 tabular-nums">{ppv.toFixed(1)}%</span>.
          </h2>
          <p className="text-sm text-ink-soft mt-3 leading-relaxed">
            Of {totalPositive} people who tested positive, only{' '}
            <strong>{truePos}</strong> actually have the disease. The remaining{' '}
            <strong>{falsePos}</strong> are <em>false positives</em> — healthy
            people the test got wrong. {ppv < 30 && 'When the disease is rare, even a 95% accurate test produces mostly false alarms.'}
            {ppv >= 30 && ppv < 70 && 'The number is closer to "coin flip" than to "definitely sick."'}
            {ppv >= 70 && 'When prevalence and accuracy are high, a positive test is meaningful.'}
          </p>
        </div>

        {/* Lesson */}
        <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-brand-900">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            This is the <strong>base-rate fallacy</strong>. The accuracy of a
            test only tells you how the test performs on a single person — it
            doesn't tell you what the test result <em>means</em> about that
            person. To answer "given a positive test, do I have the disease?"
            you need to multiply through the whole population.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Bayes' theorem is the formal name. You don't need the formula —
            you need the <em>grid</em>. Counting dots in 1,000 patients is the
            same calculation, more honestly.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <strong className="text-amber-900">Real-world stakes:</strong>{' '}
            mammograms, COVID tests, drug tests, lie detectors, AI face matchers,
            airport screening — all of these are subject to this math. The
            question isn't "how accurate is the test?" — it's "what fraction
            of the people who got flagged are actually positive?"
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

function Slider({ label, value, setValue, min, max, step, unit }: {
  label: string; value: number; setValue: (n: number) => void;
  min: number; max: number; step: number; unit: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-ink">{label}</label>
        <span className="font-mono text-sm tabular-nums text-brand-700">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full" />
      <div className="text-[10px] font-mono text-ink-muted mt-1">{unit}</div>
    </div>
  );
}

function Legend({ color, label, count, sub, outline }: { color: string; label: string; count: number; sub: string; outline?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`w-3 h-3 rounded-sm shrink-0 mt-0.5 bg-${color} ${outline ? 'ring-1 ring-rose-400' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink text-xs flex items-baseline justify-between gap-2">
          <span className="truncate">{label}</span>
          <span className="font-mono tabular-nums">{count}</span>
        </div>
        <div className="text-[10px] text-ink-muted leading-snug mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
