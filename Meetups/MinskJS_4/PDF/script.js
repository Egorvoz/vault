const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'https://github.com/';

// NOTE: u can't add script tag init :) yet
const buildTemplate = (type) => {
  return `
    <div style="font-size: 10px; color: red;">
      <span>${ type === 'header' ? 'HEADER' : 'FOOTER'}</span>
      <span class="date"></span> |
      <span class="title"></span> |
      <span class="url"></span> |
      <span class="pageNumber"></span> /
      <span class="totalPages"></span>
    </div>
  `;
}

(async () => {
  const dir = './pdf';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto(URL, {
    waitUntil: ['networkidle0', 'domcontentloaded'],
    // timeout: 30000,
  });

  await page.pdf({
    path: 'pdf/document.pdf',
    displayHeaderFooter: true,
    headerTemplate: buildTemplate('header'), // new one
    footerTemplate: buildTemplate('footer'), // new one
    printBackground: true,
    landscape: false,
    // pageRanges: '1-2',
    format: 'A4',
    margin: {
      top: 100,
      right: 40,
      bottom: 100,
      left: 40,
    },
  })

  await browser.close();
})();
