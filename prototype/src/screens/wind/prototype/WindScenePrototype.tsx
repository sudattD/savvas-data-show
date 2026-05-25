// PROTOTYPE — the Wind Power Curve activity rebuilt as virus-stage-styled
// scenes. Lives at /wind-turbine/prototype, in parallel with the live
// WindTurbinePage (untouched until this rework is complete).
//
// The 3-Act spine is the base (memory: acts-are-the-base). Scenes are units
// inside an Act; the Act rail is always visible.
//
//   ACT 1 · Notice & Wonder   ACT 2 · Investigate        ACT 3 · Reveal
//   1 Welcome                 5 Pick Your Lens           8 Look Back
//   2 Meet Dr. Vela           6 Investigate              9 The Reveal
//   3 Watch It Work           7 Synthesize               10 Make It Yours
//   4 Notice & Wonder
//
// One global `step` (1–10) walks the whole quest; the Act number, scene
// number, and backdrop are derived from it.

import { useEffect, useMemo, useState } from 'react';
import { useDocumentTitle } from '../../../lib/useDocumentTitle';
import { WIND_DATA } from '../../../data/windTurbine';
import { quadratic, rSquared } from '../../../lib/fit';
import PowerCurveScatter from '../PowerCurveScatter';
import ChipPicker from '../chips/ChipPicker';
import {
  NOTICE_CHIPS,
  WONDER_CHIPS,
  FIT_CLAIM_CHIPS,
  DIFF_CLAIM_CHIPS,
  REGIME_CLAIM_CHIPS,
  SYNTHESIS_CHIPS,
  FINAL_CLAIM_CHIPS,
  NOTEBOOK_HEADLINE_CHIPS,
  renderStaticChips,
  renderDerivedChips,
} from '../chips/catalog';
import type { FitClaimContext, DiffClaimContext, RegimeClaimContext } from '../chips/catalog';
import LensPicker from '../lenses/LensPicker';
import FitLens from '../lenses/FitLens';
import DifferencesLens from '../lenses/DifferencesLens';
import RegimeLens from '../lenses/RegimeLens';
import { defaultAct2State } from '../lenses/types';
import type { Act2State, LensId } from '../lenses/types';
import { CUT_IN_SPEED, RATED_SPEED, RATED_POWER } from '../regimes';
import { fitQuadratic, binnedMeans, differences } from '../quadFit';
import { NarratorAvatar, NARRATOR } from '../Narrator';
import RevealCard from '../reveals/RevealCard';
import { listRevealsFor, RAMP_UP_FIT_INFO } from '../reveals/revealCatalog';
import LINES from '../narratorLines.json';
import { SceneFrame, NarratorBubble, ScaffoldButtons, Term } from './sceneKit';

const TOTAL_STEPS = 10;

// Reveal animation tuning, ported from WindWonder.
const REVEAL_MS = 3500;
const REVEAL_TICKS = 60;
const easeIn = (t: number) => t * t;

const noticeOptions = NOTICE_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const wonderOptions = WONDER_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const synthesisOptions = SYNTHESIS_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const finalClaimOptions = FINAL_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const headlineOptions = NOTEBOOK_HEADLINE_CHIPS.map((c) => ({ id: c.id, label: c.text }));

// The canonical ramp-up quadratic, formatted as an equation for the reveal.
function fmtEquation(): string {
  const { a, b, c } = RAMP_UP_FIT_INFO;
  return `P = ${a.toFixed(2)}·v² ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}·v ${
    c >= 0 ? '+' : '−'
  } ${Math.abs(c).toFixed(0)}`;
}

