#!/bin/bash

ssh ids3 'cd /data/deploy-ids-tests/fair-enough ; git pull ; docker-compose down ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache ; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d'
