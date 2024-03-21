import fs from 'node:fs'

import puppeteer, { Page } from 'puppeteer'

import { crawlPage } from './crawlPage'

// async function wait(delay) {
//   return new Promise(function (resolve, reject) {
//       setTimeout(resolve, delay)
//   })
// }

(async () => {
  const BASE_URL = 'https://www.imdb.com'
  let cookies: any = null
  try {
    cookies = fs.readFileSync('./cookie.json', 'utf-8')
  } catch (e) {
    console.log('no stored cookie')
  }

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')

  // Go to your site
  if (cookies) await page.setCookie(...JSON.parse(cookies))
  //await page.goto('https://www.imdb.com/search/title/?title_type=feature')
  await page.goto('https://www.imdb.com/search/title/?title_type=feature&release_date=2024-03-13,2024-03-20')

  let btBannerRgpd = undefined
  if (!cookies) btBannerRgpd = await page.waitForSelector('[data-testid=accept-button]')
  let btNext = await page.waitForSelector('span.ipc-see-more__text')

  if (btBannerRgpd) {
    await btBannerRgpd.click()
    await btBannerRgpd.dispose()
    const cookies = await page.cookies()
    fs.writeFileSync('./cookie.json', JSON.stringify(cookies))
  }

  const links = await page.$$eval('a', a => a.map(a => a.href))
  const scraped = []
  for (const link of links) {
    if (link.includes('com/title/')) {
      const l = new URL(link)
      if (!scraped.includes(l.pathname)) {
        await crawlPage(`${BASE_URL}${l.pathname}`, browser)
        scraped.push(l.pathname)
      }
    }
  }

  await btNext.click()
  await startCrawl(page)
  browser.close()

  async function startCrawl(page: Page, nb = 0) {
    console.log('*******', nb)

    const res = await page.waitForResponse((response) => {
      if (response.url().includes('caching.graphql.imdb.com') && response.request().method().toUpperCase() != 'OPTIONS') {
        //console.log(response.url())
        return response.json()
      }
    })

    const json = await res.json()
    for (const edge of json.data.advancedTitleSearch.edges) {
      const url = `${BASE_URL}/title/${edge.node.title.id}`
      await crawlPage(url, browser)
    }

    btNext = await page.$('span.ipc-see-more__text')
    if (btNext) {
      await btNext.click()
      await startCrawl(page, nb + 1)
    } else {
      return Promise.resolve(true)
    }
  }
})()