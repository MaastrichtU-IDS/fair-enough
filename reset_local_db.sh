#!/bin/bash
docker-compose down
docker volume rm -f fair-enough_mongodb-data
docker-compose up --build --force-recreate
