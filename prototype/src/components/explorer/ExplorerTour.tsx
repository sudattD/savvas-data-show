import { useEffect, useLayoutEffect, useState } from 'react';

// A short, scripted walkthrough that overlays the Explorer. The tour drives
// the underlying view (dataset, chart config) via the setters passed in by
// ExplorerPage, so each stop lands on something visually concrete. When the
// tour ends, the overlay unmounts and the user is left wherever the last
// step put them — free to keep exploring.
//
// Activated via `?tour=1` on /explorer. See ExplorerPage for the wiring.

export type TourStep = {
  title: string;
  /** Optional lead paragraph. Pair with `points` for bulleted observations. */
  body?: string;
  /** Bulleted observations (2-3 short lines, rendered as a list). */
  points?: string[];
  /** CSS selector for the element to spotlight. Omit for a centered card. */
  selector?: string;
  /** Optional state mutation when the step opens (switch dataset, change chart, etc.). */
  setup?: () => void;
  /** Override the "Next" button label (used for the final step). */
  cta?: string;
  /** Eyebrow override (defaults to "Stop N"). Useful for "Dataset 2 of 4". */
  eyebrow?: string;
};

type Props = {
  steps: TourStep[];
  onClose: () => void;
};

export default function ExplorerTour({ steps, onClose }: Props) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[i];

  useEffect(() => {
    step.setup?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!step.selector) {
        setRect(null);
        return;
      }
      // Wait a tick for the DOM to settle after setup() may have changed it.
      requestAnimationFrame(() => {
        const el = document.querySelector(step.selector!) as HTMLElement | null;
        if (el) {
          setRect(el.getBoundingClientRect());
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else {
          setRect(null);
        }
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [i, step.selector]);

  const isFirst = i === 0;
  const isLast = i === steps.length - 1;

  const cardStyle = positionCard(rect);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Backdrop rect={rect} />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-brand-900 text-white text-[11px] font-mono tracking-wider pointer-events-auto shadow-lg">
        Tour · stop {i + 1} of {steps.length}
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-surface-raised/95 border border-surface-line text-xs text-ink hover:bg-surface-raised shadow-lg pointer-events-auto"
      >
        Skip tour
      </button>

      <div
        style={cardStyle}
        className="absolute w-[340px] bg-surface-raised border-2 border-accent-400 rounded-xl shadow-2xl p-5 pointer-events-auto"
      >
        <div className="eyebrow text-accent-700 mb-1">
          {step.eyebrow ?? (isLast ? 'Last stop' : `Stop ${i + 1}`)}
        </div>
        <h3 className="font-display text-lg font-bold text-brand-900 mb-2 leading-snug">{step.title}</h3>
        {step.body && <p className="text-sm text-ink-soft leading-relaxed mb-3">{step.body}</p>}
        {step.points && step.points.length > 0 && (
          <ul className="text-sm text-ink-soft leading-relaxed mb-4 space-y-1.5 list-none">
            {step.points.map((p, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-accent-500 font-bold mt-px">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-1 flex items-center justify-between">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={isFirst}
            className="text-xs text-ink-muted hover:text-ink disabled:opacity-30 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => (isLast ? onClose() : setI(i + 1))}
            className="px-4 py-2 rounded-md bg-accent-500 text-white text-sm font-bold hover:bg-accent-600 transition shadow"
          >
            {isLast ? (step.cta ?? 'Start exploring →') : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function positionCard(rect: DOMRect | null): React.CSSProperties {
  if (!rect) {
    return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  }
  const margin = 20;
  const cardW = 340;
  const cardH = 220;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  // Prefer right of the target, then left, then below.
  let left = rect.right + margin;
  let top = rect.top + rect.height / 2 - cardH / 2;

  if (left + cardW > winW - margin) {
    left = rect.left - margin - cardW;
    if (left < margin) {
      left = Math.max(margin, Math.min(rect.left, winW - cardW - margin));
      top = rect.bottom + margin;
      if (top + cardH > winH - margin) {
        top = Math.max(margin, rect.top - cardH - margin);
      }
    }
  }
  top = Math.max(margin, Math.min(top, winH - cardH - margin));
  left = Math.max(margin, Math.min(left, winW - cardW - margin));
  return { left, top, transform: 'none' };
}

function Backdrop({ rect }: { rect: DOMRect | null }) {
  if (!rect) {
    return <div className="absolute inset-0 bg-brand-900/55" />;
  }
  const pad = 8;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const right = Math.min(window.innerWidth, rect.right + pad);
  const bottom = Math.min(window.innerHeight, rect.bottom + pad);
  const dim = 'absolute bg-brand-900/55';
  return (
    <>
      <div className={dim} style={{ top: 0, left: 0, right: 0, height: top }} />
      <div className={dim} style={{ top, left: 0, width: left, height: bottom - top }} />
      <div className={dim} style={{ top, left: right, right: 0, height: bottom - top }} />
      <div className={dim} style={{ top: bottom, left: 0, right: 0, bottom: 0 }} />
      <div
        className="absolute rounded-lg ring-4 ring-accent-400 pointer-events-none"
        style={{ top, left, width: right - left, height: bottom - top }}
      />
    </>
  );
}
