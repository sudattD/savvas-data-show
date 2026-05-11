import { envisionVideoUrl } from '../data/chapters';
import type { CourseId } from '../data/chapters';

interface Props {
  course: CourseId;
  topic: number;
  /** Tighter visual variant for inline placement. */
  compact?: boolean;
}

// Opens the Savvas-official enVision 3-Act Math video for the matching
// chapter — the same target as the QR code in the printed textbook. New
// tab so the activity context isn't lost.
export default function EnvisionVideoLink({ course, topic, compact = true }: Props) {
  const url = envisionVideoUrl({ course, topic });
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Open the Savvas enVision 3-Act Math video for this chapter"
      className={`inline-flex items-center gap-1.5 text-brand-700 hover:text-accent-700 hover:underline font-semibold ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <span aria-hidden>▶</span>
      <span>enVision 3-Act video</span>
      <span aria-hidden>↗</span>
    </a>
  );
}
