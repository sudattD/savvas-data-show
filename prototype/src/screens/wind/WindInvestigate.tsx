import { useEffect, useMemo, useRef, useState } from 'react';
import { WIND_DATA } from '../../data/windTurbine';
import { quadratic, rSquared } from '../../lib/fit';
import ActFrame from './ActFrame';
import { NarratorSays } from './Narrator';
import type { AdvanceState } from './NextRow';
import LensPicker from './lenses/LensPicker';
import FitLens from './lenses/FitLens';
import DifferencesLens from './lenses/DifferencesLens';
import RegimeLens from './lenses/RegimeLens';
import ChipPicker from './chips/ChipPicker';
import {
  FIT_CLAIM_CHIPS,
  DIFF_CLAIM_CHIPS,
  REGIME_CLAIM_CHIPS,
  SYNTHESIS_CHIPS,
  NOTICE_CHIPS,
  WONDER_CHIPS,
  renderStaticChips,
  renderDerivedChips,
} from './chips/catalog';
import type {
  FitClaimContext,
  DiffClaimContext,
  RegimeClaimContext,
} from './chips/catalog';
import type { ClassWonderings } from './WindWonder';
import type {
  Act2State,
  FitLensState,
  DifferencesLensState,
  RegimeLensState,
  LensId,
} from './lenses/types';
import { defaultAct2State } from './lenses/types';
import { CUT_IN_SPEED, RATED_SPEED } from './regimes';
import { fitQuadratic, binnedMeans, differences } from './quadFit';

// --- Shared types (consumed by Act 3) -------------------------------------

export interface LensSummary {
  used: boolean;
  claimChipIds: string[];
  claims: string[]; // pre-rendered for Act 3 display
  detail?: string;
}

export interface QuadFit {
  a: number;
  b: number;
  c: number;
  r2: number;
}

export interface WindSummary {
  state: Act2State;
  synthesisChipIds: string[];
  synthesisLines: string[];
  lenses: {
    fit: LensSummary;
    differences: LensSummary;
    regime: LensSummary;
  };
  bestFit: QuadFit;
}

