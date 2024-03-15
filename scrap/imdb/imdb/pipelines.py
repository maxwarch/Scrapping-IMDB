# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

from db.database import connect_db
from imdb.items import ImdbItem
from utils.environment import get_env


class ImdbPipeline: 
    def open_spider(self, spider):
        self.client = connect_db()
        #print('********* open_spider')
        db = self.client[get_env('FILM_DB')]
        self.films = db['films']

    def close_spider(self, spider):
        #print('********* close_spider')
        self.client.close()

    def process_item(self, item: ImdbItem, spider):
        item['duration'] = item['duration'].total_seconds()
        self.films.insert_one(ItemAdapter(item).asdict())
        return item
