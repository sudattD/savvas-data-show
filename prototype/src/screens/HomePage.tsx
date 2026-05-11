import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { DATASETS } from '../data/registry';
import { LESSONS } from './lessons/LessonsHub';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle('Home');
  const datasetCount = DATASETS.length;
  const lessonCount = LESSONS.length;

  return (
    <div className="min-h-screen">
      <Masthead />

      {/* Editorial hero */}
      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-5">A prototype · May 2026</div>
              <h1 className="editorial-hero text-5xl md:text-7xl text-brand-900">
                Data lives <em className="not-italic text-accent-600">inside</em> every chapter.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-ink-soft max-w-prose leading-relaxed">
                A prototype of an embedded data-exploration feature for{' '}
                <span className="text-brand-900 font-semibold">enVision Algebra 1, Geometry, and Algebra 2</span> —
                {' '}{datasetCount} real-world datasets, {lessonCount} transferable lessons,
                and one shared exploration tool, threaded through every chapter.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="grid grid-cols-3 gap-2">
                <Tile big label="datasets" value={datasetCount} />
                <Tile label="lessons" value={lessonCount} />
                <Tile label="acts" value={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-b border-surface-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900">Three doors in.</h2>
            <div className="eyebrow text-ink-muted hidden sm:block">the show, in pieces</div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Pillar
              to="/datasets"
              kicker="The Library"
              title="Datasets"
              body={`${datasetCount} real-world datasets, fully sourced. From Mauna Loa CO₂ since 1958 to Boston Marathon finishers, every value is verifiable to its primary source.`}
              cta="Browse the library"
              tone="amber"
            />
            <Pillar
              to="/explorer"
              kicker="The Engine"
              title="Explorer"
              body="A CODAP-class exploration tool. Tables, scatter plots, histograms, box plots, filters, summary stats. Same interface, every dataset, every chapter."
              cta="Open the explorer"
              tone="navy"
            />
            <Pillar
              to="/lessons"
              kicker="The Concepts"
              title="Lessons"
              body={`${lessonCount} interactive lessons on the data-literacy concepts students keep forever — tidy data, lying with statistics, mean vs median, survivorship bias, cherry-picked windows.`}
              cta="See the lessons"
              tone="rose"
            />
          </div>
        </div>
      </section>

      {/* Featured activities */}
      <section className="border-b border-surface-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <div className="eyebrow text-ink-muted mb-2">Featured chapter activities</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900">
              Two structural options. One product.
            </h2>
            <p className="mt-3 text-ink-soft max-w-2xl">
              Each chapter ships an activity. The same 3-Act bones; the Act-1
              commitment changes shape per activity — predict a number,
              compare two snapshots, discover a pattern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              to="/wind-turbine"
              option="Predict · slot into 3-Act"
              title="Wind Power Curve"
              body="Real SCADA data from a 1.5 MW turbine. Slider-fit a quadratic."
              tags={['Alg 1 · T8', 'Quadratics']}
              accent="brand"
              decoration={
                <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M 0 80 Q 100 50 200 30 T 400 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="80" cy="62" r="2.5" fill="currentColor" />
                  <circle cx="160" cy="40" r="2.5" fill="currentColor" />
                  <circle cx="240" cy="22" r="2.5" fill="currentColor" />
                  <circle cx="320" cy="14" r="2.5" fill="currentColor" />
                </svg>
              }
            />
            <FeatureCard
              to="/voice-dna"
              option="Explore · sensor + new formula"
              title="Voice DNA"
              body="Speak into your phone, watch the spectrogram. Discover your unique formants."
              tags={['Alg 2 · T7', 'Trig']}
              accent="accent"
              decoration={
                <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M 0 48 Q 25 20 50 48 T 100 48 T 150 48 T 200 48 T 250 48 T 300 48 T 350 48 T 400 48" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              }
            />
            <FeatureCard
              to="/reaction-time"
              option="Predict · gameplay data"
              title="Reaction Time Arena"
              body="Press SPACE the moment the screen turns green. Play 10 trials. Build your own distribution."
              tags={['Alg 1 · T11', 'Statistics']}
              accent="emerald"
              decoration={
                <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="w-full h-full">
                  <g stroke="currentColor" strokeWidth="1.5" fill="none">
                    {[60, 100, 150, 180, 220, 245, 270, 295, 320, 360].map((x, i) => (
                      <line key={i} x1={x} y1={70} x2={x} y2={70 - (12 + Math.abs(x - 240) / 3)} />
                    ))}
                    <line x1="40" y1="70" x2="380" y2="70" />
                  </g>
                </svg>
              }
            />
            <FeatureCard
              to="/census-pyramid"
              option="Compare · two snapshots"
              title="120 Years of America"
              body="Same country, 1900 vs 2020. Predict which group changed share more, then see."
              tags={['Alg 1 · T12', 'Distributions']}
              accent="rose"
              decoration={
                <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="w-full h-full">
                  <g stroke="currentColor" strokeWidth="1.2" fill="currentColor">
                    {/* mini pyramid silhouette */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const y = 12 + i * 9;
                      const w = 90 - i * 11;
                      return (
                        <g key={i}>
                          <rect x={200 - w} y={y} width={w} height={6} opacity={0.7} />
                          <rect x={200} y={y} width={w * 0.95} height={6} opacity={0.5} />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              }
            />
          </div>
        </div>
      </section>

      <footer className="py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-3 text-xs text-ink-muted">
          <div className="text-center eyebrow leading-relaxed">
            Sources · NOAA · NASA · USGS · World Bank · Wikipedia · Palmer LTER · Caltech · BAA · US Census · Social Security Administration
          </div>
          <div className="flex items-baseline justify-between border-t border-surface-line pt-3">
            <div>Prototype · built May 2026</div>
            <div className="font-mono">v0.4 · {datasetCount} datasets · {lessonCount} lessons · 3 acts</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Tile({ label, value, big }: { label: string; value: number; big?: boolean }) {
  return (
    <div className={`rounded-lg bg-surface-raised border border-surface-line p-3 ${big ? 'ring-2 ring-accent-200' : ''}`}>
      <div className="font-display font-black text-brand-900 text-3xl tabular-nums leading-none">{value}</div>
      <div className="eyebrow text-ink-muted mt-2">{label}</div>
    </div>
  );
}

function Pillar({
  to, kicker, title, body, cta, tone,
}: { to: string; kicker: string; title: string; body: string; cta: string; tone: 'navy' | 'amber' | 'rose' }) {
  const styles = {
    navy: { spine: 'bg-brand-700', kicker: 'text-brand-700' },
    amber: { spine: 'bg-accent-500', kicker: 'text-accent-700' },
    rose: { spine: 'bg-rose-600', kicker: 'text-rose-700' },
  }[tone];
  return (
    <Link
      to={to}
      className="group block bg-surface-raised border border-surface-line rounded-lg overflow-hidden hover:shadow-editorial transition"
    >
      <div className={`h-1 ${styles.spine}`} />
      <div className="p-6">
        <div className={`eyebrow ${styles.kicker} mb-3`}>{kicker}</div>
        <h3 className="font-display text-3xl font-bold text-brand-900 mb-3">{title}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-5">{body}</p>
        <div className={`text-sm font-semibold ${styles.kicker} group-hover:translate-x-1 transition inline-flex items-center gap-1`}>
          {cta} <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({
  to, option, title, body, tags, accent, decoration,
}: { to: string; option: string; title: string; body: string; tags: string[]; accent: 'brand' | 'accent' | 'emerald' | 'rose'; decoration?: React.ReactNode }) {
  const styles = {
    brand: { decoBg: 'bg-brand-100', decoText: 'text-brand-400', kicker: 'text-brand-700', tagBg: 'bg-brand-50 text-brand-800' },
    accent: { decoBg: 'bg-accent-100', decoText: 'text-accent-400', kicker: 'text-accent-700', tagBg: 'bg-accent-50 text-accent-800' },
    emerald: { decoBg: 'bg-emerald-100', decoText: 'text-emerald-400', kicker: 'text-emerald-700', tagBg: 'bg-emerald-50 text-emerald-800' },
    rose: { decoBg: 'bg-rose-100', decoText: 'text-rose-400', kicker: 'text-rose-700', tagBg: 'bg-rose-50 text-rose-800' },
  }[accent];
  return (
    <Link
      to={to}
      className="group block bg-surface-raised border border-surface-line rounded-lg overflow-hidden hover:shadow-editorial transition"
    >
      <div className={`h-28 ${styles.decoBg} relative grid place-items-center`}>
        <div className={`absolute inset-0 ${styles.decoText} opacity-50`}>{decoration}</div>
      </div>
      <div className="p-6">
        <div className={`eyebrow ${styles.kicker} mb-2`}>{option}</div>
        <h3 className="font-display text-2xl font-bold text-brand-900 mb-2">{title}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{body}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className={`text-[11px] font-semibold px-2 py-0.5 rounded ${styles.tagBg}`}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
