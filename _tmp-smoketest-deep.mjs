// Deep smoke-test: try to advance each walkthrough through 3 acts using
// generic next-button heuristics. Records each step's outcome.
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://prototype-five-iota.vercel.app';

const ROUTES = [
  '/constellation',
  '/kepler',
  '/map-earths-anger',
  '/doubling-time',
  '/hurricane-coin',
  '/inverse-square',
];

// Heuristic: a button that advances the act. Match common patterns in
// this codebase: "Next:", "Build", "Interpret", "Continue", "Reveal",
// "→", and explicit Act-2/Act-3 labels.
const ADVANCE_RE = /next:|next →|continue|build a model|interpret|reveal|→\s*$|act\s*[23]/i;
// A "loop closed" indicator — Act 3 typically shows these.
const ACT3_RE = /start over|restart|begin again|reset|save to notebook/i;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
});

const results = [];
for (const path of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  const steps = [];
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1000));

    for (let act = 1; act <= 3; act++) {
      const bodySnap = await page.evaluate(() => document.body.innerText.slice(0, 200));
      // Look for an advance button.
      const found = await page.evaluate((reSrc) => {
        const re = new RegExp(reSrc, 'i');
        const btns = Array.from(document.querySelectorAll('button, a'));
        for (const b of btns) {
          const t = (b.innerText || '').trim();
          if (t && re.test(t) && !b.disabled) {
            const rect = b.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return { text: t, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
            }
          }
        }
        return null;
      }, ADVANCE_RE.source);

      if (!found) {
        // Already at terminal state? Check for act-3 markers.
        const reachedAct3 = await page.evaluate(
          (reSrc) => new RegExp(reSrc, 'i').test(document.body.innerText),
          ACT3_RE.source,
        );
        steps.push(reachedAct3 ? `act${act}: reached Act-3 markers without a button click` : `act${act}: no advance button (stuck)`);
        break;
      }
      steps.push(`act${act}: clicking "${found.text.slice(0, 40).replace(/\s+/g, ' ')}"`);
      await page.mouse.click(found.x, found.y);
      await new Promise((r) => setTimeout(r, 1000));
    }

    const reachedAct3 = await page.evaluate(
      (reSrc) => new RegExp(reSrc, 'i').test(document.body.innerText),
      ACT3_RE.source,
    );
    steps.push(reachedAct3 ? 'reached Act-3 (Start over / Save visible)' : 'did NOT reach Act-3');
  } catch (e) {
    steps.push(`exception: ${e.message}`);
  }
  if (errors.length) steps.push(`console errs: ${errors.slice(0, 2).map((e) => e.slice(0, 100)).join(' || ')}`);
  results.push({ path, steps });
  await page.close();
}

await browser.close();
console.log('\n=== deep smoke-test ===');
for (const r of results) {
  console.log(`\n${r.path}`);
  for (const s of r.steps) console.log(`  ${s}`);
}
