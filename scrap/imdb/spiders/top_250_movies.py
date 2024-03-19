import scrapy
from scrapy.http import Response
from imdb.items import ImdbItem

BASE_URL = "https://www.imdb.com"


class Top250MoviesSpider(scrapy.Spider):
    name = "top_250_movies"

    def start_requests(self):
        urls = [
            "https://www.imdb.com/chart/top/",
        ]

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response: Response):
        item = ImdbItem()
        for href in response.xpath(
            "//ul/li/descendant::a[boolean(@aria-label) and contains(@href, 'title')]/@href"
        ):
            yield scrapy.Request(BASE_URL + href.extract(), callback=item.parse)
        # yield scrapy.Request(
        #     f"{BASE_URL}/title/tt0120737/?ref_=chttp_i_9",
        #     callback=item.parse,
        # )
