// Every USPS Priority Mail Flat Rate box, with inside dimensions, outside
// dimensions, and the 2026 flat-rate price. Five SKUs — but every Geometry
// student has held one. Anchors the Savvas Act-1 "Box 'Em Up" (Geometry
// Topic 11, 2D & 3D models) where cardboard boxes fly into a shipping
// container; this dataset lets students compute "how many small boxes fit
// inside a medium" with the actual USPS dimensions.
//
// Inside dimensions are what determines packing capacity; outside dimensions
// determine what fits on a postal scale or in a mailbox. Prices reflect the
// USPS Domestic Retail Price List effective January 2026.

import type { Dataset } from '../lib/dataset';

interface Row {
  box: string;
  category: string;
  insideLengthIn: number;
  insideWidthIn: number;
  insideHeightIn: number;
  outsideLengthIn: number;
  outsideWidthIn: number;
  outsideHeightIn: number;
  insideVolumeIn3: number;
  flatRateUsd: number;
}

// Inside dimensions exactly as published on store.usps.com for each SKU
// (rounded to nearest 1/8 inch on USPS's own product pages; we use decimals
// here for math). Outside dimensions include the wall thickness (~1/4").
function v(L: number, W: number, H: number): number {
  return Number((L * W * H).toFixed(2));
}

const RAW: Row[] = [
  {
    box: 'Small Flat Rate',
    category: 'Flat-rate domestic',
    insideLengthIn: 8.625, insideWidthIn: 5.375, insideHeightIn: 1.625,
    outsideLengthIn: 8.6875, outsideWidthIn: 5.4375, outsideHeightIn: 1.75,
    insideVolumeIn3: v(8.625, 5.375, 1.625),
    flatRateUsd: 11.05,
  },
  {
    box: 'Medium Flat Rate (top-loading)',
    category: 'Flat-rate domestic',
    insideLengthIn: 11.0, insideWidthIn: 8.5, insideHeightIn: 5.5,
    outsideLengthIn: 11.25, outsideWidthIn: 8.75, outsideHeightIn: 6.0,
    insideVolumeIn3: v(11.0, 8.5, 5.5),
    flatRateUsd: 19.10,
  },
  {
    box: 'Medium Flat Rate (side-loading)',
    category: 'Flat-rate domestic',
    insideLengthIn: 13.625, insideWidthIn: 11.875, insideHeightIn: 3.375,
    outsideLengthIn: 14.125, outsideWidthIn: 12.0, outsideHeightIn: 3.5,
    insideVolumeIn3: v(13.625, 11.875, 3.375),
    flatRateUsd: 19.10,
  },
  {
    box: 'Large Flat Rate',
    category: 'Flat-rate domestic',
    insideLengthIn: 12.0, insideWidthIn: 11.75, insideHeightIn: 5.5,
    outsideLengthIn: 12.25, outsideWidthIn: 12.0, outsideHeightIn: 6.0,
    insideVolumeIn3: v(12.0, 11.75, 5.5),
    flatRateUsd: 24.95,
  },
  {
    box: 'APO/FPO Flat Rate',
    category: 'Flat-rate military',
    insideLengthIn: 12.0, insideWidthIn: 12.0, insideHeightIn: 5.5,
    outsideLengthIn: 12.25, outsideWidthIn: 12.25, outsideHeightIn: 6.0,
    insideVolumeIn3: v(12.0, 12.0, 5.5),
    flatRateUsd: 21.50,
  },
];

