// Drive each showpiece activity into Act 2/3 via direct DOM interactions,
// capture full screenshots for visual review.
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

async function shot(page, name) {
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `/Users/dereklomas/savvas/screenshots/_triage/x-${name}.png` });
}
async function dismissWidget(page) {
  await page.evaluate(() => {
    const gotIt = Array.from(document.querySelectorAll('button')).find(b => /got it/i.test(b.textContent || ''));
    if (gotIt instanceof HTMLElement) gotIt.click();
  });
}
async function clickByText(page, re) {
  return page.evaluate((src) => {
    const r = new RegExp(src, 'i');
    const b = Array.from(document.querySelectorAll('button, a')).find((el) => {
      if (el.tagName === 'A' && el.getAttribute('target') === '_blank') return false;
      const t = (el.innerText || '').trim();
      return t && r.test(t) && !el.disabled;
    });
    if (b) { b.click(); return true; }
    return false;
  }, re.source);
}

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Kepler — easy: button works without any input
await page.goto('http://localhost:5173/kepler', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await clickByText(page, /plot the solar system/i);
await new Promise(r => setTimeout(r, 800));
await shot(page, 'kepler-act2');
await clickByText(page, /log.?log/i);
await new Promise(r => setTimeout(r, 400));
await shot(page, 'kepler-act2-loglog');
await clickByText(page, /what does kepler|interpret|next:/i);
await new Promise(r => setTimeout(r, 800));
await shot(page, 'kepler-act3');

// Map Earth's Anger
await page.goto('http://localhost:5173/map-earths-anger', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await clickByText(page, /plot the world/i);
await new Promise(r => setTimeout(r, 1500));
await shot(page, 'map-act2');
const desc = await page.$('textarea');
if (desc) { await desc.click(); await desc.type('Quakes cluster along the Ring of Fire'); }
await new Promise(r => setTimeout(r, 300));
await clickByText(page, /interpret|next:/i);
await new Promise(r => setTimeout(r, 800));
await shot(page, 'map-act3');

// Hurricane Coin (was just refactored — sanity check)
await page.goto('http://localhost:5173/hurricane-coin', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await shot(page, 'hurricane-act1');
await clickByText(page, /under 50%/i);
await new Promise(r => setTimeout(r, 200));
await clickByText(page, /count the history/i);
await new Promise(r => setTimeout(r, 1200));
await shot(page, 'hurricane-act2');

// Doubling Time
await page.goto('http://localhost:5173/doubling-time', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await clickByText(page, /plot 50 years/i);
await new Promise(r => setTimeout(r, 1000));
await shot(page, 'doubling-act2');

// Inverse Square
await page.goto('http://localhost:5173/inverse-square', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await shot(page, 'inverse-act1');
await clickByText(page, /push the star|plot|test/i);
await new Promise(r => setTimeout(r, 800));
await shot(page, 'inverse-act2');

// Constellation
await page.goto('http://localhost:5173/constellation', { waitUntil: 'networkidle2' });
await dismissWidget(page);
await clickByText(page, /open the sky/i);
await new Promise(r => setTimeout(r, 800));
await shot(page, 'constellation-act2');

await browser.close();
console.log('done');
