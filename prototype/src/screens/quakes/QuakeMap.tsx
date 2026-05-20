import { useEffect, useMemo, useRef, useState } from 'react';
import { NarratorSays } from './Narrator';
import type { AdvanceState } from './NextRow';
import LensPicker from './lenses/LensPicker';
import MapLens from './lenses/MapLens';
import HistogramLens from './lenses/HistogramLens';
import ScatterLens from './lenses/ScatterLens';
import ChipPicker from './chips/ChipPicker';
import { getDataset } from '../../data/registry';
import {
  MAP_CLAIM_CHIPS,
  histogramClaimChipsFor,
  scatterClaimChipsFor,
  SYNTHESIS_CHIPS,
  WONDER_CHIPS,
  NOTICE_CHIPS,
  renderStaticChips,
  renderDerivedChips,
} from './chips/catalog';
import type {
  MapClaimContext,
  HistogramClaimContext,
  ScatterClaimContext,
} from './chips/catalog';
import type { ClassWonderings } from './QuakeWonder';
import type {
  Act2State,
  HistogramLensState,
  LensId,
  MapLensState,
  ScatterLensState,
} from './lenses/types';
import { defaultAct2State, HISTOGRAM_VAR_LABELS, SCATTER_VAR_LABELS } from './lenses/types';
import type { MapLensDerived } from './lenses/MapLens';
import ActFrame from './ActFrame';

