import strawberry
from strawberry.asgi import GraphQL
from typing import List, Optional, Union, Any
from pydantic import BaseModel, Field
import json
from starlette.requests import Request
from starlette.websockets import WebSocket
from starlette.responses import Response 
from strawberry.types import Info
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings
# from app.models import EvaluationModel
# from app.api.collections import list_collections, show_collection

# https://strawberry.rocks/docs/general/schema-basics


class EnoughGraphQL(GraphQL):
    async def get_context(self, request: Union[Request, WebSocket], response: Optional[Response] = None) -> Any:
        db_client = AsyncIOMotorClient(settings.MONGODB_URL)
        return {"db": db_client.evaluations}


@strawberry.type
class User:
    name: str
    age: int

@strawberry.type
class CollectionModel:
    id: str
    title: str
    description: Optional[str]
    homepage: Optional[str]
    assessments: List[str]
    author: str
    created: str
    # uri: str = Field(alias="@id")
    # context: str = Field(alias="@context")


@strawberry.type
class EvaluationResults:
    id: str
    title: str
    description: str
    file_url: str
    fair_type: str
    metric_id: str
    logs: List[str]
    score: int = 0
    max_score: int = 1
    bonus_score: int = 0
    max_bonus: int = 1
    author: Optional[str] = None

@strawberry.type
class EvaluationScore:
    total_score: int = 0
    total_score_max: int = 0
    total_bonus: int = 0
    total_bonus_max: int = 0
    percent: Optional[int] = 0
    bonus_percent: Optional[int] = 0

@strawberry.type
class EvaluationModel:
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: str
    resource_uri: str
    collection: str
    author: Optional[str]
    score: Optional[EvaluationScore]
    results: Optional[List[EvaluationResults]]
    data: str
    created: str
    # data: Optional[EvaluationData] = EvaluationData()
    # uri: str = Field(..., alias="@id")
    # context: str = Field(..., alias="@context")


#  strawberry.field(resolver=collection_resolver)
@strawberry.type
class Query:
    # collections: List[CollectionModel] = strawberry.field(resolver=collection_resolver)
    # collection: CollectionModel = strawberry.field(resolver=collection_resolver)

    @strawberry.field
    def user(self) -> User:
        return User(name="Patrick", age=100)

    @strawberry.field
    async def collections(self, info: Info, id: Optional[str] = None) -> List[CollectionModel]:
        # db = get_db()
        db = info.context["db"]
        collections = await db["collections"].find().to_list(1000)
        collec_list = []
        for collec in collections:
            if id and id != collec['_id']:
                continue
            # if title and not collec['title'].lower().contains(title.lower()):
            #     continue
            collec['id'] = collec['_id']
            del collec['_id']
            del collec['@id']
            del collec['@context']
            collec_list.append(CollectionModel(**collec))
        return collec_list


    @strawberry.field
    async def evaluations(self, info: Info,
            id: Optional[str] = None,
            maxScore: Optional[int] = None,
            minScore: Optional[int] = None,
            maxBonus: Optional[int] = None,
            minBonus: Optional[int] = None,
            maxPercent: Optional[int] = None,
            minPercent: Optional[int] = None,
            
        ) -> List[EvaluationModel]:
        db = info.context["db"]
        evaluations = await db["evaluations"].find().to_list(1000)
        eval_list = []
        for eval in evaluations:
            if id and id != eval['_id']:
                continue
            if maxScore and maxScore > eval['score']['total_score']:
                continue
            if minScore and minScore < eval['score']['total_score']:
                continue
            if maxBonus and maxBonus > eval['score']['total_bonus']:
                continue
            if minBonus and minBonus < eval['score']['total_bonus']:
                continue
            if maxPercent and maxPercent > eval['score']['percent']:
                continue
            if minPercent and minPercent < eval['score']['percent']:
                continue
            result_list = []
            for result in eval['results']:
                # Convert the results list to objects
                del result['@id']
                del result['@context']
                result_list.append(EvaluationResults(**result))

            # Convert the evaluations to objects
            eval['results'] = result_list
            eval['score'] = EvaluationScore(**eval['score'])
            eval['id'] = eval['_id']
            del eval['_id']
            del eval['@id']
            del eval['@context']
            eval['data'] = json.dumps(eval['data'], indent=2)
            if 'author' not in eval.keys():
                eval['author'] = "noone"
            eval_list.append(EvaluationModel(**eval))
        return eval_list