const puppeteer = require('puppeteer');

const URL = 'https://github.com/';

let page;
let browser;

jest.setTimeout(30000);

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      // '--start-fullscreen',
      '-start-maximized',
    ],
    devtools: true,
    slowMo: 20, // to see what we are doing
  });

  page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080,
  });
});

afterAll(() => {
  browser.close();
});

describe('GitHub Loading', () => {

  test('page title should be valid', async () => {
    await page.goto(URL, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      // timeout: 30000,
    });

    const title = await page.title();

    expect(title).toBe('The world’s leading software development platform · GitHub')
  })

});

describe('Github Sign In', () => {

  test('accepting empty form should show error', async () => {

    await page.goto(`${URL}/login`, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      // timeout: 30000,
    });

    // NOTE: 2 way to do it

    // #1
    await page.waitForSelector('input[type="submit"]');

    // await page.focus('#login_field');
    // await page.keyboard.type('Saitama');

    await page.type('#login_field', 'Saitama');

    // await page.focus('#password');
    // await page.keyboard.type('OnePunchManIsTheBest');

    await page.type('#password', 'OnePunchManIsTheBest');

    // await page.click('input[type="submit"]');
    await page.$eval('input[type="submit"]', el => el.click());

    await page.waitForSelector('.flash-error');

    const errorText = await page.$eval('.flash-error > .container', el => el.innerText);

    expect(errorText).toBe('Incorrect username or password.');

    // #2
    /* await page.evaluate((a, b) => {
      document.querySelector('#a').value = a;
      document.querySelector('#b').value = b;
      document.querySelector('#c').click();
      ...
    }, a, b); */

    expect(123).toBe(123);

  });

});

/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
/* .... test cases .... */
