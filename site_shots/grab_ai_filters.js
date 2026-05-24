// Hunt for AI assistant UI + capture filters
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Catalog with all filters
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);
  await page.screenshot({ path: 'flt_01_default.png' });
  console.log('saved flt_01_default.png');

  // 2. Open "Все регионы" dropdown
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'Все регионы');
    if (b) b.click();
  });
  await sleep(600);
  await page.screenshot({ path: 'flt_02_regions_open.png' });
  console.log('saved flt_02_regions_open.png');

  // Close by pressing Escape
  await page.keyboard.press('Escape');
  await sleep(400);

  // 3. Открыть "Все позиции" dropdown
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'Все позиции');
    if (b) b.click();
  });
  await sleep(600);
  await page.screenshot({ path: 'flt_03_positions_open.png' });
  console.log('saved flt_03_positions_open.png');
  await page.keyboard.press('Escape');
  await sleep(400);

  // 4. Открыть "Все возрасты"
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'Все возрасты');
    if (b) b.click();
  });
  await sleep(600);
  await page.screenshot({ path: 'flt_04_ages_open.png' });
  console.log('saved flt_04_ages_open.png');
  await page.keyboard.press('Escape');
  await sleep(400);

  // 5. Open "Любой хват"
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'Любой хват');
    if (b) b.click();
  });
  await sleep(600);
  await page.screenshot({ path: 'flt_05_shooting_open.png' });
  console.log('saved flt_05_shooting_open.png');
  await page.keyboard.press('Escape');
  await sleep(400);

  // 6. Click filters icon to expand advanced filters
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // The settings/filter icon button — typically last in the search row
    const candidates = buttons.filter(b => b.querySelector('svg'));
    // Try to find by aria-label or specific role
    const filterBtn = candidates.find(b => {
      const a = (b.getAttribute('aria-label') || '').toLowerCase();
      return a.includes('фильтр') || a.includes('filter') || a.includes('settings');
    });
    if (filterBtn) filterBtn.click();
  });
  await sleep(700);
  await page.screenshot({ path: 'flt_06_advanced.png' });
  console.log('saved flt_06_advanced.png');

  // 7. Type in search
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"], input[placeholder*="Поиск"], input[placeholder*="имени"]');
    if (input) { input.focus(); }
  });
  await page.keyboard.type('Алек', { delay: 100 });
  await sleep(800);
  await page.screenshot({ path: 'flt_07_search.png' });
  console.log('saved flt_07_search.png');

  // 8. Hunt for AI assistant — look at every page for floating button or chat icon
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1200);
  // Inspect entire DOM for assistant-related elements
  const found = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const matches = [];
    for (const el of all) {
      const t = (el.textContent || '').trim().slice(0, 50);
      const aria = (el.getAttribute('aria-label') || '');
      const cls = el.className || '';
      const id = el.id || '';
      const combined = (t + ' ' + aria + ' ' + cls + ' ' + id).toLowerCase();
      if (/assistant|помощник|ассистент|chat|чат|ai\b|искусствен/.test(combined)) {
        if (el.children.length < 3 && t.length < 60) {
          matches.push({ tag: el.tagName, text: t, aria, cls: String(cls).slice(0, 60), rect: el.getBoundingClientRect() });
        }
      }
    }
    // Also check for floating buttons (position: fixed)
    const fixed = [];
    for (const el of all.slice(0, 500)) {
      const s = window.getComputedStyle(el);
      if (s.position === 'fixed' && el.tagName !== 'HEAD') {
        fixed.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 40), cls: String(el.className).slice(0, 60), rect: el.getBoundingClientRect() });
      }
    }
    return { matches: matches.slice(0, 30), fixed: fixed.slice(0, 20) };
  });
  console.log('AI search results:', JSON.stringify(found, null, 2).slice(0, 3000));

  // 9. Try common AI routes
  for (const r of ['ai', 'assistant', 'chat', 'help', 'ai-assistant', 'analytics', 'reports', 'insights']) {
    try {
      await page.goto(`https://vetrychok.ru/${r}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await sleep(700);
      const size = (await page.screenshot({ path: `ai_probe_${r}.png` })).length;
      console.log(`ai_probe_${r}.png size=${size}`);
    } catch(e) { console.log('err', r, e.message); }
  }

  // 10. Inspect player page for assistant
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1500);
  const inPlayer = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a'));
    return buttons
      .filter(el => {
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return s.position === 'fixed' || r.bottom > window.innerHeight - 100;
      })
      .map(el => ({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
        aria: el.getAttribute('aria-label') || '',
        cls: String(el.className).slice(0, 80),
      })).slice(0, 20);
  });
  console.log('Player floating buttons:', JSON.stringify(inPlayer, null, 2));
  await page.screenshot({ path: 'player_with_potential_ai.png', fullPage: false });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
