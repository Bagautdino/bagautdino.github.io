// Headless SPA capture for vetrychok.ru using system Chrome via puppeteer-core
const puppeteer = require('puppeteer-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEW = { width: 1440, height: 900 };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function shoot(page, name, opts = {}) {
  await sleep(opts.delay || 600);
  await page.screenshot({ path: name, fullPage: opts.full || false });
  console.log('saved', name);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  await page.setViewport(VIEW);

  // 1. Home (landing)
  await page.goto('https://vetrychok.ru/', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, '01_home.png', { full: true });

  // 2. Login form
  await page.goto('https://vetrychok.ru/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, '02_login.png');

  // 3. Players list (catalog)
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, '03_players_list.png', { full: true });

  // 4. Player dashboard (Главная)
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, '04_dashboard.png', { full: true });

  // 5. Player profile with each tab
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await shoot(page, '05_player_profile.png', { full: true });

  // Find all tab buttons in the profile and click each
  const tabs = await page.evaluate(() => {
    const txts = ['Профиль', 'Антропометрия', 'Тесты', 'Статистика', 'Травмы', 'Оценки', 'Видеотека', 'Отзывы', 'Семья'];
    const results = [];
    for (const t of txts) {
      const el = Array.from(document.querySelectorAll('button, a, [role="tab"], div'))
        .find(e => e.textContent && e.textContent.trim() === t && e.children.length === 0);
      results.push({ t, found: !!el });
    }
    return results;
  });
  console.log('tabs found:', JSON.stringify(tabs));

  const order = ['Антропометрия', 'Тесты', 'Статистика', 'Травмы', 'Оценки', 'Видеотека', 'Отзывы', 'Семья'];
  let i = 6;
  for (const tabName of order) {
    try {
      const handle = await page.evaluateHandle((t) => {
        return Array.from(document.querySelectorAll('button, a, [role="tab"], div'))
          .find(e => e.textContent && e.textContent.trim() === t && e.children.length === 0);
      }, tabName);
      if (handle) {
        try {
          await handle.asElement()?.click();
        } catch (e) {
          // try click via evaluate
          await page.evaluate((t) => {
            const el = Array.from(document.querySelectorAll('button, a, [role="tab"], div'))
              .find(e => e.textContent && e.textContent.trim() === t && e.children.length === 0);
            if (el) el.click();
          }, tabName);
        }
        await sleep(900);
        const fileName = String(i).padStart(2, '0') + '_tab_' + tabName.toLowerCase()
          .replace(/[^a-zа-я0-9]/gi, '_') + '.png';
        await page.screenshot({ path: fileName, fullPage: true });
        console.log('saved', fileName);
        i++;
      }
    } catch (e) {
      console.log('tab error', tabName, e.message);
    }
  }

  // Login page form variants — switch role to "Скаут"
  await page.goto('https://vetrychok.ru/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(600);
  try {
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('button, label, div'))
        .find(e => e.textContent && e.textContent.trim() === 'Скаут');
      if (el) el.click();
    });
    await sleep(500);
    await page.screenshot({ path: '15_login_scout.png' });
    console.log('saved 15_login_scout.png');
  } catch (e) { console.log('scout select err', e.message); }

  // Watchlist
  await page.goto('https://vetrychok.ru/watchlist', { waitUntil: 'networkidle2', timeout: 30000 });
  await shoot(page, '16_watchlist.png', { full: true });

  // Try /education or /learning
  for (const r of ['education', 'learn', 'learning', 'обучение']) {
    try {
      await page.goto('https://vetrychok.ru/' + encodeURIComponent(r), { waitUntil: 'networkidle2', timeout: 20000 });
      await sleep(500);
      await page.screenshot({ path: '17_edu_' + r.replace(/[^a-z]/gi,'') + '.png', fullPage: true });
      console.log('saved 17_edu_' + r);
    } catch (e) {}
  }

  // Probe sidebar nav by clicking visible items on /players
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  const nav = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button, [role="link"], [role="menuitem"], nav *'))
      .filter(e => e.textContent && e.textContent.trim().length > 0 && e.textContent.length < 50)
      .map(e => ({ tag: e.tagName, text: e.textContent.trim(), href: e.getAttribute('href') }))
      .filter((v, i, arr) => arr.findIndex(x => x.text === v.text) === i);
    return links.slice(0, 40);
  });
  console.log('NAV ITEMS:', JSON.stringify(nav, null, 2));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
