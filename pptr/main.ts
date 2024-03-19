import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch()

  // Create a page
  const page = await browser.newPage()

  // Go to your site
  await page.goto('https://www.imdb.com/search/title/?title_type=feature')

  // Query for an element handle.
  const element = await page.waitForSelector('span > .ipc-see-more__text')

  if (element) {
    // Do something with element...
    await element.click() // Just an example.

    // Dispose of handle
    await element.dispose()
  }

  // Close browser.
  //await browser.close();
})()