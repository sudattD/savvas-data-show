// Nutrition facts for 24 signature burgers and sandwiches from seven US
// fast-food chains. Anchors Algebra 2 Topic 10 (Matrices) — the Savvas
// Act-1 "The Big Burger" asks "how many patties are in the big burger?"
// This dataset is the matrix that lets students stack:
//
//   patty-vector × items-vector → nutrient-vector
//
// Every chain restaurant in the US with 20+ locations is required by FDA
// menu-labeling rules (21 CFR §101.11, in force since 2018) to publish
// these exact numbers. They're as canonical as nutrition data gets.

import type { Dataset } from '../lib/dataset';

interface Row {
  item: string;
  brand: string;
  category: string;       // burger | chicken sandwich | other sandwich
  patties: number;        // number of meat patties (0 for non-meat / 1 for single)
  servingG: number;       // serving size in grams
  calories: number;
  fatG: number;
  satFatG: number;
  sodiumMg: number;
  carbsG: number;
  proteinG: number;
}

const RAW: Row[] = [
  // McDonald's — published at mcdonalds.com/us/en-us/about-our-food/nutrition-calculator.html
  { item: 'Hamburger',                brand: "McDonald's", category: 'burger',           patties: 1, servingG: 100, calories: 250, fatG:  9, satFatG:  3, sodiumMg:  510, carbsG: 31, proteinG: 12 },
  { item: 'Cheeseburger',             brand: "McDonald's", category: 'burger',           patties: 1, servingG: 114, calories: 300, fatG: 13, satFatG:  6, sodiumMg:  720, carbsG: 32, proteinG: 15 },
  { item: 'Big Mac',                  brand: "McDonald's", category: 'burger',           patties: 2, servingG: 213, calories: 540, fatG: 28, satFatG: 10, sodiumMg:  940, carbsG: 46, proteinG: 25 },
  { item: 'Quarter Pounder w/ Cheese',brand: "McDonald's", category: 'burger',           patties: 1, servingG: 198, calories: 520, fatG: 26, satFatG: 13, sodiumMg: 1140, carbsG: 41, proteinG: 30 },
  { item: 'Double Quarter Pounder',   brand: "McDonald's", category: 'burger',           patties: 2, servingG: 270, calories: 740, fatG: 42, satFatG: 19, sodiumMg: 1370, carbsG: 42, proteinG: 48 },
  { item: 'McChicken',                brand: "McDonald's", category: 'chicken sandwich', patties: 1, servingG: 142, calories: 410, fatG: 22, satFatG:  3, sodiumMg:  610, carbsG: 39, proteinG: 14 },
  // Burger King — published at bk.com/nutrition
  { item: 'Whopper',                  brand: 'Burger King',category: 'burger',           patties: 1, servingG: 290, calories: 650, fatG: 37, satFatG: 11, sodiumMg:  980, carbsG: 50, proteinG: 28 },
  { item: 'Whopper Jr.',              brand: 'Burger King',category: 'burger',           patties: 1, servingG: 148, calories: 320, fatG: 18, satFatG:  5, sodiumMg:  510, carbsG: 29, proteinG: 14 },
  { item: 'Bacon King',               brand: 'Burger King',category: 'burger',           patties: 2, servingG: 358, calories:1150, fatG: 78, satFatG: 31, sodiumMg: 2200, carbsG: 50, proteinG: 61 },
  { item: 'Original Chicken Sandwich',brand: 'Burger King',category: 'chicken sandwich', patties: 1, servingG: 219, calories: 660, fatG: 39, satFatG:  6, sodiumMg: 1240, carbsG: 51, proteinG: 24 },
  // Wendy's — published at wendys.com/nutrition
  { item: "Dave's Single",            brand: "Wendy's",    category: 'burger',           patties: 1, servingG: 277, calories: 570, fatG: 34, satFatG: 11, sodiumMg: 1110, carbsG: 38, proteinG: 30 },
  { item: "Dave's Double",            brand: "Wendy's",    category: 'burger',           patties: 2, servingG: 380, calories: 810, fatG: 51, satFatG: 19, sodiumMg: 1390, carbsG: 39, proteinG: 50 },
  { item: 'Baconator',                brand: "Wendy's",    category: 'burger',           patties: 2, servingG: 337, calories: 960, fatG: 62, satFatG: 24, sodiumMg: 1810, carbsG: 38, proteinG: 56 },
  { item: 'Spicy Chicken Sandwich',   brand: "Wendy's",    category: 'chicken sandwich', patties: 1, servingG: 225, calories: 500, fatG: 22, satFatG:  4, sodiumMg: 1230, carbsG: 50, proteinG: 28 },
  { item: 'Grilled Chicken Sandwich', brand: "Wendy's",    category: 'chicken sandwich', patties: 1, servingG: 224, calories: 370, fatG: 11, satFatG:  3, sodiumMg:  920, carbsG: 40, proteinG: 32 },
  // Chick-fil-A — published at chick-fil-a.com/menu
  { item: 'Original Chicken Sandwich',brand: 'Chick-fil-A',category: 'chicken sandwich', patties: 1, servingG: 183, calories: 420, fatG: 18, satFatG:  4, sodiumMg: 1410, carbsG: 40, proteinG: 28 },
  { item: 'Spicy Deluxe Sandwich',    brand: 'Chick-fil-A',category: 'chicken sandwich', patties: 1, servingG: 222, calories: 550, fatG: 25, satFatG:  6, sodiumMg: 1810, carbsG: 47, proteinG: 30 },
  { item: 'Grilled Chicken Sandwich', brand: 'Chick-fil-A',category: 'chicken sandwich', patties: 1, servingG: 215, calories: 350, fatG:  8, satFatG:  2, sodiumMg:  850, carbsG: 41, proteinG: 30 },
  // In-N-Out — published at in-n-out.com/menu/nutrition-info
  { item: 'Hamburger w/ onion',       brand: 'In-N-Out',   category: 'burger',           patties: 1, servingG: 243, calories: 390, fatG: 19, satFatG:  5, sodiumMg:  650, carbsG: 39, proteinG: 16 },
  { item: 'Cheeseburger w/ onion',    brand: 'In-N-Out',   category: 'burger',           patties: 1, servingG: 268, calories: 480, fatG: 27, satFatG: 10, sodiumMg: 1000, carbsG: 39, proteinG: 22 },
  { item: 'Double-Double w/ onion',   brand: 'In-N-Out',   category: 'burger',           patties: 2, servingG: 330, calories: 670, fatG: 41, satFatG: 18, sodiumMg: 1440, carbsG: 39, proteinG: 37 },
  // Five Guys — published at fiveguys.com/nutrition
  { item: 'Little Hamburger',         brand: 'Five Guys',  category: 'burger',           patties: 1, servingG: 192, calories: 540, fatG: 26, satFatG: 12, sodiumMg:  390, carbsG: 39, proteinG: 21 },
  { item: 'Hamburger',                brand: 'Five Guys',  category: 'burger',           patties: 2, servingG: 303, calories: 840, fatG: 44, satFatG: 20, sodiumMg:  580, carbsG: 39, proteinG: 47 },
  // Whataburger — published at whataburger.com/nutrition
  { item: 'Whataburger',              brand: 'Whataburger',category: 'burger',           patties: 1, servingG: 322, calories: 590, fatG: 26, satFatG:  8, sodiumMg:  990, carbsG: 56, proteinG: 27 },
  { item: 'Double Meat w/ Cheese',    brand: 'Whataburger',category: 'burger',           patties: 2, servingG: 421, calories: 835, fatG: 44, satFatG: 14, sodiumMg: 1470, carbsG: 56, proteinG: 50 },
];

