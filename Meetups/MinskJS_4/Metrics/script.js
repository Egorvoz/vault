const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.mann-ivanov-ferber.ru';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      // '--start-fullscreen',
      '-start-maximized',
    ],
    devtools: true,
  });

  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080,
  })

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);

  await page.tracing.start({path: 'trace.json'});

  await page.goto(`${URL}/books/allbooks/`, {
    waitUntil: ['networkidle0', 'domcontentloaded'],
    // timeout: 30000,
  });

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  let totalJSBytes = 0;
  let usedJSBytes = 0;

  for (const entry of jsCoverage) {
    totalJSBytes += entry.text.length;

    for (const range of entry.ranges) {
      usedJSBytes += range.end - range.start - 1;
    }
  }

  console.log(`JS used (bytes): ${Math.round(usedJSBytes / totalJSBytes * 100)}%`);

  let totalCSSBytes = 0;
  let usedCSSBytes = 0;

  for (const entry of cssCoverage) {
    totalCSSBytes += entry.text.length;

    for (const range of entry.ranges) {
      usedCSSBytes += range.end - range.start - 1;
    }
  }

  console.log(`CSS used (bytes): ${Math.round(usedCSSBytes / totalCSSBytes * 100)}%`);

  // how it was year ago
  // https://michaljanaszek.com/blog/test-website-performance-with-puppeteer

  // for more use CDPSession => client.send(Performance API)
  const metrics = await page.metrics();
  console.log(`Page metrics: \n`, metrics);

  await page.tracing.stop();

  await browser.close();
})();
