from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import strawberry
from strawberry.asgi import GraphQL

from app.api.api import api_router
from app.config import settings

from app.api.collections import list_collections, show_collection
from app.models import EvaluationModel, CollectionModel
from typing import List, Optional

# @strawberry.type
# class Query:
#     @strawberry.field
#     async def collections(self, id: str =None) -> List[CollectionModel]:
#         if id:
#             collection = await show_collection(id)
#             print(collection)
#             print(type(collection))
#             return collection
#         return await list_collections()

@strawberry.type
class User:
    name: str
    age: int

@strawberry.type
class Query:
    @strawberry.field
    def user(self) -> User:
        return User(name="Patrick", age=100)

schema = strawberry.Schema(query=Query)
graphql_app = GraphQL(schema)


app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_PATH}/openapi.json",
    description="""APIs to evaluate how FAIR a resource is given its URI (URL identifier for this resource).
    
You will need to login with [ORCID](https://orcid.org) to create new collections of assessments.

To login, click on the **Authorize 🔓️** button, and use the 2nd option: **OpenIdConnect (OAuth2, implicit)**""",
    swagger_ui_init_oauth = {
        # https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/
        # "usePkceWithAuthorizationCodeGrant": True,
        "clientId": settings.ORCID_CLIENT_ID,
        "scopes": "/authenticate",
        "appName": "FAIR enough"
    }
)

app.add_route("/graphql", graphql_app)
app.add_websocket_route("/graphql", graphql_app)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(api_router, prefix=settings.API_PATH)
