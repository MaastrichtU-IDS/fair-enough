from fastapi import FastAPI, APIRouter
from typing import List
import os
import pathlib

from app.models import AssessmentModel

router = APIRouter()

@router.get(
    "/", 
    response_description="List all assessments", 
    # response_model=List[AssessmentModel]
)
async def list_assessments() -> List[AssessmentModel]:
    assessments_path = str(pathlib.Path(__file__).parent.resolve()) + '/../assessments'

    # First get the assessments filepath
    assess_name_list = []
    for path, subdirs, files in os.walk(assessments_path):
        for filename in files:
            if not path.endswith('__pycache__') and not filename.endswith('__init__.py'):
                filepath = path.replace(assessments_path, '')
                if filepath:
                    assess_name_list.append(filepath[1:] + '/' + filename[:-3])
                else:
                    assess_name_list.append(filename[:-3])

    assess_list = []
    # Then import each assessment listed in the assessments folder
    for assess_name in assess_name_list:
        assess_module = assess_name.replace('/', '.')
        # print('Import ' + assess_module)
        import importlib
        Assessment = getattr(importlib.import_module('app.assessments.' + assess_module), "Assessment")
        # module = __import__('app.assessments.' + assess_name, fromlist=['Assessment'])
        # Assessment = getattr(module, 'Assessment')
        assess_list.append(Assessment(assess_name).dict())

    return assess_list
