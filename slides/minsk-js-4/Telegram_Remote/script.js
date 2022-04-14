const puppeteer = require('puppeteer');
const prompts = require('prompts');

const credentials = require('./credentionals');

const URL = 'https://web.telegram.org/#/login';

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

  /* LOGIN ACTIONS */

  await page.click('body');

  await page.waitFor(3000);

  await page.waitForSelector('.login_phone_num_input_group');

  await page.type('.login_phone_num_input_group > input', credentials.tel);

  await page.click('.login_head_submit_btn');

  await page.waitForSelector('.md_simple_modal_footer > .btn-md-primary');

  await page.click('.btn-md-primary');

  const response = await prompts({
    type: 'text',
    name: 'code',
    message: 'Enter Telegram Code:'
  });

  await page.waitForSelector('.md-input-group');

  await page.type('.md-input-group > input', response.code);

  await page.waitForSelector('.im_dialog_wrap');

  await page.evaluate(() => {
    const imList = document.querySelectorAll(
      '.im_dialog'
    );

    const imContact = Array.from(imList).find(imItem => {
      if (imItem.querySelector('.im_dialog_peer > span').innerText === 'Saved Messages') {
        return imItem
      }
    });

    if (imContact) {
      const e = document.createEvent('HTMLEvents');
      e.initEvent('mousedown', false, true);

      imContact.dispatchEvent(e);
    }
  });

  await page.waitForSelector('.composer_rich_textarea');

  await page.evaluate(() => {
    const messageArea = document.querySelector('.composer_rich_textarea');

    if (messageArea) {
      messageArea.textContent = 'Дарова Минск ЖЭЭС Хэштег 4. \n Лол кек чебурек. \n ИЗИ ТАСК';
    }

    const sendBtn = document.querySelector('.im_submit_send');

    if (sendBtn) {
      const e = document.createEvent('HTMLEvents');
      e.initEvent('mousedown', false, true);

      sendBtn.dispatchEvent(e);
    }
  })

  await browser.close();
})();
