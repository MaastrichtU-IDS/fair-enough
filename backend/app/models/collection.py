from pydantic import BaseModel, Field, AnyUrl
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
# import strawberry

from app.config import settings
# from app.models import AssessmentModel

# FAIR evaluator API: http://smart-api.info/ui/4831dbbe28707c16b8c2b513b3523402

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# @strawberry.type
class CollectionModel(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    id: str = Field(..., alias="_id")
    # allow_population_by_field_name: bool = True
    title: str = Field(...)
    description: Optional[str] = None
    homepage: Optional[str] = None
    # homepage: Optional[AnyUrl] = None
    assessments: List[str] = []
    # assessments: List[AssessmentModel] = []
    author: str = Field(...)
    created: str = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+01:00")
    uri: str = Field(..., alias="@id")
    context: str = Field(..., alias="@context")

    # def __init__(self):
        # super().__init__()
        # print(self)
        # self.uri = 'toto'
        # self.context = {'title': 'dc:title'}

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "id": "fair-metrics",
                "title": "FAIR Metrics for dataset",
                "description": "A collection to evaluate a dataset FAIRness",
                "homepage": "https://github.com/FAIRMetrics/Metrics",
                "assessments": ["f1_unique_persistent_identifier"],
                "author": "https://orcid.org/0000-0000-0000-0000"
            }
        }

class CreateCollectionModel(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    id: str = Field(..., alias="_id")
    title: str = Field(...)
    description: Optional[str] = None
    homepage: Optional[AnyUrl] = None
    assessments: List[str] = []
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "id": "fair-metrics",
                "title": "FAIR Metrics for datasets",
                "description": "A collection to evaluate a dataset FAIRness",
                "homepage": "https://github.com/FAIRMetrics/Metrics",
                "assessments": [
                    f"{settings.TESTS_API_URL}/tests/RD-F4",
                ],
            }
        }

class UpdateCollectionModel(BaseModel):
    title: Optional[str]
    description: Optional[str] = None
    # description: Optional[str] = Field(...)
    homepage: Optional[AnyUrl] = None
    assessments: List[str]
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                # "id": "fair-metrics",
                "title": "FAIR Metrics for datasets",
                "description": "A collection to evaluate a dataset FAIRness",
                "homepage": "https://github.com/FAIRMetrics/Metrics",
                "assessments": ["f1_unique_persistent_identifier"]
            }
        }
