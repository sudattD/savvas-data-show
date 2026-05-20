// Persistent left-side rail that anchors the student in the three-Act
// journey. Sits in the empty left margin of the centered main content on
// wide screens; hidden below xl where there isn't room. Sub-steps appear
// indented under the active Act so the student always knows their precise
// location.
interface ActRailProps {
  current: 1 | 2 | 3;
  step?: number;
  stepLabels?: string[];
}

interface ActMeta {
  num: 1 | 2 | 3;
  label: string;
  sub: string;
}

const ACTS: ActMeta[] = [
  { num: 1, label: 'Act 1', sub: 'Notice & wonder' },
  { num: 2, label: 'Act 2', sub: 'Investigate' },
  { num: 3, label: 'Act 3', sub: 'Revelation' },
];

type State = 'done' | 'active' | 'upcoming';

export default function ActRail({ current, step, stepLabels }: ActRailProps) {
  return (
    <aside
      aria-label="Activity progress"
      className="hidden xl:flex fixed top-28 left-6 z-10 flex-col w-72 select-none"
    >
      {ACTS.map((a, i) => {
        const state: State =
          a.num < current ? 'done' : a.num === current ? 'active' : 'upcoming';
        const isLast = i === ACTS.length - 1;
        return (
          <div key={a.num} className="flex flex-col items-start">
            <div className="flex items-center gap-3.5">
              <Dot state={state} num={a.num} />
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold tracking-widest ${
                    state === 'active' ? 'text-rose-700' : 'text-slate-400'
                  }`}
                >
                  {a.label.toUpperCase()}
                </div>
                <div
                  className={`font-display text-xl font-bold leading-tight ${
                    state === 'active' ? 'text-ink' : 'text-slate-500'
                  }`}
                >
                  {a.sub}
                </div>
              </div>
            </div>

            {state === 'active' && step && stepLabels && (
              <ol className="ml-[23px] mt-4 border-l-2 border-rose-200 pl-5 space-y-3">
                {stepLabels.map((label, idx) => {
                  const sn = idx + 1;
                  const sState: State =
                    sn < step ? 'done' : sn === step ? 'active' : 'upcoming';
                  return (
                    <li key={label} className="flex items-center gap-3">
                      <StepDot state={sState} num={sn} />
                      <span
                        className={`text-base font-semibold leading-tight ${
                          sState === 'active'
                            ? 'text-ink'
                            : sState === 'done'
                            ? 'text-rose-600/80'
                            : 'text-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            {!isLast && (
              <div
                aria-hidden="true"
                className={`w-0.5 h-12 ml-[23px] my-2 rounded-full ${
                  state === 'done' ? 'bg-rose-300' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </aside>
  );
}

function Dot({ state, num }: { state: State; num: number }) {
  if (state === 'active') {
    return (
      <div className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-600 to-amber-600 text-white text-base font-display font-bold shadow-md ring-4 ring-rose-100 shrink-0">
        {num}
      </div>
    );
  }
  if (state === 'done') {
    return (
      <div className="grid place-items-center w-12 h-12 rounded-full bg-rose-500 text-white text-base font-display font-bold shrink-0">
        ✓
      </div>
    );
  }
  return (
    <div className="grid place-items-center w-12 h-12 rounded-full border-2 border-slate-300 bg-white text-slate-400 text-base font-display font-bold shrink-0">
      {num}
    </div>
  );
}

function StepDot({ state, num }: { state: State; num: number }) {
  if (state === 'active') {
    return (
      <span className="grid place-items-center w-7 h-7 rounded-full bg-rose-600 text-white text-xs font-display font-bold shrink-0 ring-2 ring-rose-100">
        {num}
      </span>
    );
  }
  if (state === 'done') {
    return (
      <span className="grid place-items-center w-7 h-7 rounded-full bg-rose-200 text-rose-700 text-xs font-display font-bold shrink-0">
        ✓
      </span>
    );
  }
  return (
    <span className="grid place-items-center w-7 h-7 rounded-full border-2 border-slate-300 bg-white text-slate-400 text-xs font-display font-bold shrink-0">
      {num}
    </span>
  );
}
