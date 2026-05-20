import { useEffect, useMemo, useRef, useState } from 'react';
import { HISTORICAL_EARTHQUAKES, HISTORICAL_QUERY } from '../../data/historicalEarthquakes';
import { NarratorIntro, NarratorSays } from './Narrator';
import ChipPicker from './chips/ChipPicker';
import { NOTICE_CHIPS, WONDER_CHIPS } from './chips/catalog';
import InteractiveGlobe from './InteractiveGlobe';
import type { GlobeDot } from './InteractiveGlobe';
import { depthColor, magnitudeRadius, DepthLegend } from './quakeColors';
import type { AdvanceState } from './NextRow';
import ActFrame from './ActFrame';

export interface GroupWondering {
  id: string;
  name: string;
  noticeChipIds: string[];
  wonderChipIds: string[];
}

export interface ClassWonderings {
  groups: GroupWondering[];
}

interface QuakeWonderProps {
  onStart: (wonderings: ClassWonderings) => void;
  initialWonderings?: ClassWonderings | null;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

const REVEAL_MS = 4000;
const REVEAL_TICKS = 50;
const MAX_GROUPS = 8;

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Watch the reveal',
  2: 'The data',
  3: 'Notice & wonder',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

function easeIn(t: number): number {
  return t * t * t;
}

function makeGroup(index: number): GroupWondering {
  return {
    id: `g-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    name: `Group ${index}`,
    noticeChipIds: [],
    wonderChipIds: [],
  };
}

function isGroupFilled(g: GroupWondering): boolean {
  return g.noticeChipIds.length > 0 || g.wonderChipIds.length > 0;
}

const noticeOptions = NOTICE_CHIPS.map((c) => ({ id: c.id, label: c.text }));
const wonderOptions = WONDER_CHIPS.map((c) => ({ id: c.id, label: c.text }));

export default function QuakeWonder({ onStart, initialWonderings = null, onAdvanceStateChange }: QuakeWonderProps) {
  const hasPrior = !!initialWonderings && initialWonderings.groups.length > 0;
  const [phase, setPhase] = useState<'pre' | 'revealing' | 'post'>(hasPrior ? 'post' : 'pre');
  const [revealCount, setRevealCount] = useState(hasPrior ? HISTORICAL_EARTHQUAKES.length : 0);
  const [groups, setGroups] = useState<GroupWondering[]>(
    initialWonderings?.groups ?? [makeGroup(1)],
  );
  // Returning visitors land back at the capture step — that's where their
  // work lives. First-timers start at the reveal.
  const [step, setStep] = useState<Step>(hasPrior ? 3 : 1);

  const dots = useMemo<GlobeDot[]>(
    () =>
      HISTORICAL_EARTHQUAKES.map((q, i) => ({
        id: i,
        lat: q.lat,
        lon: q.lon,
        radius: magnitudeRadius(q.mag),
        color: depthColor(q.depthKm),
      })),
    [],
  );

  useEffect(() => {
    if (phase !== 'revealing') return;
    const total = dots.length;
    const tickMs = REVEAL_MS / REVEAL_TICKS;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      const visibleCount = Math.floor(easeIn(tick / REVEAL_TICKS) * total);
      setRevealCount(Math.min(total, visibleCount));
      if (tick >= REVEAL_TICKS) {
        setRevealCount(total);
        window.clearInterval(id);
        setPhase('post');
      }
    }, tickMs);
    return () => window.clearInterval(id);
  }, [phase, dots.length]);

  const startYear = HISTORICAL_QUERY.startTime.slice(0, 4);
  const endYear = HISTORICAL_QUERY.endTime.slice(0, 4);

  const toggleChip = (groupId: string, field: 'noticeChipIds' | 'wonderChipIds', id: string) => {
    setGroups((gs) =>
      gs.map((g) => {
        if (g.id !== groupId) return g;
        const list = g[field];
        return {
          ...g,
          [field]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
        };
      }),
    );
  };

  const addGroup = () => {
    if (groups.length >= MAX_GROUPS) return;
    setGroups((gs) => [...gs, makeGroup(gs.length + 1)]);
  };

  const removeGroup = (id: string) => {
    setGroups((gs) =>
      gs.length <= 1
        ? gs
        // After removing, renumber so names stay consecutive.
        : gs.filter((g) => g.id !== id).map((g, i) => ({ ...g, name: `Group ${i + 1}` })),
    );
  };

  const filledCount = groups.filter(isGroupFilled).length;

  // Step-aware readiness for the global Next button.
  const canAdvance =
    step === 1 ? phase === 'post' :
    step === 2 ? true :
    /* step === 3 */ filledCount >= 1;

  const hint =
    step === 1 && phase !== 'post' ? 'Play the reveal to continue.' :
    step === 3 && filledCount < 1 ? 'Pick a chip for at least one group.' :
    '';

  const nextLabel =
    step === 1 ? 'Next: The data →' :
    step === 2 ? 'Next: Notice & wonder →' :
    /* step === 3 */ 'Next: Map the data →';

  const backLabel =
    step === 2 ? 'Back to the reveal' :
    step === 3 ? 'Back to the data' :
    undefined;

  const handleAdvance = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      onStart({ groups: groups.filter(isGroupFilled) });
    }
  };

  // Refs so advance/back closures published to the parent always read fresh
  // state. The effect re-publishes whenever any visible field changes.
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
      ? phase === 'pre'
        ? 'Press play to watch every major earthquake of the last 35 years.'
        : phase === 'revealing'
        ? 'Each dot is a real M6+ event.'
        : 'A planet quietly drawing a single shape.'
      : step === 2
      ? 'Four things every earthquake event tells you.'
      : 'A room full of data detectives — capture each group\'s notice and wonder.';

  return (
    <ActFrame
      actNumber={1}
      eyebrow="ACT 1 · NOTICE & WONDER · WHOLE CLASS"
      title="What is the planet trying to tell you?"
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          {phase === 'pre' && <NarratorIntro />}
          <div className="bg-[#0c0c1e] rounded-xl border border-slate-800 overflow-hidden relative">
            <InteractiveGlobe
              dots={dots.slice(0, revealCount)}
              aspectRatio={16 / 10}
              locked={phase === 'pre'}
              autoRotateDegPerSec={phase === 'revealing' ? 8 : phase === 'post' ? 3 : 0}
            />
            {phase === 'pre' && (
              <button
                onClick={() => setPhase('revealing')}
                className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40 transition group"
                aria-label="Play earthquake reveal"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="grid place-items-center w-20 h-20 rounded-full bg-rose-600 group-hover:bg-rose-500 shadow-2xl transition">
                    <span className="text-3xl text-white leading-none" style={{ marginLeft: 4 }}>▶</span>
                  </div>
                  <div className="text-white font-display font-bold text-lg drop-shadow">
                    Play — {startYear} to {endYear}
                  </div>
                  <div className="text-rose-100 text-xs drop-shadow">
                    Every magnitude-6+ earthquake on Earth
                  </div>
                </div>
              </button>
            )}
            {phase === 'revealing' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-black/60 backdrop-blur text-white font-mono text-xs">
                {revealCount.toLocaleString()} events…
              </div>
            )}
            {phase === 'post' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-black/60 backdrop-blur text-white font-mono text-xs">
                {HISTORICAL_EARTHQUAKES.length.toLocaleString()} events · {startYear}–{endYear}
              </div>
            )}
            {phase === 'post' && (
              <div className="absolute bottom-2 left-3 px-3 py-1.5 rounded-md bg-black/55 backdrop-blur">
                <DepthLegend tone="dark" />
              </div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act1Post" />
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
              THE DATA
            </div>
            <div className="text-sm text-ink leading-relaxed">
              <strong className="tabular-nums">
                {HISTORICAL_EARTHQUAKES.length.toLocaleString()}
              </strong>{' '}
              earthquakes · {startYear}–{endYear} · USGS Earthquake Hazards Program.
              Each event tells you four things:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              <FieldChip label="Where" detail="lat, lon, place" />
              <FieldChip label="How strong" detail="magnitude" />
              <FieldChip label="How deep" detail="km below surface" />
              <FieldChip label="When" detail="date and time" />
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <div className="text-[10px] font-semibold tracking-widest text-rose-700">
                  CAPTURE EACH GROUP
                </div>
                <h3 className="font-display text-lg font-bold text-ink leading-tight mt-0.5">
                  No answer is wrong. Tap what each group noticed and wondered.
                </h3>
              </div>
              <div className="text-xs text-slate-500">
                {filledCount} of {groups.length} group{groups.length === 1 ? '' : 's'} captured
              </div>
            </div>

            {groups.map((group, idx) => (
              <GroupCard
                key={group.id}
                index={idx + 1}
                group={group}
                onToggleNotice={(id) => toggleChip(group.id, 'noticeChipIds', id)}
                onToggleWonder={(id) => toggleChip(group.id, 'wonderChipIds', id)}
                onRemove={groups.length > 1 ? () => removeGroup(group.id) : undefined}
              />
            ))}

            {groups.length < MAX_GROUPS && (
              <button
                onClick={addGroup}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-semibold hover:border-rose-400 hover:text-rose-700 hover:bg-rose-50/40 transition"
              >
                + Add another group
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500">
            USGS Earthquake Hazards Program · M6+ catalog.
          </div>
        </>
      )}
    </ActFrame>
  );
}

function GroupCard({
  index,
  group,
  onToggleNotice,
  onToggleWonder,
  onRemove,
}: {
  index: number;
  group: GroupWondering;
  onToggleNotice: (id: string) => void;
  onToggleWonder: (id: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-white to-amber-50/40 border border-amber-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-b border-amber-200 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-display font-bold text-base shadow-sm shrink-0">
            {index}
          </div>
          <div className="font-display text-lg font-bold text-ink">{group.name}</div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-xs font-semibold text-slate-500 hover:text-rose-700 transition px-2 py-1 rounded-md hover:bg-white/60"
            aria-label={`Remove ${group.name}`}
          >
            ✕ Remove
          </button>
        )}
      </div>
      <div className="px-5 py-5 space-y-5">
        <ChipPicker
          label="WHAT THIS GROUP NOTICED · TAP UP TO 3"
          hint="Pick the observations that match what this group saw on the map."
          options={noticeOptions}
          selected={group.noticeChipIds}
          onToggle={onToggleNotice}
          max={3}
        />
        <div className="pt-4 border-t border-amber-200/60">
          <ChipPicker
            label="WHAT THIS GROUP WONDERED · TAP UP TO 3"
            hint="Pick the questions this group would ask the data."
            options={wonderOptions}
            selected={group.wonderChipIds}
            onToggle={onToggleWonder}
            max={3}
          />
        </div>
      </div>
    </div>
  );
}

function FieldChip({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] font-semibold tracking-widest text-slate-500">
        {label.toUpperCase()}
      </div>
      <div className="text-xs text-slate-700 mt-0.5 leading-tight">{detail}</div>
    </div>
  );
}
