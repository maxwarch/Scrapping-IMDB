# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

class ImdbItem(Item):
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