#!/bin/bash
clear
#sed -n p front/.env api/.env > .env
docker compose down

cd mongo
sh ./initVarMongo.sh
cd ..
docker compose up --build --remove-orphans $1