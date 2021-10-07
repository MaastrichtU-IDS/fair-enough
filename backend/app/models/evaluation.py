from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
import strawberry


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


class EvaluationResults(BaseModel):
    # Same as AssessmentModel in api/assessments.py
    title: str
    description: str
    filename: str
    file_url: Optional[str]
    fair_type: str
    metric_id: str
    score: int = 0
    max_score: int = 1
    bonus_score: int = 0
    max_bonus: int = 1
    logs: List[str] = []


class EvaluationData(BaseModel):
    alternative_uris: List[str] = []
    resource_title: Optional[str]
    uri_protocol: Optional[str]
    uri_location: Optional[str]
    uri_doi: Optional[str]
    accessRights: Optional[str]
    license: Optional[str]
    content_negotiation: Optional[dict]
    identifier_in_metadata: Optional[dict]


class EvaluationScore(BaseModel):
    total_score: int = 0
    total_score_max: int = 0
    total_bonus: int = 0
    total_bonus_max: int = 0
    percent: Optional[str]


# @strawberry.type
class EvaluationModel(BaseModel):
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # id: str = Field(..., alias="_id")
    resource_uri: str = Field(...)
    title: str = Field(...)
    collection: str = Field(...)
    # results: dict
    # data: dict
    # score: dict
    results: Optional[List[EvaluationResults]] = []
    data: dict = {}
    # data: Optional[EvaluationData] = EvaluationData()
    score: Optional[EvaluationScore] = EvaluationScore()

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
                "title": "FAIR metrics dataset evaluation",
                "collection": "fair-metrics",
                'results': {'f': [], 'a': [], 'i': [], 'r': []},
                'data': {},
                'score': {}
            }
        }


class CreateEvaluationModel(BaseModel):
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    resource_uri: str = Field(...)
    title: str = Field(...)
    collection: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
                "title": "FAIR metrics dataset evaluation",
                "collection": "fair-metrics"
            }
        }


class UpdateEvaluationModel(BaseModel):
    resource_uri: Optional[str]
    title: Optional[str]
    collection: Optional[str]
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
                "title": "FAIR metrics dataset evaluation",
                "collection": "fair-metrics"
            }
        }

