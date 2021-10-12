from pydantic import BaseModel, Field, AnyUrl
from typing import Optional, List
from bson import ObjectId
import strawberry

from app.config import settings

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
    author: str = Field(...)
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
                "title": "FAIR Metrics for dataset",
                "description": "A collection to evaluate a dataset FAIRness",
                "homepage": "https://github.com/FAIRMetrics/Metrics",
                "assessments": [
                    "f1_unique_persistent_identifier",
                    "f2_machine_readable_metadata",
                    "f3_identifier_in_metadata",
                    "f4_searchable",
                    "a1_access_protocol",
                    "i1_knowledge_representation",
                    "r1_accessible_license"
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
                "title": "FAIR Metrics for dataset",
                "description": "A collection to evaluate a dataset FAIRness",
                "homepage": "https://github.com/FAIRMetrics/Metrics",
                "assessments": ["f1_unique_persistent_identifier"]
            }
        }
