// PROTOTYPE scene kit — shared chrome for the virus-stage-styled Wind Power
// Curve scenes. The 3-Act spine is the base (see memory: acts-are-the-base):
// every scene renders inside <SceneFrame>, which always shows the Act rail.
//
// <SceneFrame> also drives the cinematic between-scene pause: on every scene
// change it shows the crisp, themed backdrop full-screen with the scene title
// for a beat, then blurs it back and fades the scene content in.

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { NarratorAvatar, NARRATOR } from '../Narrator';
import { SceneBackdrop } from './backdrops';
import type { BackdropVariant } from './backdrops';

// --------------------------------------------------------------------------
// The 3-Act spine.
// --------------------------------------------------------------------------

export const ACTS = [
  { id: 1, name: 'Notice & Wonder', short: 'Wonder' },
  { id: 2, name: 'Investigate', short: 'Investigate' },
  { id: 3, name: 'Reveal', short: 'Reveal' },
] as const;

// --------------------------------------------------------------------------
// Glossary — inline definitions surfaced on hover/tap, virus-stage style.
// --------------------------------------------------------------------------

export const GLOSSARY: Record<string, string> = {
  'power curve':
    'A power curve shows how much electrical power a turbine produces at each wind speed.',
  SCADA:
    'SCADA (Supervisory Control and Data Acquisition) is the system that logs a turbine’s sensor readings, minute by minute.',
  'rated power':
    'Rated power is the maximum power a turbine is designed to produce. Above a certain wind speed it holds flat at this ceiling.',
  'cut-in speed':
    'The cut-in speed is the lowest wind speed at which a turbine starts generating usable power.',
};

export function Term({ children }: { children: keyof typeof GLOSSARY }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-semibold text-sky-700 underline decoration-dotted decoration-sky-400 underline-offset-2"
      >
        {children}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-relaxed text-slate-100 shadow-xl">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-sky-300">
            {children}
          </span>
          {GLOSSARY[children]}
        </span>
      )}
    </span>
  );
}

// --------------------------------------------------------------------------
// Narrator bubble — single character (Dr. Marcus Vela), click-to-play audio.
// --------------------------------------------------------------------------

