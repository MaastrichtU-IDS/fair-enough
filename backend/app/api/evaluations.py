# from urllib import request
from fastapi import FastAPI, APIRouter, Body, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# from typing import Collection, List, Optional
from typing import List, Optional
from starlette.responses import RedirectResponse
# from app.db import get_db, db
from app.db import get_db
from rdflib import ConjunctiveGraph
# from celery.result import AsyncResult
import asyncio
# import grequests
import requests
import concurrent.futures
import json
import yaml
from datetime import datetime
import hashlib
import urllib.parse

from app.models import PyObjectId, CreateEvaluationModel, EvaluationModel, User, EvaluationResults, EvaluationScore, UpdateEvaluationModel
from app.api.login import get_current_user, reusable_oauth2
from app.config import settings
from app.celery_app import celery_app
from app.worker import run_evaluation

router = APIRouter()
# db = get_db()


@router.post("/evaluations", 
    description="""You can run this evaluation without being authenticated, but if you are authenticated your ORCID will be added as author of the evaluation.

Examples of resources to evaluate:
* FAIR principle publication: https://doi.org/10.1038/sdata.2016.18
* Zenodo RDFLib library: https://doi.org/10.5281/zenodo.1486394
* Wikidata DOI: https://doi.org/10.1016/J.JBI.2019.103292
* Dataverse NL: https://doi.org/10.34894/DR3I2A
* FAIR Data Point distribution: https://purl.org/fairdatapoint/app/distribution/54a43c3e-8a6f-4a75-95c0-a2cb1e8c74ab
* FAIR sharing: https://doi.org/10.25504/FAIRsharing.jptb1m
* Pangea data repository: https://doi.org/10.1594/PANGAEA.908011
* Interoperability publication: https://doi.org/10.1045/november2015-vandesompel
* Bio2RDF publication: https://doi.org/10.1016/j.jbi.2008.03.004
* SIO publication: https://doi.org/10.1186/2041-1480-5-14
* SIO Ontology: http://semanticscience.org/ontology/sio.owl
* Kaggle: https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge 
* RIVM data repository: https://data.rivm.nl/meta/srv/eng/rdf.metadata.get?uuid=1c0fcd57-1102-4620-9cfa-441e93ea5604&approved=true
* NeuroDKG publication: https://doi.org/10.5281/zenodo.5541440
* Human Protein Atlas page: https://www.proteinatlas.org/ENSG00000084110-HAL
* ORCID profile: https://orcid.org/0000-0002-1501-1082""",
    response_description="Add a new evaluation", 
    response_model={})
async def create_evaluation(
        evaluation: CreateEvaluationModel = Body(...),
        current_user: Optional[User] = Depends(get_current_user)
    ):
    evaluation = jsonable_encoder(evaluation)
    db = get_db()
    print('Start evaluation!')

    collection = await db["collections"].find_one({"_id": evaluation['collection']})
    if collection is None:
        raise HTTPException(status_code=404, detail=f"Provided collection {id} not found")

    print(collection['assessments'])
    # Send asynchronous requests to get each test result
    # https://stackoverflow.com/questions/9110593/asynchronous-requests-with-python-requests
    eval_results = async_requests(
        urls=collection['assessments'], 
        post_data={'subject': evaluation['resource_uri']},
        content_type='application/json',
        accept='application/json'
    )

    summary = {
        'subject': evaluation['resource_uri'],
        'collection': evaluation['collection'],
        'created_at': str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
    }
    eval_score = 0
    for test_url, test_res in eval_results.items():
        try:
            if int(test_res[0]['http://semanticscience.org/resource/SIO_000300'][0]['@value']) >= 1:
                eval_score += 1
        except Exception as e:
            print(f'Could not get score for {test_url}')
            print(test_res)
    summary['score'] = eval_score
    summary['score_max'] = len(eval_results.keys())
    summary['score_percent'] = round(eval_score * 100 / len(eval_results.keys()), 2)

    if current_user:
        print(current_user)
        summary['http://purl.org/dc/terms/creator'] = current_user['id']

    eval_results['summary'] = summary
    # Generate sha1 hash based on subject URL + time of evaluation
    eval_id = f'{evaluation["resource_uri"]}/{datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")}'
    eval_results['_id'] = hashlib.sha1(eval_id.encode('utf-8')).hexdigest()
    # sha1 : http://localhost/rest/evaluation/22248f30cf44e74ae134b221894820b182c433a2
    # md5  : http://localhost/rest/evaluation/45af39b178f961d56131f1cb68d4d3df
    eval_results['@id'] = f'{settings.BASE_URI}/evaluation/{eval_results["_id"]}'


    # Add to MongoDB
    new_evaluation = await db["evaluations"].insert_one(eval_results)
    # print('NEW EVAL INSERTED: ', new_evaluation.inserted_id)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=eval_results)
    # return eval_results


