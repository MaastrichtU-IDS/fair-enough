# from typing import Dict
import pytest
# from fastapi.testclient import TestClient
# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# from httpx import AsyncClient
# from httpx import AsyncClient

from app.config import settings
# from app.tests.conftest import client

# @pytest.mark.anyio
# def test_collections(client: AsyncClient) -> None:

# @pytest.mark.anyio
def test_collections(test_client) -> None:
    # async with AsyncClient(app=app, base_url="http://localhost") as ac:
    #     response = await ac.get("/")
    r = test_client.get(f"{settings.API_PATH}/collections")
    results = r.json()
    print(results)
    assert len(results[0]['assessments']) > 0
    assert r.status_code == 200
