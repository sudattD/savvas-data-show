import { useCallback, useEffect, useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import QuakeWonder from './quakes/QuakeWonder';
import QuakeMap from './quakes/QuakeMap';
import QuakeClaim, { QuakeClosingContext } from './quakes/QuakeClaim';
import type { ClassWonderings } from './quakes/QuakeWonder';
import type { QuakeSummary } from './quakes/QuakeMap';
import NextRow from './quakes/NextRow';
import type { AdvanceState } from './quakes/NextRow';
import ActRail from './quakes/ActRail';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';
import { stopNarrator } from './quakes/Narrator';

export default function MapEarthsAngerPage() {
  useDocumentTitle("Map Earth's Anger");

  // Stop the narrator when this screen is closed. The audio player is a
  // module-level singleton, so without this it keeps playing after the
  // user navigates away from the activity.
  useEffect(() => stopNarrator, []);
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [wonderings, setWonderings] = useState<ClassWonderings | null>(null);
  const [summary, setSummary] = useState<QuakeSummary | null>(null);
  const [advance, setAdvance] = useState<AdvanceState | null>(null);

  const restart = () => {
    setAct(1);
    setWonderings(null);
    setSummary(null);
    setAdvance(null);
  };

  // The advance handler each Act publishes captures internal state via
  // closure; useCallback gives the child a stable setter so its useEffect
  // doesn't refire every render.
  const handleAdvanceStateChange = useCallback((next: AdvanceState) => {
    setAdvance(next);
  }, []);

  // Cross-Act Back fallback: used only when the current Act is on its first
  // step (and so publishes no internal back).
  const fallbackBack =
    act === 2 ? () => {
      setAct(1);
      setAdvance(null);
    } : act === 3 ? () => {
      setAct(2);
      setAdvance(null);
    } : undefined;
  const fallbackBackLabel =
    act === 2 ? 'Back to notice & wonder' : act === 3 ? 'Back to investigate' : undefined;

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
      <ActRail current={act} step={advance?.step} stepLabels={advance?.stepLabels} />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <QuakeWonder
            initialWonderings={wonderings}
            onStart={(w) => {
              setWonderings(w);
              setAct(2);
              setAdvance(null);
            }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 2 && (
          <QuakeMap
            wonderings={wonderings}
            onNext={(s) => {
              setSummary(s);
              setAct(3);
              setAdvance(null);
            }}
            initialState={summary?.state}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 3 && summary && (
          <QuakeClaim
            summary={summary}
            wonderings={wonderings}
            onRestart={restart}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}

        <div className="mt-8">
          <NextRow
            advance={advance}
            fallbackBack={fallbackBack}
            fallbackBackLabel={fallbackBackLabel}
          />
        </div>

        {act === 3 && summary && (
          <div className="mt-12">
            <QuakeClosingContext summary={summary} wonderings={wonderings} />
          </div>
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('earthquakes')} pin={{ course: 'geometry', topic: 1 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · USGS Earthquake Hazards Program · M6+ catalog (Act 1) · past-week M2.5+ feed (Acts 2–3).</div>
          <SeeAllDataLink datasetId="earthquakes" compact />
        </div>
      </footer>
    </div>
  );
}