@router.get(
    "/evaluations", response_description="List all evaluations", 
    # response_model=List[EvaluationModel]
    response_model=List[dict]
)
async def list_evaluations():
    db = get_db()
    # full_evals = await db["evaluations"].find().to_list()
    evals = await db["evaluations"].find().to_list(10000)

    # Do not return large fields like data to make it faster for the frontend
    # partial_evals = []
    # for eval in evals:
    #     partial_evals.append({
    #         '_id': str(eval['_id']),
    #         'resource_uri': eval['resource_uri'],
    #         'collection': eval['collection'],
    #         'score': eval['score'],
    #         'created': eval['created'],
    #         'author': eval['author'],
    #         '@id': eval['@id'],
    #     })
    return evals


@router.get(
    "/evaluation/{id}", 
    response_description="Get a single evaluation", 
    response_model=dict # response_model=EvaluationModel
)
async def show_evaluation(id: str, accept: Optional[str] = Header(None)) -> dict:
    # id: PyObjectId
    print('id!!!', id)
    db = get_db()

    evaluation = await db["evaluations"].find_one({"_id": id})
    # print(evaluation)
    # text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
    
    if not evaluation is None:
        # if accept.startswith('text/html'):
        #     return RedirectResponse(url=f'{settings.FRONTEND_URL}/evaluation/{str(id)}')
        # for result in evaluation:
        #     return result
        return evaluation
    raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")
    # return await db["evaluations"].find_one({"_id": id})



def query_url(url, timeout=100, data=None, content_type=None):
    headers = {}
    if content_type:
        headers['Content-Type'] = content_type
    if data:
        return requests.post(url, json=data, timeout=timeout, headers=headers)
    else:
        return requests.get(url, timeout=timeout, headers=headers)

def async_requests(urls, post_data=None, content_type=None, accept=None):
    responses = {}
    resp_ok = 0
    resp_err = 0
    print('URLLLLSS', urls)
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        future_to_url = {executor.submit(query_url, url, 100, post_data, content_type): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            print('url', url) 
            try:
                data = future.result()
                if accept == 'application/json':
                    responses[url] = json.loads(data.text)
                elif accept == 'text/x-yaml' or accept == 'yaml':
                    responses[url] = yaml.load(data.text, Loader=yaml.FullLoader)
                else:
                    responses[url] = data.text
            except Exception as exc:
                resp_err = resp_err + 1
                responses[url] = f'Error: {str(exc)}'
            else:
                resp_ok = resp_ok + 1
        print('Async requests OK/Errors', resp_ok, ' / ', resp_err)
        print(responses)
        return responses



# @router.websocket("/evaluations")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()
#         await websocket.send_text(f"Message text was: {data}")

# async def run_evaluation(
#         evaluation: CreateEvaluationModel,
#         collection,
#         current_user: Optional[User]) -> EvaluationModel:
#     assessment_list = collection['assessments']
#     init_eval = {
#         '_id': evaluation['_id'],
#         'resource_uri': evaluation['resource_uri'],
#         'title': evaluation['title'],
#         'collection': evaluation['collection'],
#         'data': {
#             'alternative_uris': [evaluation['resource_uri']]
#         },
#         '@id': f'{settings.BASE_URI}/evaluation/{evaluation["_id"]}',
#         '@context': settings.CONTEXT
#     }
#     if current_user:
#         print('USER!!!')
#         print(str(current_user))
#         init_eval['author'] = current_user['id']
#     else:
#         init_eval['author'] = None
#     eval = EvaluationModel(**init_eval)
#     g = ConjunctiveGraph()

#     # Import each assessment listed in the collection
#     for assess_name in assessment_list:
#         assess_module = assess_name.replace('/', '.')
#         print('Import ' + assess_module)
#         import importlib
#         Assessment = getattr(importlib.import_module('app.assessments.' + assess_module), "Assessment")
#         # module = __import__('app.assessments.' + assess_name, fromlist=['Assessment'])
#         # Assessment = getattr(module, 'Assessment')
#         assess = Assessment(assess_name)
#         try: 
#             eval, g = assess.runEvaluate(eval, g)
#         except Exception as e:
#             print('❌ Error running the assessment ' + assess_name)
#             print(e)

#     # Calculate the total score
#     # for fair_type in ['f', 'a', 'i', 'r']:
#     for result in eval.results:
#         eval.score.total_score += result['score']
#         eval.score.total_score_max += result['max_score']
#         # if 'bonus_score' in result.keys() and 'max_bonus' in result.keys():
#         eval.score.total_bonus += result['bonus_score']
#         eval.score.total_bonus_max += result['max_bonus']
#     if eval.score.total_score_max > 0:
#         eval.score.percent = int(eval.score.total_score * 100 / eval.score.total_score_max)
#         eval.score.bonus_percent = int(eval.score.total_bonus * 100 / eval.score.total_bonus_max)
#     else:
#         eval.score.percent = 0
#         eval.score.bonus_percent = 0
#     return eval
