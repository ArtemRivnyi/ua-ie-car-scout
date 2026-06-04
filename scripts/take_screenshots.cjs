const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\Artem\\.gemini\\antigravity-ide\\brain\\f6411a80-ab18-40f7-a683-8d7b6475d868';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // 1. Home page / Default
  console.log('Taking screenshot: home.png');
  await page.screenshot({ path: path.join(artifactsDir, 'home.png'), fullPage: true });

  // 2. Select a Toyota filter (e.g. Celica)
  console.log('Clicking Celica filter...');
  // Find the button with text "Celica" or similar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const celica = buttons.find(b => b.textContent.includes('Celica'));
    if (celica) celica.click();
  });
  
  await new Promise(r => setTimeout(r, 2000)); // wait for network or state
  console.log('Taking screenshot: celica_selected.png');
  await page.screenshot({ path: path.join(artifactsDir, 'celica_selected.png'), fullPage: true });

  // 3. Import Calc tab
  console.log('Clicking Import Calc tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.navbar__nav-item'));
    const calc = tabs.find(t => t.textContent.includes('Import Calc'));
    if (calc) calc.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('Taking screenshot: import_calc.png');
  await page.screenshot({ path: path.join(artifactsDir, 'import_calc.png'), fullPage: true });

  // 4. Favourites tab
  console.log('Clicking Favourites tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.navbar__nav-item'));
    const favs = tabs.find(t => t.textContent.includes('Favourites'));
    if (favs) favs.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('Taking screenshot: favourites.png');
  await page.screenshot({ path: path.join(artifactsDir, 'favourites.png'), fullPage: true });

  await browser.close();
  console.log('Done!');
})();
