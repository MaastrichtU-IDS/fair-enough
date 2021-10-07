import os
from fastapi import FastAPI, APIRouter
from typing import List
import pathlib
from app.models.assessment import AssessmentModel

router = APIRouter()

def get_assessments() -> List:
    assess_path = str(pathlib.Path(__file__).parent.resolve()) + '/../../assessments'
    print(assess_path)
    files_list = os.listdir(assess_path)
    assess_list = []
    for file in files_list:
        if file.endswith('.py') and file != '__init__.py':
            assess_list.append(file[:-3])

    return assess_list

@router.get(
    "/", response_description="List all assessments", response_model=List[str]
)
async def list_assessments():
    # assessments = await db["assessments"].find().to_list(1000)
    return get_assessments()




# class PyObjectId(ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid objectid")
#         return ObjectId(v)

#     @classmethod
#     def __modify_schema__(cls, field_schema):
#         field_schema.update(type="string")


# class AssessmentModel(BaseModel):
#     # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
#     id: str = Field(..., alias="_id")
#     title: str = Field(...)
#     description: Optional[str] = None
#     assessments: List[str] = []
#     author: str = Field(...)
#     class Config:
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 "id": "fair-dataset",
#                 "title": "FAIR dataset",
#                 "description": "A assessment to evaluate a dataset FAIRness",
#                 "assessments": ["f1_1_assess_unique_identifier"],
#                 "author": "https://orcid.org/0000-0000-0000-0000"
#             }
#         }

# class CreateAssessmentModel(BaseModel):
#     # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
#     id: str = Field(..., alias="_id")
#     title: str = Field(...)
#     description: Optional[str] = None
#     assessments: List[str] = []
#     class Config:
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 "id": "fair-dataset",
#                 "title": "FAIR dataset",
#                 "description": "A assessment to evaluate a dataset FAIRness",
#                 "assessments": ["f1_1_assess_unique_identifier", "f1_2_assess_persistent_identifier"],
#             }
#         }

# class UpdateAssessmentModel(BaseModel):
#     title: Optional[str]
#     description: Optional[str] = None
#     # description: Optional[str] = Field(...)
#     assessments: List[str]
#     class Config:
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 # "id": "fair-dataset",
#                 "title": "FAIR dataset",
#                 "description": "A assessment to evaluate a dataset FAIRness",
#                 "assessments": ["f1_1_assess_unique_identifier"]
#             }
#         }


# @router.post("/", response_description="Add a new assessment", response_model=AssessmentModel)
# async def create_assessment(
#         assessment: CreateAssessmentModel = Body(...),
#         current_user: models.User = Depends(login.get_current_user)):
#     assessment = jsonable_encoder(assessment)
#     print(current_user)
#     collec_obj = {
#         '_id': assessment['_id'],
#         'title': assessment['title'],
#         'description': assessment['description'],
#         'assessments': assessment['assessments'],
#         'author': current_user['id']
#     }
#     new_assessment = await db["assessments"].insert_one(collec_obj)
#     created_assessment = await db["assessments"].find_one({"_id": new_assessment.inserted_id})
#     return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment)


# @router.get(
#     "/{id}", response_description="Get a single assessment", response_model=AssessmentModel
# )
# async def show_assessment(id: str):
#     assessment = await db["assessments"].find_one({"_id": id})
#     if assessment is not None:
#         return assessment

#     raise HTTPException(status_code=404, detail=f"Assessment {id} not found")


# @router.put("/{id}", response_description="Update a assessment", response_model=AssessmentModel)
# async def update_assessment(
#         id: str, 
#         assessment: UpdateAssessmentModel = Body(...),
#         current_user: models.User = Depends(login.get_current_user) ):

#     assessment = {k: v for k, v in assessment.dict().items() if v is not None}

#     if len(assessment) >= 1:
#         update_result = await db["assessments"].update_one({"_id": id}, {"$set": assessment})

#         if update_result.modified_count == 1:
#             updated_assessment = await db["assessments"].find_one({"_id": id})
#             if updated_assessment is not None:
#                 return updated_assessment
#     existing_assessment = await db["assessments"].find_one({"_id": id})
#     if existing_assessment is not None:
#         return existing_assessment

#     raise HTTPException(status_code=404, detail=f"Assessment {id} not found")


# @router.delete("/{id}", response_description="Delete a assessment")
# async def delete_assessment(id: str):
#     delete_result = await db["assessments"].delete_one({"_id": id})

#     if delete_result.deleted_count == 1:
#         return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

#     raise HTTPException(status_code=404, detail=f"Assessment {id} not found")