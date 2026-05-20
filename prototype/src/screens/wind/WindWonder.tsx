import { useEffect, useRef, useState } from 'react';
import { WIND_DATA } from '../../data/windTurbine';
import ActFrame from './ActFrame';
import { NarratorIntro, NarratorSays } from './Narrator';
import PowerCurveScatter from './PowerCurveScatter';
import ChipPicker from './chips/ChipPicker';
import { NOTICE_CHIPS, WONDER_CHIPS } from './chips/catalog';
import type { AdvanceState } from './NextRow';

// --- Shared types (consumed by Act 2 and Act 3) ---------------------------

export interface GroupWondering {
  id: string;
  name: string;
  noticeChipIds: string[];
  wonderChipIds: string[];
}

export interface ClassWonderings {
  groups: GroupWondering[];
}

interface WindWonderProps {
  onStart: (wonderings: ClassWonderings) => void;
  initialWonderings?: ClassWonderings | null;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

const REVEAL_MS = 3500;
const REVEAL_TICKS = 60;
const MAX_GROUPS = 8;

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Watch the reveal',
  2: 'The data',
  3: 'Notice & wonder',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2], STEP_LABELS[3]];

// Reveal dots ease in slowly then accelerate, so the curve appears to draw
// itself left-to-right rather than all at once.
function easeIn(t: number): number {
  return t * t;
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

export default function WindWonder({
  onStart,
  initialWonderings = null,
  onAdvanceStateChange,
}: WindWonderProps) {
  const hasPrior = !!initialWonderings && initialWonderings.groups.length > 0;
  const [phase, setPhase] = useState<'pre' | 'revealing' | 'post'>(hasPrior ? 'post' : 'pre');
  const [revealCount, setRevealCount] = useState(hasPrior ? WIND_DATA.length : 0);
  const [groups, setGroups] = useState<GroupWondering[]>(
    initialWonderings?.groups ?? [makeGroup(1)],
  );
  // Returning visitors land back at the capture step — that's where their
  // work lives. First-timers start at the reveal.
  const [step, setStep] = useState<Step>(hasPrior ? 3 : 1);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const total = WIND_DATA.length;
    const tickMs = REVEAL_MS / REVEAL_TICKS;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      const visible = Math.floor(easeIn(tick / REVEAL_TICKS) * total);
      setRevealCount(Math.min(total, visible));
      if (tick >= REVEAL_TICKS) {
        setRevealCount(total);
        window.clearInterval(id);
        setPhase('post');
      }
    }, tickMs);
    return () => window.clearInterval(id);
  }, [phase]);

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
        : gs.filter((g) => g.id !== id).map((g, i) => ({ ...g, name: `Group ${i + 1}` })),
    );
  };

  const filledCount = groups.filter(isGroupFilled).length;

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
    /* step === 3 */ 'Next: Investigate →';

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
        ? 'Press play to watch one wind turbine work for half a day.'
        : phase === 'revealing'
        ? 'Each dot is one real minute of the turbine.'
        : 'A turbine quietly drawing a single shape.'
      : step === 2
      ? 'Two numbers every minute. That is the whole dataset.'
      : "A room full of data detectives — capture each group's notice and wonder.";

  return (
    <ActFrame
      actNumber={1}
      eyebrow="ACT 1 · NOTICE & WONDER · WHOLE CLASS"
      title="What is the turbine trying to tell you?"
      step={step}
      stepTotal={3}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          {phase === 'pre' && <NarratorIntro />}
          <div className="rounded-xl border border-slate-200 overflow-hidden relative bg-white">
            <PowerCurveScatter points={WIND_DATA.slice(0, revealCount)} aspectRatio={16 / 9} />
            {phase === 'pre' && (
              <button
                onClick={() => setPhase('revealing')}
                className="absolute inset-0 grid place-items-center bg-sky-950/25 hover:bg-sky-950/35 transition group"
                aria-label="Play wind power curve reveal"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="grid place-items-center w-20 h-20 rounded-full bg-sky-600 group-hover:bg-sky-500 shadow-2xl transition">
                    <span className="text-3xl text-white leading-none" style={{ marginLeft: 4 }}>▶</span>
                  </div>
                  <div className="text-white font-display font-bold text-lg drop-shadow">
                    Play — one turbine, ~12 hours
                  </div>
                  <div className="text-sky-100 text-xs drop-shadow">
                    Every minute: the wind it saw and the power it made
                  </div>
                </div>
              </button>
            )}
            {phase === 'revealing' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-slate-900/75 backdrop-blur text-white font-mono text-xs">
                {revealCount.toLocaleString()} minutes…
              </div>
            )}
            {phase === 'post' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-slate-900/75 backdrop-blur text-white font-mono text-xs">
                {WIND_DATA.length.toLocaleString()} minutes · one 1.5 MW turbine
              </div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act1Post" />
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <PowerCurveScatter points={WIND_DATA} aspectRatio={16 / 9} />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-2">
              THE DATA
            </div>
            <div className="text-sm text-ink leading-relaxed">
              <strong className="tabular-nums">{WIND_DATA.length.toLocaleString()}</strong>{' '}
              minutes of one operating 1.5 MW wind turbine, recorded by its own
              onboard sensors (SCADA). Every minute tells you just two things:
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <FieldChip label="Wind speed" detail="metres per second" />
              <FieldChip label="Power output" detail="kilowatts" />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Put the two numbers on the same plane — wind speed across, power
              up — and every minute becomes one dot. Together they draw the
              shape you just watched appear.
            </p>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <PowerCurveScatter points={WIND_DATA} aspectRatio={21 / 9} />
          </div>
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-display text-lg font-bold text-ink">{g.name}</div>
                  {groups.length > 1 && (
                    <button
                      onClick={() => removeGroup(g.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <ChipPicker
                  label="WE NOTICED"
                  hint="What did this group see in the curve?"
                  options={noticeOptions}
                  selected={g.noticeChipIds}
                  onToggle={(id) => toggleChip(g.id, 'noticeChipIds', id)}
                  max={3}
                />
                <ChipPicker
                  label="WE WONDER"
                  hint="What does this group want to ask the data?"
                  options={wonderOptions}
                  selected={g.wonderChipIds}
                  onToggle={(id) => toggleChip(g.id, 'wonderChipIds', id)}
                  max={2}
                />
              </div>
            ))}
            {groups.length < MAX_GROUPS && (
              <button
                onClick={addGroup}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50 transition"
              >
                + Add another group
              </button>
            )}
          </div>
        </>
      )}
    </ActFrame>
  );
}

function FieldChip({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2.5">
      <div className="text-sm font-bold text-ink">{label}</div>
      <div className="text-xs text-slate-500">{detail}</div>
    </div>
  );
}
