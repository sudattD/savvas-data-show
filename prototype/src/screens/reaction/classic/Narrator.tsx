import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import LINES from './narratorLines.json';

export const NARRATOR = {
  name: 'Dr. Sarah Reyes',
  role: 'Cognitive Neuroscientist · Perception Lab',
  org: 'Perception Lab',
};

export type NarratorLineKey = keyof typeof LINES;

// --------------------------------------------------------------------------
// Global audio player — module-level singleton so two NarratorBubbles can't
// talk over each other.
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
  const audio = new Audio(`/audio/reaction-narrator/${key}.mp3`);
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
        `Narrator audio missing: /audio/reaction-narrator/${key}.mp3`,
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
// Visual components — purple accent palette matching the reaction theme
// --------------------------------------------------------------------------

const PORTRAIT_SRC = '/images/narrator/reaction.png';

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
      className="shrink-0 rounded-full object-cover ring-1 ring-violet-200/60"
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
      <circle cx="50" cy="50" r="50" fill="#ede9fe" />
      <path
        d="M10,100 L10,92 Q16,82 30,78 L40,77 L60,77 L70,78 Q84,82 90,92 L90,100 Z"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="0.6"
      />
      <path d="M40,77 L50,84 L60,77 Z" fill="#e2e8f0" />
      <rect x="45" y="64" width="10" height="15" fill="#fcd9b6" />
      <path d="M26,46 Q26,22 50,21 Q74,22 74,46 Q70,36 50,35 Q30,36 26,46 Z" fill="#2d1b69" />
      <ellipse cx="50" cy="50" rx="21" ry="24" fill="#fcd9b6" />
      <ellipse cx="29" cy="52" rx="2.4" ry="3.3" fill="#e8b58c" />
      <ellipse cx="71" cy="52" rx="2.4" ry="3.3" fill="#e8b58c" />
      <path d="M37,47 Q41,45 45,47" stroke="#2d1b69" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55,47 Q59,45 63,47" stroke="#2d1b69" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M43,67 Q50,72 57,67" stroke="#7c3a12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

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
          active: 'bg-violet-300 text-slate-900 border-violet-300 shadow',
        }
      : {
          idle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700',
          active: 'bg-violet-600 text-white border-violet-600 shadow',
        };
  return (
    <button
      onClick={toggle}
      aria-label={playing ? `Stop ${NARRATOR.name} speaking` : `Play ${NARRATOR.name} speaking`}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg transition border shrink-0 ${
        playing ? palette.active : palette.idle
      }`}
    >
      <span aria-hidden="true">{playing ? '⏸' : '🔊'}</span>
    </button>
  );
}

function useAutoplayOnMount(key: NarratorLineKey) {
  useEffect(() => {
    ensurePlaying(key);
  }, [key]);
}

export function NarratorIntro() {
  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4 sm:gap-5">
        <NarratorAvatar size={88} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-violet-700">
                MEET YOUR GUIDE
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight mt-0.5">
                {NARRATOR.name}
              </div>
              <div className="text-xs font-semibold text-violet-700">{NARRATOR.role}</div>
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

export function NarratorSays({ lineKey }: { lineKey: NarratorLineKey }) {
  useAutoplayOnMount(lineKey);
  return (
    <div className="bg-white border border-violet-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="text-[10px] font-semibold tracking-widest text-violet-700 leading-tight">
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

export function NarratorDynamicSays({
  text,
  lineKey,
  autoplay = true,
}: {
  text: string;
  lineKey?: NarratorLineKey;
  autoplay?: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keyedPlayer = useNarratorPlayer(lineKey ?? 'intro');
  const hasKeyedAudio = Boolean(lineKey);

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    utteranceRef.current = null;
  };

  const speak = () => {
    if (hasKeyedAudio) {
      keyedPlayer.toggle();
      return;
    }
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    stopCurrent();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggle = () => {
    if (hasKeyedAudio) keyedPlayer.toggle();
    else if (speaking) stop();
    else speak();
  };

  useEffect(() => {
    if (autoplay) speak();
    return () => {
      if (utteranceRef.current) stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, lineKey, autoplay]);

  const isPlaying = hasKeyedAudio ? keyedPlayer.playing : speaking;

  return (
    <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-[10px] font-semibold leading-tight tracking-widest text-violet-700">
              {NARRATOR.name.toUpperCase()} · {NARRATOR.org}
            </div>
            <button
              onClick={toggle}
              aria-label={isPlaying ? `Stop ${NARRATOR.name} speaking` : `Play ${NARRATOR.name} speaking`}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition ${
                isPlaying
                  ? 'border-violet-600 bg-violet-600 text-white shadow'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700'
              }`}
            >
              <span aria-hidden="true">{isPlaying ? '⏸' : '🔊'}</span>
            </button>
          </div>
          <p className="mt-1 text-sm italic leading-relaxed text-ink">"{text}"</p>
        </div>
      </div>
    </div>
  );
}
