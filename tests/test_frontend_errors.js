import puppeteer from 'puppeteer';

async function checkFrontend() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  if (content.length < 500) {
    console.log("HTML content:", content);
  }
  
  const rootHtml = await page.$eval('#root', el => el.innerHTML).catch(() => 'NO_ROOT');
  console.log("Root content length:", rootHtml.length);
  
  await browser.close();
}

checkFrontend();
