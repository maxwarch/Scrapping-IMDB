import scrapy
from imdb.items import ImdbItem
from scrapy.http import Response

BASE_URL = "https://www.imdb.com"


class TestMoviesSpider(scrapy.Spider):
    name = "test_movies"
    start_urls = [
        f"{BASE_URL}/title/tt5435326",
    ]

    def parse(self, response: Response):
        item = ImdbItem()
        yield from item.parse(response=response)
