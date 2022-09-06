from typing import List

from app.api.login import get_current_user
from app.config import settings
from app.db import get_db
from app.models import User, register_test
from fastapi import APIRouter, Body, Depends, HTTPException

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



## Can't work because ID is immutable
# @router.put("/metrics/{id}", 
#     response_description="Update a Metric Test",
#     # response_model=CollectionModel
# )
# async def update_metric_test(
#         test_to_update: UpdateMetricTestModel = Body(...),
#         current_user: User = Depends(get_current_user) 
#     ) -> dict:

#     # Check if the collection updated has been published by the same ORCID user
#     if not current_user or current_user['id'] != settings.ADMIN_ORCID:
#         raise HTTPException(status_code=403, detail=f"Metric test can only be updated by the admin of the API, please contact {settings.ADMIN_ORCID} for requesting the update a registered metric test")

#     db = get_db()
#     return await update_test(test_to_update, db)


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
