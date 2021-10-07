# from typing import Dict
import pytest
# from httpx import AsyncClient
# from fastapi.testclient import TestClient

from app.config import settings
from app.tests.conftest import client

# @pytest.mark.anyio
# def test_collections(client: AsyncClient) -> None:

def test_collections() -> None:
    r = client.get(f"{settings.API_PATH}/collections")
    results = r.json()
    print(results)
    assert len(results[0]['assessments']) > 2
    assert r.status_code == 200
