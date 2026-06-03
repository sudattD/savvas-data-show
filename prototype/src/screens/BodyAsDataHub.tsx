import Masthead from '../components/Masthead';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function BodyAsDataHub() {
  useDocumentTitle('Body as Data · Transformations');
  return (
    <div className="min-h-screen">
      <Masthead
        section="Body as Data"
        eyebrow="Geometry · Topic 3 · Transformations"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="geometry" topic={3} />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="max-w-2xl">
          <div className="eyebrow text-ink-muted mb-2">Chapter activity</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900">
            Body as Data
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Webcam pose tracking — apply transformations (rotate 30°, scale half, reflect)
            to your own body in real time. Coming soon.
          </p>
        </div>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('earthquakes')} pin={{ course: 'geometry', topic: 3 }} />
        </div>
      </main>
    </div>
  );
}
