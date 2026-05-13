import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import QuakeWonder from './quakes/QuakeWonder';
import QuakeMap from './quakes/QuakeMap';
import QuakeClaim from './quakes/QuakeClaim';
import type { PredictionShape } from './quakes/QuakeWonder';
import type { QuakeSummary } from './quakes/QuakeMap';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function MapEarthsAngerPage() {
  useDocumentTitle("Map Earth's Anger");
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [prediction, setPrediction] = useState<PredictionShape | null>(null);
  const [summary, setSummary] = useState<QuakeSummary | null>(null);

  const restart = () => {
    setAct(1);
    setPrediction(null);
    setSummary(null);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Map Earth's Anger"
        eyebrow="Geometry · Topic 1 · Foundations of Geometry"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="geometry" topic={1} />
            <SeeAllDataLink datasetId="earthquakes" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <QuakeWonder
            onStart={(pred) => {
              setPrediction(pred);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <QuakeMap
            onNext={(s) => {
              setSummary(s);
              setAct(3);
            }}
          />
        )}
        {act === 3 && summary && (
          <QuakeClaim summary={summary} prediction={prediction} onRestart={restart} />
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('earthquakes')} pin={{ course: 'geometry', topic: 1 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · USGS Earthquake Hazards Program · past-week M2.5+ feed.</div>
          <SeeAllDataLink datasetId="earthquakes" compact />
        </div>
      </footer>
    </div>
  );
}
