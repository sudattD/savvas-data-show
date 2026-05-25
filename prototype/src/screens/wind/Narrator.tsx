import { useEffect, useState, useSyncExternalStore } from 'react';
import LINES from './narratorLines.json';

// The narrator persona for the Wind Power Curve activity. He guides the
// class through the journey — introducing himself before Act 1, then
// reappearing at key moments. Fictional composite (not based on any real
// NREL engineer) so we can put any classroom-appropriate words in his
// mouth without misrepresenting a real person.
export const NARRATOR = {
  name: 'Dr. Marcus Vela',
  role: 'Wind Energy Engineer · National Renewable Energy Laboratory',
  org: 'NREL',
};

// Stable identifiers for each spoken line. The script that generates audio
// (`scripts/generateWindNarrator.mjs`) writes one MP3 per key into
// `public/audio/wind-narrator/`; the components below load them by key.
export type NarratorLineKey = keyof typeof LINES;

// --------------------------------------------------------------------------
// Global audio player — module-level singleton so two NarratorBubbles can't
// talk over each other. Tapping a 🔊 button stops any other line that's
// currently playing.
// --------------------------------------------------------------------------

const subscribers = new Set<() => void>();
let currentKey: NarratorLineKey | null = null;
let currentAudio: HTMLAudioElement | null = null;

function notify() {
  subscribers.forEach((fn) => fn());
}

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = null;
  currentKey = null;
}

// Start (or restart) playing a given line. Unlike playLine below, this never
// toggles off — if the same key is already playing, it leaves it alone. Used
// for auto-play when a narrator bubble appears on screen.
function ensurePlaying(key: NarratorLineKey) {
  if (currentKey === key) return;
  startLine(key);
}

// Toggle behavior for the "Hear it" button: stop if this key is already
// playing, otherwise start it.
function playLine(key: NarratorLineKey) {
  if (currentKey === key) {
    stopCurrent();
    notify();
    return;
  }
  startLine(key);
}

function startLine(key: NarratorLineKey) {
  stopCurrent();
  const audio = new Audio(`/audio/wind-narrator/${key}.mp3`);
  audio.onended = () => {
    if (currentKey === key) {
      currentKey = null;
      currentAudio = null;
      notify();
    }
  };
  audio.onerror = () => {
    if (currentKey === key) {
      currentKey = null;
      currentAudio = null;
      notify();
      console.warn(
        `Narrator audio missing: /audio/wind-narrator/${key}.mp3 — run \`node scripts/generateWindNarrator.mjs\` to generate it.`,
      );
    }
  };
  currentAudio = audio;
  currentKey = key;
  notify();
  audio.play().catch((e) => {
    console.warn('Narrator audio failed to play:', e);
    if (currentKey === key) {
      currentKey = null;
      currentAudio = null;
      notify();
    }
  });
}

function useNarratorPlayer(key: NarratorLineKey) {
  const current = useSyncExternalStore(
    (fn) => {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    },
    () => currentKey,
    () => null,
  );
  return {
    playing: current === key,
    toggle: () => playLine(key),
  };
}

// --------------------------------------------------------------------------
// Visual components
// --------------------------------------------------------------------------

// Photographic portrait, generated once by scripts/generateWindNarratorPortrait.mjs
// and served as a static asset. The SVG below is kept as a graceful fallback
// for environments where the image hasn't been generated yet (e.g. fresh
// clones before the portrait script has run).
const PORTRAIT_SRC = '/images/narrator/marcus.png';

