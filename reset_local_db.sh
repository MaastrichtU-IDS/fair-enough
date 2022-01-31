#!/bin/bash


if [ "$1" = "--prod" ] ; then
    echo "Reset prod database"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
    sudo rm -rf /data/fair-enough
    git pull
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate --build --remove-orphans -d
else
    echo "Reset development database"
    docker-compose down
    docker volume rm -f fair-enough_mongodb-data
    docker-compose up --build --force-recreate
fi
