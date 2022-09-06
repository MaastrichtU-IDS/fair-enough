from typing import List, Optional

import requests
import yaml
from bson import ObjectId
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import AnyUrl, BaseModel, Field

# Plugin and serializer required to parse jsonld with rdflib

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



# class UpdateMetricTestModel(BaseModel):
#     id: Optional[str]
#     new_url: Optional[str]
#     # description: Optional[str] = None
#     # description: Optional[str] = Field(...)
#     # homepage: Optional[AnyUrl] = None

#     class Config:
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 "id": "https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier",
#                 "new_url": "https://w3id.org/FAIR_Tests/tests/gen2_unique_identifier",
#             }
#         }



# async def update_test(test_update, db):
#     existing_test = await db["metrics"].find_one({"_id": test_update.id})
    
#     if not existing_test:
#         raise HTTPException(status_code=422, detail=f"Provided metrics test URL {test_update.id} does not exist")

#     try:
#         # test = {k: v for k, v in test.dict(by_alias=True).items() if v is not None}

#         res = requests.get(test_update.new_url)
#         new_test = yaml.load(res.text, Loader=yaml.FullLoader)

#         if not new_test['info']['x-tests_metric']:
#             raise HTTPException(status_code=422, detail='Missing the field info.x-tests_metric in the YAML')
#         if not new_test['info']['x-applies_to_principle']:
#             raise HTTPException(status_code=422, detail='Missing the field info.x-applies_to_principle in the YAML')
        
#         new_test['_id'] = test_update.new_url
#         # print(testInfo)

#         update_result = await db["metrics"].update_one({"_id": test_update.id}, {"$set": new_test})

#         return JSONResponse(content=new_test)
#     except Exception as e:
#         raise HTTPException(status_code=422, detail=str(e))

