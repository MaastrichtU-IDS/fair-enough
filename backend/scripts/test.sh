#!/usr/bin/env bash

set -e
set -x

pytest -s --cov=app --cov-report=term-missing app/tests "${@}"
