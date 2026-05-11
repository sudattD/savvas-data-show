// Companion lessons are the 6 transferable-concept lessons that aren't bound
// to any single chapter — students get value pairing them with the relevant
// chapter activity. (The other three /lessons/* items — Rare Disease,
// Crack the Headline, Hit the Target — are themselves chapter activities and
// are not surfaced here.)

import type { ChapterEntry, FormatCode } from './chapters';

export interface CompanionLesson {
  id: string;        // lesson route slug
  number: string;    // L1, L2 etc.
  title: string;
  concept: string;
  duration: string;
  family: 'Visual deception' | 'Statistical thinking' | 'Data hygiene';
}

export const COMPANION_LESSONS: CompanionLesson[] = [
  { id: 'slider-of-lies',   number: 'L1', title: 'The Slider of Lies',                concept: 'Truncated y-axis',       duration: '~4 min', family: 'Visual deception' },
  { id: 'walk-into-a-bar',  number: 'L2', title: 'A Billionaire Walks Into a Bar',    concept: 'Mean vs median',          duration: '~3 min', family: 'Statistical thinking' },
  { id: 'tidy-data',        number: 'L3', title: 'Tidy Data',                          concept: 'Wide vs long format',     duration: '~5 min', family: 'Data hygiene' },
  { id: 'csv-from-hell',    number: 'L4', title: 'The CSV from Hell',                  concept: 'Real-world data cleaning', duration: '~6 min', family: 'Data hygiene' },
  { id: 'pick-your-story',  number: 'L5', title: 'Pick Your Story',                    concept: 'Cherry-picked windows',    duration: '~4 min', family: 'Visual deception' },
  { id: 'survivorship-bias', number: 'L6', title: "The Bullet Holes That Aren't There", concept: 'Survivorship bias',       duration: '~5 min', family: 'Visual deception' },
];

const BY_ID: Record<string, CompanionLesson> = Object.fromEntries(COMPANION_LESSONS.map((l) => [l.id, l]));

const STUDENT_DATA_FORMATS: FormatCode[] = ['SEN', 'POL', 'IMP', 'TML'];
const TIDY_FORMATS: FormatCode[] = ['SEN', 'POL', 'IMP'];

// Datasets that arrive as a trend over time — y-axis truncation can lie,
// chosen-window cherry-picking can flip the headline.
const TREND_DATASETS = new Set(['co2', 'moore', 'population', 'marathon', 'hurricanes', 'tides', 'babyNames', 'earthquakes']);

// Datasets that only include the ones that "made it" — the missing entries
// matter as much as the visible ones.
const SELECTION_BIAS_DATASETS = new Set(['marathon', 'spotify', 'neo', 'exoplanets']);

export interface CompanionMatch {
  lesson: CompanionLesson;
  reason: string;
}

export function companionLessonsFor(c: ChapterEntry): CompanionMatch[] {
  const matches: CompanionMatch[] = [];

  if (c.datasets.some((d) => TREND_DATASETS.has(d))) {
    matches.push({
      lesson: BY_ID['slider-of-lies'],
      reason: 'Trend charts here are easy to lie with — a truncated y-axis changes the story.',
    });
    matches.push({
      lesson: BY_ID['pick-your-story'],
      reason: 'Trend rates change with the chosen window — cherry-picked windows matter.',
    });
  }

  if (c.format.includes('TML') || /statistic|data analysis|probability/i.test(c.topicName)) {
    matches.push({
      lesson: BY_ID['walk-into-a-bar'],
      reason: 'When you compute a mean here, the median may tell a different story.',
    });
  }

  if (c.format.some((f) => STUDENT_DATA_FORMATS.includes(f))) {
    matches.push({
      lesson: BY_ID['tidy-data'],
      reason: 'Student-collected data lands messy — tidy format unlocks the chart.',
    });
  }

  if (c.format.some((f) => TIDY_FORMATS.includes(f))) {
    matches.push({
      lesson: BY_ID['csv-from-hell'],
      reason: 'Real-world data needs cleaning before it can be modeled.',
    });
  }

  if (c.datasets.some((d) => SELECTION_BIAS_DATASETS.has(d))) {
    matches.push({
      lesson: BY_ID['survivorship-bias'],
      reason: 'This dataset only includes the ones that "made it" — what\'s missing matters.',
    });
  }

  return matches;
}
