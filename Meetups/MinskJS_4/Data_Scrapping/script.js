const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.mann-ivanov-ferber.ru';

async function getAllBookTitles(page, count, delay) {
  await scrollToBottom(page, count, delay)

  const items = await page.evaluate(() => {
    const bookListEl = document.querySelector('.c-book-list');

    if (!bookListEl) {
      return
    }

    const booksTitles = bookListEl.querySelectorAll(
      '.p-book-description-wrapper > p'
    )

    if (booksTitles) {
      return Array.from(booksTitles).map(book => {
        if (book.innerText !== '') {
          return book.innerText;
        }
      });
    }
  })

  return items;
}

async function scrollToBottom(page, count = 1, delay = 1000) {
  const items = [];

  let previousHeight;

  for (let i = 0; i < count; i++) {
    previousHeight = await page.evaluate('document.body.scrollHeight')

    await page.evaluate('window.scrollBy(0, document.body.scrollHeight)')

    await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`)
    await page.waitFor(delay)
  }
}

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

  await page.goto(`${URL}/books/allbooks/`, {
    waitUntil: ['networkidle0', 'domcontentloaded'],
    // timeout: 30000,
  });

  const booksTitlesList = await getAllBookTitles(page, 5, 2000)

  fs.writeFileSync(
    'bookTitlesMIF.txt',
    booksTitlesList.join('\n'),
  );

  await browser.close();
})();
