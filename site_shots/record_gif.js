// Record a sequence of frames demonstrating the site, then ffmpeg → GIF
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const dir = '/tmp/gif_frames';
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  let frame = 0;
  const snap = async (label) => {
    frame++;
    const p = path.join(dir, String(frame).padStart(3, '0') + '_' + label + '.png');
    await page.screenshot({ path: p });
    console.log('frame', frame, label);
  };

  // 1. Home (3 frames - dwell)
  await page.goto('https://vetrychok.ru/', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await snap('home');
  await sleep(600);
  await snap('home');

  // 2. Login
  await page.goto('https://vetrychok.ru/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(900);
  await snap('login');
  await snap('login');

  // 3. Players catalog
  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);
  await snap('players');
  await snap('players');
  await snap('players');

  // 4. Dashboard
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1100);
  await snap('dashboard');
  await snap('dashboard');
  await snap('dashboard');

  // 5. Player profile + click each tab
  await page.goto('https://vetrychok.ru/player/1', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);
  await snap('profile');

  for (const t of ['Антропометрия', 'Тесты', 'Статистика', 'Видеотека', 'Семья']) {
    await page.evaluate((tt) => {
      const el = Array.from(document.querySelectorAll('button, div'))
        .find(e => e.textContent && e.textContent.trim() === tt && e.children.length === 0);
      if (el) el.click();
    }, t);
    await sleep(900);
    await snap('tab_' + t);
    await sleep(300);
    await snap('tab_' + t);
  }

  // 6. Education
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Обучение');
    if (el) el.click();
  });
  await sleep(1500);
  await snap('education');
  await snap('education');

  await browser.close();
  console.log('captured', frame, 'frames into', dir);
})().catch(e => { console.error(e); process.exit(1); });