// Act 2 lens copy.
const LENS_ORDER: readonly LensId[] = ['fit', 'differences', 'regime'];
const LENS_TAB_LABEL: Record<LensId, string> = {
  fit: 'Fit a Curve',
  differences: 'Differences',
  regime: 'Regimes',
};
const LENS_SUBTITLE: Record<LensId, string> = {
  fit: 'Drag a, b and c until the parabola hugs the ramp-up dots.',
  differences: 'Bin the ramp-up zone and read the first and second differences.',
  regime: 'Toggle operating zones in and out of a best-fit quadratic — watch R² react.',
};
const LENS_LINE: Record<LensId, string> = {
  fit: 'Drag a, b and c until the orange parabola hugs the ramp-up dots. Watch R² climb — that number is how close your model is.',
  differences:
    'Split the ramp-up zone into bins and read the second differences. Roughly constant? That is the fingerprint of a quadratic.',
  regime:
    'Toggle operating zones in and out of the fit. Watch R² react — a quadratic only holds where the curve actually curves.',
};

// Ramp-up zone — the stretch the quadratic is meant to model. Used to score
// the lens claim chips. Ported from WindInvestigate.
const RAMP_UP_DATA = WIND_DATA.filter(
  (d) => d.windSpeed >= CUT_IN_SPEED && d.windSpeed < RATED_SPEED,
);
const RAMP_UP_FIT = (() => {
  const c = fitQuadratic(RAMP_UP_DATA);
  return rSquared(RAMP_UP_DATA, quadratic(c.a, c.b, c.c));
})();
const ALL_DATA_FIT = (() => {
  const c = fitQuadratic(WIND_DATA);
  return rSquared(WIND_DATA, quadratic(c.a, c.b, c.c));
})();

