import { useCallback, useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import WindWonder from './wind/WindWonder';
import WindInvestigate from './wind/WindInvestigate';
import WindReveal, { WindClosingContext } from './wind/WindReveal';
import type { ClassWonderings } from './wind/WindWonder';
import type { WindSummary } from './wind/WindInvestigate';
import NextRow from './wind/NextRow';
import type { AdvanceState } from './wind/NextRow';
import ActRail from './wind/ActRail';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function WindTurbinePage() {
  useDocumentTitle('Wind Power Curve');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [wonderings, setWonderings] = useState<ClassWonderings | null>(null);
  const [summary, setSummary] = useState<WindSummary | null>(null);
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
        section="Wind Power Curve"
        eyebrow="Algebra 1 · Topic 8 · Quadratic Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={8} />
            <SeeAllDataLink datasetId="wind" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <ActRail current={act} step={advance?.step} stepLabels={advance?.stepLabels} />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <WindWonder
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
          <WindInvestigate
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
          <WindReveal
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
            <WindClosingContext summary={summary} wonderings={wonderings} />
          </div>
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('wind')} pin={{ course: 'algebra1', topic: 8 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · SCADA log from a 1.5 MW operating wind turbine · ~12 hours, one reading per minute.</div>
          <SeeAllDataLink datasetId="wind" compact />
        </div>
      </footer>
    </div>
  );
}
