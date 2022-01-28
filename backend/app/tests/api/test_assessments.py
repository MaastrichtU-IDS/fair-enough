# from typing import Dict
import pytest
import json
# from httpx import AsyncClient
# from fastapi.testclient import TestClient

from app.config import settings
from app.tests.conftest import client


def test_register_metrics(test_client) -> None:
    data = {
        "url": "https://w3id.org/FAIR_Tests/tests/gen2_metadata_identifier_persistence"
    }
    r = test_client.post(f"{settings.API_PATH}/metric-test",
        data=json.dumps(data),
        # headers={"Accept": "application/json"}
    )
    results = r.json()
    assert r.status_code == 201
    # assert len(results['results']) > 2

    r = test_client.get(f"{settings.API_PATH}/metric-tests")
    print(r)
    results = r.json()
    # print(results)
    assert len(results) > 0
    assert r.status_code == 200

