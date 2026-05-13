import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import HurricaneWonder from './hurricane/HurricaneWonder';
import HurricaneCount from './hurricane/HurricaneCount';
import HurricaneClaim from './hurricane/HurricaneClaim';
import type { HurricaneTally } from './hurricane/HurricaneCount';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function HurricaneCoinPage() {
  useDocumentTitle('The Hurricane Coin');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [tally, setTally] = useState<HurricaneTally | null>(null);

  const restart = () => {
    setAct(1);
    setPrediction(null);
    setTally(null);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="The Hurricane Coin"
        eyebrow="Geometry · Topic 12 · Probability"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="geometry" topic={12} />
            <SeeAllDataLink datasetId="hurricanes" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <HurricaneWonder
            onStart={(p) => {
              setPrediction(p);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <HurricaneCount
            onNext={(t) => {
              setTally(t);
              setAct(3);
            }}
          />
        )}
        {act === 3 && tally && (
          <HurricaneClaim tally={tally} prediction={prediction} onRestart={restart} />
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('hurricanes')} pin={{ course: 'geometry', topic: 12 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · 957 named Atlantic storms · NOAA HURDAT2 · 1950–2024.</div>
          <SeeAllDataLink datasetId="hurricanes" compact />
        </div>
      </footer>
    </div>
  );
}
