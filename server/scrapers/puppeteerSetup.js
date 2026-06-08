import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

let browserInstance = null;
let launchPromise = null;

export async function getBrowser() {
  if (browserInstance) {
    return browserInstance;
  }
  if (launchPromise) {
    return launchPromise;
  }
  
  console.log('[puppeteer] Launching hidden browser instance...');
  
  const launchOptions = {
    headless: true,
    timeout: 10000,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-dev-shm-usage',
    ],
    ignoreHTTPSErrors: true,
  };

  const pLaunch = puppeteer.launch(launchOptions);
  const pTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Puppeteer launch hard timeout')), 10000));

  launchPromise = Promise.race([pLaunch, pTimeout]).then(browser => {
    browserInstance = browser;
    browserInstance.on('disconnected', () => {
      console.log('[puppeteer] Browser disconnected, resetting instance...');
      browserInstance = null;
      launchPromise = null;
    });
    launchPromise = null;
    return browserInstance;
  }).catch(err => {
    launchPromise = null;
    throw err;
  });

  return launchPromise;
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
