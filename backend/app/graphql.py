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
    author: Optional[str]
    created: Optional[str]
    # uri: str = Field(alias="@id")
    # context: str = Field(alias="@context")


@strawberry.type
class EvaluationModel:
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: str
    subject: str
    collection: str
    score: int
    score_max: int
    score_percent: float
    created_at: Optional[str]
    author: Optional[str]
    # results: Optional[List[EvaluationResults]]
    # contains: str
    # data: Optional[EvaluationData] = EvaluationData()
    # uri: str = Field(..., alias="@id")
    # context: str = Field(..., alias="@context")


#  strawberry.field(resolver=collection_resolver)
@strawberry.type
class Query:
    # collections: List[CollectionModel] = strawberry.field(resolver=collection_resolver)
    # collection: CollectionModel = strawberry.field(resolver=collection_resolver)


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
            # id: Optional[str] = None,
            subject: Optional[str] = None,
            collection: Optional[str] = None,
            maxScore: Optional[int] = None,
            minScore: Optional[int] = None,
            # maxBonus: Optional[int] = None,
            # minBonus: Optional[int] = None,
            maxPercent: Optional[int] = None,
            minPercent: Optional[int] = None,
            
        ) -> List[EvaluationModel]:
        db = info.context["db"]
        evaluations = await db["evaluations"].find().to_list(1000)
        eval_list = []
        for eval in evaluations:
            # if id and id != eval['_id']:
            #     continue
            if subject and subject != eval['subject']:
                continue
            if collection and collection != eval['collection']:
                continue
            if maxScore and maxScore < eval['score']:
                continue
            if minScore and minScore > eval['score']:
                continue
            # if maxBonus and maxBonus > eval['score_percent']:
            #     continue
            # if minBonus and minBonus < eval['score']['total_bonus']:
            #     continue
            if maxPercent and maxPercent < eval['score_percent']:
                continue
            if minPercent and minPercent > eval['score_percent']:
                continue
            # result_list = []
            # for result in eval['results']:
            #     # Convert the results list to objects
            #     del result['@id']
            #     del result['@context']
            #     result_list.append(EvaluationResults(**result))

            # Convert the evaluations to objects
            # eval['results'] = result_list
            # eval['score'] = EvaluationScore(**eval['score'])
            eval['id'] = eval['_id']
            del eval['_id']
            del eval['@id']
            del eval['@context']
            del eval['@type']
            del eval['contains']
            # eval['contains'] = json.dumps(eval['contains'], indent=2)
            if 'author' not in eval.keys():
                eval['author'] = "noone"
            print(eval)
            eval_list.append(EvaluationModel(**eval))
        return eval_list