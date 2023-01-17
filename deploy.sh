#!/bin/bash

if [[ $1 -eq "--no-cache" ]]
then
    echo "Building without cache"
    ssh ids3 'cd /data/deploy-services/fair-enough ; git pull ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml down ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate'
else
    ssh ids3 'cd /data/deploy-services/fair-enough ; git pull ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate --build --remove-orphans -d'
fi
