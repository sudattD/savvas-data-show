import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import ConstellationNotice from './constellation/ConstellationNotice';
import ConstellationDesign from './constellation/ConstellationDesign';
import ConstellationClaim from './constellation/ConstellationClaim';
import type { ConstellationDraft } from './constellation/ConstellationDesign';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function ConstellationDesignerPage() {
  useDocumentTitle('Constellation Designer');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<ConstellationDraft | null>(null);

  const restart = () => {
    setAct(1);
    setDraft(null);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Constellation Designer"
        eyebrow="Geometry · Topic 6 · Quadrilaterals and Other Polygons"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="geometry" topic={6} />
            <SeeAllDataLink datasetId="stars" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && <ConstellationNotice onStart={() => setAct(2)} />}
        {act === 2 && (
          <ConstellationDesign
            onNext={(d) => {
              setDraft(d);
              setAct(3);
            }}
          />
        )}
        {act === 3 && draft && <ConstellationClaim draft={draft} onRestart={restart} />}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('stars')} pin={{ course: 'geometry', topic: 6 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · HYG Database (Hipparcos + Yale + Gliese), CC-BY-SA · 750 naked-eye stars at J2000.0 coordinates.</div>
          <SeeAllDataLink datasetId="stars" compact />
        </div>
      </footer>
    </div>
  );
}
