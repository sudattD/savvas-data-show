import { Link } from 'react-router-dom';
import Masthead from '../../components/Masthead';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

interface LessonCard {
  to: string;
  number: string;
  family: string;
  title: string;
  body: string;
  concept: string;
  duration: string;
  accent: string;
}

const LESSONS: LessonCard[] = [
  {
    to: '/lessons/slider-of-lies',
    number: 'L1', family: 'VISUAL DECEPTION', title: 'The Slider of Lies',
    body: 'Same dataset, two charts, opposite stories. Drag a single slider and watch the climate trend appear and disappear.',
    concept: 'Truncated y-axis', duration: '~4 min', accent: 'rose',
  },
  {
    to: '/lessons/walk-into-a-bar',
    number: 'L2', family: 'STATISTICAL THINKING', title: 'A Billionaire Walks Into a Bar',
    body: '10 people, average wealth $52k. One billionaire walks in. Now the average is $9 million. Did everyone get richer?',
    concept: 'Mean vs median with outliers', duration: '~3 min', accent: 'amber',
  },
  {
    to: '/lessons/tidy-data',
    number: 'L3', family: 'DATA HYGIENE', title: 'Tidy Data',
    body: "The same gradebook in two shapes. One you can chart with a click. The other you can't. The difference between data work and not.",
    concept: 'Wide vs long format', duration: '~5 min', accent: 'emerald',
  },
  {
    to: '/lessons/csv-from-hell',
    number: 'L4', family: 'DATA HYGIENE', title: 'The CSV from Hell',
    body: 'Six different problems hide in 10 rows: whitespace, date hell, mixed units, missing-value typos, duplicates, impossible outliers. Apply the fixes, watch the table heal.',
    concept: 'Real-world data cleaning', duration: '~6 min', accent: 'emerald',
  },
  {
    to: '/lessons/pick-your-story',
    number: 'L5', family: 'VISUAL DECEPTION', title: 'Pick Your Story',
    body: 'Real CO₂ data. Two sliders for start and end year. Watch the trend rate change. Watch the headline change. Same data, opposite stories.',
    concept: 'Cherry-picked time windows', duration: '~4 min', accent: 'rose',
  },
  {
    to: '/lessons/survivorship-bias',
    number: 'L6', family: 'VISUAL DECEPTION', title: "The Bullet Holes That Aren't There",
    body: 'WWII bombers came back covered in bullet holes. Engineers wanted to armor the holes. Place your armor on the plane. Then meet Abraham Wald.',
    concept: 'Survivorship bias', duration: '~5 min', accent: 'rose',
  },
  {
    to: '/lessons/rare-disease',
    number: 'L7', family: 'STATISTICAL THINKING', title: 'The Rare Disease Test',
    body: 'You tested positive on a 95% accurate test for a rare disease. Should you panic? A grid of 1,000 patients reveals the answer — and changes how you read every screening test.',
    concept: 'Base-rate fallacy', duration: '~5 min', accent: 'amber',
  },
  {
    to: '/lessons/crack-the-headline',
    number: 'L8', family: 'STATISTICAL THINKING', title: 'Crack the Headline',
    body: 'Five real-world headlines. Each one is an equation in disguise. Translate the English claim into algebra, solve it, then check whether the headline was being honest.',
    concept: 'Algebra in disguise', duration: '~6 min', accent: 'emerald',
  },
  {
    to: '/lessons/hit-the-target',
    number: 'L9', family: 'STATISTICAL THINKING', title: 'Hit the Target',
    body: 'A virtual cannon. Adjust angle and velocity. Try to hit four targets at increasing range. The trajectory is a parabola — and the math reveals which combinations work.',
    concept: 'Quadratic trajectories', duration: '~5 min', accent: 'violet',
  },
];

const SPINE: Record<string, string> = {
  rose: 'bg-rose-500', amber: 'bg-accent-500', emerald: 'bg-emerald-500', sky: 'bg-sky-500', violet: 'bg-violet-500',
};

const FAMILY_TONE: Record<string, string> = {
  'VISUAL DECEPTION': 'text-rose-700',
  'STATISTICAL THINKING': 'text-accent-700',
  'DATA HYGIENE': 'text-emerald-700',
};

export default function LessonsHub() {
  useDocumentTitle('Lessons');
  return (
    <div className="min-h-screen">
      <Masthead section="Data-Literacy Lessons" eyebrow="Transferable concepts" />

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-12">
          <div className="eyebrow text-rose-700 mb-4">The concepts</div>
          <h1 className="editorial-hero text-4xl md:text-6xl text-brand-900 max-w-3xl">
            The data-literacy stuff students <em className="not-italic text-accent-600">keep</em> forever.
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-prose leading-relaxed">
            Six interactive lessons on the moves a data-literate adult actually
            uses. Tidy data. Lying with statistics. Mean vs median. Survivorship
            bias. Each lesson is short, focused, and named after a real concept
            students can quote later.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group block bg-surface-raised border border-surface-line rounded-lg overflow-hidden hover:shadow-editorial hover:-translate-y-0.5 transition"
            >
              <div className={`h-1 ${SPINE[l.accent] ?? 'bg-brand-500'}`} />
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-3">
                  <div className={`eyebrow ${FAMILY_TONE[l.family] ?? 'text-brand-700'}`}>
                    <span className="font-mono mr-2 text-ink-muted">{l.number}</span>
                    {l.family}
                  </div>
                  <span className="font-mono text-[10px] text-ink-muted">{l.duration}</span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-brand-900 leading-tight mb-3 min-h-[3.5rem]">
                  {l.title}
                </h2>
                <p className="text-sm text-ink-soft leading-relaxed mb-4 line-clamp-3">{l.body}</p>
                <div className="text-[11px] eyebrow text-ink-muted pt-3 border-t border-surface-line">
                  Concept · <span className="text-ink normal-case font-semibold tracking-normal">{l.concept}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
