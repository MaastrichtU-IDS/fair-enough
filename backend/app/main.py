from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import strawberry

from app.graphql import EnoughGraphQL
from app.api.api import api_router
from app.config import settings
from app.graphql import Query
from app.db import connect_db, close_db


schema = strawberry.Schema(query=Query)
graphql_app = EnoughGraphQL(schema)


app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_PATH}/openapi.json",
    description=f"""APIs to evaluate how FAIR a resource is given its URI (URL identifier for this resource).
    
You don't need to login to run evaluations, but you will need to login with [ORCID](https://orcid.org) if you want to create a new collection of assessments.

To login, click on the **Authorize 🔓️** button, and use the 2nd option: **OpenIdConnect (OAuth2, implicit)**

You can access the web application at [{settings.FRONTEND_URL}]({settings.FRONTEND_URL})

You can also query FAIR enough using the experimental GraphQL endpoint at [/graphql](/graphql?query=query%20%7B%0A%09evaluations%20%7B%0A%20%20%20%20title%0A%20%20%20%20resourceUri%0A%20%20%20%20collection%0A%20%20%20%20score%20%7B%0A%20%20%20%20%20%20totalScore%0A%20%20%20%20%20%20totalScoreMax%0A%20%20%20%20%20%20percent%0A%20%20%20%20%20%20totalBonus%0A%20%20%20%20%20%20totalBonusMax%0A%20%20%20%20%20%20bonusPercent%0A%20%20%20%20%7D%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20fairType%0A%20%20%20%20%20%20metricId%0A%20%20%20%20%20%20score%0A%20%20%20%20%20%20maxScore%0A%20%20%20%20%20%20bonusScore%0A%20%20%20%20%20%20maxBonus%0A%20%20%20%20%20%20logs%0A%20%20%20%20%7D%0A%20%20%20%20data%0A%20%20%7D%0A%7D)

[Source code](https://github.com/MaastrichtU-IDS/fair-enough)
""",
    swagger_ui_init_oauth = {
        # https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/
        # "usePkceWithAuthorizationCodeGrant": True,
        "clientId": settings.ORCID_CLIENT_ID,
        "scopes": "/authenticate",
        "appName": "FAIR enough"
    },
    # terms_of_service = "https://github.com/MaastrichtU-IDS/fair-enough/blob/main/LICENSE",
    license_info = {
        "name": "MIT license",
        "url": "https://github.com/MaastrichtU-IDS/fair-enough/blob/main/LICENSE"
    },
    contact = {
        "name": "Vincent Emonet",
        "email": "vincent.emonet@gmail.com",
        # "url": "https://github.com/vemonet",
    },
)

app.add_route("/graphql", graphql_app)
app.add_websocket_route("/graphql", graphql_app)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(api_router, prefix=settings.API_PATH)

app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/", include_in_schema=False)
def redirect_root_to_docs():
    """Redirect the route / to /docs"""
    return RedirectResponse(url='/docs')
