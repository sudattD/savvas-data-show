# Savvas Data Show — Design Pass

**Reviewer:** Claude (cowork session, 2026-05-10)
**Target demo:** Wednesday 2026-05-13 (Savvas product team)
**Scope:** All public routes of the deployed prototype + the underlying React source.
**Method:** Persona-driven walkthrough of every page; chart rendering verified with browser zoom and console inspection.

---

## TL;DR for Wednesday

You have a polished, publisher-grade editorial shell wrapped around a working CODAP-class explorer and six well-written lessons. The brand identity is the single strongest part of the prototype — Fraunces / Inter / JetBrains Mono with the navy + amber + warm-off-white palette reads as Atlantic-meets-textbook, exactly the tone Savvas needs. The work that's most at risk for Wednesday is **chart rendering correctness in two places** (Wind Turbine Act 1, Explorer default attributes), and a handful of small affordance gaps that will trip first-time users in front of the publisher.

Three demo-day priorities, in order:

1. **Fix the Wind Turbine Act 1 empty chart.** This is the page the deck literally names as "Option A · slot into existing 3-Act." If the reviewers click into it from the home page and see no data dots, the whole pitch wobbles.
2. **Give the Explorer better default X/Y attributes per dataset.** Loading `/explorer?dataset=penguins` and seeing what looks like an empty canvas is the #1 risk for a publisher who clicks around on their own.
3. **Update `document.title` per route.** Every tab in their browser will read "Wind Power Curve" all afternoon. Small thing, but reviewers notice.

The rest of this doc: the four personas I used, a page-by-page walkthrough scored through each persona's eyes, severity-ranked findings, and three redesign mockups for the weakest screens.

See `/Users/dereklomas/philosopherslibrary/savvas_design_pass_2026-05-10.md` for the full version (identical content; this copy lives next to the prototype for project housekeeping).
