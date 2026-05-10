# Design Language — Working Notes

This is a *working* doc. Aesthetic direction is still open. Two reasonable directions:

- **A. Savvas-aligned** — sit inside enVision's existing visual identity so the new feature feels native to the textbook. Conservative pitch.
- **B. Fresh & complementary** — keep some bridging cues but signal "this is a new layer, deliberately modern." Aggressive pitch.

Wednesday plan: lean toward A so it slots in, then show one screen of B as the "and here's what we could push toward."

---

## Notes on Savvas's existing enVision aesthetic

From the Algebra 2 ToC + Topic 1 "Mathematical Modeling in 3 Acts" pages:

### Color palette
- **Deep navy / royal blue** is the dominant brand color. Used for chapter chips (#1A2D4E-ish family) and headings.
- **Amber/gold accent** ("MATHEMATICAL MODELING IN 3 ACTS" badge, the orange dots in the ACT pill).
- **Off-white / pale gray** background pages (slight warm tint).
- **A second, lighter "topic teal"** appears on the TOPIC navigation strip at the bottom of the page (~#127A82).
- Strong type-on-color contrast (white text on navy chips).

### Typography
- Chapter title type is a **clean condensed sans-serif** with a slight humanist flavor — looks like Frutiger / Avenir / DIN-condensed family. Heavy weight on the chapter number and number, semibold on the title.
- "envision" wordmark is a custom italic serif — not for us to copy; treat as their signature.
- Body copy is a **classic textbook serif** for the question prompts ("Many schools and community centers organize…"), pairing with sans for headings.

### Shape & layout
- Chapter chip is a **right-pointing arrow tab** with the number in a contrasting color block. Distinctive shape — copying it would feel imitative; *evoking* it (left-anchored numbered tab) would feel respectful.
- ACT pills are tall blue rectangles with a yellow dot pattern overlay.
- Heavy use of **blue underline rules** between sections.
- Generous white space, multi-column layout in print.

### What I'd port forward (for Wednesday)
- Navy as the dominant brand color (replace current sky/cyan in headers and primary buttons)
- Amber accent for highlighting "Act 2" / "do-this-now" moments
- Numbered chips (left side, contrast color) for chapters/lessons
- Pair sans + serif: sans for chapter/section titles, serif for the host's narrative prompts (the "voice" of the activity)
- Quiet gray-blue background fields, not pure white

### What I'd resist
- Their italic "envision" wordmark style (copyrighted brand)
- The exact arrow-tab chip shape (close to imitation)
- Their amber-dot pill texture (signature Savvas pattern)

### The fresh direction (Option B), if we present it
- Kept: navy base
- Added: bolder editorial type (closer to The Pudding / NYT Upshot vibe)
- Added: more generous typographic hierarchy, a bit more "magazine"
- Visible commitment to data-vis as the centerpiece (chart-as-hero on every page)
- Still recognizably "of" Savvas, but with the energy of a 2026 product

---

## Implementation notes for portability

The current prototype uses Tailwind directly with hard-coded `sky-*` and `slate-*` classes throughout. Before locking in the Savvas-aligned palette, I'll:

1. Create a small set of **semantic Tailwind extensions** — `brand`, `accent`, `surface`, `ink` — and route them through `tailwind.config.js`. So we can swap `bg-sky-600` → `bg-brand-600` once and the whole app retones.
2. Keep typography in two named families: `font-display` (sans) and `font-body` (serif when we add it) — currently both are sans.
3. Confine bespoke gradients to a few decorative spots (home page card headers, host avatars) so a re-skin is shallow.

---

## Open questions for the user

- Do you have a Savvas brand asset kit (style guide, typography license, color hex codes)? If yes, I can match much more precisely.
- Are there *prior Savvas digital products* (Savvas Realize, mySavvasTraining) whose web design we should align to? Their print and web identities can diverge.
- Is there a typeface license you can share? (Frutiger, DIN, Avenir all have commercial licenses.)
