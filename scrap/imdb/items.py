# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field
import html
import json
import isodate


class ImdbItem(Item):
    _id = Field()
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

        data = response.xpath('//script[@type="application/ld+json"]/text()').extract()
        data = json.loads(data[0])
        if data["@type"] == "Movie":
            print(data["name"])

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
                duration = data["duration"]
            except KeyError:
                duration = "PT0H0M"

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

            self["_id"] = data["url"]
            self["title"] = html.unescape(title)
            self["orginalTitle"] = html.unescape(data["name"])
            self["rating"] = rating
            self["genre"] = genre
            self["publish"] = publish
            self["duration"] = isodate.parse_duration(duration)
            self["description"] = description
            self["casting"] = actor
            self["public"] = html.unescape(public)
            self["locale"] = locale
            self["origin"] = origin

            yield self

        yield None
