# from typing import Dict
import pytest
# from httpx import AsyncClient
# from fastapi.testclient import TestClient

from app.config import settings
from app.tests.conftest import client


def test_assessments(test_client) -> None:
    r = test_client.get(f"{settings.API_PATH}/assessments")
    results = r.json()
    # print(results)
    assert len(results) > 3
    assert r.status_code == 200

