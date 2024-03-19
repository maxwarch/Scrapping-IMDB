import { Browser } from 'puppeteer'

export async function crawlPage(url, browser: Browser) {
  console.log(url)
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('h1')
  await page.close()
  return Promise.resolve(true)
}