import html
import json
import isodate

import scrapy

from imdb.items import ImdbItem

BASE_URL = 'https://www.imdb.com'

class Top250MoviesSpider(scrapy.Spider):
    name = "top_250_movies"

    def start_requests(self):
        urls = [
            "https://www.imdb.com/chart/top/",
        ]

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for href in response.xpath("//ul/li/descendant::a[boolean(@aria-label) and contains(@href, 'title')]/@href"):
            yield scrapy.Request(BASE_URL + href.extract(), callback = self.parse_dir_contents)
        #yield scrapy.Request(f'{BASE_URL}/title/tt0120737/?ref_=chttp_i_9', callback = self.parse_dir_contents)

    def parse_dir_contents(self, response):
        locale = html.unescape(response.xpath("//li[@data-testid='title-details-languages']/descendant::li[1]/a/text()").extract())
        origin = html.unescape(response.xpath("//li[@data-testid='title-details-origin']/descendant::li[1]/a/text()").extract())

        data = response.xpath('//script[@type="application/ld+json"]/text()').extract()
        data = json.loads(data[0])

        film = ImdbItem()
        
        try:
            title = data['alternateName']
        except:
            title = data['name']

        try:
            public = data['contentRating']
        except:
            public = ''

        film['title'] = html.unescape(title)
        film['orginalTitle'] = html.unescape(data['name'])
        film['rating'] = data['aggregateRating']['ratingValue']
        film['genre'] = [html.unescape(g) for g in data['genre']]
        film['publish'] = data['datePublished']
        film['duration'] = isodate.parse_duration(data['duration'])
        film['description'] = html.unescape(data['description'])
        film['casting'] = [html.unescape(a['name']) for a in data['actor']]
        film['public'] = html.unescape(public)
        film['locale'] = locale[0]
        film['origin'] = origin[0]

        print(film['title'])

        yield film