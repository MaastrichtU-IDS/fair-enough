import json
from typing import Any, Dict, List, Optional, Union

import strawberry
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from starlette.requests import Request
from starlette.responses import Response
from starlette.websockets import WebSocket
from strawberry.asgi import GraphQL
from strawberry.types import Info

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

# https://strawberry.rocks/docs/integrations/pydantic
# @strawberry.experimental.pydantic.type(CollectionModel, all_fields=True)
# class GraphqlCollection:
#     pass

# @strawberry.experimental.pydantic.type(EvaluationModel)
# class GraphqlEvaluation:
#     subject: strawberry.auto
#     collection: strawberry.auto
#     score: strawberry.auto
#     score_max: strawberry.auto
#     name: strawberry.auto = strawberry.field(
#         deprecation_reason="Because",
#         permission_classes=[MyPermission],
#         directives=[MyDirective],
#     )

@strawberry.type
class TestResults:
    metric_test: str
    score: int

@strawberry.input
class TestFiltered:
    metric: str
    score: int

@strawberry.type
class EvaluationModel:
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: str
    subject: str
    collection: str
    score: int
    score_max: int
    score_percent: float
    duration: float
    results: List[TestResults]
    created_at: Optional[str]
    author: Optional[str]
    # license: Optional[str]
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
            author: Optional[str] = None,
            maxScore: Optional[int] = None,
            minScore: Optional[int] = None,
            # maxBonus: Optional[int] = None,
            # minBonus: Optional[int] = None,
            maxPercent: Optional[int] = None,
            minPercent: Optional[int] = None,
            filterTests: Optional[List[TestFiltered]] = None,
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
            if author and author != eval['author']:
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

            # GraphqlEvaluation.from_pydantic(EvaluationModel(**eval))
            eval['id'] = eval['_id']
            del eval['_id']
            del eval['@id']
            del eval['@context']
            del eval['@type']
            eval['results'] = []

            filter_tests = {}
            filter_success = 0
            if filterTests:
                for ft in filterTests:
                    filter_tests[ft.metric] = ft.score

            # Add list of metrics tests individual scores
            for test_url, test_res in eval['contains'].items():
                if isinstance(test_res, list) and len(test_res) > 0:
                    if test_res[0]['http://semanticscience.org/resource/SIO_000300'][0]['@value']:
                        score = int(test_res[0]['http://semanticscience.org/resource/SIO_000300'][0]['@value'])
                        eval['results'].append(TestResults(**{
                            'metric_test': test_url,
                            'score': score,
                        }))

                        if test_url in filter_tests:
                            if score == filter_tests[test_url]:
                                filter_success += 1 
            
            if filterTests:
                # If filter tests enabled, check if we have as many success as we have tests
                if filter_success < len(filterTests):
                    continue

            del eval['contains']
            
            if 'license' in eval.keys():
                del eval['license']
            if 'metadata' in eval.keys():
                del eval['metadata']
            if 'name' in eval.keys():
                del eval['name']
            # eval['contains'] = json.dumps(eval['contains'], indent=2)
            if 'author' not in eval.keys():
                eval['author'] = ""
            if 'duration' not in eval.keys():
                eval['duration'] = ""
            print(eval)
            eval_list.append(EvaluationModel(**eval))
        return eval_list