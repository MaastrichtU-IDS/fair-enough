#!/bin/bash

# Collections are initialized auto when starting the API
# But Metrics Tests needs to be registered once the API started

## In prod:
# ./init_metrics_tests.sh https://api.fair-enough.semanticscience.org

if [ -z "$1" ]
then
    API_URL=http://localhost
    echo "No API_URL provided, defaulting to $API_URL"
else
    API_URL=$1
fi

POST_TESTS_URL=$API_URL/rest/metrics


# FAIR enough metrics
# TODO: replace with https://w3id.org/fair-enough/metrics
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/a1-access-protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/f1-unique-persistent-id"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/f2-machine-readable-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/f3-id-in-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/i1-knowledge-representation"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/i2-fair-vocabularies"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/r1-accessible-license"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/f4-searchable"}' -H "Content-Type: application/json" $POST_TESTS_URL

# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/a2-metadata-longevity"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/i3-check-sparl-endpoint"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/i3-data-management-plan"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/i3-use-references"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/r2-detailed-provenance"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://metrics.api.fair-enough.semanticscience.org/tests/r3-meets-community-standards"}' -H "Content-Type: application/json" $POST_TESTS_URL


# Rare Disease metrics
curl -X POST -d '{"url": "https://rare-disease.api.fair-enough.semanticscience.org/tests/RD-F4"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://rare-disease.api.fair-enough.semanticscience.org/tests/RD-R1-3"}' -H "Content-Type: application/json" $POST_TESTS_URL


echo "######### FAIR Evaluator metrics #########"
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_persistence"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_identifier_persistence"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_structured_metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_grounded_metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_authorization"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_identifier_in_metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_kr_language_strong"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_kr_language_weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_data_protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_authorization"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_contains_outward_links"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_in_metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_includes_license_strong"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_includes_license_weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_kr_language_strong"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_kr_language_weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_persistence"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_uses_fair_vocabularies_strong"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_uses_fair_vocabularies_weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/FAIR_Tests/tests/gen2_searchable"}' -H "Content-Type: application/json" $POST_TESTS_URL
