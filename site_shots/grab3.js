// Additional captures: tighter framing, mobile, assistant chat, scout-focused views
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function shoot(page, file, opts = {}) {
  await sleep(opts.delay || 700);
  if (opts.clip) {
    await page.screenshot({ path: file, clip: opts.clip });
  } else {
    await page.screenshot({ path: file, fullPage: !!opts.full });
  }
  console.log('saved', file);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });

  // ====== Desktop 1440x900 (clean, no scroll) ======
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Home — tight 1440x900
  await page.goto('https://vetrychok.ru/', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, 'd_01_home.png');

  // 2. Home — full landing (scrolled, full page)
  await shoot(page, 'd_01b_home_full.png', { full: true });

  // 3. Login
  await page.goto('https://vetrychok.ru/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, 'd_02_login.png');

  // 4. Players list (scout catalog)
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, 'd_03_players.png');

  // 5. Dashboard
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, 'd_04_dashboard.png');

  // 6. Player profile + tabs (clean 1440x900)
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await shoot(page, 'd_05_profile.png');

  const tabs = ['Антропометрия', 'Тесты', 'Статистика', 'Травмы', 'Оценки', 'Видеотека', 'Отзывы', 'Семья'];
  let i = 6;
  for (const t of tabs) {
    await page.evaluate((t) => {
      const el = Array.from(document.querySelectorAll('button, div')).find(e => e.textContent && e.textContent.trim() === t && e.children.length === 0);
      if (el) el.click();
    }, t);
    await sleep(800);
    const fname = `d_${String(i).padStart(2,'0')}_${t.toLowerCase().replace(/[^а-яa-z]/g,'')}.png`;
    await shoot(page, fname);
    i++;
  }

  // 14. Add player
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Добавить игрока');
    if (el) el.click();
  });
  await sleep(1000);
  await shoot(page, 'd_14_add_step1.png');

  // 15. Education
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Обучение');
    if (el) el.click();
  });
  await sleep(1000);
  await shoot(page, 'd_15_education.png');

  // 16. Education — open a lesson
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a')).find(e => e.textContent && e.textContent.trim() === 'Открыть урок');
    if (el) el.click();
  });
  await sleep(1200);
  await shoot(page, 'd_16_lesson.png');

  // 17. Watchlist
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Список наблюдения');
    if (el) el.click();
  });
  await sleep(1000);
  await shoot(page, 'd_17_watchlist.png');

  // 18. Try assistant chat
  for (const r of ['assistant', 'chat', 'ai']) {
    try {
      await page.goto(`https://vetrychok.ru/${r}`, { waitUntil: 'networkidle2', timeout: 20000 });
      await sleep(800);
      await page.screenshot({ path: `d_18_${r}.png` });
      console.log('saved d_18_' + r);
    } catch(e){}
  }

  // 19. Check for assistant floating chat button on player page
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1500);
  const hasChat = await page.evaluate(() => {
    // look for chat / assistant button
    const all = Array.from(document.querySelectorAll('button, div, span, a'));
    const candidates = all.filter(el => {
      const t = (el.textContent || '').toLowerCase();
      return t.includes('ассистент') || t.includes('чат') || t.includes('помощник') || t.includes('ai');
    }).map(e => ({ tag: e.tagName, text: (e.textContent || '').trim().slice(0, 80), cls: e.className }));
    return candidates.slice(0, 10);
  });
  console.log('CHAT CANDIDATES:', JSON.stringify(hasChat));

  // try clicking the assistant button if exists
  try {
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('button, [role="button"]'));
      const btn = all.find(el => {
        const t = (el.textContent || '').toLowerCase();
        const a = (el.getAttribute('aria-label') || '').toLowerCase();
        return t.includes('ассистент') || a.includes('assistant') || t.includes('помощник');
      });
      if (btn) btn.click();
    });
    await sleep(1200);
    await shoot(page, 'd_19_assistant_open.png');
  } catch(e) {}

  // ====== Mobile viewport iPhone-like ======
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mobile.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

  await mobile.goto('https://vetrychok.ru/', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await mobile.screenshot({ path: 'm_01_home.png' });
  console.log('saved m_01_home.png');

  await mobile.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await mobile.screenshot({ path: 'm_02_players.png' });
  console.log('saved m_02_players.png');

  await mobile.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await mobile.screenshot({ path: 'm_03_dashboard.png' });
  console.log('saved m_03_dashboard.png');

  await mobile.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await mobile.screenshot({ path: 'm_04_profile.png' });
  console.log('saved m_04_profile.png');

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
