from fastapi import FastAPI, APIRouter, Body
from typing import List
import os
import importlib
import pathlib
from rdflib import ConjunctiveGraph

from app.models import AssessmentModel, EvaluationModel
from app.config import settings

router = APIRouter()

@router.get(
    "/assessments", 
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
        assess_list.append(Assessment(assess_name).dict(by_alias=True))

    return assess_list

@router.post(
    "/assessments", 
    response_description="Run one assessment", 
    # response_model=List[AssessmentModel]
)
async def run_assessment(
        # assessment_id: str = 'f2_machine_readable_metadata',
        # resource_uri: str = 'https://doi.org/10.1594/PANGAEA.908011'
        assessment: dict = Body({
            'assessment_id': 'f2_machine_readable_metadata',
            'resource_uri': 'https://doi.org/10.1594/PANGAEA.908011'
        }),
    ) -> AssessmentModel:
    assess_module = assessment['assessment_id'].replace('/', '.')
    Assessment = getattr(importlib.import_module('app.assessments.' + assess_module), "Assessment")

    init_eval = {
        'resource_uri': assessment['resource_uri'],
        'title': 'Run assessment',
        'collection': 'fair-metrics',
        'data': {'alternative_uris': []},
        '@id': f'{settings.BASE_URI}/evaluation/run-assessment',
        '@context': settings.CONTEXT
    }
    eval = EvaluationModel(**init_eval)
    assess = Assessment(assessment['assessment_id'])
    g = ConjunctiveGraph()
    try: 
        eval, g = assess.runEvaluate(eval, g)
        return eval.results[0].dict(with_alias=True)
    except Exception as e:
        print('❌ Error running the assessment ' + assessment['assessment_id'])
        print(e)
