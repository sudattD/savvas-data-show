import { useEffect, useRef, useState } from 'react';
import QuakeEnergyMeter from '../../components/calibrators/QuakeEnergyMeter';
import { getDataset } from '../../data/registry';
import { HISTORICAL_EARTHQUAKES } from '../../data/historicalEarthquakes';
import { isOnRingOfFire, RING_ARCS } from './ringOfFire';
import InteractiveGlobe from './InteractiveGlobe';
import type { GlobeOverlay } from './InteractiveGlobe';
import { NarratorSays } from './Narrator';
import ChipPicker from './chips/ChipPicker';
import {
  FINAL_CLAIM_CHIPS,
  NOTEBOOK_HEADLINE_CHIPS,
  NOTICE_CHIPS,
  WONDER_CHIPS,
  renderStaticChips,
} from './chips/catalog';
import RevealCard from './reveals/RevealCard';
import { listRevealsFor } from './reveals/revealCatalog';
import ExitTicket from './reveals/ExitTicket';
import ExtensionPrompts from './reveals/ExtensionPrompts';
import type { QuakeSummary, LensSummary } from './QuakeMap';
import type { ClassWonderings, GroupWondering } from './QuakeWonder';
import type { AdvanceState } from './NextRow';
import ActFrame from './ActFrame';

interface QuakeClaimProps {
  summary: QuakeSummary;
  wonderings: ClassWonderings | null;
  onRestart: () => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

const NOTEBOOK_KEY = 'savvas:notebook:earthquakes-mea';

interface NotebookEntry {
  finalClaimChipIds: string[];
  finalClaims: string[];
  headlineChipIds: string[];
  headlines: string[];
  savedAt: string;
  synthesisLines: string[];
  shownCount: number;
  ringOfFireCount: number;
  minMag: number;
  groups: GroupWondering[];
  lenses: {
    map: LensSummary;
    histogram: LensSummary;
    scatter: LensSummary;
  };
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
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function getDiscussionPrompt(): string | null {
  try {
    const dataset = getDataset('earthquakes');
    const fit = dataset.chapterFits?.find((f) => f.course === 'geometry' && f.topic === 1);
    return fit?.discussion?.[2] ?? fit?.discussion?.[0] ?? null;
  } catch {
    return null;
  }
}

const RING_OVERLAYS: GlobeOverlay[] = RING_ARCS.map((arc) => ({ points: arc }));
const finalClaimOptions = FINAL_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const headlineOptions = NOTEBOOK_HEADLINE_CHIPS.map((c) => ({ id: c.id, label: c.text }));

// Stable Ring of Fire stat for the Revelation, computed from the 5,455 M6+
// events students saw in Act 1. Not the (possibly empty) Act 2 Map lens
// slice — that depended on whether the class enabled the Map lens.
const HISTORICAL_RING_COUNT = HISTORICAL_EARTHQUAKES.filter((q) =>
  isOnRingOfFire(q.lat, q.lon),
).length;
const HISTORICAL_RING_PCT = Math.round(
  (HISTORICAL_RING_COUNT / HISTORICAL_EARTHQUAKES.length) * 100,
);

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Revisit',
  2: 'The reveal',
  3: 'Commit',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

export default function QuakeClaim({ summary, wonderings, onRestart, onAdvanceStateChange }: QuakeClaimProps) {
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
  const lensesUsed = (['map', 'histogram', 'scatter'] as const).filter((k) => summary.lenses[k].used);
  // Union of every wonder chip any group picked in Act 1. Drives which
  // reveal cards we render below.
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
      shownCount: summary.shownCount,
      ringOfFireCount: summary.ringOfFireCount,
      minMag: summary.minMag,
      groups,
      lenses: summary.lenses,
    };
    if (saveNotebookEntry(entry)) {
      setSavedEntry(entry);
    }
  };

