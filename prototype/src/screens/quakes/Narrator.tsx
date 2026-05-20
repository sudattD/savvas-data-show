import { useEffect, useState, useSyncExternalStore } from 'react';
import LINES from './narratorLines.json';

// The narrator persona for the Map Earth's Anger activity. She guides the
// class through the journey — introducing herself before Act 1, then
// reappearing at key moments. Fictional composite (not based on any real
// USGS scientist) so we can put any classroom-appropriate words in her
// mouth without misrepresenting a real person.
export const NARRATOR = {
  name: 'Dr. Maya Chen',
  role: 'Seismologist · U.S. Geological Survey',
};

// Stable identifiers for each spoken line. The script that generates audio
// (`scripts/generateNarrator.mjs`) writes one MP3 per key into
// `public/audio/narrator/`; the components below load them by the same key.
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
  const audio = new Audio(`/audio/narrator/${key}.mp3`);
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
        `Narrator audio missing: /audio/narrator/${key}.mp3 — run \`node scripts/generateNarrator.mjs\` to generate it.`,
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

// Photographic portrait, generated once by scripts/generateNarratorPortrait.mjs
// and served as a static asset. The SVG below is kept as a graceful fallback
// for environments where the image hasn't been generated yet (e.g. fresh
// clones before the portrait script has run).
const PORTRAIT_SRC = '/images/narrator/maya.png';

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
      className="shrink-0 rounded-full object-cover ring-1 ring-amber-200/60"
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
      <circle cx="50" cy="50" r="50" fill="#fef3c7" />
      <path
        d="M10,100 L10,92 Q16,82 30,78 L40,77 L60,77 L70,78 Q84,82 90,92 L90,100 Z"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="0.6"
      />
      <path d="M40,77 L50,84 L60,77 Z" fill="#cbd5e1" />
      <g transform="translate(62,83)">
        <rect width="12" height="7" rx="1.2" fill="#dc2626" />
        <path
          d="M1.5,3.5 L3,2 L4.5,4 L6,2 L7.5,4 L9,2.5 L10.5,3.5"
          stroke="#fef2f2"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <rect x="45" y="65" width="10" height="14" fill="#f0c896" />
      <path d="M22,52 Q22,22 50,20 Q78,22 78,52 L77,68 L23,68 Z" fill="#2a1a0d" />
      <ellipse cx="50" cy="50" rx="22" ry="25" fill="#f0c896" />
      <ellipse cx="29" cy="53" rx="2.5" ry="3.5" fill="#e0b288" />
      <ellipse cx="71" cy="53" rx="2.5" ry="3.5" fill="#e0b288" />
      <path
        d="M27,40 Q30,27 50,25 Q70,27 73,40 Q66,33 50,33 Q34,33 27,40 Z"
        fill="#2a1a0d"
      />
      <path
        d="M37,48 Q41,46 45,48"
        stroke="#2a1a0d"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55,48 Q59,46 63,48"
        stroke="#2a1a0d"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="33"
        y="52"
        width="14"
        height="9"
        rx="1.5"
        fill="rgba(255,255,255,0.18)"
        stroke="#1f2937"
        strokeWidth="1.3"
      />
      <rect
        x="53"
        y="52"
        width="14"
        height="9"
        rx="1.5"
        fill="rgba(255,255,255,0.18)"
        stroke="#1f2937"
        strokeWidth="1.3"
      />
      <line x1="47" y1="56.5" x2="53" y2="56.5" stroke="#1f2937" strokeWidth="1.3" />
      <circle cx="40" cy="56" r="1.5" fill="#1f2937" />
      <circle cx="60" cy="56" r="1.5" fill="#1f2937" />
      <circle cx="34" cy="63" r="2.5" fill="#f4a8a8" opacity="0.4" />
      <circle cx="66" cy="63" r="2.5" fill="#f4a8a8" opacity="0.4" />
      <path
        d="M43,67 Q50,72 57,67"
        stroke="#7c2d12"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
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
          active: 'bg-amber-400 text-slate-900 border-amber-400 shadow',
        }
      : {
          idle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700',
          active: 'bg-rose-600 text-white border-rose-600 shadow',
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

// Shared autoplay hook — when a narrator bubble appears, Maya starts
// speaking on her own. Browsers may block the very first attempt before
// any user gesture; subsequent plays after Next/Back navigation work fine.
function useAutoplayOnMount(key: NarratorLineKey) {
  useEffect(() => {
    ensurePlaying(key);
  }, [key]);
}

// The intro card. Big avatar + introduction. Shown once at the very top of
// Act 1, before the play button.
export function NarratorIntro() {
  useAutoplayOnMount('intro');
  return (
    <div className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4 sm:gap-5">
        <NarratorAvatar size={88} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-amber-700">
                MEET YOUR GUIDE
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight mt-0.5">
                {NARRATOR.name}
              </div>
              <div className="text-xs font-semibold text-rose-700">{NARRATOR.role}</div>
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
    <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 leading-tight">
              {NARRATOR.name.toUpperCase()} · USGS
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
            <div className="text-[10px] font-semibold tracking-widest text-amber-300 leading-tight">
              {NARRATOR.name.toUpperCase()} · USGS
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
