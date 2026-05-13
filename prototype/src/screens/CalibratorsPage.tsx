import Masthead from '../components/Masthead';
import LogAxisLens from '../components/calibrators/LogAxisLens';
import QuakeEnergyMeter from '../components/calibrators/QuakeEnergyMeter';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function CalibratorsPage() {
  useDocumentTitle('Calibrators');
  return (
    <div className="min-h-screen">
      <Masthead
        section="Calibrators"
        eyebrow="Quick interactives that make units feel real"
      />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <header className="space-y-2 max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-ink">Calibrators</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Short, single-screen interactives — drop one onto any chapter or
            dataset story to make a unit, scale, or transformation tangible
            in fifteen seconds. No 3-Act structure, no commitment, just a
            calibration moment before the math hits.
          </p>
        </header>

        <section className="space-y-2">
          <header>
            <div className="text-[10px] font-semibold tracking-widest text-violet-700">
              FOR: ANY DATASET WITH ORDERS-OF-MAGNITUDE SPREAD
            </div>
            <h2 className="font-display text-xl font-bold text-ink">Log Axis Lens</h2>
            <p className="text-sm text-slate-600">
              Same data, two scales. Toggle Moore's Law, quake energy, or star distance.
            </p>
          </header>
          <LogAxisLens />
        </section>

        <section className="space-y-2">
          <header>
            <div className="text-[10px] font-semibold tracking-widest text-rose-700">
              FOR: EARTHQUAKES OR ANY LOGARITHMIC INTENSITY SCALE
            </div>
            <h2 className="font-display text-xl font-bold text-ink">Quake Energy Meter</h2>
            <p className="text-sm text-slate-600">
              Drag the slider. See why "magnitude 6" is not "a bit more than 5."
            </p>
          </header>
          <QuakeEnergyMeter />
        </section>

        <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed">
          <div className="font-semibold text-ink mb-1">What's next on the calibrator list?</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Parsec ruler</strong> — stack of AUs growing into a parsec. For stars / exoplanets.</li>
            <li><strong>Decibel comparator</strong> — slider with everyday sounds at each level. For audio / Voice DNA.</li>
            <li><strong>Doubling-time timer</strong> — set a growth rate, watch the doubling time. For Moore's Law / exponentials.</li>
            <li><strong>Polygon sum animator</strong> — drag a vertex, watch the (n−2)·180° proof draw itself.</li>
          </ul>
        </section>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · embeddable widgets · drop one into any chapter or dataset story.
      </footer>
    </div>
  );
}
