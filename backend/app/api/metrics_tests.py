from fastapi import FastAPI, APIRouter, Body, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
import os
import importlib
import pathlib
import requests
import yaml
from rdflib import Graph

# from app.models import AssessmentModel, EvaluationModel
from app.config import settings
from app.db import get_db
from app.models.metric_test import register_test

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
