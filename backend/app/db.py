from app.config import settings
import motor.motor_asyncio


def get_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    return client.evaluations

db = get_db()

def init_db() -> None:
    db = get_db()
    collection = db["collections"].find_one({"_id": id})
    if collection is not None:
        print('Create a first collection in database: fair-dataset')
        collec_id = "fair-metrics"
        collec_obj = {
            "_id": collec_id,
            "title": "FAIR metrics",
            "description": "Implementation of the FAIR Metrics (Working Group result) to evaluate a dataset FAIRness",
            "homepage": "https://github.com/FAIRMetrics/Metrics",
            "assessments": [
                "f1_unique_persistent_identifier",
                "f2_machine_readable_metadata",
                "f3_identifier_in_metadata",
                "f4_searchable",
                "a1_access_protocol",
                "i1_knowledge_representation",
                "r1_accessible_license",
                "i2_fair_vocabularies"
            ],
            "author": "https://orcid.org/0000-00c02-1501-1082",
            '@id': f'{settings.BASE_URI}/collection/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)
        print(new_collection)