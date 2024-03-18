from pymongo.mongo_client import MongoClient

from utils.environment import get_env

def connect_db():
  # Set the Stable API version when creating a new client
  client = MongoClient(host=get_env('DB_HOST'), port=int(get_env('DB_PORT')), 
                       username=get_env('FILM_USER'), 
                       password=get_env('FILM_PWD'), 
                       authSource=get_env('FILM_DB'))
                            
  # Send a ping to confirm a successful connection
  try:
      client.admin.command('ping')
      return client
  except Exception as e:
      print(e)