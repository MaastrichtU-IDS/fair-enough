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

POST_TESTS_URL=$API_URL/metrics


# FAIR enough metrics
# TODO: replace with https://w3id.org/fair-enough/metrics
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a1-data-authorization"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a1-data-protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a1-metadata-authorization"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a1-metadata-protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a2-metadata-persistent"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f1-data-identifier-persistent"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-persistent"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-unique"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f2-grounded-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f2-structured-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f3-data-identifier-in-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f3-metadata-identifier-in-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f4-searchable"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation-structured"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation-semantic"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-structured"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-semantic"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-known"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-resolve"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i3-metadata-contains-outward-links"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/r1-includes-license"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/r1-includes-standard-license"}' -H "Content-Type: application/json" $POST_TESTS_URL



# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a1-access-protocol"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f1-unique-persistent-id"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f2-machine-readable-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f3-id-in-metadata"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation-weak"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/r1-accessible-license"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/f4-searchable"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/a2-metadata-longevity"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i3-check-sparl-endpoint"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i3-data-management-plan"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/i3-use-references"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/r2-detailed-provenance"}' -H "Content-Type: application/json" $POST_TESTS_URL
# curl -X POST -d '{"url": "https://w3id.org/fair-enough/metrics/tests/r3-meets-community-standards"}' -H "Content-Type: application/json" $POST_TESTS_URL


# Rare Disease metrics
curl -X POST -d '{"url": "https://w3id.org/rd-fairness-tests/tests/RD-F4"}' -H "Content-Type: application/json" $POST_TESTS_URL
curl -X POST -d '{"url": "https://w3id.org/rd-fairness-tests/tests/RD-R1-3"}' -H "Content-Type: application/json" $POST_TESTS_URL


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
