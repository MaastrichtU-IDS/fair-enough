import datetime
import json
import urllib.parse
from typing import List, Optional

import requests
import yaml
from app.config import settings
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Plugin and serializer required to parse jsonld with rdflib
from pyld import jsonld
from rdflib import Graph, URIRef

# import logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)


async def register_test(test, db):
    existing_test = await db["metrics"].find_one({"_id": test['url']})
    if not existing_test is None:
        raise HTTPException(status_code=422, detail=f"Provided metrics test URL {test['url']} has already been registered")

    try: 
        res = requests.get(test['url'])
        testInfo = yaml.load(res.text, Loader=yaml.FullLoader)

        if not testInfo['info']['x-tests_metric']:
            raise HTTPException(status_code=422, detail='Missing the field info.x-tests_metric in the YAML')
        if not testInfo['info']['x-applies_to_principle']:
            raise HTTPException(status_code=422, detail='Missing the field info.x-applies_to_principle in the YAML')
        testInfo['_id'] = test['url']
        print(testInfo)
        new_entry = await db["metrics"].insert_one(testInfo)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=testInfo)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

