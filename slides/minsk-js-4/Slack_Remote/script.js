const puppeteer = require('puppeteer');
const prompts = require('prompts');

const credentionals = require('./credentionals');

const URL = 'https://slack.com/signin';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      // '--start-fullscreen',
      '-start-maximized',
    ],
    devtools: true,
    slowMo: 80,
  });

  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080,
  })

  await page.goto(URL, {
    // waitUntil: ['networkidle0', /* 'domcontentloaded' */],
    // timeout: 30000,
  });

  // OR use page evaluate or $eval :)

  await page.waitForSelector('input')

  await page.type('input[type="text"]', 'frontendBelarus');

  await page.click('#submit_team_domain');

  await page.waitForSelector('#signin_btn')

  await page.type('#email', credentionals.email);
  await page.type('#password', credentionals.password);

  await page.click('#signin_btn');

  await page.waitForSelector('.p-channel_sidebar__static_list');

  await page.evaluate(() => {
    const channelList = document.querySelectorAll(
      '.p-channel_sidebar__channel'
    );

    const imList = document.querySelectorAll(
      '.p-channel_sidebar__channel--im'
    );

    const contact = Array.from(imList).find(
      contact => (contact.text === 'Yahor Vaziyanau(you)')
    );

    if (contact) {
      contact.click();
    }
  });

  await page.waitForSelector('.ql-editor.ql-blank');

  await page.focus('.ql-editor.ql-blank > p');
  await page.keyboard.type(`Hello it's me Mario!!!`);

  // Enter :)
  await page.keyboard.press(String.fromCharCode(13))

  // We could write a code for waiting next message and etc. but timeout :)

  await browser.close();
})();
