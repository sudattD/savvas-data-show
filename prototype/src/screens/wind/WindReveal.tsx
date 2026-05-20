import { useEffect, useRef, useState } from 'react';
import { getDataset } from '../../data/registry';
import { WIND_DATA } from '../../data/windTurbine';
import ActFrame from './ActFrame';
import { NarratorSays } from './Narrator';
import type { AdvanceState } from './NextRow';
import ChipPicker from './chips/ChipPicker';
import {
  FINAL_CLAIM_CHIPS,
  NOTEBOOK_HEADLINE_CHIPS,
  NOTICE_CHIPS,
  WONDER_CHIPS,
  renderStaticChips,
} from './chips/catalog';
import RevealCard from './reveals/RevealCard';
import { listRevealsFor, RAMP_UP_FIT_INFO } from './reveals/revealCatalog';
import ExitTicket from './reveals/ExitTicket';
import ExtensionPrompts from './reveals/ExtensionPrompts';
import PowerCurveScatter from './PowerCurveScatter';
import { CUT_IN_SPEED, RATED_SPEED, RATED_POWER } from './regimes';
import type { WindSummary, LensSummary, QuadFit } from './WindInvestigate';
import type { ClassWonderings, GroupWondering } from './WindWonder';

interface WindRevealProps {
  summary: WindSummary;
  wonderings: ClassWonderings | null;
  onRestart: () => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

const NOTEBOOK_KEY = 'savvas:notebook:wind-power-curve';

interface NotebookEntry {
  finalClaimChipIds: string[];
  finalClaims: string[];
  headlineChipIds: string[];
  headlines: string[];
  savedAt: string;
  synthesisLines: string[];
  bestFit: QuadFit;
  groups: GroupWondering[];
  lenses: WindSummary['lenses'];
}

function loadNotebookEntry(): NotebookEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(NOTEBOOK_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NotebookEntry;
  } catch {
    return null;
  }
}

