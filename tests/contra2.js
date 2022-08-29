const { chromium } = require('@playwright/test');
const data = [];

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.contradefensa.com/certified-ethical-hacker/');
  // Wait for questions are loaded
  await page.waitForLoadState('networkidle');

  let counter = 0;
  while (counter < 10) {
    await page.click('.answer-text');
    await page.waitForLoadState('load');
    const question = await page.$eval('#question', el => el.textContent);
    const choices = await page.$$('.answer-container');

    const answers = [];
    for (let answer of choices) {
      const choice = await answer.$eval('.answer-text', el => el.innerText);
      answers.push(choice);
    }

    data.push({ question, answers });
    counter++;
  }

  console.log(data);
  console.log(`\nScraped questions: ${data.length}`);

  await browser.close();
})();