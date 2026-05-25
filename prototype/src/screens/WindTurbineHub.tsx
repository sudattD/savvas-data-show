import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

// The wind-turbine chapter landing. The same Quadratic Functions chapter has
// two activities built against it — the original single-page 3-Act activity
// and the newer Quest-format rebuild. This page is the fork: pick a path.
//
//   /wind-turbine            → this hub
//   /wind-turbine/classic    → the original activity (WindTurbinePage)
//   /wind-turbine/prototype  → the Quest rebuild (WindScenePrototype)

export default function WindTurbineHub() {
  useDocumentTitle('Wind Power Curve');
  return (
    <div className="min-h-screen">
      <Masthead
        section="Wind Power Curve"
        eyebrow="Algebra 1 · Topic 8 · Quadratic Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={8} />
            <SeeAllDataLink datasetId="wind" label="Explore the data" compact />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="max-w-2xl">
          <div className="eyebrow text-ink-muted mb-2">Chapter activity · choose your path</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900">
            Wind Power Curve
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            One real 1.5 MW turbine logged everything it did for half a day. Students
            slider-fit a quadratic <span className="font-mono text-sm">P = a·v² + b·v + c</span>{' '}
            against the SCADA data and read what the curve is hiding. We built this
            chapter activity two ways — same data, same 3-Act spine, two experiences.
          </p>
        </div>

        {/* The two entry points */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <EntryCard
            to="/wind-turbine/prototype"
            kicker="Newest build · Quest format"
            title="The Quest"
            body="The chapter rebuilt as a cinematic, scene-by-scene journey. A guide walks the class through ten scenes across the three Acts — themed backdrops, a between-scene pause, on-demand scaffolding."
            features={[
              'Ten guided scenes, one global step',
              'Cinematic per-scene backdrops & narrator',
              'Notice → Investigate → Reveal, scene by scene',
            ]}
            cta="Launch the Quest"
            tone="quest"
            decoration={<QuestArt />}
          />
          <EntryCard
            to="/wind-turbine/classic"
            kicker="Original build"
            title="The Classic Activity"
            body="The activity as we first built it: one scrolling page that moves through the three Acts. Slider-fit the quadratic, work the three lenses, then commit a claim to the notebook."
            features={[
              'Single-page, three-Act flow',
              'Slider-fit with a live R² readout',
              'Fit · Differences · Regime lenses',
            ]}
            cta="Open the activity"
            tone="classic"
            decoration={<ClassicArt />}
          />
        </div>

        <p className="mt-6 text-xs text-ink-muted">
          Both paths target the same standards (HSF-IF.C.7.a · HSF-BF.A.1.a · HSS-ID.B.6.a)
          and run about 30 minutes. The Quest is the format we are moving toward; the
          classic activity stays available for comparison.
        </p>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('wind')} pin={{ course: 'algebra1', topic: 8 }} />
        </div>
      </main>

      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>
            Prototype · SCADA log from a 1.5 MW operating wind turbine · ~12 hours, one
            reading per minute.
          </div>
          <SeeAllDataLink datasetId="wind" compact />
        </div>
      </footer>
    </div>
  );
}

function EntryCard({
  to,
  kicker,
  title,
  body,
  features,
  cta,
  tone,
  decoration,
}: {
  to: string;
  kicker: string;
  title: string;
  body: string;
  features: string[];
  cta: string;
  tone: 'quest' | 'classic';
  decoration: React.ReactNode;
}) {
  const styles =
    tone === 'quest'
      ? {
          header: 'bg-gradient-to-br from-sky-700 via-blue-700 to-cyan-600',
          kicker: 'text-sky-700',
          tick: 'text-sky-600',
          button: 'bg-sky-600 group-hover:bg-sky-500',
        }
      : {
          header: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900',
          kicker: 'text-slate-600',
          tick: 'text-slate-500',
          button: 'bg-slate-800 group-hover:bg-slate-700',
        };
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-xl border border-surface-line bg-surface-raised transition hover:shadow-editorial"
    >
      <div className={`relative h-36 ${styles.header}`}>{decoration}</div>
      <div className="flex flex-1 flex-col p-6">
        <div className={`eyebrow ${styles.kicker} mb-1`}>{kicker}</div>
        <h2 className="font-display text-2xl font-bold text-brand-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
        <ul className="mt-4 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className={`mt-0.5 font-bold ${styles.tick}`} aria-hidden="true">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div
          className={`mt-5 inline-flex items-center justify-center self-start rounded-full px-5 py-2 text-sm font-semibold text-white shadow transition ${styles.button}`}
        >
          {cta} →
        </div>
      </div>
    </Link>
  );
}

// Quest art — the power curve traced in light over a starfield, echoing the
// Quest's Act 3 "reveal" backdrop.
function QuestArt() {
  return (
    <svg viewBox="0 0 400 144" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {[
        [40, 30], [110, 54], [180, 24], [250, 48], [320, 32], [368, 66],
        [75, 92], [300, 96],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.3} fill="#ffffff" opacity={0.7} />
      ))}
      <path
        d="M30,112 H140 C200,112 240,70 300,40 H372"
        fill="none"
        stroke="#bae6fd"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.25}
      />
      <path
        d="M30,112 H140 C200,112 240,70 300,40 H372"
        fill="none"
        stroke="#e0f2fe"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {[[80, 112], [140, 112], [210, 92], [260, 64], [300, 40], [340, 40]].map(
        ([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3} fill="#fde68a" />
        ),
      )}
    </svg>
  );
}

// Classic art — a blueprint-style power curve with slider ticks, echoing the
// original activity's fit-the-quadratic interaction.
function ClassicArt() {
  return (
    <svg viewBox="0 0 400 144" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {[64, 128, 192, 256, 320].map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={144} stroke="#7f9bc4" strokeWidth={1} opacity={0.16} />
      ))}
      {[36, 72, 108].map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="#7f9bc4" strokeWidth={1} opacity={0.16} />
      ))}
      <path
        d="M30,116 C150,112 230,70 372,28"
        fill="none"
        stroke="#7ec8f5"
        strokeWidth={2.5}
        strokeDasharray="7 6"
        opacity={0.7}
      />
      {[[70, 114], [150, 100], [230, 70], [310, 44]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#cfe2f5" />
      ))}
      {/* slider track + handle */}
      <line x1={40} y1={132} x2={360} y2={132} stroke="#cfe2f5" strokeWidth={2} opacity={0.6} />
      {[120, 220, 300].map((x) => (
        <circle key={x} cx={x} cy={132} r={5} fill="#7ec8f5" />
      ))}
    </svg>
  );
}
