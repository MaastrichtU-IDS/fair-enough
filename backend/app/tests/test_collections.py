from typing import Dict

from fastapi.testclient import TestClient

from app.config import settings


def test_collections(client: TestClient) -> None:
    # r = client.post(f"{settings.API_PATH}/login/access-token", data=login_data)
    r = client.get(f"{settings.API_PATH}/collections")
    results = r.json()
    print(results)
    assert len(results[0]['assessments']) > 2
    assert r.status_code == 200
    # assert "access_token" in tokens
    # assert results["access_token"]