  // Step-aware AdvanceState.
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
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      onRestart();
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
      title="Look what every group found."
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
              <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-3">
                WHAT EVERY GROUP NOTICED · {groups.length} GROUP{groups.length === 1 ? '' : 'S'}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {groups.map((g) => {
                  const notices = renderStaticChips(NOTICE_CHIPS, g.noticeChipIds);
                  const wonders = renderStaticChips(WONDER_CHIPS, g.wonderChipIds);
                  return (
                    <div key={g.id} className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2">
                      <div className="font-display text-sm font-bold text-ink">{g.name}</div>
                      {notices.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-slate-500">NOTICED</div>
                          <ul className="text-sm text-ink list-disc list-inside leading-snug">
                            {notices.map((n, i) => <li key={i} className="italic">{n}</li>)}
                          </ul>
                        </div>
                      )}
                      {wonders.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-slate-500">WONDERED</div>
                          <ul className="text-sm text-ink list-disc list-inside leading-snug">
                            {wonders.map((w, i) => <li key={i} className="italic">{w}</li>)}
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
              <div className="text-[10px] font-semibold tracking-widest text-rose-700">
                WHAT THE LENSES SHOWED
              </div>
              <div className="space-y-3">
                {lensesUsed.map((lensKey) => (
                  <LensRow
                    key={lensKey}
                    name={lensKey === 'map' ? 'Map' : lensKey === 'histogram' ? 'Histogram' : 'Scatter'}
                    lens={summary.lenses[lensKey]}
                  />
                ))}
              </div>
              {summary.synthesisLines.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-1">
                    SYNTHESIS FROM ACT 2
                  </div>
                  <ul className="text-sm text-ink list-disc list-inside leading-relaxed">
                    {summary.synthesisLines.map((s, i) => <li key={i} className="italic">{s}</li>)}
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
                <div className="text-[10px] font-semibold tracking-widest text-rose-700">
                  REVEAL · ANSWERS TO YOUR WONDERINGS
                </div>
                <h2 className="font-display text-2xl font-bold text-ink leading-tight mt-1">
                  Now let's use the data to answer each question your class asked.
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Compare what your class claimed in Act 2 to what the data actually shows.
                  Where they line up — your model worked. Where they don't — your model can sharpen.
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
          <div className="bg-white border-2 border-rose-200 rounded-xl p-5">
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
              label="M6+ EVENTS GLOBALLY"
              value={HISTORICAL_EARTHQUAKES.length.toLocaleString()}
              subtle="USGS catalog · 1990–present"
            />
            <ResultCard
              label="ON THE RING OF FIRE"
              value={HISTORICAL_RING_COUNT.toLocaleString()}
              subtle={`${HISTORICAL_RING_PCT}% of the global M6+ catalog`}
            />
            <ResultCard
              label="LENSES YOUR CLASS USED"
              value={lensesUsed.length.toString()}
              subtle={
                lensesUsed.length === 0
                  ? '—'
                  : lensesUsed
                      .map((l) => (l === 'map' ? 'Map' : l === 'histogram' ? 'Histogram' : 'Scatter'))
                      .join(' · ')
              }
              tone="slate"
            />
          </div>

          <div className="bg-gradient-to-br from-rose-700 via-orange-700 to-amber-600 rounded-2xl shadow-lg p-6 text-white space-y-4">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-rose-100 mb-1">
                NOTEBOOK · GEO · TOPIC 1 · FOUNDATIONS OF GEOMETRY
              </div>
              <h3 className="font-display text-3xl font-bold mb-2">Map Earth's Anger</h3>
              <div className="text-sm text-rose-100">
                {groups.length} group{groups.length === 1 ? '' : 's'} ·{' '}
                {HISTORICAL_RING_PCT}% of M6+ on the Ring of Fire ·{' '}
                {lensesUsed.length} lens{lensesUsed.length === 1 ? '' : 'es'} used
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-4">
              <div className="text-[10px] font-semibold tracking-widest text-rose-100 mb-2">
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
                          ? 'bg-white text-rose-800 border-white shadow'
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
                className="px-4 py-2 rounded-lg bg-white text-rose-800 font-semibold hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
// reached Act 3. Always visible after they cross into Act 3 — Reality
// check, discussion prompt, exit ticket, extensions, and the Algebra 1
// callout don't belong inside the linear journey.
export function QuakeClosingContext({
  summary,
  wonderings,
}: {
  summary: QuakeSummary;
  wonderings: ClassWonderings | null;
}) {
  const groups = wonderings?.groups ?? [];
  const lensesUsed = (['map', 'histogram', 'scatter'] as const).filter((k) => summary.lenses[k].used);
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
            Each group's path mattered. Share which lens you picked and why. Compare what you saw. Honor what differs.
          </p>
        </div>
      )}

      <ExitTicket />

      <ExtensionPrompts />

      <div className="text-xs text-slate-500 leading-relaxed">
        Reality check: Act 2's dataset is the past seven days. The pattern
        is the same whether you take seven days or seventy years — plate
        boundaries are slow on a human time scale. Run the activity again
        next week and the dots will land in the same places.
      </div>

      <div className="pt-2">
        <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-1">
          LOOKING AHEAD · ALGEBRA 1 · TOPIC 6 · EXPONENTIAL &amp; LOGARITHMIC
        </div>
        <div className="text-xs text-slate-500 leading-relaxed mb-2">
          The magnitude scale itself is a logarithm. M7 isn't "a bit
          stronger" than M6 — it's 32× the energy. Here's a quick peek at
          the math you'll see again in Algebra 1.
        </div>
        <QuakeEnergyMeter compact />
      </div>
    </div>
  );
}

function Revelation() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-6 sm:p-8">
        <div className="text-[10px] font-semibold tracking-widest text-amber-400 mb-2">
          ✨ THE REVELATION
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          The Pacific Ring of Fire.
        </h2>
        <p className="text-base text-slate-200 leading-relaxed mt-3 max-w-2xl">
          The curve hugging the Pacific has a name. Geologists call it the{' '}
          <strong className="text-amber-300">Pacific Ring of Fire</strong> —
          the rim where Earth's tectonic plates push under each other, slide
          past each other, or one dives beneath another. About{' '}
          <strong className="text-amber-300 tabular-nums">{HISTORICAL_RING_PCT}%</strong>{' '}
          of the world's M6+ earthquakes since 1990 landed along it. Whatever
          each group noticed — clusters, coasts, lines, blanks, deep zones —
          pointed at the same physics.
        </p>
      </div>
      <div className="bg-[#0c0c1e] border-t border-slate-700">
        <InteractiveGlobe
          dots={[]}
          overlays={RING_OVERLAYS}
          aspectRatio={16 / 10}
          autoRotateDegPerSec={5}
          initialRotation={[-150, -20]}
        />
      </div>
      <div className="p-6 sm:p-8 border-t border-slate-700 space-y-3">
        <h3 className="font-display text-lg font-bold text-white">
          Why? Plate tectonics.
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Earth's outer shell is broken into roughly a dozen rigid plates,
          drifting a few centimetres a year. Where they meet, they collide,
          slide, or one dives under another. Quakes happen where plates
          meet — not where they don't. That's why the middle of the
          Pacific Ocean stays quiet and the rim shakes.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          The math you used in Act 2 — coordinates, distance, lines — is
          how seismologists make sense of this every day. Lat and lon
          carried the whole story.
        </p>
      </div>
    </div>
  );
}

function LensRow({ name, lens }: { name: string; lens: LensSummary }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-xs font-semibold text-rose-700">{name}</div>
        {lens.detail && (
          <div className="text-[10px] font-mono text-slate-500">{lens.detail}</div>
        )}
      </div>
      {lens.claims.length > 0 ? (
        <ul className="text-sm text-ink mt-1 list-disc list-inside leading-snug">
          {lens.claims.map((c, i) => <li key={i} className="italic">{c}</li>)}
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
  tone = 'rose',
}: {
  label: string;
  value: string;
  subtle: string;
  tone?: 'rose' | 'emerald' | 'slate';
}) {
  const palette = {
    rose: ['border-rose-200', 'bg-rose-50', 'text-rose-700', 'text-rose-900'],
    emerald: ['border-emerald-200', 'bg-emerald-50', 'text-emerald-700', 'text-emerald-900'],
    slate: ['border-slate-200', 'bg-slate-50', 'text-slate-600', 'text-slate-800'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-2xl font-bold ${palette[3]} tabular-nums mt-0.5`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{subtle}</div>
    </div>
  );
}