export default function WindScenePrototype() {
  useDocumentTitle('Wind Power Curve · prototype');

  // One global scene index. State for the reveal, the wonderings, and the
  // Act 2 investigation all live here so Back/Next never loses work.
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'pre' | 'revealing' | 'post'>('pre');
  const [revealCount, setRevealCount] = useState(0);
  const [notices, setNotices] = useState<string[]>([]);
  const [wonders, setWonders] = useState<string[]>([]);
  const [act2, setAct2] = useState<Act2State>(defaultAct2State);
  // Which lens model is shown on the left of the Investigate scene.
  const [activeLens, setActiveLens] = useState<LensId>('fit');
  // Act 3 commitments.
  const [finalClaims, setFinalClaims] = useState<string[]>([]);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const total = WIND_DATA.length;
    const tickMs = REVEAL_MS / REVEAL_TICKS;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      setRevealCount(Math.min(total, Math.floor(easeIn(tick / REVEAL_TICKS) * total)));
      if (tick >= REVEAL_TICKS) {
        setRevealCount(total);
        window.clearInterval(id);
        setPhase('post');
      }
    }, tickMs);
    return () => window.clearInterval(id);
  }, [phase]);

  // --- Act 2 claim-chip contexts (numbers update as the student works) ----

  const fitCtx = useMemo<FitClaimContext>(() => {
    const model = quadratic(act2.fit.a, act2.fit.b, act2.fit.c);
    return {
      a: act2.fit.a,
      b: act2.fit.b,
      c: act2.fit.c,
      r2: rSquared(RAMP_UP_DATA, model),
      predictedAt10: model(10),
    };
  }, [act2.fit.a, act2.fit.b, act2.fit.c]);

  const diffCtx = useMemo<DiffClaimContext>(() => {
    const means = binnedMeans(RAMP_UP_DATA, CUT_IN_SPEED, RATED_SPEED, act2.differences.bins).map(
      (b) => b.mean,
    );
    const { second } = differences(means);
    const finite = second.filter((v) => Number.isFinite(v));
    const mean = finite.length ? finite.reduce((s, v) => s + v, 0) / finite.length : 0;
    const spread = finite.length ? Math.max(...finite) - Math.min(...finite) : 0;
    return { meanSecondDiff: mean, spread, roughlyConstant: spread <= Math.max(150, Math.abs(mean) * 2) };
  }, [act2.differences.bins]);

  const regimeCtx = useMemo<RegimeClaimContext>(
    () => ({ rampUpR2: RAMP_UP_FIT, allDataR2: ALL_DATA_FIT }),
    [],
  );

  const fitClaimOptions = FIT_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(fitCtx) }));
  const diffClaimOptions = DIFF_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(diffCtx) }));
  const regimeClaimOptions = REGIME_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(regimeCtx) }));

  // --- Generic chip toggler -----------------------------------------------

  const toggle = (list: string[], set: (v: string[]) => void, max: number) => (id: string) => {
    if (list.includes(id)) set(list.filter((x) => x !== id));
    else if (list.length < max) set([...list, id]);
  };

  const toggleLens = (lens: LensId) =>
    setAct2((s) => ({ ...s, [lens]: { ...s[lens], enabled: !s[lens].enabled } }));

  const toggleClaim = (lens: LensId) => (id: string) =>
    setAct2((s) => {
      const cur = s[lens].claimChipIds;
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(0, 3);
      return { ...s, [lens]: { ...s[lens], claimChipIds: next } };
    });

  // --- Act 2 derived gating -----------------------------------------------

  const lensEnabled = { fit: act2.fit.enabled, differences: act2.differences.enabled, regime: act2.regime.enabled };
  const anyLens = lensEnabled.fit || lensEnabled.differences || lensEnabled.regime;
  const claimedCount =
    (act2.fit.enabled && act2.fit.claimChipIds.length > 0 ? 1 : 0) +
    (act2.differences.enabled && act2.differences.claimChipIds.length > 0 ? 1 : 0) +
    (act2.regime.enabled && act2.regime.claimChipIds.length > 0 ? 1 : 0);

  // --- Navigation ---------------------------------------------------------

  const back = step > 1 ? () => setStep((s) => s - 1) : undefined;
  const next = step < TOTAL_STEPS ? () => setStep((s) => s + 1) : undefined;

  // Wipe every commitment and walk back to the welcome scene.
  const restart = () => {
    setNotices([]);
    setWonders([]);
    setAct2(defaultAct2State);
    setActiveLens('fit');
    setFinalClaims([]);
    setHeadlines([]);
    setSaved(false);
    setPhase('pre');
    setRevealCount(0);
    setStep(1);
  };

  // Act / scene-within-act derived from the global step.
  const act = step <= 4 ? 1 : step <= 7 ? 2 : 3;
  const localStep = step <= 4 ? step : step <= 7 ? step - 4 : step - 7;
  const localTotal = act === 1 ? 4 : 3;
  const frame = { act, step: localStep, stepTotal: localTotal, onBack: back };

  // --- Act 3 recap + reveal data ------------------------------------------
  // Everything the class committed to in Acts 1–2, rendered back as text so
  // the Reveal can show their own path before the data answers it.
  const noticeLines = renderStaticChips(NOTICE_CHIPS, notices);
  const wonderLines = renderStaticChips(WONDER_CHIPS, wonders);
  const synthesisLines = renderStaticChips(SYNTHESIS_CHIPS, act2.synthesisChipIds);
  const lensClaimLines: Record<LensId, string[]> = {
    fit: renderDerivedChips(FIT_CLAIM_CHIPS, act2.fit.claimChipIds, fitCtx),
    differences: renderDerivedChips(DIFF_CLAIM_CHIPS, act2.differences.claimChipIds, diffCtx),
    regime: renderDerivedChips(REGIME_CLAIM_CHIPS, act2.regime.claimChipIds, regimeCtx),
  };
  const lensesUsed = LENS_ORDER.filter((l) => lensEnabled[l]);
  // One reveal card per wonder chip the class picked in Act 1.
  const reveals = listRevealsFor(wonders);

  // ======================================================================
  // ACT 1
  // ======================================================================

  if (step === 1) {
    return (
      <SceneFrame
        {...frame}
        variant="dawn"
        sceneTitle="Welcome"
        onBack={undefined}
        onNext={next}
        nextLabel="Start the quest"
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-xl rounded-3xl border border-white/30 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">
              Algebra 1 · Topic 8 · Quadratic Functions
            </div>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-ink">
              The Wind Power Curve
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              One real wind turbine recorded everything it did for half a day. Watch the
              shape it drew, then tell us what you notice. Can you read what the turbine is
              trying to say?
            </p>
            <div className="mt-5 flex items-center justify-center gap-3 text-left">
              <NarratorAvatar size={48} />
              <div className="text-xs text-slate-500">
                Guided by <span className="font-bold text-ink">{NARRATOR.name}</span>
                <br />
                {NARRATOR.role}
              </div>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 2) {
    return (
      <SceneFrame
        {...frame}
        variant="day"
        sceneTitle="Meet Your Guide"
        onNext={next}
        nextLabel="See the turbine's data"
        backLabel="Welcome"
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-xl space-y-4">
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-center shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Meet your guide
              </div>
              <p className="mt-1 text-sm text-slate-600">
                A wind energy engineer will walk your class through the data.
              </p>
            </div>
            <NarratorBubble line={LINES.intro} audioSrc="/audio/wind-narrator/intro.mp3" avatarSize={72} />
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 3) {
    return (
      <SceneFrame
        {...frame}
        variant="windy"
        sceneTitle="Watch the Turbine Work"
        onNext={next}
        nextLabel="Notice & wonder"
        backLabel="Meet your guide"
        nextDisabled={phase !== 'post'}
        nextHint="Play the reveal to continue."
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Turbine SCADA Log</h2>
                <p className="text-sm text-slate-600">
                  {phase === 'pre'
                    ? 'Press play — one turbine, ~12 hours.'
                    : phase === 'revealing'
                      ? `${revealCount.toLocaleString()} minutes…`
                      : `${WIND_DATA.length.toLocaleString()} minutes · one 1.5 MW turbine`}
                </p>
              </div>
              <ScaffoldButtons
                about={{
                  heading: 'About the Power Curve',
                  body: (
                    <>
                      <p>
                        Each point pairs two readings from the same minute: the wind speed
                        the turbine felt and the power it produced. Together they form the
                        turbine's <Term>power curve</Term>.
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>x-axis: wind speed (metres per second)</li>
                        <li>y-axis: power output (kilowatts)</li>
                        <li>Raw, unsmoothed <Term>SCADA</Term> data.</li>
                      </ul>
                    </>
                  ),
                }}
                help={{
                  heading: 'How to Read the Reveal',
                  body: (
                    <>
                      <p className="font-semibold">Follow these steps:</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5">
                        <li>Press play and watch dots appear left to right.</li>
                        <li>Each dot is one real minute of the turbine.</li>
                        <li>Watch where the cloud climbs steeply and where it flattens.</li>
                        <li>Don't name the shape yet — just watch it form.</li>
                      </ol>
                    </>
                  ),
                }}
              />
            </div>
            <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <PowerCurveScatter
                points={WIND_DATA.slice(0, revealCount)}
                aspectRatio={16 / 9}
                regimeBands={phase === 'post'}
                ratedLine={phase === 'post'}
              />
              {phase === 'pre' && (
                <button
                  onClick={() => setPhase('revealing')}
                  className="group absolute inset-0 grid place-items-center bg-sky-950/25 transition hover:bg-sky-950/35"
                  aria-label="Play wind power curve reveal"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-sky-600 shadow-2xl transition group-hover:bg-sky-500">
                      <span className="text-3xl leading-none text-white" style={{ marginLeft: 4 }}>
                        ▶
                      </span>
                    </div>
                    <div className="font-display text-lg font-bold text-white drop-shadow">
                      Play — one turbine, ~12 hours
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <NarratorBubble line={LINES.act1Post} audioSrc="/audio/wind-narrator/act1Post.mp3" />
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                The data
              </div>
              <p className="mt-1">
                <strong className="tabular-nums">{WIND_DATA.length.toLocaleString()}</strong>{' '}
                minutes of one 1.5 MW turbine, logged by its own <Term>SCADA</Term> sensors.
                Every minute records just two numbers — wind speed and power output — and each
                pair is one dot.
              </p>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 4) {
    const captured = notices.length + wonders.length;
    return (
      <SceneFrame
        {...frame}
        variant="dusk"
        sceneTitle="Notice & Wonder"
        onNext={next}
        nextLabel="Act 2: Investigate"
        backLabel="The reveal"
        nextDisabled={captured === 0}
        nextHint="Pick at least one chip to continue."
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">The Full Power Curve</h2>
                <p className="text-sm text-slate-600">
                  What does your group see? Don't name the shape — describe it.
                </p>
              </div>
              <ScaffoldButtons
                help={{
                  heading: 'Capturing Notice & Wonder',
                  body: (
                    <>
                      <p>
                        Pick the chips that match what your group saw and asked. There are no
                        wrong answers — different groups will notice different things.
                      </p>
                      <p className="mt-2">
                        <strong>We noticed</strong> — up to 3 things you saw.
                        <br />
                        <strong>We wonder</strong> — up to 2 questions for the data.
                      </p>
                    </>
                  ),
                }}
              />
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <PowerCurveScatter points={WIND_DATA} aspectRatio={16 / 9} regimeBands ratedLine />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <NarratorBubble line={LINES.act1Post} audioSrc="/audio/wind-narrator/act1Post.mp3" />
            <div className="space-y-4 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">
              <div className="font-display text-base font-bold text-ink">Group 1</div>
              <ChipPicker
                label="WE NOTICED"
                hint="What did this group see in the curve?"
                options={noticeOptions}
                selected={notices}
                onToggle={toggle(notices, setNotices, 3)}
                max={3}
              />
              <ChipPicker
                label="WE WONDER"
                hint="What does this group want to ask the data?"
                options={wonderOptions}
                selected={wonders}
                onToggle={toggle(wonders, setWonders, 2)}
                max={2}
                tone="amber"
              />
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  // ======================================================================
  // ACT 2 · Investigate — Act-wide "blueprint" backdrop
  // ======================================================================

  if (step === 5) {
    return (
      <SceneFrame
        {...frame}
        variant="blueprint"
        sceneTitle="Pick Your Lens"
        onNext={next}
        nextLabel="Investigate"
        backLabel="Notice & wonder"
        nextDisabled={!anyLens}
        nextHint="Turn on at least one lens."
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          <LensPicker enabled={lensEnabled} onToggle={toggleLens} />
          <div className="flex flex-col gap-4">
            <NarratorBubble line={LINES.act2Picker} audioSrc="/audio/wind-narrator/act2Picker.mp3" />
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Your toolkit
              </div>
              <p className="mt-1">
                Each lens tests a different question about the curve. Turn on as many as fit
                your group's wonderings — you'll work them on the next scene.
              </p>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 6) {
    // Split layout: the interactive model on the left, dialogue + details on
    // the right. Tabs switch which enabled lens is on the left.
    const enabledList = LENS_ORDER.filter((l) => lensEnabled[l]);
    const shown: LensId = enabledList.includes(activeLens) ? activeLens : enabledList[0] ?? 'fit';

    const claim: Record<LensId, { label: string; options: { id: string; label: string }[]; selected: string[] }> = {
      fit: { label: 'WHAT DID THE FIT SHOW? · TAP UP TO 3', options: fitClaimOptions, selected: act2.fit.claimChipIds },
      differences: {
        label: 'WHAT DID THE DIFFERENCES SHOW? · TAP UP TO 3',
        options: diffClaimOptions,
        selected: act2.differences.claimChipIds,
      },
      regime: {
        label: 'WHAT DID THE REGIMES SHOW? · TAP UP TO 3',
        options: regimeClaimOptions,
        selected: act2.regime.claimChipIds,
      },
    };

    return (
      <SceneFrame
        {...frame}
        variant="blueprint"
        sceneTitle="Investigate"
        onNext={next}
        nextLabel="Synthesize"
        backLabel="Pick your lens"
        nextDisabled={claimedCount === 0}
        nextHint="Pick a claim chip in at least one lens."
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* LEFT — the interactive model */}
          <div className="flex flex-col gap-3">
            {enabledList.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {enabledList.map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLens(l)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      l === shown
                        ? 'bg-sky-600 text-white shadow'
                        : 'bg-white/80 text-slate-600 backdrop-blur hover:bg-white'
                    }`}
                  >
                    {LENS_TAB_LABEL[l]}
                    {claim[l].selected.length > 0 && <span className="ml-1.5">✓</span>}
                  </button>
                ))}
              </div>
            )}
            <div className="rounded-2xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur">
              <h2 className="font-display text-lg font-bold text-ink">{LENS_TAB_LABEL[shown]}</h2>
              <p className="mb-3 text-sm text-slate-600">{LENS_SUBTITLE[shown]}</p>
              {shown === 'fit' && (
                <FitLens state={act2.fit} onChange={(fit) => setAct2((s) => ({ ...s, fit }))} />
              )}
              {shown === 'differences' && (
                <DifferencesLens
                  state={act2.differences}
                  onChange={(differences) => setAct2((s) => ({ ...s, differences }))}
                />
              )}
              {shown === 'regime' && (
                <RegimeLens state={act2.regime} onChange={(regime) => setAct2((s) => ({ ...s, regime }))} />
              )}
            </div>
          </div>

          {/* RIGHT — dialogue + details */}
          <div className="flex flex-col gap-4">
            <NarratorBubble line={LENS_LINE[shown]} />
            <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="font-display text-base font-bold text-ink">Record what you see</div>
                <ScaffoldButtons
                  about={{
                    heading: 'About the Three Lenses',
                    body: (
                      <>
                        <p>
                          Each lens interrogates the same <Term>power curve</Term> a different way:
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          <li><strong>Fit</strong> — what equation matches?</li>
                          <li><strong>Differences</strong> — is it really a parabola?</li>
                          <li><strong>Regimes</strong> — where does the model hold?</li>
                        </ul>
                      </>
                    ),
                  }}
                  help={{
                    heading: 'Working a Lens',
                    body: (
                      <>
                        <p className="font-semibold">On the model to the left:</p>
                        <ol className="mt-2 list-decimal space-y-1 pl-5">
                          <li>Drag the sliders / toggle the zones.</li>
                          <li>Watch how R² or the differences react.</li>
                          <li>Tap the claim chips here that match what you see (up to 3).</li>
                        </ol>
                      </>
                    ),
                  }}
                />
              </div>
              <ChipPicker
                label={claim[shown].label}
                hint="Numbers update as you work the model — pick chips that match what you see now."
                options={claim[shown].options}
                selected={claim[shown].selected}
                onToggle={toggleClaim(shown)}
                max={3}
              />
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Progress
              </div>
              <p className="mt-1">
                {claimedCount} of {enabledList.length} lens{enabledList.length === 1 ? '' : 'es'}{' '}
                have claim chips.
                {enabledList.length > 1 && ' Switch lenses with the tabs above the model.'}
              </p>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 7) {
    return (
      <SceneFrame
        {...frame}
        variant="blueprint"
        sceneTitle="Synthesize"
        onNext={next}
        nextLabel="Act 3: Reveal"
        backLabel="Investigate"
        nextDisabled={act2.synthesisChipIds.length === 0}
        nextHint="Pick a synthesis chip to continue."
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">
            <div className="font-display text-lg font-bold text-ink">Pull It Together</div>
            <p className="mb-4 text-sm text-slate-600">
              Across every lens your class used, which statements is the class ready to defend?
            </p>
            <ChipPicker
              label="SYNTHESIS · TAP UP TO 3"
              hint="This becomes the claim your class carries into the reveal."
              options={synthesisOptions}
              selected={act2.synthesisChipIds}
              onToggle={toggle(
                act2.synthesisChipIds,
                (synthesisChipIds) => setAct2((s) => ({ ...s, synthesisChipIds })),
                3,
              )}
              max={3}
              tone="amber"
            />
          </div>

          <div className="flex flex-col gap-4">
            <NarratorBubble line="Step back. Across every lens, what pulls it together? Pick the statements your class is ready to defend — that's the claim you carry into the reveal." />
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                From your investigation
              </div>
              <p className="mt-1">
                {claimedCount} lens{claimedCount === 1 ? '' : 'es'} with claim chips ·{' '}
                {act2.synthesisChipIds.length} synthesis chip
                {act2.synthesisChipIds.length === 1 ? '' : 's'} picked so far.
              </p>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  // ======================================================================
  // ACT 3 · Reveal — one Act-wide "reveal" night backdrop. The class looks
  // back at its own path, the data answers every wondering, then each group
  // commits to a claim.
  // ======================================================================

  if (step === 8) {
    return (
      <SceneFrame
        {...frame}
        variant="reveal"
        sceneTitle="Look Back"
        onNext={next}
        nextLabel="See the reveal"
        backLabel="Synthesize"
      >
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
          {/* LEFT — the whole journey, recapped from the class's own chips */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Act 1 · What your group noticed & wondered
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    We noticed
                  </div>
                  {noticeLines.length > 0 ? (
                    <ul className="mt-1 list-inside list-disc text-sm leading-snug text-ink">
                      {noticeLines.map((n, i) => (
                        <li key={i} className="italic">{n}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm italic text-slate-400">Nothing recorded.</p>
                  )}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-amber-700">
                    We wonder
                  </div>
                  {wonderLines.length > 0 ? (
                    <ul className="mt-1 list-inside list-disc text-sm leading-snug text-ink">
                      {wonderLines.map((w, i) => (
                        <li key={i} className="italic">{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm italic text-slate-400">No questions recorded.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                Act 2 · What your lenses showed
              </div>
              {lensesUsed.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {lensesUsed.map((l) => (
                    <div key={l} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-bold text-sky-700">{LENS_TAB_LABEL[l]}</div>
                      {lensClaimLines[l].length > 0 ? (
                        <ul className="mt-1 list-inside list-disc text-sm leading-snug text-ink">
                          {lensClaimLines[l].map((c, i) => (
                            <li key={i} className="italic">{c}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm italic text-slate-400">
                          Lens opened, but no claim chip picked.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm italic text-slate-400">No lenses were opened.</p>
              )}
              {synthesisLines.length > 0 && (
                <div className="mt-3 border-t border-slate-200 pt-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                    Synthesis
                  </div>
                  <ul className="mt-1 list-inside list-disc text-sm leading-relaxed text-ink">
                    {synthesisLines.map((s, i) => (
                      <li key={i} className="italic">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — narrator + what the reveal will do */}
          <div className="flex flex-col gap-4">
            <NarratorBubble line={LINES.act3Top} audioSrc="/audio/wind-narrator/act3Top.mp3" />
            <div className="rounded-2xl border border-white/30 bg-white/80 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                What happens now
              </div>
              <p className="mt-1">
                Every group took a different path through the same data. On the next
                scene the data answers the questions your class asked — and the math
                that ties it all together steps into the light.
              </p>
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (step === 9) {
    return (
      <SceneFrame
        {...frame}
        variant="reveal"
        sceneTitle="The Reveal"
        onNext={next}
        nextLabel="Make your claim"
        backLabel="Look back"
      >
        <div className="flex flex-1 flex-col gap-5">
          <NarratorBubble line={LINES.act3Closing} audioSrc="/audio/wind-narrator/act3Closing.mp3" />

          {reveals.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
                  Reveal · answers to your wonderings
                </div>
                <h2 className="mt-1 font-display text-xl font-bold text-ink">
                  The data answers every question your class asked.
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Compare what your group claimed to what the data actually shows.
                  Where they line up, your model worked. Where they don't, it can
                  sharpen.
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
          ) : (
            <div className="rounded-2xl border border-white/30 bg-white/85 p-5 text-sm leading-relaxed text-slate-700 shadow-xl backdrop-blur">
              Your group logged what it noticed but didn't pick a question to ask the
              data. That's fine — here is the big picture the whole class was circling.
            </div>
          )}

          <Revelation />
        </div>
      </SceneFrame>
    );
  }

  // step === 10 · Make It Yours
  return (
    <SceneFrame
      {...frame}
      variant="reveal"
      sceneTitle="Make It Yours"
      onNext={restart}
      nextLabel="Start over ↺"
      backLabel="The reveal"
    >
      <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* LEFT — commit a final claim, then write the notebook headline */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-sky-200 bg-white/95 p-5 shadow-xl backdrop-blur">
            <ChipPicker
              label="WRITE YOUR FINAL CLAIM · TAP UP TO 3"
              hint="Different groups will commit to different claims. That's the point."
              options={finalClaimOptions}
              selected={finalClaims}
              onToggle={toggle(finalClaims, setFinalClaims, 3)}
              max={3}
            />
          </div>

          <div className="space-y-4 rounded-2xl bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-100">
                Notebook · Algebra 1 · Topic 8 · Quadratic Functions
              </div>
              <h3 className="mt-1 font-display text-3xl font-bold">Wind Power Curve</h3>
              <div className="text-sm text-sky-100">
                Best-fit R² {RAMP_UP_FIT_INFO.r2.toFixed(2)} · {lensesUsed.length} lens
                {lensesUsed.length === 1 ? '' : 'es'} used
              </div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sky-100">
                Pick a headline · tap up to 3
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {headlineOptions.map((opt) => {
                  const active = headlines.includes(opt.id);
                  const disabled = !active && headlines.length >= 3;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggle(headlines, setHeadlines, 3)(opt.id)}
                      disabled={disabled}
                      className={`rounded-xl border px-3 py-2 text-left text-xs font-medium leading-snug transition ${
                        active
                          ? 'border-white bg-white text-sky-800 shadow'
                          : disabled
                            ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/40'
                            : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="mr-1.5" aria-hidden="true">
                        {active ? '✓' : '+'}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSaved(true)}
                disabled={finalClaims.length === 0 && headlines.length === 0}
                className="rounded-lg bg-white px-4 py-2 font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saved ? 'Update notebook' : 'Save to notebook'}
              </button>
              {saved && (
                <span className="rounded-md bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white">
                  Saved ✓
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — narrator send-off + the headline numbers */}
        <div className="flex flex-col gap-4">
          <NarratorBubble line="That claim is yours now — you built it from the data, not from a textbook. Carry it forward: every model has a zone where it works, and the real skill is knowing where that zone ends." />
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
        </div>
      </div>
    </SceneFrame>
  );
}

// The climactic card: the full power curve with the best-fit quadratic owning
// its middle regime, and the plain-language "why" beneath it.
function Revelation() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
      <div className="p-6 sm:p-8">
        <div className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
          ✨ The revelation
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          A parabola — but only in the middle.
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-200">
          The shape your class watched the turbine draw is a{' '}
          <strong className="text-sky-300">piecewise function</strong>. In the ramp-up
          zone it is a genuine quadratic — the best-fit parabola{' '}
          <span className="font-mono text-sky-300">{fmtEquation()}</span> hugs the data
          with{' '}
          <strong className="text-sky-300">R² ≈ {RAMP_UP_FIT_INFO.r2.toFixed(2)}</strong>.
          Below cut-in it is flat at zero; above rated speed it is flat at the ceiling.
          One curve, three acts.
        </p>
      </div>
      <div className="border-y border-slate-700 bg-white">
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
      <div className="space-y-3 p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-white">
          Why a parabola — and why only there?
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">
          The energy carried by wind actually grows with the <em>cube</em> of its speed.
          Across the range this turbine runs, though, a{' '}
          <strong className="text-sky-300">quadratic</strong> tracks the data
          beautifully — close enough to predict, simple enough to use. That's what a
          model is: not the whole truth, but a trustworthy stand-in inside a known range.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          The flat top isn't physics — it's{' '}
          <strong className="text-sky-300">engineering</strong>. Past rated speed the
          turbine pitches its blades to spill wind and protect itself. So the curve has
          three pieces, and the quadratic you built owns the middle one.
        </p>
      </div>
    </div>
  );
}

// A small headline statistic, used on the closing scene.
function ResultCard({ label, value, subtle }: { label: string; value: string; subtle: string }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-bold tabular-nums text-sky-900">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{subtle}</div>
    </div>
  );
}

