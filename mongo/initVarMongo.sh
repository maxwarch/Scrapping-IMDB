#!/bin/bash

set -o allexport
source ../.env

sed "s/DB/$FILM_DB/g" ./entrypoint.js.tpl \
  | sed "s/USER/$FILM_USER/g" \
  | sed "s/PWD/$FILM_PWD/g" \
  > ./entrypoint.js