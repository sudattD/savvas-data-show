export interface VowelRef {
  id: string;
  letter: string;
  ipa: string;
  exampleWord: string;
  audioUrl: string;
  description: string;
  // Hint about what to look for — pedagogical caption.
  formantHint: string;
  // Approx formant frequencies (Hz, adult male average from Peterson & Barney
  // and similar references). Used to tell students roughly where to look.
  formants: { F1: number; F2: number };
}

const REF_AH: VowelRef = {
  id: 'ah',
  letter: 'AH',
  ipa: '[a]',
  exampleWord: 'father',
  audioUrl: '/voice/vowel-ah.mp3',
  description: 'Open front unrounded',
  formantHint: 'Two bands sitting fairly close together, both in the lower half.',
  formants: { F1: 730, F2: 1090 },
};

const REF_EE: VowelRef = {
  id: 'ee',
  letter: 'EE',
  ipa: '[i]',
  exampleWord: 'see',
  audioUrl: '/voice/vowel-ee.mp3',
  description: 'Close front unrounded',
  formantHint: 'One low band, one much higher band — big gap between them.',
  formants: { F1: 270, F2: 2290 },
};

const REF_OO: VowelRef = {
  id: 'oo',
  letter: 'OO',
  ipa: '[u]',
  exampleWord: 'boot',
  audioUrl: '/voice/vowel-oo.mp3',
  description: 'Close back rounded',
  formantHint: 'Two low bands, stacked close to the bottom.',
  formants: { F1: 300, F2: 870 },
};

// Step order matches the script: AH → EE → OO → EE (repeat to test consistency).
export const VOWEL_LADDER: VowelRef[] = [
  REF_AH,
  REF_EE,
  REF_OO,
  { ...REF_EE, id: 'ee2', description: 'Repeat — does it look the same as before?' },
];

export const VOWEL_AUDIO_ATTRIBUTION = {
  recorder: 'Denelson83',
  license: 'CC BY-SA 3.0',
  source: 'Wikimedia Commons',
  sourceUrl: 'https://commons.wikimedia.org/wiki/Category:IPA_audio',
};
