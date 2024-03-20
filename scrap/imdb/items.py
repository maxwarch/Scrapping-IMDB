# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field
import html
import json
import isodate
from timelength import TimeLength


class ImdbItem(Item):
    _id = Field()
    type = Field()
    title = Field()
    orginalTitle = Field()
    rating = Field()
    genre = Field()
    publish = Field()
    duration = Field()
    description = Field()
    casting = Field()
    public = Field()
    locale = Field()
    origin = Field()
    keywords = Field()
    episodes = Field()
    saisons = Field()

    def parse(self, response):
        locale = html.unescape(
            response.xpath(
                "//li[@data-testid='title-details-languages']/descendant::li[1]/a/text()"
            ).extract()
        )
        origin = html.unescape(
            response.xpath(
                "//li[@data-testid='title-details-origin']/descendant::li[1]/a/text()"
            ).extract()
        )

        duration = None
        data = response.xpath('//script[@type="application/ld+json"]/text()').extract()
        data = json.loads(data[0])
        type = data["@type"]

        if type == "Movie" or type == "TVSeries":
            episodes = 0
            saisons = 0
            if type == "TVSeries":
                ## episodes
                episodes = response.xpath(
                    '//section[@data-testid="Episodes"]/div/a/h3/span[@class="ipc-title__subtext"]/text()'
                ).extract()
                episodes = episodes[0] if len(episodes) >= 1 else 0

                ## saisons
                saisons = response.xpath(
                    '//div[@data-testid="episodes-browse-episodes"]/child::div[2]/child::a/span[contains(text(), "son")]/text()'
                ).extract()

                if len(saisons) == 0:
                    saisons = response.xpath(
                        '//select[@id="browse-episodes-season"]/child::option[2]/text()'
                    ).extract()
                    saisons = saisons[0] if len(saisons) >= 1 else 0
                else:
                    saisons = saisons[0].split(" ")[0] if len(saisons) >= 1 else 0

                ## duration
                duration = response.xpath(
                    '//*[@data-testid="hero__pageTitle"]/following::ul/child::li[last()]/text()'
                ).extract()
                # print(duration)
                duration = (
                    TimeLength(duration[0]).to_seconds() if len(duration) >= 1 else None
                )

            try:
                title = data["alternateName"]
            except KeyError:
                title = data["name"]

            try:
                public = data["contentRating"]
            except KeyError:
                public = ""

            try:
                rating = data["aggregateRating"]
            except KeyError:
                rating = ""

            try:
                publish = data["datePublished"]
            except KeyError:
                publish = ""

            try:
                if duration is None:
                    dur = data["duration"]
                    duration = isodate.parse_duration(dur).total_seconds()
            except KeyError:
                if duration is None:
                    duration = 0

            try:
                description = data["description"]
            except KeyError:
                description = ""

            try:
                act = data["actor"]
                actor = [html.unescape(a["name"]) for a in act]
            except KeyError:
                actor = ""

            try:
                gen = data["genre"]
                genre = [html.unescape(g) for g in gen]
            except KeyError:
                genre = ""

            try:
                if locale and len(locale):
                    locale = locale[0]
                else:
                    locale = ""
            except KeyError:
                locale = ""

            try:
                if origin and len(origin):
                    origin = origin[0]
                else:
                    origin = ""
            except KeyError:
                origin = ""

            try:
                key = data["keywords"].split(",")
                keywords = [html.unescape(k) for k in key]
            except KeyError:
                keywords = ""

            self["_id"] = data["url"]
            self["type"] = type
            self["title"] = html.unescape(title)
            self["orginalTitle"] = html.unescape(data["name"])
            self["rating"] = rating
            self["genre"] = html.unescape(genre)
            self["publish"] = publish
            self["duration"] = duration
            self["description"] = html.unescape(description)
            self["casting"] = actor
            self["public"] = html.unescape(public)
            self["locale"] = locale
            self["origin"] = origin
            self["keywords"] = keywords
            self["episodes"] = int(episodes)
            self["saisons"] = int(saisons)

            print(self["title"])

            yield self

        yield None
