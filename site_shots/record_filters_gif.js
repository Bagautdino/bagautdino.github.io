// Record filter interaction sequence for GIF
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const dir = '/tmp/filter_frames';
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
    await page.screenshot({ path: path.join(dir, String(frame).padStart(3, '0') + '_' + label + '.png') });
    console.log('frame', frame, label);
  };

  await page.goto('https://vetrychok.ru/players', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1200);
  await snap('start');
  await sleep(400);
  await snap('start');

  // Open advanced filters
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const filterBtn = buttons.find(b => b.querySelector('svg') && !b.textContent.trim().length);
    if (filterBtn) filterBtn.click();
  });
  await sleep(800);
  await snap('advanced_open');
  await snap('advanced_open');
  await snap('advanced_open');

  // Set region: Москва
  await page.evaluate(() => {
    const trigger = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Все регионы' && b.closest('[class*="grid"]'));
    if (trigger) trigger.click();
  });
  await sleep(700);
  await snap('regions_open');
  await page.evaluate(() => {
    const opt = Array.from(document.querySelectorAll('div, li')).find(e => e.textContent && e.textContent.trim() === 'Москва' && e.children.length === 0);
    if (opt) opt.click();
  });
  await sleep(900);
  await snap('region_moscow');
  await snap('region_moscow');

  // Set position: Нападающий
  await page.evaluate(() => {
    const trigger = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'Все позиции' && b.closest('[class*="grid"]'));
    if (trigger) trigger.click();
  });
  await sleep(700);
  await snap('positions_open');
  await page.evaluate(() => {
    const opt = Array.from(document.querySelectorAll('div, li')).find(e => e.textContent && e.textContent.trim() === 'Нападающий' && e.children.length === 0);
    if (opt) opt.click();
  });
  await sleep(900);
  await snap('position_forward');
  await snap('position_forward');

  // Type in search
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"], input[placeholder*="Поиск"], input[placeholder*="имени"]');
    if (input) input.focus();
  });
  await page.keyboard.type('Алек', { delay: 120 });
  await sleep(800);
  await snap('search_result');
  await snap('search_result');
  await snap('search_result');

  await browser.close();
  console.log('captured', frame, 'frames');
})().catch(e => { console.error(e); process.exit(1); });