export function NarratorAvatar({ size = 64 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <NarratorAvatarFallback size={size} />;
  return (
    <img
      src={PORTRAIT_SRC}
      width={size}
      height={size}
      alt={`Portrait of ${NARRATOR.name}`}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover ring-1 ring-sky-200/60"
      style={{ width: size, height: size }}
    />
  );
}

function NarratorAvatarFallback({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Portrait of ${NARRATOR.name}`}
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="50" fill="#e0f2fe" />
      <path
        d="M10,100 L10,92 Q16,82 30,78 L40,77 L60,77 L70,78 Q84,82 90,92 L90,100 Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="0.6"
      />
      <path d="M40,77 L50,84 L60,77 Z" fill="#cbd5e1" />
      <rect x="45" y="64" width="10" height="15" fill="#e8b58c" />
      {/* short hair */}
      <path d="M26,46 Q26,22 50,21 Q74,22 74,46 Q70,36 50,35 Q30,36 26,46 Z" fill="#2b2118" />
      <ellipse cx="50" cy="50" rx="21" ry="24" fill="#e8b58c" />
      <ellipse cx="29" cy="52" rx="2.4" ry="3.3" fill="#d8a37a" />
      <ellipse cx="71" cy="52" rx="2.4" ry="3.3" fill="#d8a37a" />
      {/* brows */}
      <path d="M37,47 Q41,45 45,47" stroke="#2b2118" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55,47 Q59,45 63,47" stroke="#2b2118" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* glasses */}
      <rect x="33" y="51" width="14" height="9" rx="1.5" fill="rgba(255,255,255,0.18)" stroke="#1f2937" strokeWidth="1.3" />
      <rect x="53" y="51" width="14" height="9" rx="1.5" fill="rgba(255,255,255,0.18)" stroke="#1f2937" strokeWidth="1.3" />
      <line x1="47" y1="55.5" x2="53" y2="55.5" stroke="#1f2937" strokeWidth="1.3" />
      <circle cx="40" cy="55.5" r="1.5" fill="#1f2937" />
      <circle cx="60" cy="55.5" r="1.5" fill="#1f2937" />
      {/* smile */}
      <path d="M43,67 Q50,72 57,67" stroke="#7c3a12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Reusable play button. Renders 🔊 / ⏸ based on playback state. Tone
// inverts on dark backgrounds.
function PlayButton({
  lineKey,
  tone = 'light',
}: {
  lineKey: NarratorLineKey;
  tone?: 'light' | 'dark';
}) {
  const { playing, toggle } = useNarratorPlayer(lineKey);
  const palette =
    tone === 'dark'
      ? {
          idle: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
          active: 'bg-sky-300 text-slate-900 border-sky-300 shadow',
        }
      : {
          idle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700',
          active: 'bg-sky-600 text-white border-sky-600 shadow',
        };
  return (
    <button
      onClick={toggle}
      aria-label={playing ? `Stop ${NARRATOR.name} speaking` : `Play ${NARRATOR.name} speaking`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border shrink-0 ${
        playing ? palette.active : palette.idle
      }`}
    >
      <span aria-hidden="true">{playing ? '⏸' : '🔊'}</span>
      <span>{playing ? 'Playing…' : 'Hear it'}</span>
    </button>
  );
}

// Shared autoplay hook — when a narrator bubble appears, Marcus starts
// speaking on his own. Browsers may block the very first attempt before
// any user gesture; subsequent plays after Next/Back navigation work fine.
function useAutoplayOnMount(key: NarratorLineKey) {
  useEffect(() => {
    ensurePlaying(key);
  }, [key]);
}

// The intro card. Big avatar + introduction. Shown once at the very top of
// Act 1. Deliberately does NOT autoplay on launch — Marcus stays quiet until
// the student taps "Hear it".
export function NarratorIntro() {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4 sm:gap-5">
        <NarratorAvatar size={88} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-sky-700">
                MEET YOUR GUIDE
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight mt-0.5">
                {NARRATOR.name}
              </div>
              <div className="text-xs font-semibold text-sky-700">{NARRATOR.role}</div>
            </div>
            <PlayButton lineKey="intro" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mt-3 italic">
            "{LINES.intro}"
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline guidance bubble — narrator's voice attached at a key moment in
// an Act. Uses a light surface with a small avatar chip on the left.
export function NarratorSays({ lineKey }: { lineKey: NarratorLineKey }) {
  useAutoplayOnMount(lineKey);
  return (
    <div className="bg-white border border-sky-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-[10px] font-semibold tracking-widest text-sky-700 leading-tight">
              {NARRATOR.name.toUpperCase()} · {NARRATOR.org}
            </div>
            <PlayButton lineKey={lineKey} />
          </div>
          <div className="text-sm text-ink leading-relaxed mt-1 italic">
            "{LINES[lineKey]}"
          </div>
        </div>
      </div>
    </div>
  );
}

// Dark-theme variant for the Revelation card in Act 3.
export function NarratorSaysDark({ lineKey }: { lineKey: NarratorLineKey }) {
  useAutoplayOnMount(lineKey);
  return (
    <div className="bg-white/5 backdrop-blur border border-white/15 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-[10px] font-semibold tracking-widest text-sky-300 leading-tight">
              {NARRATOR.name.toUpperCase()} · {NARRATOR.org}
            </div>
            <PlayButton lineKey={lineKey} tone="dark" />
          </div>
          <div className="text-sm text-slate-100 leading-relaxed mt-1 italic">
            "{LINES[lineKey]}"
          </div>
        </div>
      </div>
    </div>
  );
}
