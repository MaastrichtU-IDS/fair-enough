from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
# import strawberry

# @strawberry.type
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
class EvaluationResults(BaseModel):
    # Same as AssessmentModel in api/assessments.py
    id: str
    title: str
    description: str
    # filename: str
    author: Optional[str] = None
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

# @strawberry.type
class EvaluationScore(BaseModel):
    total_score: int = 0
    total_score_max: int = 0
    total_bonus: int = 0
    total_bonus_max: int = 0
    percent: Optional[int] = 0
    bonus_percent: Optional[int] = 0


# @strawberry.type
class EvaluationModel(BaseModel):
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # id: str = Field(..., alias="_id")
    resource_uri: str = Field(...)
    collection: str = Field(...)
    # title: Optional[str] = Field(...)
    author: Optional[str] = None
    score: Optional[EvaluationScore] = EvaluationScore()
    created: str = ''
    results: Optional[List[EvaluationResults]] = []
    data: dict = Field(default={})
    # data: Optional[EvaluationData] = EvaluationData()
    uri: str = Field(..., alias="@id")
    context: str = Field(..., alias="@context")

    # @strawberry.type
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
                # "title": "FAIR metrics dataset evaluation",
                "collection": "fair-metrics",
                'results':[],
                'data': {},
                'score': {}
            }
        }


class CreateEvaluationModel(BaseModel):
    # id: str = Field(default_factory=PyObjectId, alias="_id")
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    resource_uri: str = Field(...)
    collection: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972",
                "collection": "fair-metrics-maturity-indicators"
            }
        }


class UpdateEvaluationModel(BaseModel):
    resource_uri: Optional[str]
    collection: Optional[str]
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
                "collection": "fair-metrics"
            }
        }

