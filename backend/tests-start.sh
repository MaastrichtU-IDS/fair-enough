#! /usr/bin/env bash
set -e

# python ./app/initial_data.py
poetry run python ./app/initial_data.py

bash ./scripts/test.sh "$@"