function saveNotebookEntry(entry: NotebookEntry): boolean {
  try {
    window.localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}

function formatSavedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getDiscussionPrompt(): string | null {
  try {
    const dataset = getDataset('wind');
    const fit = dataset.chapterFits?.find((f) => f.course === 'algebra1' && f.topic === 8);
    return fit?.discussion?.[2] ?? fit?.discussion?.[0] ?? null;
  } catch {
    return null;
  }
}

function fmtEquation(f: QuadFit): string {
  return `P = ${f.a.toFixed(2)}·v² ${f.b >= 0 ? '+' : '−'} ${Math.abs(f.b).toFixed(
    1,
  )}·v ${f.c >= 0 ? '+' : '−'} ${Math.abs(f.c).toFixed(0)}`;
}

const finalClaimOptions = FINAL_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const headlineOptions = NOTEBOOK_HEADLINE_CHIPS.map((c) => ({ id: c.id, label: c.text }));

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Revisit',
  2: 'The reveal',
  3: 'Commit',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

const LENS_NAMES: Record<keyof WindSummary['lenses'], string> = {
  fit: 'Fit a curve',
  differences: 'Differences',
  regime: 'Regimes',
};

export default function WindReveal({
  summary,
  wonderings,
  onRestart,
  onAdvanceStateChange,
}: WindRevealProps) {
  const [finalClaimChipIds, setFinalClaimChipIds] = useState<string[]>([]);
  const [headlineChipIds, setHeadlineChipIds] = useState<string[]>([]);
  const [savedEntry, setSavedEntry] = useState<NotebookEntry | null>(null);
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    const prior = loadNotebookEntry();
    if (prior) {
      setSavedEntry(prior);
      setFinalClaimChipIds(prior.finalClaimChipIds ?? []);
      setHeadlineChipIds(prior.headlineChipIds ?? []);
    }
  }, []);

  const groups = wonderings?.groups ?? [];
  const lensKeys: (keyof WindSummary['lenses'])[] = ['fit', 'differences', 'regime'];
  const lensesUsed = lensKeys.filter((k) => summary.lenses[k].used);
  const pickedWonderIds = groups.flatMap((g) => g.wonderChipIds);
  const reveals = listRevealsFor(pickedWonderIds);

  const toggleFinal = (id: string) => {
    setFinalClaimChipIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return next.slice(0, 3);
    });
  };

  const toggleHeadline = (id: string) => {
    setHeadlineChipIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return next.slice(0, 3);
    });
  };

  const handleSave = () => {
    const entry: NotebookEntry = {
      finalClaimChipIds,
      finalClaims: renderStaticChips(FINAL_CLAIM_CHIPS, finalClaimChipIds),
      headlineChipIds,
      headlines: renderStaticChips(NOTEBOOK_HEADLINE_CHIPS, headlineChipIds),
      savedAt: new Date().toISOString(),
      synthesisLines: summary.synthesisLines,
      bestFit: summary.bestFit,
      groups,
      lenses: summary.lenses,
    };
    if (saveNotebookEntry(entry)) setSavedEntry(entry);
  };

  const canAdvance =
    step === 1 ? true :
    step === 2 ? true :
    /* step === 3 */ finalClaimChipIds.length >= 1;

  const hint =
    step === 3 && finalClaimChipIds.length < 1
      ? 'Pick at least one final claim chip to commit.'
      : '';

  const nextLabel =
    step === 1 ? 'Next: The reveal →' :
    step === 2 ? 'Next: Make your claim →' :
    /* step === 3 */ 'Start over ↺';

  const backLabel =
    step === 2 ? 'Back to revisit' :
    step === 3 ? 'Back to the reveal' :
    undefined;

  const handleAdvance = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else onRestart();
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
  }, [step, canAdvance, hint, nextLabel, backLabel, onAdvanceStateChange]);

  const stepSubhead =
    step === 1
      ? 'Different groups, different lenses, different paths — see what your class found.'
      : step === 2
      ? "Compare your class's claims to what the data actually shows."
      : 'Commit to a final claim and pick a headline for the notebook.';

  return (
    <ActFrame
      actNumber={3}
      eyebrow="ACT 3 · REVELATION · WHOLE CLASS"
      title="Here is what the data was hiding."
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          <NarratorSays lineKey="act3Top" />

          {groups.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-3">
                WHAT EVERY GROUP NOTICED · {groups.length} GROUP
                {groups.length === 1 ? '' : 'S'}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {groups.map((g) => {
                  const notices = renderStaticChips(NOTICE_CHIPS, g.noticeChipIds);
                  const wonders = renderStaticChips(WONDER_CHIPS, g.wonderChipIds);
                  return (
                    <div
                      key={g.id}
                      className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2"
                    >
                      <div className="font-display text-sm font-bold text-ink">{g.name}</div>
                      {notices.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-slate-500">
                            NOTICED
                          </div>
                          <ul className="text-sm text-ink list-disc list-inside leading-snug">
                            {notices.map((n, i) => (
                              <li key={i} className="italic">{n}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {wonders.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-slate-500">
                            WONDERED
                          </div>
                          <ul className="text-sm text-ink list-disc list-inside leading-snug">
                            {wonders.map((w, i) => (
                              <li key={i} className="italic">{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lensesUsed.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-[10px] font-semibold tracking-widest text-sky-700">
                WHAT THE LENSES SHOWED
              </div>
              <div className="space-y-3">
                {lensesUsed.map((k) => (
                  <LensRow key={k} name={LENS_NAMES[k]} lens={summary.lenses[k]} />
                ))}
              </div>
              {summary.synthesisLines.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-1">
                    SYNTHESIS FROM ACT 2
                  </div>
                  <ul className="text-sm text-ink list-disc list-inside leading-relaxed">
                    {summary.synthesisLines.map((s, i) => (
                      <li key={i} className="italic">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act3Closing" />

          {reveals.length > 0 && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-semibold tracking-widest text-sky-700">
                  REVEAL · ANSWERS TO YOUR WONDERINGS
                </div>
                <h2 className="font-display text-2xl font-bold text-ink leading-tight mt-1">
                  Let's use the data to answer each question your class asked.
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Compare what your class claimed in Act 2 to what the data
                  actually shows. Where they line up, your model worked. Where
                  they don't, your model can sharpen.
                </p>
              </div>
              {reveals.map(({ id, reveal }, i) => (
                <RevealCard
                  key={id}
                  index={i + 1}
                  question={reveal.question}
                  takeaway={reveal.takeaway}
                  source={reveal.source}
                >
                  {reveal.viz()}
                </RevealCard>
              ))}
            </div>
          )}

          <Revelation />
        </>
      )}

      {step === 3 && (
        <>
          <div className="bg-white border-2 border-sky-200 rounded-xl p-5">
            <ChipPicker
              label="WRITE YOUR FINAL CLAIM · TAP UP TO 3"
              hint="Different groups will commit to different claims. That's the point."
              options={finalClaimOptions}
              selected={finalClaimChipIds}
              onToggle={toggleFinal}
              max={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <ResultCard
              label="BEST QUADRATIC FIT"
              value={`R² ${RAMP_UP_FIT_INFO.r2.toFixed(2)}`}
              subtle="on the ramp-up zone"
            />
            <ResultCard
              label="RATED POWER"
              value={`${RATED_POWER} kW`}
              subtle="the turbine's nameplate ceiling"
            />
            <ResultCard
              label="LENSES YOUR CLASS USED"
              value={lensesUsed.length.toString()}
              subtle={lensesUsed.length === 0 ? '—' : lensesUsed.map((l) => LENS_NAMES[l]).join(' · ')}
              tone="slate"
            />
          </div>

          <div className="bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 rounded-2xl shadow-lg p-6 text-white space-y-4">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-sky-100 mb-1">
                NOTEBOOK · ALGEBRA 1 · TOPIC 8 · QUADRATIC FUNCTIONS
              </div>
              <h3 className="font-display text-3xl font-bold mb-2">Wind Power Curve</h3>
              <div className="text-sm text-sky-100">
                {groups.length} group{groups.length === 1 ? '' : 's'} ·{' '}
                best-fit R² {RAMP_UP_FIT_INFO.r2.toFixed(2)} ·{' '}
                {lensesUsed.length} lens{lensesUsed.length === 1 ? '' : 'es'} used
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-4">
              <div className="text-[10px] font-semibold tracking-widest text-sky-100 mb-2">
                PICK A HEADLINE · TAP UP TO 3
              </div>
              <div className="flex flex-wrap gap-2">
                {headlineOptions.map((opt) => {
                  const active = headlineChipIds.includes(opt.id);
                  const disabled = !active && headlineChipIds.length >= 3;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleHeadline(opt.id)}
                      disabled={disabled}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium leading-snug transition border ${
                        active
                          ? 'bg-white text-sky-800 border-white shadow'
                          : disabled
                          ? 'bg-white/5 text-white/40 border-white/10 cursor-not-allowed'
                          : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                      }`}
                    >
                      <span className="mr-1.5" aria-hidden="true">{active ? '✓' : '+'}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                disabled={finalClaimChipIds.length === 0 && headlineChipIds.length === 0}
                className="px-4 py-2 rounded-lg bg-white text-sky-800 font-semibold hover:bg-sky-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savedEntry ? 'Update notebook' : 'Save to notebook'}
              </button>
              {savedEntry && (
                <span className="px-3 py-1.5 rounded-md bg-emerald-500/90 text-white text-xs font-semibold">
                  Saved {formatSavedDate(savedEntry.savedAt)}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </ActFrame>
  );
}

// Reflection/wrap-up content shown below the activity once the student has
// reached Act 3 — discussion prompt, exit ticket, extensions, reality check.
export function WindClosingContext({
  summary,
  wonderings,
}: {
  summary: WindSummary;
  wonderings: ClassWonderings | null;
}) {
  const groups = wonderings?.groups ?? [];
  const lensKeys: (keyof WindSummary['lenses'])[] = ['fit', 'differences', 'regime'];
  const lensesUsed = lensKeys.filter((k) => summary.lenses[k].used);
  const discussionPrompt = getDiscussionPrompt();
  return (
    <div className="space-y-6">
      <div className="border-t border-surface-line pt-6">
        <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-1">
          AFTER THE JOURNEY
        </div>
        <h2 className="font-display text-xl font-bold text-ink">Discuss · Reflect · Look ahead</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {groups.length} group{groups.length === 1 ? '' : 's'} took {lensesUsed.length} lens
          {lensesUsed.length === 1 ? '' : 'es'} through the data.
        </p>
      </div>

      {discussionPrompt && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
            NOW DISCUSS · ACROSS GROUPS
          </div>
          <p className="text-base text-amber-900 leading-relaxed">{discussionPrompt}</p>
          <p className="text-xs text-amber-800/70 mt-2 italic">
            Each group's path mattered. Share which lens you picked and why.
            Compare what you saw. Honor what differs.
          </p>
        </div>
      )}

      <ExitTicket />

      <ExtensionPrompts />

      <div className="text-xs text-slate-500 leading-relaxed">
        Reality check: this is one turbine on one day. Another turbine, another
        site, another day would give a slightly different curve — but the same
        three-regime shape, and the same quadratic ramp-up. That's the rule for
        any dataset: ask what would change if you collected it somewhere else.
      </div>

      <div className="pt-2">
        <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-1">
          LOOKING AHEAD · MODELING WITH FUNCTIONS
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          The power curve is a <strong>piecewise function</strong>: a constant,
          then a quadratic, then a constant. Real-world data rarely fits one
          equation end to end — the skill you'll keep building is choosing the
          right function for each piece, and knowing where each one stops being
          true.
        </div>
      </div>
    </div>
  );
}

function Revelation() {
  const eq = fmtEquation({
    a: RAMP_UP_FIT_INFO.a,
    b: RAMP_UP_FIT_INFO.b,
    c: RAMP_UP_FIT_INFO.c,
    r2: RAMP_UP_FIT_INFO.r2,
  });
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-6 sm:p-8">
        <div className="text-[10px] font-semibold tracking-widest text-sky-400 mb-2">
          ✨ THE REVELATION
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          A parabola — but only in the middle.
        </h2>
        <p className="text-base text-slate-200 leading-relaxed mt-3 max-w-2xl">
          The shape your class watched the turbine draw is a{' '}
          <strong className="text-sky-300">piecewise function</strong>. In the
          ramp-up zone it is a genuine quadratic — the best-fit parabola{' '}
          <span className="font-mono text-sky-300">{eq}</span> hugs the data
          with <strong className="text-sky-300">R² ≈ {RAMP_UP_FIT_INFO.r2.toFixed(2)}</strong>.
          Below cut-in it is flat at zero; above rated speed it is flat at the
          ceiling. One curve, three acts.
        </p>
      </div>
      <div className="bg-white border-y border-slate-700">
        <PowerCurveScatter
          points={WIND_DATA}
          aspectRatio={16 / 9}
          regimeBands
          colorByRegime
          model={RAMP_UP_FIT_INFO.model}
          modelDomain={[0, 18]}
          fitZone={[CUT_IN_SPEED, RATED_SPEED]}
          ratedLine
        />
      </div>
      <div className="p-6 sm:p-8 space-y-3">
        <h3 className="font-display text-lg font-bold text-white">
          Why a parabola — and why only there?
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          The energy carried by wind actually grows with the <em>cube</em> of
          its speed. Across the range this turbine runs, though, a{' '}
          <strong className="text-sky-300">quadratic</strong> tracks the data
          beautifully — close enough to predict, simple enough to use. That's
          what a model is: not the whole truth, but a trustworthy stand-in
          inside a known range.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          The flat top isn't physics — it's <strong className="text-sky-300">
          engineering</strong>. Past rated speed the turbine pitches its
          blades to spill wind and protect itself. So the curve has three
          pieces, and the quadratic you built owns the middle one.
        </p>
      </div>
    </div>
  );
}

function LensRow({ name, lens }: { name: string; lens: LensSummary }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-semibold text-sky-700">{name}</div>
        {lens.detail && (
          <div className="text-[10px] font-mono text-slate-500">{lens.detail}</div>
        )}
      </div>
      {lens.claims.length > 0 ? (
        <ul className="text-sm text-ink mt-1 list-disc list-inside leading-snug">
          {lens.claims.map((c, i) => (
            <li key={i} className="italic">{c}</li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-slate-400 italic mt-1">No chip picked for this lens.</div>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  subtle,
  tone = 'sky',
}: {
  label: string;
  value: string;
  subtle: string;
  tone?: 'sky' | 'slate';
}) {
  const palette = {
    sky: ['border-sky-200', 'bg-sky-50', 'text-sky-700', 'text-sky-900'],
    slate: ['border-slate-200', 'bg-slate-50', 'text-slate-600', 'text-slate-800'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-2xl font-bold ${palette[3]} tabular-nums mt-0.5`}>
        {value}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{subtle}</div>
    </div>
  );
}
