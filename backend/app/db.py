from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import datetime

# https://github.com/michaldev/fastapi-async-mongodb
# https://art049.github.io/odmantic/usage_fastapi/
# https://www.codementor.io/@arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr


db_client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


def get_db() -> AsyncIOMotorDatabase:
    """Return Evaluations database client instance."""
    return db


async def connect_db():
    """Create database connection."""
    global db_client
    global db
    db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    # db_client = AsyncIOMotorClient(settings.MONGODB_URL, maxPoolSize=100, minPoolSize=100)
    db = db_client.evaluations

async def close_db():
    """Close database connection."""
    db_client.close()


def init_db() -> None:
    """Initialize database if empty"""
    db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = db_client.evaluations

    # Not working: print('Initialize the database with default FAIR metrics tests')
    # await register_test({'url': "https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier"}, db_client)
    # await register_test({'url': "https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier"}, db_client)

    collection = db["collections"].find_one({"_id": id})
    if collection is not None:
        print('Initialize the database with a few collections')
        collec_id = "fair-evaluator-maturity-indicators"
        collec_obj = {
            "_id": collec_id,
            "title": "FAIR Evaluator maturity indicators",
            "description": "Implementation of the FAIR Metrics maturity indicators in ruby to evaluate a dataset FAIRness",
            "homepage": "https://github.com/FAIRMetrics/Metrics",
            "assessments": [
                f"https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_persistence",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_identifier_persistence",
                f"https://w3id.org/FAIR_Tests/tests/gen2_structured_metadata",
                f"https://w3id.org/FAIR_Tests/tests/gen2_grounded_metadata",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_authorization",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_identifier_in_metadata",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_kr_language_strong",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_kr_language_weak",
                f"https://w3id.org/FAIR_Tests/tests/gen2_data_protocol",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_authorization",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_contains_outward_links",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_in_metadata",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_includes_license_strong",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_includes_license_weak",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_kr_language_strong",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_kr_language_weak",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_persistence",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_protocol",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_uses_fair_vocabularies_strong",
                f"https://w3id.org/FAIR_Tests/tests/gen2_metadata_uses_fair_vocabularies_weak",
                f"https://w3id.org/FAIR_Tests/tests/gen2_searchable",
            ],  
            "author": "https://orcid.org/0000-0001-6960-357X",
            'created': str(datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
            '@id': f'{settings.BASE_URI}/collections/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)

        # TODO: replace with https://w3id.org/fair-enough/metrics
        collec_id = "fair-enough-data"
        collec_obj = {
            "_id": collec_id,
            "title": "FAIR Enough dataset maturity indicators",
            "description": "Implementation of the FAIR Metrics maturity indicators (https://github.com/FAIRMetrics/Metrics) in python to evaluate a dataset FAIRness",
            "homepage": "https://github.com/MaastrichtU-IDS/fair-enough-metrics",
            "assessments": [
                # f"{settings.TESTS_API_URL}/tests/a1-access-protocol",
                f"https://w3id.org/fair-enough/metrics/tests/a1-data-authorization",
                f"https://w3id.org/fair-enough/metrics/tests/a1-data-protocol",
                f"https://w3id.org/fair-enough/metrics/tests/a1-metadata-authorization",
                f"https://w3id.org/fair-enough/metrics/tests/a1-metadata-protocol",
                f"https://w3id.org/fair-enough/metrics/tests/a2-metadata-persistent",
                f"https://w3id.org/fair-enough/metrics/tests/f1-data-identifier-persistent",
                f"https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-persistent",
                f"https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-unique",
                f"https://w3id.org/fair-enough/metrics/tests/f2-grounded-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f2-structured-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f3-data-identifier-in-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f3-metadata-identifier-in-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f4-searchable",
                f"https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation-structured",
                f"https://w3id.org/fair-enough/metrics/tests/i1-data-knowledge-representation-semantic",
                f"https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-structured",
                f"https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-semantic",
                f"https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-known",
                f"https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-resolve",
                f"https://w3id.org/fair-enough/metrics/tests/i3-metadata-contains-outward-links",
                f"https://w3id.org/fair-enough/metrics/tests/r1-includes-license",
                f"https://w3id.org/fair-enough/metrics/tests/r1-includes-standard-license",
                # f"https://w3id.org/fair-enough/metrics/tests/a2-metadata-longevity",
                # f"https://w3id.org/fair-enough/metrics/tests/i3-check-sparl-endpoint",
                # f"https://w3id.org/fair-enough/metrics/tests/i3-data-management-plan",
                # f"https://w3id.org/fair-enough/metrics/tests/i3-use-references",
                # f"https://w3id.org/fair-enough/metrics/tests/r2-detailed-provenance",
                # f"https://w3id.org/fair-enough/metrics/tests/r3-meets-community-standards",
            ],
            "author": "https://orcid.org/0000-0002-1501-1082",
            'created': str(datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
            '@id': f'{settings.BASE_URI}/collections/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)

        collec_id = "fair-enough-metadata"
        collec_obj = {
            "_id": collec_id,
            "title": "FAIR Enough metadata maturity indicators",
            "description": "Implementation of the FAIR Metrics maturity indicators (https://github.com/FAIRMetrics/Metrics) in python to evaluate the FAIRness of a resource metadata",
            "homepage": "https://github.com/MaastrichtU-IDS/fair-enough-metrics",
            "assessments": [
                # f"{settings.TESTS_API_URL}/tests/a1-access-protocol",
                f"https://w3id.org/fair-enough/metrics/tests/a1-metadata-authorization",
                f"https://w3id.org/fair-enough/metrics/tests/a1-metadata-protocol",
                f"https://w3id.org/fair-enough/metrics/tests/a2-metadata-persistent",
                f"https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-persistent",
                f"https://w3id.org/fair-enough/metrics/tests/f1-metadata-identifier-unique",
                f"https://w3id.org/fair-enough/metrics/tests/f2-grounded-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f2-structured-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f3-metadata-identifier-in-metadata",
                f"https://w3id.org/fair-enough/metrics/tests/f4-searchable",
                f"https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-structured",
                f"https://w3id.org/fair-enough/metrics/tests/i1-metadata-knowledge-representation-semantic",
                f"https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-known",
                f"https://w3id.org/fair-enough/metrics/tests/i2-fair-vocabularies-resolve",
                f"https://w3id.org/fair-enough/metrics/tests/i3-metadata-contains-outward-links",
                f"https://w3id.org/fair-enough/metrics/tests/r1-includes-license",
                f"https://w3id.org/fair-enough/metrics/tests/r1-includes-standard-license",
            ],
            "author": "https://orcid.org/0000-0002-1501-1082",
            'created': str(datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
            '@id': f'{settings.BASE_URI}/collections/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)

        
        collec_id = "rare-disease-maturity-indicators"
        collec_obj = {
            "_id": collec_id,
            "title": "FAIR maturity indicators for Rare Disease",
            "description": "FAIR Maturity Indicators for Rare Disease research",
            "homepage": "https://github.com/LUMC-BioSemantics/RD-FAIRmetric-F4",
            "assessments": [
                f"https://rare-disease.api.fair-enough.semanticscience.org/tests/RD-F4",
                f"https://rare-disease.api.fair-enough.semanticscience.org/tests/RD-R1-3",
            ],
            "author": "https://orcid.org/0000-0002-1501-1082",
            'created': str(datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
            '@id': f'{settings.BASE_URI}/collections/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)

        print(new_collection)