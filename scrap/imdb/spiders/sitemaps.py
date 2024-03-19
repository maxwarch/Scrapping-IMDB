import scrapy
from scrapy.http import Response
import xmltodict


from imdb.items import ImdbItem

BASE_URL = "https://www.imdb.com"
url_regex = r"/title\/(tt[0-9]+)/?(ref_)?"


class SitemapsSpider(scrapy.Spider):
    name = "sitemaps"
    allowed_domains = ["imdb.com"]
    start_urls = [f"{BASE_URL}/sitemap/title-{nb}.xml.gz" for nb in range(0, 5)]

    def parse(self, response: Response):
        item = ImdbItem()
        raw = xmltodict.parse(response.text)
        for r in raw["urlset"]["url"]:
            yield scrapy.Request(r["loc"], callback=item.parse)