interface WindInvestigateProps {
  onNext: (summary: WindSummary) => void;
  initialState?: Act2State;
  wonderings?: ClassWonderings | null;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Pick your lens',
  2: 'Investigate',
  3: 'Synthesize',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

// Ramp-up readings — the zone the quadratic is meant to model.
const RAMP_UP_DATA = WIND_DATA.filter(
  (d) => d.windSpeed >= CUT_IN_SPEED && d.windSpeed < RATED_SPEED,
);

// Fixed reference fits for the Regime lens chips: a quadratic on the ramp-up
// zone alone vs. the same kind of fit stretched across every reading.
const RAMP_UP_FIT = (() => {
  const coeffs = fitQuadratic(RAMP_UP_DATA);
  return rSquared(RAMP_UP_DATA, quadratic(coeffs.a, coeffs.b, coeffs.c));
})();
const ALL_DATA_FIT = (() => {
  const coeffs = fitQuadratic(WIND_DATA);
  return rSquared(WIND_DATA, quadratic(coeffs.a, coeffs.b, coeffs.c));
})();

export default function WindInvestigate({
  onNext,
  initialState,
  wonderings = null,
  onAdvanceStateChange,
}: WindInvestigateProps) {
  const [state, setState] = useState<Act2State>(initialState ?? defaultAct2State());
  // Returning visitors land at the synthesis step; first-timers at the picker.
  const [step, setStep] = useState<Step>(initialState ? 3 : 1);

  // --- Data-derived contexts for the claim chips --------------------------

  const fitCtx = useMemo<FitClaimContext>(() => {
    const model = quadratic(state.fit.a, state.fit.b, state.fit.c);
    return {
      a: state.fit.a,
      b: state.fit.b,
      c: state.fit.c,
      r2: rSquared(RAMP_UP_DATA, model),
      predictedAt10: model(10),
    };
  }, [state.fit.a, state.fit.b, state.fit.c]);

  const diffCtx = useMemo<DiffClaimContext>(() => {
    const means = binnedMeans(RAMP_UP_DATA, CUT_IN_SPEED, RATED_SPEED, state.differences.bins).map(
      (b) => b.mean,
    );
    const { second } = differences(means);
    const finite = second.filter((v) => Number.isFinite(v));
    const mean = finite.length ? finite.reduce((s, v) => s + v, 0) / finite.length : 0;
    const spread = finite.length ? Math.max(...finite) - Math.min(...finite) : 0;
    return {
      meanSecondDiff: mean,
      spread,
      roughlyConstant: spread <= Math.max(150, Math.abs(mean) * 2),
    };
  }, [state.differences.bins]);

  const regimeCtx = useMemo<RegimeClaimContext>(
    () => ({ rampUpR2: RAMP_UP_FIT, allDataR2: ALL_DATA_FIT }),
    [],
  );

  // --- Lens enable / state plumbing ---------------------------------------

  const enabled = {
    fit: state.fit.enabled,
    differences: state.differences.enabled,
    regime: state.regime.enabled,
  };
  const anyEnabled = enabled.fit || enabled.differences || enabled.regime;

  const toggleLens = (lens: LensId) =>
    setState((s) => ({ ...s, [lens]: { ...s[lens], enabled: !s[lens].enabled } }));

  const updateFit = (next: FitLensState) => setState((s) => ({ ...s, fit: next }));
  const updateDifferences = (next: DifferencesLensState) =>
    setState((s) => ({ ...s, differences: next }));
  const updateRegime = (next: RegimeLensState) => setState((s) => ({ ...s, regime: next }));

  const toggleChipFor = (lens: LensId, id: string) => {
    setState((s) => {
      const cur = s[lens].claimChipIds;
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return { ...s, [lens]: { ...s[lens], claimChipIds: next.slice(0, 3) } };
    });
  };

  const toggleSynthesis = (id: string) => {
    setState((s) => {
      const cur = s.synthesisChipIds;
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return { ...s, synthesisChipIds: next.slice(0, 3) };
    });
  };

  const usedClaimCount =
    (state.fit.enabled && state.fit.claimChipIds.length > 0 ? 1 : 0) +
    (state.differences.enabled && state.differences.claimChipIds.length > 0 ? 1 : 0) +
    (state.regime.enabled && state.regime.claimChipIds.length > 0 ? 1 : 0);

  const finalCanAdvance =
    anyEnabled && usedClaimCount >= 1 && state.synthesisChipIds.length >= 1;

  const canAdvance =
    step === 1 ? anyEnabled :
    step === 2 ? usedClaimCount >= 1 :
    /* step === 3 */ finalCanAdvance;

  const hint =
    step === 1 && !anyEnabled ? 'Turn on at least one lens.' :
    step === 2 && usedClaimCount === 0 ? 'Pick a chip in at least one lens.' :
    step === 3 && state.synthesisChipIds.length === 0 ? 'Pick a synthesis chip.' :
    '';

  const nextLabel =
    step === 1 ? 'Next: Investigate →' :
    step === 2 ? 'Next: Synthesize →' :
    /* step === 3 */ 'Next: Revelation →';

  const backLabel =
    step === 2 ? 'Back to lens picker' :
    step === 3 ? 'Back to investigate' :
    undefined;

  const handleFinalAdvance = () => {
    const summary: WindSummary = {
      state,
      synthesisChipIds: state.synthesisChipIds,
      synthesisLines: renderStaticChips(SYNTHESIS_CHIPS, state.synthesisChipIds),
      lenses: {
        fit: {
          used: state.fit.enabled,
          claimChipIds: state.fit.claimChipIds,
          claims: renderDerivedChips(FIT_CLAIM_CHIPS, state.fit.claimChipIds, fitCtx),
          detail: `P = ${state.fit.a.toFixed(2)}·v² + ${state.fit.b.toFixed(1)}·v + ${state.fit.c.toFixed(0)} · R² ${fitCtx.r2.toFixed(2)}`,
        },
        differences: {
          used: state.differences.enabled,
          claimChipIds: state.differences.claimChipIds,
          claims: renderDerivedChips(DIFF_CLAIM_CHIPS, state.differences.claimChipIds, diffCtx),
          detail: `${state.differences.bins} bins`,
        },
        regime: {
          used: state.regime.enabled,
          claimChipIds: state.regime.claimChipIds,
          claims: renderDerivedChips(REGIME_CLAIM_CHIPS, state.regime.claimChipIds, regimeCtx),
          detail: `${state.regime.included.length} zone${state.regime.included.length === 1 ? '' : 's'} fitted`,
        },
      },
      bestFit: {
        a: state.fit.a,
        b: state.fit.b,
        c: state.fit.c,
        r2: fitCtx.r2,
      },
    };
    onNext(summary);
  };

  const handleAdvance = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else handleFinalAdvance();
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

  // --- Render-time chip option lists --------------------------------------

  const fitClaimOptions = FIT_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(fitCtx) }));
  const diffClaimOptions = DIFF_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(diffCtx) }));
  const regimeClaimOptions = REGIME_CLAIM_CHIPS.map((c) => ({
    id: c.id,
    label: c.render(regimeCtx),
  }));
  const synthesisOptions = SYNTHESIS_CHIPS.map((c) => ({ id: c.id, label: c.text }));

  const stepSubhead =
    step === 1
      ? 'Choose which lenses your class will use to investigate the curve.'
      : step === 2
      ? 'Work each lens — pick chips that match what you see.'
      : 'Across the lenses, pick what pulls it all together.';

  let panelIndex = 0;
  const nextPanelIndex = () => ++panelIndex;

  return (
    <ActFrame
      actNumber={2}
      eyebrow="ACT 2 · INVESTIGATE"
      title="Put the curve to the test."
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          {wonderings && wonderings.groups.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-semibold tracking-widest text-amber-700">
                FROM ACT 1 · {wonderings.groups.length} GROUP
                {wonderings.groups.length === 1 ? '' : 'S'}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {wonderings.groups.map((g) => {
                  const notices = renderStaticChips(NOTICE_CHIPS, g.noticeChipIds);
                  const wonders = renderStaticChips(WONDER_CHIPS, g.wonderChipIds);
                  return (
                    <div
                      key={g.id}
                      className="bg-white/70 border border-amber-200/70 rounded-lg p-3 space-y-1.5"
                    >
                      <div className="text-[11px] font-bold text-amber-800">{g.name}</div>
                      {notices.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-amber-700/70">
                            NOTICED
                          </div>
                          <ul className="text-amber-900 text-xs leading-snug list-disc list-inside">
                            {notices.map((n, i) => (
                              <li key={i} className="italic">{n}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {wonders.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-amber-700/70">
                            WONDERED
                          </div>
                          <ul className="text-amber-900 text-xs leading-snug list-disc list-inside">
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

          <NarratorSays lineKey="act2Picker" />
          <LensPicker enabled={enabled} onToggle={toggleLens} />
        </>
      )}

      {step === 2 && (
        <>
          {!anyEnabled && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              No lenses enabled. Go back and pick at least one.
            </div>
          )}

          {state.fit.enabled && (
            <LensPanel
              index={nextPanelIndex()}
              title="Fit a curve"
              subtitle="Drag a, b and c until the orange parabola hugs the ramp-up dots."
            >
              <FitLens state={state.fit} onChange={updateFit} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label="WHAT DID THE FIT SHOW? · TAP UP TO 3"
                  hint="Numbers update as you drag the sliders — pick chips that match your fit now."
                  options={fitClaimOptions}
                  selected={state.fit.claimChipIds}
                  onToggle={(id) => toggleChipFor('fit', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          {state.differences.enabled && (
            <LensPanel
              index={nextPanelIndex()}
              title="Differences"
              subtitle="Bin the ramp-up data and read off the first and second differences."
            >
              <DifferencesLens state={state.differences} onChange={updateDifferences} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label="WHAT DID THE DIFFERENCES SHOW? · TAP UP TO 3"
                  hint="The chips reflect the table above."
                  options={diffClaimOptions}
                  selected={state.differences.claimChipIds}
                  onToggle={(id) => toggleChipFor('differences', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          {state.regime.enabled && (
            <LensPanel
              index={nextPanelIndex()}
              title="Regimes"
              subtitle="Toggle operating zones in and out of a best-fit quadratic — watch R² react."
            >
              <RegimeLens state={state.regime} onChange={updateRegime} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label="WHAT DID THE REGIMES SHOW? · TAP UP TO 3"
                  hint="Try fitting the ramp-up zone alone, then add the others."
                  options={regimeClaimOptions}
                  selected={state.regime.claimChipIds}
                  onToggle={(id) => toggleChipFor('regime', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          {usedClaimCount > 0 && (
            <div className="text-xs text-slate-500">
              {usedClaimCount} lens{usedClaimCount === 1 ? '' : 'es'} with picks so far.
            </div>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-5">
            <ChipPicker
              label="SYNTHESIS · TAP UP TO 3"
              hint="Across the lenses, pick what pulls it together."
              options={synthesisOptions}
              selected={state.synthesisChipIds}
              onToggle={toggleSynthesis}
              max={3}
              tone="amber"
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-700">From your investigation: </span>
            {usedClaimCount} lens{usedClaimCount === 1 ? '' : 'es'} with picks ·{' '}
            {state.synthesisChipIds.length} synthesis chip
            {state.synthesisChipIds.length === 1 ? '' : 's'} so far.
          </div>
        </>
      )}
    </ActFrame>
  );
}

function LensPanel({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-9 h-9 rounded-lg bg-sky-600 text-white font-display font-bold text-sm">
          {index}
        </div>
        <div>
          <div className="font-display text-lg font-bold text-ink leading-tight">{title}</div>
          <div className="text-xs text-slate-600 leading-snug">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
