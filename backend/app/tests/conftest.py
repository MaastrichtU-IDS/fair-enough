from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# import motor.motor_asyncio
# import asyncio
from httpx import AsyncClient
# import os
# from sqlalchemy.orm import Session

from app.main import app
from app.config import settings
from app.db import connect_db, get_db
# from app.db.session import SessionLocal

# from app.tests.utils.user import authentication_token_from_email
# from app.tests.utils.utils import get_superuser_token_headers


# @app.on_event("startup")
# async def startup_event():
#     items["foo"] = {"name": "Fighters"}
#     items["bar"] = {"name": "Tenders"}

client = TestClient(app)
# connect_db()


@pytest.fixture(scope="session")
def db() -> Generator:
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    yield client.evaluations
    # yield SessionLocal()

# @pytest.fixture(scope="module")
# def client():
#     connect_db()
#     client = TestClient(app)
#     yield client

@pytest.fixture(scope="session")
def test_client():
    from app.main import app
    with TestClient(app) as test_client:
        yield test_client

    # import asyncio
    db = get_db()
    # db = asyncio.run(get_database())
    # db[database_name][users_collection_name].delete_one({"username": test_user["user"]["username"]})



# @pytest.fixture
# async def client():
#     # client = TestClient(app=app, base_url="http://localhost")
#     # client = AsyncClient(app=app, base_url="http://localhost")
#     async with AsyncClient(app=app, base_url="http://localhost") as ac:
#         yield client
#     # await client.shutdown()


# @pytest.fixture(scope="module")
# def client() -> Generator:
#     with TestClient(app) as c:
#         yield c

# @pytest.fixture(scope="module")
# def event_loop():
#     loop = asyncio.get_event_loop()
#     yield loop
#     loop.close()

# @pytest.fixture(scope='module')
# async def async_fixture():
#     return await AsyncClient(app=app, base_url="http://localhost")

# @pytest.mark.anyio

# @pytest.fixture(scope="module")
# @pytest.mark.asyncio
# async def client() -> Generator:
#     async with AsyncClient(app=app, base_url="http://test") as ac:
#         yield ac
#         # response = await ac.get("/")
#     # with TestClient(app) as c:
#     #     yield c


# @pytest.fixture(scope="module")
# def superuser_token_headers(client: TestClient) -> Dict[str, str]:
#     return get_superuser_token_headers(client)


# @pytest.fixture(scope="module")
# def normal_user_token_headers(client: TestClient, db: Session) -> Dict[str, str]:
#     return authentication_token_from_email(
#         client=client, email=settings.EMAIL_TEST_USER, db=db
#     )
