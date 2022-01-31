# from raven import Client

from app.celery_app import celery_app
from app.config import settings
from app.models import PyObjectId, CreateEvaluationModel, EvaluationModel, User
from rdflib import Graph
import datetime
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# from app.db import get_db

from fastapi.encoders import jsonable_encoder

# client_sentry = Client(settings.SENTRY_DSN)


@celery_app.task(acks_late=True)
def run_evaluation(evaluation: CreateEvaluationModel,
        collection,
        current_user: User) -> EvaluationModel:
    assessment_list = collection['assessments']
    init_eval = {
        '_id': evaluation['_id'],
        'resource_uri': evaluation['resource_uri'],
        # 'title': evaluation['title'],
        'collection': evaluation['collection'],
        'data': {
            'alternative_uris': [evaluation['resource_uri']]
        },
        '@id': f'{settings.BASE_URI}/evaluations/{evaluation["_id"]}',
        '@context': settings.CONTEXT
    }
    if current_user:
        init_eval['author'] = current_user['id']
    else:
        init_eval['author'] = None
    eval = EvaluationModel(**init_eval)
    g = Graph()

    # Import each assessment listed in the collection
    for assess_name in assessment_list:
        assess_module = assess_name.replace('/', '.')
        print('Import ' + assess_module)
        import importlib
        Assessment = getattr(importlib.import_module('app.assessments.' + assess_module), "Assessment")
        # module = __import__('app.assessments.' + assess_name, fromlist=['Assessment'])
        # Assessment = getattr(module, 'Assessment')
        assess = Assessment(assess_name)
        try: 
            eval, g = assess.runEvaluate(eval, g)
        except Exception as e:
            print('❌ Error running the assessment ' + assess_name)
            print(e)

    eval.data['main_rdf_metadata'] = g.serialize(format='turtle', indent=2)

    print('END ASSESS IN WORKER')

    # Calculate the total score
    # for fair_type in ['f', 'a', 'i', 'r']:
    for result in eval.results:
        eval.score.total_score += result['score']
        eval.score.total_score_max += result['max_score']
        # if 'bonus_score' in result.keys() and 'max_bonus' in result.keys():
        eval.score.total_bonus += result['bonus_score']
        eval.score.total_bonus_max += result['max_bonus']
    if eval.score.total_score_max > 0:
        eval.score.percent = int(eval.score.total_score * 100 / eval.score.total_score_max)
        eval.score.bonus_percent = int(eval.score.total_bonus * 100 / eval.score.total_bonus_max)
    else:
        eval.score.percent = 0
        eval.score.bonus_percent = 0

    eval.created = str(datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))
    print('AFTER SCORE')

    print(eval.dict(by_alias=True))

    db = AsyncIOMotorClient(settings.MONGODB_URL).evaluations
    new_evaluation = db["evaluations"].insert_one(eval.dict(by_alias=True))
    # print(type(new_evaluation.inserted_id))
    # print(new_evaluation.inserted_id)
    print(new_evaluation)
    # created_evaluation = db["evaluations"].find_one({"_id": new_evaluation.inserted_id})
    # created_evaluation['_id'] = str(created_evaluation['_id'])
    
    # from fastapi import status
    # from fastapi.responses import JSONResponse
    # return JSONResponse(status_code=status.HTTP_201_CREATED, content=eval.dict(by_alias=True))
    # eval['_id'] = str(eval['_id'])
    eval = jsonable_encoder(eval)

    return eval

# @celery_app.task(acks_late=True)
# def task_evaluation(evaluation: CreateEvaluationModel,
#         collection,
#         current_user: User) -> EvaluationModel:
#     return run_evaluation(evaluation, collection, current_user)