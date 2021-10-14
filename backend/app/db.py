from app.config import settings
# import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# https://github.com/michaldev/fastapi-async-mongodb
# https://art049.github.io/odmantic/usage_fastapi/

# https://www.codementor.io/@arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr

# def get_db():
#     client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
#     return client.evaluations

# db = get_db()


db_client: AsyncIOMotorClient = None

# db: AsyncIOMotorDatabase = AsyncIOMotorClient(settings.MONGODB_URL, maxPoolSize=10, minPoolSize=10).evaluations
db: AsyncIOMotorDatabase = None

def get_db() -> AsyncIOMotorDatabase:
    """Return Evaluations database client instance."""
    # db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    # return db_client.evaluations
    # print(db)
    return db


# db: AsyncIOMotorDatabase = get_db()


async def connect_db():
    """Create database connection."""
    global db
    # db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_client = AsyncIOMotorClient(settings.MONGODB_URL, 
        maxPoolSize=100, 
        minPoolSize=100)
    db = db_client.evaluations

async def close_db():
    """Close database connection."""
    db_client.close()



def init_db() -> None:
    """Initialize database if empty"""
    db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = db_client.evaluations

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
                "i2_fair_vocabularies",
                "r1_accessible_license"
            ],
            "author": "https://orcid.org/0000-00c02-1501-1082",
            '@id': f'{settings.BASE_URI}/collection/{collec_id}',
            '@context': settings.CONTEXT
        }
        new_collection = db["collections"].insert_one(collec_obj)
        print(new_collection)