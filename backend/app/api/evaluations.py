# from urllib import request
from fastapi import FastAPI, APIRouter, Body, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from starlette.responses import RedirectResponse
from rdflib import Graph
import requests
import concurrent.futures
import json
import yaml
from datetime import datetime
import hashlib
from app.models import CreateEvaluationModel, User
from app.api.login import get_current_user
from app.db import get_db
from app.config import settings

router = APIRouter()


@router.post("/evaluations", 
    description="""You can run this evaluation without being authenticated, but if you are authenticated your ORCID will be added as author of the evaluation.

Examples of resources to evaluate:
* FAIR principle publication: https://doi.org/10.1038/sdata.2016.18
* Zenodo RDFLib library: https://doi.org/10.5281/zenodo.1486394
* Wikidata DOI: https://doi.org/10.1016/J.JBI.2019.103292
* Dataverse NL: https://doi.org/10.34894/DR3I2A
* FAIR Data Point dataset: https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972
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
    start_time = datetime.now()
    evaluation = jsonable_encoder(evaluation)
    db = get_db()

    if len(evaluation['subject']) < 2:
        raise HTTPException(status_code=422, detail=f"No URL has been provided as subject to evaluate")

    collection = await db["collections"].find_one({"_id": evaluation['collection']})
    if collection is None:
        raise HTTPException(status_code=404, detail=f"Provided collection {id} not found")

    max_workers=20
    # Reduce number of workers for some URLs, otherwise they fail to respond under too many requests
    limit_for_urls = ['https://www.proteinatlas.org/']
    for limit_url in limit_for_urls:
        if str(evaluation['subject']).startswith(limit_url):
            max_workers=3

    # Send asynchronous requests to get each test result
    eval_results = async_requests(
        urls=collection['assessments'], 
        post_data={'subject': str(evaluation['subject'])},
        content_type='application/json',
        accept='application/json',
        max_workers=max_workers
    )

    eval = {
        'subject': evaluation['subject'],
        'collection': evaluation['collection'],
        'created_at': str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S")),
        'metadata': {}
    }
    eval_score = 0
    for test_url, test_res in eval_results.items():
        try:
            if isinstance(test_res, list) and len(test_res) > 0:
                if int(test_res[0]['http://semanticscience.org/resource/SIO_000300'][0]['@value']) >= 1:
                    eval_score += 1
                if test_res[0]['http://semanticscience.org/resource/metadata']:
                    # TODO: handle this better with a function
                    if 'title' in test_res[0]['http://semanticscience.org/resource/metadata'].keys():
                        if not 'title' in eval['metadata'].keys():
                            eval['metadata']['title'] = []
                        if isinstance(test_res[0]['http://semanticscience.org/resource/metadata']['title'], str):
                            test_res[0]['http://semanticscience.org/resource/metadata']['title'] = [test_res[0]['http://semanticscience.org/resource/metadata']['title']]
                        eval['metadata']['title'] = list(set(eval['metadata']['title'] + test_res[0]['http://semanticscience.org/resource/metadata']['title']))

                    if 'description' in test_res[0]['http://semanticscience.org/resource/metadata'].keys():
                        if not 'description' in eval['metadata'].keys():
                            eval['metadata']['description'] = []
                        if isinstance(test_res[0]['http://semanticscience.org/resource/metadata']['description'], str):
                            test_res[0]['http://semanticscience.org/resource/metadata']['description'] = [test_res[0]['http://semanticscience.org/resource/metadata']['description']]
                        eval['metadata']['description'] = list(set(eval['metadata']['description'] + test_res[0]['http://semanticscience.org/resource/metadata']['description']))

                    if 'license' in test_res[0]['http://semanticscience.org/resource/metadata'].keys():
                        print('EVAL LICENSE', test_res[0]['http://semanticscience.org/resource/metadata']['license'])
                        if not 'license' in eval['metadata'].keys():
                            eval['metadata']['license'] = []
                        # if isinstance(test_res[0]['http://semanticscience.org/resource/metadata']['license'], str):
                        #     test_res[0]['http://semanticscience.org/resource/metadata']['license'] = [test_res[0]['http://semanticscience.org/resource/metadata']['license']]
                        eval['metadata']['license'] = list(set(eval['metadata']['license'] + test_res[0]['http://semanticscience.org/resource/metadata']['license']))

                    if 'created' in test_res[0]['http://semanticscience.org/resource/metadata'].keys():
                        if not 'created' in eval['metadata'].keys():
                            eval['metadata']['created'] = []
                        eval['metadata']['created'] = list(set(eval['metadata']['created'] + test_res[0]['http://semanticscience.org/resource/metadata']['created']))

        except Exception as e:
            print(f'Could not get score for {test_url}', test_res)
    eval['score'] = eval_score
    eval['score_max'] = len(eval_results.keys())
    eval['score_percent'] = round(eval_score * 100 / len(eval_results.keys()), 2)

    if current_user:
        eval['author'] = current_user['id']

    eval['@type'] = 'http://semanticscience.org/resource/ProcessStatus'
    eval['@context'] = settings.CONTEXT

    eval['contains'] = eval_results
    eval['license'] = {'@id': settings.EVALUATION_LICENSE}

    # eval_results['summary'] = summary
    # Generate sha1 hash based on subject URL + time of evaluation
    eval_id = f'{evaluation["subject"]}/{datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")}'
    eval['_id'] = hashlib.sha1(eval_id.encode('utf-8')).hexdigest()
    # sha1 : http://localhost/rest/evaluations/22248f30cf44e74ae134b221894820b182c433a2
    # md5  : http://localhost/rest/evaluations/45af39b178f961d56131f1cb68d4d3df
    eval['@id'] = f'{settings.BASE_URI}/evaluations/{eval["_id"]}'

    run_time = datetime.now() - start_time
    eval['duration'] = str(run_time.total_seconds())

    # Add to MongoDB
    new_evaluation = await db["evaluations"].insert_one(eval)
    # print('NEW EVAL INSERTED: ', new_evaluation.inserted_id)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=eval)


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
    #         'subject': eval['subject'],
    #         'collection': eval['collection'],
    #         'score': eval['score'],
    #         'created': eval['created'],
    #         'author': eval['author'],
    #         '@id': eval['@id'],
    #     })
    return evals


api_responses={
    200: {
        "description": "SPARQL query results",
        "content": {
            "application/ld+json": {
                "results": {"bindings": []}, 'head': {'vars': []}
            },
            "text/turtle": {
                "example": "<http://subject> <http://predicate> <http://object> ."
            },
            # "application/xml": {
            #     "example": "<RDF></RDF>"
            # },
            "application/rdf+xml": {
                "example": '<?xml version="1.0" encoding="UTF-8"?> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF>'
            },
        },
    },
    400:{
        "description": "Bad Request",
    },
    403:{
        "description": "Forbidden",
    }, 
    422:{
        "description": "Unprocessable Entity",
    },
}


@router.get(
    "/evaluations/{id}", 
    response_description="Get a single evaluation", 
    response_model=dict, # response_model=EvaluationModel
    responses=api_responses
)
async def show_evaluation(id: str, accept: Optional[str] = Header(None)) -> dict:
    # id: PyObjectId
    db = get_db()

    evaluation = await db["evaluations"].find_one({"_id": id})
    
    if not evaluation is None:
        if accept.startswith('text/html'):
            return RedirectResponse(url=f'{settings.FRONTEND_URL}/evaluations/{str(id)}')
        
        if accept.startswith('text/turtle'):
            g = Graph()
            g.parse(data=json.dumps(evaluation), format="json-ld")
            # curl -L -H "Accept: text/turtle" http://localhost/evaluations/48e21fbc6d3a130e9c716d8a0aa67cb7cd2e4346
            return PlainTextResponse(g.serialize(format='turtle'), media_type='text/turtle')
        if accept.startswith('application/rdf+xml') or accept.startswith('text/xhtml+xml'):
            g = Graph()
            g.parse(data=json.dumps(evaluation), format="json-ld")
            # curl -L -H "Accept: application/rdf+xml" http://localhost/evaluations/48e21fbc6d3a130e9c716d8a0aa67cb7cd2e4346
            return PlainTextResponse(g.serialize(format='application/rdf+xml'), media_type='application/rdf+xml')
        return JSONResponse(content=evaluation, media_type='application/ld+json')
        # return evaluation
    raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")



def query_url(url, data, timeout=100, content_type=None, accept=None):
    headers = {}
    if content_type:
        headers['Content-Type'] = content_type
    if accept:
        headers['Accept'] = accept
    if data:
        return requests.post(url, json=data, timeout=timeout, headers=headers, allow_redirects=True)
    else:
        return requests.get(url, timeout=timeout, headers=headers, allow_redirects=True)


def async_requests(urls, post_data, content_type=None, accept=None, max_workers=30):
    responses = {}
    resp_ok = 0
    resp_err = 0
    timeout = 100
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(query_url, url, post_data, timeout, content_type, accept): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
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
        # print('Async requests OK/Errors', resp_ok, ' / ', resp_err)
        return responses



# @router.websocket("/evaluations")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()
#         await websocket.send_text(f"Message text was: {data}")
