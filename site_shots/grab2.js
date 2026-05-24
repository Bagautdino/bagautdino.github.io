// Click sidebar nav items to capture pages without URL hooks
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);

  // Click each sidebar item, screenshot
  const navOrder = ['Список наблюдения', 'Добавить игрока', 'Обучение'];
  let i = 18;
  for (const name of navOrder) {
    try {
      await page.evaluate((t) => {
        const items = Array.from(document.querySelectorAll('li, a, button'))
          .filter(e => e.textContent && e.textContent.trim() === t);
        if (items.length) items[items.length - 1].click();
      }, name);
      await sleep(1200);
      const file = String(i).padStart(2, '0') + '_nav_' + name.toLowerCase()
        .replace(/[^a-zа-я0-9]/gi, '_') + '.png';
      await page.screenshot({ path: file, fullPage: true });
      console.log('saved', file);
      i++;
    } catch (e) {
      console.log('err', name, e.message);
    }
  }

  // Dropdown filter expansion on players list
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);
  try {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Все регионы');
      if (btn) btn.click();
    });
    await sleep(700);
    await page.screenshot({ path: '21_players_filter_open.png' });
    console.log('saved 21_players_filter_open.png');
  } catch (e) {}

  // Players card view toggle
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(900);
  try {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Список');
      if (btn) btn.click();
    });
    await sleep(500);
    await page.screenshot({ path: '22_players_table.png', fullPage: true });
    console.log('saved 22_players_table.png');
  } catch (e) {}

  // Player profile — click "Не верифицирован" badge area for verification info
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);
  try {
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button, div, span'))
        .find(e => e.textContent && e.textContent.trim() === 'Не верифицирован');
      if (b) b.click();
    });
    await sleep(800);
    await page.screenshot({ path: '23_verify_modal.png', fullPage: true });
    console.log('saved 23_verify_modal.png');
  } catch (e) {}

  // Травмы tab
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  try {
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button, div'))
        .find(e => e.textContent && e.textContent.trim() === 'Травмы' && e.children.length === 0);
      if (b) b.click();
    });
    await sleep(700);
    await page.screenshot({ path: '24_tab_travma.png', fullPage: true });
    console.log('saved 24_tab_travma.png');
  } catch (e) {}

  // Оценки tab
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  try {
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button, div'))
        .find(e => e.textContent && e.textContent.trim() === 'Оценки' && e.children.length === 0);
      if (b) b.click();
    });
    await sleep(700);
    await page.screenshot({ path: '25_tab_ocenki.png', fullPage: true });
    console.log('saved 25_tab_ocenki.png');
  } catch (e) {}

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
