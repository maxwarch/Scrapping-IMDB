import dayjs from 'dayjs'
import { decode } from 'html-entities'
import parse from 'parse-duration'
import { Browser } from 'puppeteer'

import { connectDb } from './db'
import { filmModel } from './model'

connectDb()

export async function crawlPage(url, browser: Browser) {
  console.log(url)
  const page = await browser.newPage()
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')

  await page.goto(url)
  await page.waitForSelector('p.footer__copyright')

  const film = new filmModel()

  let locale = ''
  try {
    locale = await page.$eval('::-p-xpath(//li[@data-testid="title-details-languages"]/descendant::li[1]/a)', e => e.textContent)
  } catch (e) {
    locale = await page.$eval('::-p-xpath(//li[@data-testid="title-details-origin"]/descendant::li[1]/a)', e => e.textContent)
  }

  let origin = ''
  try {
    origin = await page.$eval('::-p-xpath(//li[@data-testid="title-details-origin"]/descendant::li[1]/a)', e => e.textContent)
  } catch (e) {
    origin = ''
  }

  film.locale = locale
  film.origin = origin
  film._id = url

  let data = await page.$eval('::-p-xpath(//script[@type="application/ld+json"])', e => e.textContent)
  data = JSON.parse(data)
  film['type'] = data['@type']

  if (film.type == 'Movie' || film.type == 'TVSeries') {
    if (film.type == 'TVSeries') {
      // episodes
      const episodes = await page.$eval('::-p-xpath(//section[@data-testid="Episodes"]/div/a/h3/span[@class="ipc-title__subtext"])', e => e.textContent)
      film.episodes = episodes * 1

      // saisons
      let saisons = await page.$eval('::-p-xpath(//div[@data-testid="episodes-browse-episodes"]/child::div[2]/child::a/span[contains(text(), "son")])', e => e.textContent)
      if (!saisons) {
        saisons = await page.$eval('::-p-xpath(//select[@id="browse-episodes-season"]/child::option[2])', e => e.textContent)
      } else {
        saisons = saisons.split(' ')[0]
      }
      film.saisons = saisons * 1
    }
//console.log(data)
    // duration
    let duration = await page.$eval('::-p-xpath(//*[@data-testid="hero__pageTitle"]/following::ul/child::li[last()])', e => e.textContent)
    duration = parse(duration, 's') || undefined

    film.title = decode(data['alternateName']) || decode(data['name'])
    film.orginalTitle = decode(data['name'])
    film.public = data['contentRating'] || ''
    film.rating = data['aggregateRating'] || ''
    film.publish = new Date(dayjs(data['datePublished']).toISOString())

    if (!duration){
      const dur = data['duration']
      film.duration = dur //isodate.parse_duration(dur).total_seconds()
    } else {
      film.duration = duration
    }

    film.description = decode(data['description']) ?? ''

    const act = data['actor']
    film.actor = act.map(a => decode(a.name)) ?? ''

    try {
      const gen = data['genre']
      film.genre = gen.map(a => decode(a)) ?? []
    } catch (e){
      film.genre = []
    }

    try {
      const key = data['keywords'].split(',')
      film.keywords = key.map(a => decode(a)) ?? ''
    } catch (e) {
      film.keywords = []
    }

    //console.log(film)

    await film.updateOne({ _id: url }, { $set: film.toJSON(), upsert: true })

    await page.close()
    return Promise.resolve(true)
  }
}