interface QuakeMapProps {
  onNext: (summary: QuakeSummary) => void;
  initialState?: Act2State;
  wonderings?: ClassWonderings | null;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

export interface LensSummary {
  used: boolean;
  claimChipIds: string[];
  claims: string[]; // pre-rendered for Act 3 display
  detail?: string;
}

export interface QuakeSummary {
  state: Act2State;
  synthesisChipIds: string[];
  synthesisLines: string[]; // pre-rendered
  lenses: {
    map: LensSummary;
    histogram: LensSummary;
    scatter: LensSummary;
  };
  totalCount: number;
  shownCount: number;
  minMag: number;
  ringOfFireCount: number;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Pick your lenses',
  2: 'Investigate',
  3: 'Synthesize',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

export default function QuakeMap({
  onNext,
  initialState,
  wonderings = null,
  onAdvanceStateChange,
}: QuakeMapProps) {
  const [state, setState] = useState<Act2State>(initialState ?? defaultAct2State());
  const [mapDerived, setMapDerived] = useState<MapLensDerived>({
    totalCount: 0,
    shownCount: 0,
    ringOfFireCount: 0,
  });
  // Returning visitors land at the synthesis step (their latest work);
  // first-timers start at the lens picker.
  const [step, setStep] = useState<Step>(initialState ? 3 : 1);

  // Derive context for data-derived chips. Histogram + scatter need stats
  // about the underlying dataset; map needs the live filter result.
  const dataset = getDataset('earthquakes');

  const histogramCtx = useMemo<HistogramClaimContext>(() => {
    let mags = 0;
    let depths = 0;
    let maxMag = 0;
    let maxDepth = 0;
    let smallCount = 0; // mag < 4
    let shallowCount = 0; // depth < 70
    const total = dataset.rows.length;
    for (const r of dataset.rows) {
      const m = Number(r.magnitude);
      const d = Number(r.depthKm);
      if (Number.isFinite(m)) {
        mags++;
        if (m > maxMag) maxMag = m;
        if (m < 4) smallCount++;
      }
      if (Number.isFinite(d)) {
        depths++;
        if (d > maxDepth) maxDepth = d;
        if (d < 70) shallowCount++;
      }
    }
    return {
      variable: state.histogram.variable,
      shallowPct: depths === 0 ? 0 : Math.round((shallowCount / depths) * 100),
      smallPct: mags === 0 ? 0 : Math.round((smallCount / mags) * 100),
      maxMag,
      maxDepth,
      totalCount: total,
    };
  }, [dataset, state.histogram.variable]);

  const mapCtx = useMemo<MapClaimContext>(
    () => ({
      totalCount: mapDerived.totalCount,
      shownCount: mapDerived.shownCount,
      ringOfFireCount: mapDerived.ringOfFireCount,
      ringPct:
        mapDerived.shownCount === 0
          ? 0
          : Math.round((mapDerived.ringOfFireCount / mapDerived.shownCount) * 100),
      minMag: state.map.minMag,
    }),
    [mapDerived, state.map.minMag],
  );

  const scatterCtx = useMemo<ScatterClaimContext>(
    () => ({ xKey: state.scatter.xKey, yKey: state.scatter.yKey }),
    [state.scatter.xKey, state.scatter.yKey],
  );

  const enabled = {
    map: state.map.enabled,
    histogram: state.histogram.enabled,
    scatter: state.scatter.enabled,
  };
  const anyEnabled = enabled.map || enabled.histogram || enabled.scatter;

  const toggleLens = (lens: LensId) => {
    setState((s) => ({ ...s, [lens]: { ...s[lens], enabled: !s[lens].enabled } }));
  };

  const updateMap = (next: MapLensState) => setState((s) => ({ ...s, map: next }));
  const updateHistogram = (next: HistogramLensState) =>
    setState((s) => ({ ...s, histogram: next }));
  const updateScatter = (next: ScatterLensState) =>
    setState((s) => ({ ...s, scatter: next }));

  const toggleChipFor = (
    lens: 'map' | 'histogram' | 'scatter',
    id: string,
  ) => {
    setState((s) => {
      const cur = s[lens].claimChipIds;
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      // Cap each lens at 3 selections.
      const capped = next.slice(0, 3);
      return { ...s, [lens]: { ...s[lens], claimChipIds: capped } };
    });
  };

  const toggleSynthesis = (id: string) => {
    setState((s) => {
      const cur = s.synthesisChipIds;
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      const capped = next.slice(0, 3);
      return { ...s, synthesisChipIds: capped };
    });
  };

  // Did the student actually engage each enabled lens — i.e., pick a chip?
  const usedClaimCount =
    (state.map.enabled && state.map.claimChipIds.length > 0 ? 1 : 0) +
    (state.histogram.enabled && state.histogram.claimChipIds.length > 0 ? 1 : 0) +
    (state.scatter.enabled && state.scatter.claimChipIds.length > 0 ? 1 : 0);

  const finalCanAdvance =
    anyEnabled && usedClaimCount >= 1 && state.synthesisChipIds.length >= 1;

  // Step-aware readiness, label, hint, advance, back.
  const canAdvance =
    step === 1 ? anyEnabled :
    step === 2 ? usedClaimCount >= 1 :
    /* step === 3 */ finalCanAdvance;

  const hint =
    step === 1 && !anyEnabled ? 'Turn on at least one lens (Map / Histogram / Scatter).' :
    step === 2 && usedClaimCount === 0 ? 'Pick a chip in at least one lens.' :
    step === 3 && state.synthesisChipIds.length === 0 ? 'Pick a synthesis chip.' :
    '';

  const nextLabel =
    step === 1 ? 'Next: Investigate →' :
    step === 2 ? 'Next: Synthesize →' :
    /* step === 3 */ 'Next: Make a claim →';

  const backLabel =
    step === 2 ? 'Back to lens picker' :
    step === 3 ? 'Back to investigate' :
    undefined;

  const handleFinalAdvance = () => {
    const summary: QuakeSummary = {
      state,
      synthesisChipIds: state.synthesisChipIds,
      synthesisLines: renderStaticChips(SYNTHESIS_CHIPS, state.synthesisChipIds),
      lenses: {
        map: {
          used: state.map.enabled,
          claimChipIds: state.map.claimChipIds,
          claims: renderDerivedChips(MAP_CLAIM_CHIPS, state.map.claimChipIds, mapCtx),
        },
        histogram: {
          used: state.histogram.enabled,
          claimChipIds: state.histogram.claimChipIds,
          claims: renderDerivedChips(
            histogramClaimChipsFor(histogramCtx),
            state.histogram.claimChipIds,
            histogramCtx,
          ),
          detail: `Variable: ${HISTOGRAM_VAR_LABELS[state.histogram.variable]}`,
        },
        scatter: {
          used: state.scatter.enabled,
          claimChipIds: state.scatter.claimChipIds,
          claims: renderDerivedChips(
            scatterClaimChipsFor(scatterCtx),
            state.scatter.claimChipIds,
            scatterCtx,
          ),
          detail: `${SCATTER_VAR_LABELS[state.scatter.xKey]} × ${SCATTER_VAR_LABELS[state.scatter.yKey]}`,
        },
      },
      totalCount: mapDerived.totalCount,
      shownCount: mapDerived.shownCount,
      minMag: state.map.minMag,
      ringOfFireCount: mapDerived.ringOfFireCount,
    };
    onNext(summary);
  };

  const handleAdvance = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      handleFinalAdvance();
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

  // Render-time chip option lists (apply ctx for derived chips).
  const mapClaimOptions = MAP_CLAIM_CHIPS.map((c) => ({ id: c.id, label: c.render(mapCtx) }));
  const histogramClaimOptions = histogramClaimChipsFor(histogramCtx).map((c) => ({
    id: c.id,
    label: c.render(histogramCtx),
  }));
  const scatterClaimOptions = scatterClaimChipsFor(scatterCtx).map((c) => ({
    id: c.id,
    label: c.render(scatterCtx),
  }));
  const synthesisOptions = SYNTHESIS_CHIPS.map((c) => ({ id: c.id, label: c.text }));

  const stepSubhead =
    step === 1
      ? 'Choose which lenses your class will use to investigate the data.'
      : step === 2
      ? 'Work each lens — pick chips that match what you see.'
      : 'Across the lenses, pick what pulls it all together.';

  return (
    <ActFrame
      actNumber={2}
      eyebrow="ACT 2 · INVESTIGATE"
      title="Pick your lens. Find what's there."
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
                FROM ACT 1 · {wonderings.groups.length} GROUP{wonderings.groups.length === 1 ? '' : 'S'}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {wonderings.groups.map((g) => {
                  const notices = renderStaticChips(NOTICE_CHIPS, g.noticeChipIds);
                  const wonders = renderStaticChips(WONDER_CHIPS, g.wonderChipIds);
                  return (
                    <div key={g.id} className="bg-white/70 border border-amber-200/70 rounded-lg p-3 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-800">{g.name}</div>
                      {notices.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-amber-700/70">NOTICED</div>
                          <ul className="text-amber-900 text-xs leading-snug list-disc list-inside">
                            {notices.map((n, i) => <li key={i} className="italic">{n}</li>)}
                          </ul>
                        </div>
                      )}
                      {wonders.length > 0 && (
                        <div>
                          <div className="text-[9px] font-semibold tracking-widest text-amber-700/70">WONDERED</div>
                          <ul className="text-amber-900 text-xs leading-snug list-disc list-inside">
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
          {state.map.enabled && (
            <LensPanel
              index={1}
              title="Map"
              subtitle="Plot every quake on a coordinate grid. Filter, hover, toggle the Ring of Fire arcs."
            >
              <MapLens state={state.map} onChange={updateMap} onDerivedChange={setMapDerived} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label="WHAT DID THE MAP SHOW? · TAP UP TO 3"
                  hint="Numbers update as you move the magnitude slider — pick chips that match what you see now."
                  options={mapClaimOptions}
                  selected={state.map.claimChipIds}
                  onToggle={(id) => toggleChipFor('map', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          {state.histogram.enabled && (
            <LensPanel
              index={state.map.enabled ? 2 : 1}
              title="Histogram"
              subtitle="Pick a variable. See how the values are distributed across all events."
            >
              <HistogramLens state={state.histogram} onChange={updateHistogram} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label={`WHAT DID THE ${HISTOGRAM_VAR_LABELS[state.histogram.variable].toUpperCase()} HISTOGRAM SHOW? · TAP UP TO 3`}
                  hint="The chips change when you switch variables."
                  options={histogramClaimOptions}
                  selected={state.histogram.claimChipIds}
                  onToggle={(id) => toggleChipFor('histogram', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          {state.scatter.enabled && (
            <LensPanel
              index={[state.map.enabled, state.histogram.enabled].filter(Boolean).length + 1}
              title="Scatter"
              subtitle="Pick two variables. Try the 'fit a line' toggle inside the chart — what R² do you get?"
            >
              <ScatterLens state={state.scatter} onChange={updateScatter} />
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <ChipPicker
                  label={`WHAT DID THE ${SCATTER_VAR_LABELS[state.scatter.xKey].toUpperCase()} × ${SCATTER_VAR_LABELS[state.scatter.yKey].toUpperCase()} SCATTER SHOW? · TAP UP TO 3`}
                  hint="The chips change when you swap axes."
                  options={scatterClaimOptions}
                  selected={state.scatter.claimChipIds}
                  onToggle={(id) => toggleChipFor('scatter', id)}
                  max={3}
                />
              </div>
            </LensPanel>
          )}

          <div className="text-xs text-slate-500">
            {usedClaimCount > 0
              ? `${usedClaimCount} lens${usedClaimCount === 1 ? '' : 'es'} with picks so far.`
              : null}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-5">
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
            {state.synthesisChipIds.length} synthesis chip{state.synthesisChipIds.length === 1 ? '' : 's'} so far.
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
        <div className="grid place-items-center w-9 h-9 rounded-lg bg-rose-600 text-white font-display font-bold text-sm">
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