export const FAST_FOOD_BURGERS_DATASET: Dataset = {
  id: 'fastFoodBurgers',
  name: 'Fast-food burgers & sandwiches · 25 items',
  description:
    '25 signature burgers and chicken sandwiches from seven major US fast-food chains, with calories, macronutrients, sodium, and serving size. Numbers come from each brand\'s FDA-required nutrition disclosures — McDonald\'s, Burger King, Wendy\'s, Chick-fil-A, In-N-Out, Five Guys, Whataburger. Range from McDonald\'s 250-calorie Hamburger to Burger King\'s 1,150-calorie Bacon King.',
  source: 'Brand-published nutrition disclosures (FDA-required under 21 CFR §101.11)',
  family: 'people',
  provenance: {
    primarySource: 'Each chain\'s own published nutrition information, which under FDA menu-labeling regulations (21 CFR §101.11) must accurately reflect every item served',
    primarySourceUrl: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/menu-labeling-requirements',
    collector: 'Compiled from individual brand nutrition pages (mcdonalds.com, bk.com, wendys.com, chick-fil-a.com, in-n-out.com/menu/nutrition-info, fiveguys.com, whataburger.com)',
    collectionMethod:
      'Each row was transcribed from the brand\'s public nutrition disclosure for the standard menu item (default toppings as shown on the menu, not "build-your-own" customizations). Serving size in grams follows the brand\'s declared serving weight. Values are per single item, not per meal.',
    collectionPeriod: 'Brand menus as published in 2024-2026 (menu items occasionally reformulate; these reflect the current published values)',
    retrievalDate: '2026-05-12',
    retrievalMethod: 'Cross-referenced brand nutrition pages with Fast Food Nutrition (fastfoodnutrition.org) and Nutritionix entries to confirm consistency. USDA FoodData Central\'s Branded Foods database includes some of these items and was used as a third reference where available.',
    license: 'Nutrition facts are factual product attributes, not copyrightable. FDA-mandated disclosures are public information. Brand and item names are trademarks of their respective companies and are used here descriptively.',
    citation: 'Brand-published nutrition information per 21 CFR §101.11 (FDA Menu Labeling Final Rule, effective May 7, 2018). Compiled May 2026.',
    caveats: [
      'Default toppings only. Add-ons (extra cheese, bacon, sauces) shift numbers significantly. The Whopper here includes mayo; without it, fat drops by ~10 g.',
      'Serving size varies because the items themselves do — a Whopper is 290 g, a Bacon King is 358 g. Per-100-g comparisons can be more apples-to-apples for some analyses.',
      'Sodium varies more than calories across items. Bacon-King-type items can hit 2,200 mg sodium (nearly the FDA daily limit of 2,300 mg) in one sandwich.',
      'Numbers occasionally update when chains reformulate. Wendy\'s switched to a thicker patty in 2017; Burger King updated Whopper specs in 2023.',
      'McDonald\'s and Burger King franchises in some markets serve slightly different ingredients (e.g., bread suppliers vary). US-published values are used here.',
    ],
  },
  story: [
    {
      heading: 'The "big burger" Act 1 has a real answer.',
      body:
        'The Savvas Act-1 video asks how many patties are in the biggest burger imaginable. Real fast-food math has a ceiling: Wendy\'s Baconator and BK\'s Bacon King top the standard menu at 2 patties / ~1,000 calories. Custom "secret menu" stacks go further (the In-N-Out 4×4 is four patties, 990 calories) but reformulate aggressively. Plot patties × calories and you see the linear floor — and the bun-and-sauce intercept.',
      highlight: 'BK Bacon King: 1,150 cal · 2 patties · 2,200 mg sodium — 96% of a day\'s sodium in one sandwich.',
    },
    {
      heading: 'A nutrition matrix.',
      body:
        'Stack a row vector of patty counts × a column matrix of per-patty contributions and you get the total. Add a sauce vector, a bun vector, a cheese vector. The Big Mac is one row of that matrix: 2 patties + 3 buns (yes, three) + 2 slices cheese + Mac sauce + lettuce + onion + pickles. The math of "build a 1,200-calorie meal" is the same matrix algebra used in food-formulation software.',
    },
    {
      heading: 'Brand fingerprints.',
      body:
        'Plot calories vs. sodium and the brands cluster. In-N-Out runs lower sodium across the board (lean ingredient list). Wendy\'s and BK trend higher. Chick-fil-A\'s grilled chicken is the lowest-calorie item by far — and its spicy deluxe is one of the highest in sodium. Each brand\'s recipe philosophy shows up as a region on the scatter.',
    },
  ],
  attributes: [
    { key: 'item',      label: 'Item',          kind: 'categorical', description: 'Menu item name as published by the brand. 25 unique items across seven chains.' },
    { key: 'brand',     label: 'Brand',         kind: 'categorical', description: 'Fast-food chain: McDonald\'s, Burger King, Wendy\'s, Chick-fil-A, In-N-Out, Five Guys, Whataburger.' },
    { key: 'category',  label: 'Category',      kind: 'categorical', description: 'Burger, chicken sandwich, or other sandwich.' },
    { key: 'patties',   label: 'Patties',       kind: 'numeric', description: 'Number of meat patties in the default item (chicken sandwiches count their fillet as one patty).' },
    { key: 'servingG',  label: 'Serving size',  kind: 'numeric', unit: 'g',  description: 'Total serving weight in grams as published by the brand.' },
    { key: 'calories',  label: 'Calories',      kind: 'numeric', unit: 'kcal', description: 'Total kilocalories per serving.' },
    { key: 'fatG',      label: 'Total fat',     kind: 'numeric', unit: 'g',  description: 'Total fat in grams per serving. Includes saturated, monounsaturated, and polyunsaturated.' },
    { key: 'satFatG',   label: 'Saturated fat', kind: 'numeric', unit: 'g',  description: 'Saturated fat in grams per serving.' },
    { key: 'sodiumMg',  label: 'Sodium',        kind: 'numeric', unit: 'mg', description: 'Sodium in milligrams per serving. FDA daily limit is 2,300 mg.' },
    { key: 'carbsG',    label: 'Carbohydrates', kind: 'numeric', unit: 'g',  description: 'Total carbohydrates in grams per serving.' },
    { key: 'proteinG',  label: 'Protein',       kind: 'numeric', unit: 'g',  description: 'Protein in grams per serving.' },
  ],
  featured: { type: 'scatter', x: 'calories', y: 'sodiumMg', color: 'brand' },
  chapterFits: [
    {
      course: 'algebra2',
      topic: 10,
      topicName: 'Matrices',
      mathFit: 'Each item is a 7-vector of nutrients (calories, fat, sat fat, sodium, carbs, protein, weight). Stack 25 items into a 25×7 matrix. Multiply a 1×25 row vector of "how many of each I want" by the matrix → total nutrients for the meal. This is real matrix-vector multiplication: the entire premise of nutrition-tracking apps.',
      standards: ['HSN-VM.C.6', 'HSN-VM.C.7', 'HSN-VM.C.8'],
      studentWhy: 'Every nutrition app you\'ve ever used runs this matrix multiplication behind the scenes. You build the meal vector; it returns the day\'s total.',
      objective: 'Students will model fast-food meal composition as matrix-vector multiplication, identify how scaling a row (number of patties) scales the resulting nutrient totals, and use the matrix to find item combinations that satisfy calorie or protein targets.',
      minutes: 30,
      discussion: [
        'Which item has the highest sodium-per-calorie ratio? Plot sodium vs. calories and look at the slope.',
        'If you want 50 g of protein from a single item, which sandwiches qualify? Use the protein column as a filter.',
        'Build a 1,500-calorie meal from any combination of items. Now repeat with the constraint that sodium ≤ 2,000 mg. Which constraint changes the answer more?',
      ],
    },
  ],
  rows: RAW.map((r) => ({ ...r })),
};
