import { Link } from 'react-router-dom';
import { getDataset } from '../data/registry';

interface Props {
  datasetId: string;
  /** Optional override; defaults to "See all N readings in the Explorer →". */
  label?: string;
  /** Tighter visual variant for inline placement. */
  compact?: boolean;
}

/** A consistent affordance that lets students/teachers pop out of a guided
 *  lesson or activity into the full Explorer, pre-loaded with the relevant
 *  dataset. Opens in a new tab so the lesson context isn't lost. */
export default function SeeAllDataLink({ datasetId, label, compact = false }: Props) {
  const d = getDataset(datasetId);
  const count = d.rows.length.toLocaleString();
  const text = label ?? `See all ${count} ${rowsNoun(d.id)} in the Explorer`;
  return (
    <Link
      to={`/explorer?dataset=${datasetId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-brand-700 hover:text-accent-700 hover:underline font-semibold ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <span>{text}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}

function rowsNoun(id: string): string {
  switch (id) {
    case 'co2':
      return 'monthly readings';
    case 'wind':
      return 'SCADA readings';
    case 'tides':
      return 'tide readings';
    case 'penguins':
      return 'penguins';
    case 'earthquakes':
      return 'earthquakes';
    case 'hurricanes':
      return 'hurricanes';
    case 'stars':
      return 'stars';
    case 'exoplanets':
      return 'exoplanets';
    case 'neo':
      return 'near-Earth asteroids';
    case 'marathon':
      return 'marathon finishers';
    case 'babyNames':
      return 'name-years';
    case 'population':
      return 'age × sex × year rows';
    case 'moore':
      return 'microprocessors';
    case 'spotify':
      return 'tracks';
    case 'countries':
      return 'countries';
    default:
      return 'rows';
  }
}
