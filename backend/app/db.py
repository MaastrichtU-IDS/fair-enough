from app.config import settings
import motor.motor_asyncio


def get_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    return client.evaluations


def init_db() -> None:
    db = get_db()
    collection = db["collections"].find_one({"_id": id})
    if collection is not None:
        print('Create a first collection in database: fair-dataset')
        collec_obj = {
            "_id": "fair-metrics",
            "title": "FAIR metrics",
            "description": "Implementation of the FAIR metrics (Working Group result) to evaluate a dataset FAIRness",
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
            "author": "https://orcid.org/0000-0002-1501-1082"
        }
        new_collection = db["collections"].insert_one(collec_obj)
        print(new_collection)