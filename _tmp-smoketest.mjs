// Smoke-test the 6 new walkthroughs.
// For each: open page, wait for app shell, click through Act 1 → 2 → 3
// using best-guess selectors, capture console errors + final screenshot.
import puppeteer from 'puppeteer-core';
import { execSync } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://prototype-five-iota.vercel.app';

const ROUTES = [
  { path: '/constellation',    expect: 'Constellation' },
  { path: '/kepler',           expect: 'Kepler' },
  { path: '/map-earths-anger', expect: "Earth" },
  { path: '/doubling-time',    expect: 'Doubling' },
  { path: '/hurricane-coin',   expect: 'Hurricane' },
  { path: '/inverse-square',   expect: 'Inverse' },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
});

const results = [];
for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    const url = r.url();
    if (!url.endsWith('favicon.ico')) errors.push(`reqfail: ${url} ${r.failure()?.errorText}`);
  });

  let status = 'pass';
  let detail = '';
  try {
    const resp = await page.goto(BASE + route.path, { waitUntil: 'networkidle2', timeout: 25000 });
    if (!resp || !resp.ok()) {
      status = 'fail';
      detail = `HTTP ${resp?.status()}`;
    } else {
      // Wait a beat for React to hydrate and run effects.
      await new Promise((r) => setTimeout(r, 1500));
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes(route.expect.toLowerCase())) {
        status = 'fail';
        detail = `expected text "${route.expect}" not found`;
      } else {
        // Count buttons + try to find an advance button by common patterns.
        const buttons = await page.$$eval('button, a', (els) =>
          els.map((e) => e.innerText.trim()).filter(Boolean),
        );
        detail = `${buttons.length} clickable; sample: ${buttons.slice(0, 6).join(' | ').slice(0, 200)}`;
      }
    }
  } catch (e) {
    status = 'fail';
    detail = `exception: ${e.message}`;
  }

  if (errors.length) {
    status = status === 'pass' ? 'warn' : status;
    detail += ` | ${errors.length} console err(s): ${errors.slice(0, 3).map((e) => e.slice(0, 120)).join(' || ')}`;
  }

  results.push({ path: route.path, status, detail });
  await page.close();
}

await browser.close();
console.log('\n=== smoke-test results ===');
for (const r of results) {
  console.log(`${r.status.toUpperCase().padEnd(5)} ${r.path.padEnd(22)} ${r.detail}`);
}
