import fs from 'node:fs'

import puppeteer from 'puppeteer'

// async function wait(delay) {
//   return new Promise(function (resolve, reject) {
//       setTimeout(resolve, delay)
//   })
// }

(async () => {
  //const BASE_URL = 'https://www.imdb.com'
  let cookies: any = null
  try {
    cookies = fs.readFileSync('./cookie.json', 'utf-8')
  } catch (e) {
    console.log('no stored cookie')
  }

  // Launch the browser
  const browser = await puppeteer.launch({ headless: false })

  // Create a page
  const page = await browser.newPage()

  // Go to your site
  if (cookies) await page.setCookie(...JSON.parse(cookies))
  await page.goto('https://www.imdb.com/search/title/?title_type=feature')

  let btBannerRgpd = undefined
  if (!cookies) btBannerRgpd = await page.waitForSelector('[data-testid=accept-button]')
  const element = await page.waitForSelector('span.ipc-see-more__text')

  if (btBannerRgpd) {
    await btBannerRgpd.click()
    await btBannerRgpd.dispose()
    const cookies = await page.cookies()
    fs.writeFileSync('./cookie.json', JSON.stringify(cookies))

    // const links = await page.$$eval('a', a => a.map(a => a.href))
    // for (const link of links) {
    //   if (link.includes('com/title/')) {
    //     const l = new URL(link)
    //     await crawlPage(`${BASE_URL}${l.pathname}`, browser)
    //   }
    // }

    // await page.evaluate((element, page) => {
    //   setTimeout(async () => {
    //     await Promise.all( [
    //       element.click(),
    //       page.waitForResponse((response) => {
    //         console.log(response.url())
    //         return response.json()
    //       }),
    //     ])
    //   }, 0)
    // }, element, page)
  } else {
    await element.click()

    await page.waitForResponse((response) => {
      console.log(response.url())
      return response.json()
    })
  }
})()