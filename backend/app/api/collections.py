from fastapi import FastAPI, APIRouter, Body, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List
from pymongo.errors import DuplicateKeyError

from app import models
from app.api import login, assessments
from app.db import get_db
from app.config import settings
from app.models.collection import CollectionModel, CreateCollectionModel, UpdateCollectionModel


router = APIRouter()
# db = get_db()


@router.post("/", response_description="Add a new collection", response_model=CollectionModel)
async def create_collection(
        collection: CreateCollectionModel = Body(...),
        current_user: models.User = Depends(login.get_current_user)):
    collection = jsonable_encoder(collection)
    db = get_db()

    # Check if given assessments exist
    # all_assessments = await 
    all_assessments = await assessments.list_assessments()
    all_assess_names = []
    for assess in all_assessments:
        all_assess_names.append(assess['id'])
    if not all(item in all_assess_names for item in collection['assessments']):
        raise HTTPException(status_code=404, detail=f"Assessment {', '.join(collection['assessments'])} not found")

    collec_obj = {
        '_id': collection['_id'],
        'title': collection['title'],
        'description': collection['description'],
        'homepage': collection['homepage'],
        'assessments': collection['assessments'],
        'author': current_user['id'],
        '@id': f'{settings.BASE_URI}/collection/{collection["_id"]}',
        '@context': settings.CONTEXT
    }
    # posts_list.append(PostDB(**post, id=post['_id']))

    try:
        new_collection = await db["collections"].insert_one(collec_obj)
        created_collection = await db["collections"].find_one({"_id": new_collection.inserted_id})
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_collection)
    except DuplicateKeyError:
        raise HTTPException(status_code=403, detail=f"Collection {collection['_id']} already exists")


@router.get(
    "/", 
    response_description="List all collections", 
    response_model=List[CollectionModel],
    responses={
        200: {
            "content": {"application/ld+json": {}},
            "description": "Return as JSON-LD.",
        }
    },
)
async def list_collections() -> List[CollectionModel]:
    db = get_db()
    return JSONResponse(content=await db["collections"].find().to_list(1000))


@router.get(
    "/{id}", response_description="Get a single collection", response_model=CollectionModel
)
async def show_collection(id: str = 'fair-metrics') -> CollectionModel:
    db = get_db()
    collection = await db["collections"].find_one({"_id": id})
    if collection is not None:
        return collection

    raise HTTPException(status_code=404, detail=f"Collection {id} not found")


@router.put("/{id}", response_description="Update a collection", response_model=CollectionModel)
async def update_collection(
        id: str, 
        collection: UpdateCollectionModel = Body(...),
        current_user: models.User = Depends(login.get_current_user) ):
    collection = {k: v for k, v in collection.dict(by_alias=True).items() if v is not None}
    db = get_db()
    existing_collection = await db["collections"].find_one({"_id": id})

    # Check if the collection updated has been published by the same ORCID user
    if current_user['id'] != existing_collection['author']:
        raise HTTPException(status_code=503, detail=f"Collection belongs to {existing_collection['author']}, but you are logged with {current_user['id']}")

    if len(collection) >= 1:
        update_result = await db["collections"].update_one({"_id": id}, {"$set": collection})

        if update_result.modified_count == 1:
            updated_collection = await db["collections"].find_one({"_id": id})
            if updated_collection is not None:
                return updated_collection
    existing_collection = await db["collections"].find_one({"_id": id})
    if existing_collection is not None:
        return existing_collection

    raise HTTPException(status_code=404, detail=f"Collection {id} not found")


@router.delete("/{id}", response_description="Delete a collection")
async def delete_collection(id: str, current_user: models.User = Depends(login.get_current_user)):
    db = get_db()
    delete_result = await db["collections"].delete_one({"_id": id})

    # Check if the deleted collection has been published by the same ORCID user
    existing_collection = await db["collections"].find_one({"_id": id})
    if current_user['id'] != existing_collection['author']:
        raise HTTPException(status_code=503, detail=f"Collection belongs to {existing_collection['author']}, but you are logged with {current_user['id']}")

    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Collection {id} not found")