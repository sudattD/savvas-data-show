import { useEffect, useState, useSyncExternalStore } from 'react';
import LINES from './narratorLines.json';

export const NARRATOR = {
  name: 'Dr. Lena Vasquez',
  role: 'Speech Scientist · Acoustics Lab',
  org: 'Acoustics Lab',
};

export type NarratorLineKey = keyof typeof LINES;

// --------------------------------------------------------------------------
// Global audio player — module-level singleton
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

function ensurePlaying(key: NarratorLineKey) {
  if (currentKey === key) return;
  startLine(key);
}

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
  const audio = new Audio(`/audio/voice-narrator/${key}.mp3`);
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
      console.warn(`Narrator audio missing: /audio/voice-narrator/${key}.mp3`);
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
    (fn) => { subscribers.add(fn); return () => { subscribers.delete(fn); }; },
    () => currentKey,
    () => null,
  );
  return { playing: current === key, toggle: () => playLine(key) };
}

// --------------------------------------------------------------------------
// Visual components — purple/pink accent palette
// --------------------------------------------------------------------------

const PORTRAIT_SRC = '/images/narrator/voice.png';

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
      className="shrink-0 rounded-full object-cover ring-1 ring-purple-200/60"
      style={{ width: size, height: size }}
    />
  );
}

function NarratorAvatarFallback({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`Portrait of ${NARRATOR.name}`} className="shrink-0">
      <circle cx="50" cy="50" r="50" fill="#f3e8ff" />
      <path d="M10,100 L10,92 Q16,82 30,78 L40,77 L60,77 L70,78 Q84,82 90,92 L90,100 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6" />
      <path d="M40,77 L50,84 L60,77 Z" fill="#e2e8f0" />
      <rect x="45" y="64" width="10" height="15" fill="#fcd9b6" />
      <path d="M26,46 Q26,22 50,21 Q74,22 74,46 Q70,36 50,35 Q30,36 26,46 Z" fill="#3b0764" />
      <ellipse cx="50" cy="50" rx="21" ry="24" fill="#fcd9b6" />
      <ellipse cx="29" cy="52" rx="2.4" ry="3.3" fill="#e8b58c" />
      <ellipse cx="71" cy="52" rx="2.4" ry="3.3" fill="#e8b58c" />
      <path d="M37,47 Q41,45 45,47" stroke="#3b0764" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55,47 Q59,45 63,47" stroke="#3b0764" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M43,67 Q50,72 57,67" stroke="#7c3a12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PlayButton({ lineKey, tone = 'light' }: { lineKey: NarratorLineKey; tone?: 'light' | 'dark' }) {
  const { playing, toggle } = useNarratorPlayer(lineKey);
  const palette = tone === 'dark'
    ? { idle: 'bg-white/10 text-white border-white/20 hover:bg-white/20', active: 'bg-purple-300 text-slate-900 border-purple-300 shadow' }
    : { idle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700', active: 'bg-purple-600 text-white border-purple-600 shadow' };
  return (
    <button
      onClick={toggle}
      aria-label={playing ? `Stop ${NARRATOR.name} speaking` : `Play ${NARRATOR.name} speaking`}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg transition border shrink-0 ${playing ? palette.active : palette.idle}`}
    >
      <span aria-hidden="true">{playing ? '⏸' : '🔊'}</span>
    </button>
  );
}

function useAutoplayOnMount(key: NarratorLineKey) {
  useEffect(() => { ensurePlaying(key); }, [key]);
}

export function NarratorIntro() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4 sm:gap-5">
        <NarratorAvatar size={88} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-purple-700">MEET YOUR GUIDE</div>
              <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight mt-0.5">{NARRATOR.name}</div>
              <div className="text-xs font-semibold text-purple-700">{NARRATOR.role}</div>
            </div>
            <PlayButton lineKey="intro" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mt-3 italic">"{LINES.intro}"</p>
        </div>
      </div>
    </div>
  );
}

export function NarratorSays({ lineKey }: { lineKey: NarratorLineKey }) {
  useAutoplayOnMount(lineKey);
  return (
    <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-[10px] font-semibold tracking-widest text-purple-700 leading-tight">
              {NARRATOR.name.toUpperCase()} · {NARRATOR.org}
            </div>
            <PlayButton lineKey={lineKey} />
          </div>
          <div className="text-sm text-ink leading-relaxed mt-1 italic">"{LINES[lineKey]}"</div>
        </div>
      </div>
    </div>
  );
}
