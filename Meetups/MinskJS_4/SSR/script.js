const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'http://192.168.1.97:1984';

// TODO:
// 1. in html folder run `http-server -p 1984`
// 2. node script.js or in debug mode VS Code :)

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    /* args: [
      // '--start-fullscreen',
      '-start-maximized',
    ], */
    // devtools: true,
  });

  const page = await browser.newPage();

  /* page.setViewport({
    width: 1920,
    height: 1080,
  }) */

  await page.goto(URL, {
    waitUntil: ['networkidle0', 'domcontentloaded'],
    // timeout: 30000,
  });

  const compiledHTML = await page.evaluate(() => {
    const TEMPLATE = `
      <div>
        <h1>Username: {{username}}</h1>
        <span>Login: {{login}}</span>
        <span>Email: {{email}}</span>
        <span>Event: {{event}}</span>
      </div>
    `;

    return document.body.compile(TEMPLATE);
  });

  await browser.close();
})();
