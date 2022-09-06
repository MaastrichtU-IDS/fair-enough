from typing import List

from app.db import get_db
from app.models.metric_test import register_test
from fastapi import APIRouter, Body

router = APIRouter()

@router.get(
    "/metrics", 
    response_description="List all metrics tests", 
    # response_model=List[dict]
)
async def list_tests() -> List[dict]:
    db = get_db()
    tests = await db["metrics"].find().to_list(10000)
    return tests


@router.post(
    "/metrics", 
    response_description="Register a metrics test by providing its URL", 
    # response_model=List[AssessmentModel]
)
async def register_tests(
        test: dict = Body({
            'url': 'https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_persistence',
        }),
    ) -> dict:
    db = get_db()
    return await register_test(test, db)




# @router.put("/metrics/{id}", 
#     response_description="Update a Metric Test", 
#     # response_model=CollectionModel
# )
# async def update_metric_test(
#         id: str, 
#         collection: UpdateCollectionModel = Body(...),
#         current_user: models.User = Depends(login.get_current_user) ):
#     db = get_db()
#     existing_collection = await db["collections"].find_one({"_id": id})

#     # Check if the collection updated has been published by the same ORCID user
#     if current_user['id'] != existing_collection['author']:
#         raise HTTPException(status_code=403, detail=f"Collection belongs to {existing_collection['author']}, but you are logged with {current_user['id']}")

#     # Convert the collection to update object to a dict
#     collection = {k: v for k, v in collection.dict(by_alias=True).items() if v is not None}
#     if len(collection) >= 1:
#         update_result = await db["collections"].update_one({"_id": id}, {"$set": collection})

#         if update_result.modified_count == 1:
#             updated_collection = await db["collections"].find_one({"_id": id})
#             if updated_collection is not None:
#                 return updated_collection
#     else:
#         raise HTTPException(status_code=422, detail=f"No new values provided to update the collection")

#     existing_collection = await db["collections"].find_one({"_id": id})
#     if existing_collection is not None:
#         return existing_collection

#     raise HTTPException(status_code=404, detail=f"Collection {id} not found")



# @router.get(
#     "/metrics/{id}", 
#     response_description="Get a specific metrics test", 
#     # response_model=dict
# )
# async def get_test(id: str) -> dict:
#     db = get_db()
#     existing_test = await db["metrics"].find_one({"_id": id})
#     if existing_test is None:
#         raise HTTPException(status_code=404, detail=f"Test {id} not found")

#     return existing_test
