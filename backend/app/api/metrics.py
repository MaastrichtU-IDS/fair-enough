from fastapi import FastAPI, APIRouter, Body
from typing import List
from pydantic import BaseModel, Field
import os
import importlib
import pathlib
from rdflib import Graph

from app.models import AssessmentModel, EvaluationModel
from app.config import settings

router = APIRouter()

# class EvalInput(BaseModel):
#     subject: str = 'https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972'

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
    # assess_list.append(Assessment(assess_name).dict(by_alias=True))

    metric = Assessment(assess_name)
    metric_id = metric.fair_type + metric.metric_id + '_' + metric.title.lower().replace(' ', '_')

    # TODO: import the Assessment.metric() (@app decorated) to the APIRouter
    try:
        router.include_router(metric.api, tags=["metrics"])
    except Exception as e:
        print('❌ No API defined for ' + metric_id)

    # @router.post(
    #     "/" + metric_id,
    #     name=metric.title,
    #     description=metric.description,
    #     response_description="FAIR metric score", 
    #     # response_model=List[AssessmentModel]
    # )
    # async def fair_metrics(input: EvalInput = Body(...)) -> List[AssessmentModel]:
    #     try: 
    #         init_eval = {
    #             'resource_uri': input.subject,
    #             'title': 'Run assessment',
    #             'collection': 'fair-metrics',
    #             'data': {'alternative_uris': [input.subject]},
    #             '@id': f'{settings.BASE_URI}/evaluation/run-assessment',
    #             '@context': settings.CONTEXT
    #         }
    #         eval = EvaluationModel(**init_eval)
    #         g = Graph()

    #         eval, g = metric.runEvaluate(eval, g)
    #         # return eval.results[0].dict(with_alias=True)
    #         print(eval.results[0])
    #         eval.results[0]['data'] = eval.data
    #         return eval.results[0]

    #     except Exception as e:
    #         print('❌ Error running the assessment ' + metric_id)
    #         print(e)
