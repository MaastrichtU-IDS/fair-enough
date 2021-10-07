from typing import Dict

from fastapi.testclient import TestClient

from app.config import settings


def test_celery_worker_test(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    data = {"msg": "test"}
    r = client.post(
        f"{settings.API_PATH}/utils/test-celery/",
        json=data,
        headers=superuser_token_headers,
    )
    response = r.json()
    assert response["msg"] == "Word received"
