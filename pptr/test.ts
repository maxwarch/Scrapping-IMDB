import fs from 'node:fs'

import puppeteer from 'puppeteer'

import { crawlPage } from './crawlPage'

(async () => {
  let cookies: any = null
  try {
    cookies = fs.readFileSync('./cookie.json', 'utf-8')
  } catch (e) {
    console.log('no stored cookie')
  }

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  if (cookies) await page.setCookie(...JSON.parse(cookies))

  await crawlPage('https://www.imdb.com/title/tt19766364', browser) //film
  //await crawlPage('https://www.imdb.com/title/tt13210838', browser) //série
  browser.close()
})()