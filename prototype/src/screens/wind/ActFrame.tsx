// Shared shell for the three Acts of the Wind Power Curve activity. The
// outer card is the Act container; everything inside is presented as a
// sub-activity living within that Act. The header section identifies which
// Act you're in; the step section below shows where you are within it.
interface ActFrameProps {
  actNumber: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  step: number;
  stepTotal: number;
  stepLabel: string;
  stepSubhead: string;
  children: React.ReactNode;
}

export default function ActFrame({
  actNumber,
  eyebrow,
  title,
  step,
  stepTotal,
  stepLabel,
  stepSubhead,
  children,
}: ActFrameProps) {
  return (
    <section className="bg-white border border-sky-200 rounded-2xl shadow-sm overflow-hidden">
      <header className="bg-gradient-to-br from-sky-50 to-blue-50 border-b border-sky-200 px-5 sm:px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-lg font-display text-base font-bold tracking-tight shrink-0">
            A{actNumber}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold tracking-widest text-sky-700">
              {eyebrow}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </header>
      <div className="px-5 sm:px-6 py-5 space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-widest text-slate-500">
            <StepDots step={step} total={stepTotal} />
            <span>STEP {step} OF {stepTotal}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700">{stepLabel.toUpperCase()}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1.5">{stepSubhead}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mr-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block rounded-full ${
            i + 1 === step
              ? 'w-2 h-2 bg-sky-600'
              : i + 1 < step
              ? 'w-1.5 h-1.5 bg-sky-400'
              : 'w-1.5 h-1.5 bg-slate-300'
          }`}
        />
      ))}
    </div>
  );
}
