// Retake education + lesson + a few extras
const puppeteer = require('puppeteer-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Education — navigate via clicking "Обучение" from /dashboard
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(900);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Обучение');
    if (el) el.click();
  });
  await sleep(1500);
  await page.screenshot({ path: 'd_15_education.png' });
  console.log('saved d_15_education.png');

  // Open a lesson (click "Открыть урок")
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a')).find(e => e.textContent && e.textContent.trim() === 'Открыть урок');
    if (el) el.click();
  });
  await sleep(1500);
  await page.screenshot({ path: 'd_16_lesson.png' });
  console.log('saved d_16_lesson.png');

  // Lesson — full page to capture entire content
  await page.screenshot({ path: 'd_16b_lesson_full.png', fullPage: true });
  console.log('saved d_16b_lesson_full.png');

  // Filter — катание only on education
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Обучение');
    if (el) el.click();
  });
  await sleep(1200);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'U12');
    if (el) el.click();
  });
  await sleep(600);
  await page.screenshot({ path: 'd_15b_education_filtered.png' });
  console.log('saved d_15b_education_filtered.png');

  // Add player — go through 4 steps to capture each
  await page.goto('https://vetrychok.ru/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(800);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('li, a, button')).find(e => e.textContent && e.textContent.trim() === 'Добавить игрока');
    if (el) el.click();
  });
  await sleep(1200);
  await page.screenshot({ path: 'd_14a_add_step1.png' });
  console.log('saved d_14a_add_step1.png');

  // Step 2 — fill and go next
  try {
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      // surnames "Морозов" already shown as placeholder/value? click "Далее"
    });
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.trim() === 'Далее');
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: 'd_14b_add_step2.png' });
    console.log('saved d_14b_add_step2.png');
  } catch(e){}

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
