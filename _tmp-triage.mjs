// Triage all 10 walkthroughs against localhost: screenshot Act 1, attempt
// to advance through Acts 1→2→3, capture console errors, return one
// line of verdict per route.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:5173';
const OUT = '/Users/dereklomas/savvas/screenshots/_triage';
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  '/',
  '/chapters',
  '/datasets',
  '/lessons',
  '/lessons/walk-into-a-bar',
  '/lessons/slider-of-lies',
  '/lessons/survivorship-bias',
  '/lessons/hit-the-target',
  '/explorer?dataset=wind',
  '/explorer?dataset=solarSystem',
  '/explorer?dataset=moore',
  '/calibrators',
];

const ADVANCE_RE = /next:|next →|continue|build a model|interpret|reveal|plot the|start trials|open the sky|see the pyramid|count the history|push the star|turn on the mic|claim it|design another|see the |what does |does it hold/i;
// Buttons that should NEVER count as "advance" — they're side-trips.
const EXCLUDE_RE = /explore the data|see all .* in the explorer|envision 3-act/i;
const ACT3_RE = /start over|restart|begin again|save to notebook|save this|submit this finding|submit to class wall|design another/i;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
});

const results = [];
for (const path of ROUTES) {
  const slug = path.replace(/[/]/g, '') || 'home';
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  const steps = [];
  let title = '';
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 800));
    title = await page.title();
    await page.screenshot({ path: `${OUT}/${slug}-act1.png`, fullPage: false });

    for (let act = 1; act <= 3; act++) {
      const found = await page.evaluate((reSrc, exSrc) => {
        const re = new RegExp(reSrc, 'i');
        const ex = new RegExp(exSrc, 'i');
        const btns = Array.from(document.querySelectorAll('button, a'));
        for (const b of btns) {
          const t = (b.innerText || '').trim();
          if (t && re.test(t) && !ex.test(t) && !b.disabled) {
            // Skip anchors that open a new tab (target=_blank) — those are side-trips.
            if (b.tagName === 'A' && b.getAttribute('target') === '_blank') continue;
            const rect = b.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return { text: t, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
            }
          }
        }
        return null;
      }, ADVANCE_RE.source, EXCLUDE_RE.source);

      if (!found) {
        steps.push(`act${act}: no advance button visible`);
        break;
      }
      steps.push(`act${act}: "${found.text.slice(0, 50).replace(/\s+/g, ' ')}"`);
      await page.mouse.click(found.x, found.y);
      await new Promise((r) => setTimeout(r, 900));
      await page.screenshot({ path: `${OUT}/${slug}-after-act${act}.png`, fullPage: false });
    }

    const reachedAct3 = await page.evaluate(
      (reSrc) => new RegExp(reSrc, 'i').test(document.body.innerText),
      ACT3_RE.source,
    );
    steps.push(reachedAct3 ? '✓ reached Act-3' : '✗ no Act-3 markers');
  } catch (e) {
    steps.push(`EXCEPTION: ${e.message}`);
  }
  if (errors.length) steps.push(`ERRORS: ${errors.slice(0, 3).map((e) => e.slice(0, 120)).join(' || ')}`);

  results.push({ path, title, steps });
  await page.close();
}

await browser.close();
console.log('\n=== triage report ===');
for (const r of results) {
  console.log(`\n${r.path}  [title: ${r.title}]`);
  for (const s of r.steps) console.log(`  ${s}`);
}
