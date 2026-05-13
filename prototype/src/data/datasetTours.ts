import type { TourStep } from '../components/explorer/ExplorerTour';

// Per-dataset onboarding tours. Each script runs INSIDE a single dataset —
// it spotlights pieces of the Explorer UI and offers 2-3 short observations
// to help a first-time visitor get situated. The tour never switches dataset.
//
// To add a tour for a new dataset, push a new entry keyed by dataset id. If
// no entry exists, no tour is shown for that dataset.
export const DATASET_TOURS: Record<string, TourStep[]> = {
  moore: [
    {
      eyebrow: 'Get situated · 1 of 3',
      title: 'Each dot is one chip',
      selector: '[data-tour="chart"]',
      points: [
        'Year on X, transistors per chip on Y.',
        '~190 microprocessors, from the 1971 Intel 4004 onward.',
        'Color groups them by decade.',
      ],
    },
    {
      eyebrow: '2 of 3',
      title: 'The Y-axis is log',
      selector: '[data-tour="toolbar"]',
      points: [
        'Each gridline is 10×, not +10.',
        'A straight diagonal here means exponential growth.',
        'Flip to linear (toolbar) — it becomes a hockey stick.',
      ],
    },
    {
      eyebrow: '3 of 3',
      title: 'Try just one maker',
      selector: '[data-tour="filters"]',
      points: [
        'Toggle Intel only and see if the doubling still holds.',
        'Or filter by decade to compare eras.',
      ],
      cta: 'Got it →',
    },
  ],
};