export function NarratorBubble({
  line,
  audioSrc,
  avatarSize = 56,
}: {
  line: string;
  /** Optional — when omitted, the bubble shows no "Hear it" button. Used by
   *  scenes whose narration hasn't been voiced yet. */
  audioSrc?: string;
  avatarSize?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    audioRef.current = audio;
    setPlaying(false);
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.currentTime = 0;
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <div className="rounded-2xl border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur">
      <div className="flex items-start gap-3">
        <NarratorAvatar size={avatarSize} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="font-display text-base font-bold leading-tight text-ink">
                {NARRATOR.name}
              </div>
              <div className="text-[11px] font-semibold text-sky-700">{NARRATOR.role}</div>
            </div>
            {audioSrc && (
              <button
                onClick={toggle}
                aria-label={playing ? 'Stop narrator' : 'Play narrator'}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  playing
                    ? 'border-sky-600 bg-sky-600 text-white shadow'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <span aria-hidden="true" className="w-4 h-4">
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm italic leading-relaxed text-slate-700">“{line}”</p>
    </div>
  );
}

// --------------------------------------------------------------------------
// About / Help scaffolding — virus-stage's blue/purple on-demand panels.
// --------------------------------------------------------------------------

type PanelKind = 'about' | 'help';
const PANEL_META: Record<PanelKind, { accent: string }> = {
  about: { accent: '#006BE0' },
  help: { accent: '#A22DDC' },
};

export function ScaffoldButtons({
  about,
  help,
}: {
  about?: { heading: string; body: ReactNode };
  help?: { heading: string; body: ReactNode };
}) {
  const [open, setOpen] = useState<PanelKind | null>(null);
  const content = open === 'about' ? about : open === 'help' ? help : null;
  return (
    <>
      <div className="flex shrink-0 gap-2">
        {about && (
          <button
            onClick={() => setOpen('about')}
            className="rounded-full border border-[#006BE0]/30 bg-[#006BE0]/10 px-3 py-1.5 text-xs font-bold text-[#006BE0] hover:bg-[#006BE0]/20"
          >
            ⓘ About
          </button>
        )}
        {help && (
          <button
            onClick={() => setOpen('help')}
            className="rounded-full border border-[#A22DDC]/30 bg-[#A22DDC]/10 px-3 py-1.5 text-xs font-bold text-[#A22DDC] hover:bg-[#A22DDC]/20"
          >
            ? Help
          </button>
        )}
      </div>
      {open && content && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3
                className="font-display text-lg font-bold"
                style={{ color: PANEL_META[open].accent }}
              >
                {content.heading}
              </h3>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close panel"
                className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <div
              className="mt-3 border-l-4 pl-4 text-sm leading-relaxed text-slate-700"
              style={{ borderColor: PANEL_META[open].accent }}
            >
              {content.body}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --------------------------------------------------------------------------
// SceneFrame — themed backdrop + between-scene pause + Act rail + footer.
// --------------------------------------------------------------------------

export function SceneFrame({
  act,
  step,
  stepTotal,
  sceneTitle,
  variant,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled = false,
  nextHint,
}: {
  act: number;
  step: number;
  stepTotal: number;
  sceneTitle: string;
  variant: BackdropVariant;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  nextHint?: string;
}) {
  const actMeta = ACTS[act - 1];

  // Three-stage transition on step change:
  // 1. crisp backdrop + title card (holds 1.2s)
  // 2. backdrop fades out + title fades out (0.4s)
  // 3. scene content fades in (0.4s)
  const [stage, setStage] = useState<'backdrop' | 'fade' | 'scene'>('backdrop');
  useEffect(() => {
    setStage('backdrop');
    const t1 = window.setTimeout(() => setStage('fade'), 1200);
    const t2 = window.setTimeout(() => setStage('scene'), 1600);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [step]);
  const showing = stage;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Backdrop — crisp during backdrop stage, blurred after */}
      <div
        className={`fixed inset-0 -z-10 transition-all duration-[400ms] ease-out ${
          showing === 'backdrop' ? 'scale-100 blur-0' : 'scale-101 blur-[2px]'
        }`}
      >
        <SceneBackdrop variant={variant} />
      </div>

      {/* Between-scene title card — shown during backdrop stage, fades out */}
      <div
        className={`pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center text-center transition-opacity duration-[400ms] ${
          showing === 'scene' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-white/85 drop-shadow">
          Act {act} · {actMeta.name}
        </div>
        <div className="mt-3 font-display text-5xl font-extrabold text-white drop-shadow-2xl sm:text-6xl">
          {sceneTitle}
        </div>
        <div className="mt-4 h-px w-28 bg-white/50" />
        <div className="mt-3 text-sm font-semibold text-white/70 drop-shadow">
          Scene {step} of {stepTotal}
        </div>
      </div>

      {/* Scene content — fades in after backdrop+fade stages */}
      <div
        className={`relative z-10 mx-auto flex min-h-screen max-w-[1680px] flex-col px-8 pt-6 pb-28 transition-all duration-[400ms] ${
          showing === 'scene' ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-hidden={showing !== 'scene'}
      >
        {/* Act rail — the spine */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/70 p-1.5 backdrop-blur">
            {ACTS.map((a) => {
              const state = a.id === act ? 'current' : a.id < act ? 'done' : 'upcoming';
              return (
                <span
                  key={a.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide transition ${
                    state === 'current'
                      ? 'bg-sky-500 text-white'
                      : state === 'done'
                        ? 'text-sky-300'
                        : 'text-white/40'
                  }`}
                >
                  <span className="opacity-70">ACT {a.id}</span>
                  <span>{a.short}</span>
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-950">
              Prototype
            </span>
            <a
              href="/explorer?datasetId=wind"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3 w-3" aria-hidden="true">
                <circle cx={6.5} cy={6.5} r={4.5} />
                <path d="M10 10l4 4" strokeLinecap="round" />
              </svg>
              Explore the data
            </a>
          </div>
        </div>

        {/* Scene title — named as a step within its Act */}
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="rounded-md bg-sky-600 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
            ACT {act} · {actMeta.name.toUpperCase()}
          </span>
          <h1 className="font-display text-xl font-bold text-white drop-shadow">{sceneTitle}</h1>
          <span className="text-xs font-semibold text-white/70 drop-shadow">
            Scene {step} of {stepTotal}
          </span>
        </div>

        {/* Body */}
        <div className="mt-4 flex flex-1 flex-col">{children}</div>

        {/* Footer Back / Next */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            disabled={!onBack || showing !== 'scene'}
            aria-label={`Back to ${backLabel.toLowerCase()}`}
            className="rounded-full border border-white/40 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white disabled:text-slate-400 disabled:hover:bg-white/70"
          >
            ← {backLabel}
          </button>
          <span className="text-xs font-medium text-white/85 drop-shadow">
            {nextDisabled && nextHint ? nextHint : ''}
          </span>
          <button
            onClick={onNext}
            disabled={!onNext || nextDisabled || showing !== 'scene'}
            aria-label={onNext ? `Next: ${nextLabel}` : 'Next'}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-500 disabled:bg-slate-400/70 disabled:shadow-none"
          >
            {nextLabel} →
          </button>
        </div>
      </div>
    </div>
  );
}
