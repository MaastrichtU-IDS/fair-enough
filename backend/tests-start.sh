#! /usr/bin/env bash
set -e

python /app/app/initial_data.py

bash ./scripts/test.sh "$@"