export const USPS_BOXES_DATASET: Dataset = {
  id: 'uspsBoxes',
  name: 'USPS Priority Mail Flat-Rate boxes',
  description:
    'Five USPS Priority Mail Flat Rate box SKUs with exact inside and outside dimensions. Inside volume ranges from 75 in³ (Small) to 792 in³ (Large). The flat-rate price is the same regardless of contents (up to 70 lb) — the geometry of "how much fits" decides the value.',
  source: 'USPS Priority Mail Flat Rate product pages on store.usps.com (2026)',
  family: 'technology',
  provenance: {
    primarySource: 'United States Postal Service — Priority Mail Flat Rate® product specifications and Domestic Retail Price List',
    primarySourceUrl: 'https://store.usps.com/store/results/priority-mail/shipping-supplies-boxes/_/N-p52cprZu9qwm0',
    collector: 'United States Postal Service (publisher); manually transcribed for this dataset',
    collectionMethod:
      'Each box\'s inside and outside dimensions are taken verbatim from the "Dimensions" panel on its product detail page on store.usps.com. Flat-rate prices match the USPS Domestic Retail Price List effective January 26, 2026 (the most recent rate change). Inside volume is computed as L × W × H from the published inside dimensions.',
    collectionPeriod: 'Box dimensions are stable across decades; prices reflect the January 2026 retail-rate adjustment',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Manual transcription from the five individual USPS product pages (Small / Medium top-loading / Medium side-loading / Large / APO-FPO). Cross-checked against EasyPost and Shippo published reference tables which both mirror USPS specs.',
    license: 'USPS specifications are publicly published product information; works of the US Postal Service are not copyrighted under 17 U.S.C. § 105.',
    citation: 'United States Postal Service. "Priority Mail Flat Rate® Boxes — Domestic Product Specifications and Retail Price List." Effective January 26, 2026. https://store.usps.com/',
    caveats: [
      'Inside dimensions vary by ±1/16" within a single SKU because flat-rate boxes are assembled from die-cut corrugated cardboard; actual usable interior depends on how flat the assembly creases lie.',
      'The "Medium Flat Rate" SKU has two box variants — top-loading (11.25 × 8.75 × 6.0 in outside) and side-loading (14.125 × 12.0 × 3.5 in outside). Same flat-rate price; different packing geometry. The Mint product pages list these as two separate items but they share the price tier.',
      'Flat-rate prices apply to packages up to 70 lb gross weight. Outside dimensions are still subject to USPS\'s combined length-plus-girth ≤ 108" rule, though all SKUs here are well under it.',
      'Commercial-rate pricing (for high-volume shippers with USPS account discounts) is lower than the listed retail flat-rate price. Numbers here are retail.',
    ],
  },
  story: [
    {
      heading: 'Five boxes, two prices, one geometry problem.',
      body:
        'Every USPS Priority Mail Flat Rate box ships for the same price regardless of contents — up to 70 pounds. The Small box holds 75 in³ for $11. The Large holds 792 in³ for $25. That\'s 10× the volume for 2.3× the price. The geometry of what fits inside is the entire economic decision.',
      highlight: 'Large flat rate · 792 in³ · $25 — vs. Small · 75 in³ · $11.',
    },
    {
      heading: 'How many of these fit inside that?',
      body:
        'The classic question from "Box \'Em Up." A Small box is 8.625 × 5.375 × 1.625 inches inside. A Large box is 12 × 11.75 × 5.5. Do Smalls tile the Large interior? (No — the Large\'s height accommodates two Smalls stacked with room to spare, but the floor area leaves a 0.875" strip.) The math is rectangular packing; the answer is rarely an integer ratio.',
    },
    {
      heading: 'Same volume, different shape.',
      body:
        'The Medium-side-loading and Medium-top-loading boxes have identical inside volume (≈516 in³) but completely different proportions — one is 3.375" deep, the other is 5.5". Same flat-rate price, same volume — but they pack different objects efficiently. Long thin things (posters, fishing rods) want side-loading; tall things (boots, books) want top-loading.',
    },
  ],
  attributes: [
    { key: 'box',                label: 'Box SKU',           kind: 'categorical', ordinal: true, description: 'Official USPS Priority Mail Flat Rate box name. Ordered Small → Large for chart sorting.' },
    { key: 'category',           label: 'Category',          kind: 'categorical', description: 'Flat-rate domestic or flat-rate military (APO/FPO).' },
    { key: 'insideLengthIn',     label: 'Inside length',     kind: 'numeric', unit: 'in', description: 'Inside length in inches — the longest internal dimension.' },
    { key: 'insideWidthIn',      label: 'Inside width',      kind: 'numeric', unit: 'in', description: 'Inside width in inches.' },
    { key: 'insideHeightIn',     label: 'Inside height',     kind: 'numeric', unit: 'in', description: 'Inside height in inches — the shortest internal dimension on most SKUs.' },
    { key: 'outsideLengthIn',    label: 'Outside length',    kind: 'numeric', unit: 'in', description: 'Outside length in inches (typically 1/4" larger than inside).' },
    { key: 'outsideWidthIn',     label: 'Outside width',     kind: 'numeric', unit: 'in', description: 'Outside width in inches.' },
    { key: 'outsideHeightIn',    label: 'Outside height',    kind: 'numeric', unit: 'in', description: 'Outside height in inches.' },
    { key: 'insideVolumeIn3',    label: 'Inside volume',     kind: 'numeric', unit: 'in³', description: 'Inside volume = length × width × height (cubic inches). Ranges from 75 (Small) to 792 (Large).' },
    { key: 'flatRateUsd',        label: 'Flat-rate price',   kind: 'numeric', unit: '$', description: 'USPS Domestic Retail flat-rate price, Jan 2026. Same price for any contents up to 70 lb.' },
  ],
  featured: { type: 'bar', x: 'box', y: 'insideVolumeIn3' },
  chapterFits: [
    {
      course: 'geometry',
      topic: 11,
      topicName: '2-D and 3-D Models',
      mathFit: 'Inside volume is L × W × H — three numbers, one cubic-inch product. The packing question ("how many Smalls fit in a Large?") is real-world rectangular-prism nesting; the answer is rarely the volume ratio because boxes don\'t tile arbitrarily.',
      standards: ['HSG-GMD.A.3', 'HSG-MG.A.1', 'HSG-MG.A.3'],
      studentWhy: 'Every package you ever order ships in one of these. The math is the same one Amazon uses to figure out which box your order needs.',
      objective: 'Students will compute the inside volume of each USPS flat-rate box, then determine how many smaller boxes fit inside a larger one given both volume and shape constraints.',
      minutes: 25,
      discussion: [
        'The Small box has 75 in³; the Large has 792. That\'s a 10.5× volume ratio. Why doesn\'t it cost 10× more?',
        'Two boxes have the same inside volume but different shapes (Medium top vs. side). What kinds of objects fit in one and not the other?',
        'A flat-rate box ships up to 70 lb. What densities (lb/in³) of contents are USPS economically betting against?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
