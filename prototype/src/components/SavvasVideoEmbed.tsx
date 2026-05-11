import { useState } from 'react';
import EnvisionVideoLink from './EnvisionVideoLink';
import { videoForChapter } from '../data/envisionVideos';
import type { CourseId } from '../data/chapters';

interface Props {
  course: CourseId;
  topic: number;
}

// Inline player for the Savvas Act-1 video. Lazy: shows a poster JPG until
// the user clicks play, then mounts a <video> pointed at Pearson's CDN. No
// MP4 bytes leave Pearson's servers until intent is expressed.
export default function SavvasVideoEmbed({ course, topic }: Props) {
  const v = videoForChapter(course, topic);
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  if (!v) return null;

  const posterUrl = `/envision-posters/${v.tag}.jpg`;
  const hasDialogue =
    v.spokenTranscript &&
    !v.spokenTranscript.toLowerCase().includes('(no spoken dialogue)');
  const dur = v.durationSec
    ? `${Math.floor(v.durationSec / 60)}:${String(Math.round(v.durationSec % 60)).padStart(2, '0')}`
    : null;

  return (
    <div className="space-y-2">
      <div className="relative rounded-md overflow-hidden bg-slate-900 border border-surface-line aspect-video">
        {playing ? (
          <video
            src={v.videoUrl}
            poster={posterUrl}
            controls
            autoPlay
            preload="metadata"
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group block w-full h-full relative"
            aria-label={`Play "${v.learningObjective}" (${dur || 'short clip'})`}
          >
            <img
              src={posterUrl}
              alt=""
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
              loading="lazy"
            />
            {/* Play affordance */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/95 group-hover:bg-white shadow-lg flex items-center justify-center transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 text-brand-900 fill-current">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </span>
            </span>
            {/* Bottom strip — Savvas attribution + duration */}
            <span className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent flex items-baseline justify-between text-white">
              <span className="text-xs font-semibold opacity-90">enVision · 3-Act Math</span>
              {dur && <span className="text-[11px] font-mono tabular-nums opacity-80">{dur}</span>}
            </span>
          </button>
        )}
      </div>

      <div className="flex items-baseline gap-3 text-[11px] text-ink-muted">
        <span className="italic">"{v.learningObjective}"</span>
        <span className="ml-auto flex items-center gap-3">
          {(hasDialogue || v.onScreenText) && (
            <button
              type="button"
              onClick={() => setShowTranscript((s) => !s)}
              className="text-brand-700 hover:text-accent-700 hover:underline font-semibold"
            >
              {showTranscript ? 'Hide transcript ▴' : 'Transcript ▾'}
            </button>
          )}
          <EnvisionVideoLink course={course} topic={topic} compact />
        </span>
      </div>

      {showTranscript && (
        <div className="bg-surface-subtle/40 border border-surface-line rounded p-3 text-xs text-ink-soft leading-relaxed space-y-2">
          {hasDialogue && (
            <div>
              <div className="eyebrow text-ink-muted text-[10px] mb-1">Spoken</div>
              <p className="whitespace-pre-line">{v.spokenTranscript}</p>
            </div>
          )}
          {v.onScreenText && v.onScreenText.toLowerCase() !== '(none).' && v.onScreenText.toLowerCase() !== '(none)' && (
            <div>
              <div className="eyebrow text-ink-muted text-[10px] mb-1">On-screen text</div>
              <div className="whitespace-pre-line">{v.onScreenText}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
