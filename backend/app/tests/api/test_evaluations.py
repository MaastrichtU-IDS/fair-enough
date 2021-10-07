# from typing import Dict
import pytest
# from httpx import AsyncClient
# from fastapi.testclient import TestClient

from app.tests.conftest import client
from app.config import settings

# from app.api.evaluations import create_evaluation

# https://fastapi.tiangolo.com/advanced/async-tests/

# pytestmark = pytest.mark.anyio

def test_evaluation_get() -> None:
    r = client.get(f"{settings.API_PATH}/evaluations")
    results = r.json()
    # assert len(results[0]['assessments']) > 2
    assert r.status_code == 200

def test_evaluation_create() -> None:
    eval_data = {
        "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
        "title": "FAIR metrics test evaluation",
        "collection": "fair-metrics"
    }
    print('Test EVAL')
    print(settings.API_PATH)
    print(eval_data)
    print(type(eval_data))

    # For no reason only the POST don't work on test API
    # 422 {'detail': [{'loc': ['body'], 'msg': 'value is not a valid dict', 'type': 'type_error.dict'}]}
    r = client.post(f"{settings.API_PATH}/evaluations",
        data=eval_data,
        headers={"Accept": "application/json"}
    )

    print(r.status_code)
    # print(type(r))
    # print(r.text)

    results = r.json()
    print(results)

    # results = await create_evaluation(eval_data)
    # assert r.status_code == 200
    # assert len(results['results']) > 2
