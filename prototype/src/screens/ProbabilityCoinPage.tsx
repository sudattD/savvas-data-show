import { useCallback, useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import SpotifyWonder from './hurricane/SpotifyWonder';
import SpotifyCount from './hurricane/SpotifyCount';
import SpotifyClaim from './hurricane/SpotifyClaim';
import type { SpotifyTally } from './hurricane/SpotifyCount';
import NextRow from './wind/NextRow';
import type { AdvanceState } from './wind/NextRow';
import ActRail from './wind/ActRail';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function ProbabilityCoinPage() {
  useDocumentTitle('The Genre Bet · Probability');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [tally, setTally] = useState<SpotifyTally | null>(null);
  const [advance, setAdvance] = useState<AdvanceState | null>(null);

  const restart = () => {
    setAct(1);
    setTally(null);
    setAdvance(null);
  };

  const handleAdvanceStateChange = useCallback((next: AdvanceState) => {
    setAdvance(next);
  }, []);

  // Cross-Act Back fallback
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
        section="The Genre Bet"
        eyebrow="Geometry · Topic 12 · Probability"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="geometry" topic={12} />
            <SeeAllDataLink datasetId="spotify" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <ActRail current={act} step={advance?.step} stepLabels={advance?.stepLabels} />
      <main className="max-w-5xl mx-auto px-6 py-8 xl:ml-80">
        {act === 1 && (
          <SpotifyWonder
            onStart={() => {
              setAct(2);
              setAdvance(null);
            }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 2 && (
          <SpotifyCount
            onNext={(t) => {
              setTally(t);
              setAct(3);
              setAdvance(null);
            }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 3 && tally && (
          <SpotifyClaim
            tally={tally}
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

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('spotify')} pin={{ course: 'geometry', topic: 12 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · 600 songs · Spotify Audio Features · 6 genres, 100 songs each.</div>
          <SeeAllDataLink datasetId="spotify" compact />
        </div>
      </footer>
    </div>
  );
}
