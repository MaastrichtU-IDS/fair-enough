from fastapi import FastAPI, APIRouter, Body, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from app.db import get_db
from rdflib import ConjunctiveGraph
from app.models import PyObjectId, CreateEvaluationModel, EvaluationModel, User, EvaluationResults, EvaluationScore, UpdateEvaluationModel
from app.api.login import get_current_user, reusable_oauth2
from app.config import settings

router = APIRouter()
db = get_db()

# @router.websocket("/evaluations")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()
#         await websocket.send_text(f"Message text was: {data}")

@router.post("/evaluations", 
    description="""You can run this evaluation without being authenticated, but if you are authenticated your ORCID will be added as author of the evaluation.

Examples of resources to evaluate:
* FAIR principle publication: https://doi.org/10.1038/sdata.2016.18
* Zenodo RDFLib library: https://doi.org/10.5281/zenodo.1486394
* Wikidata DOI: https://doi.org/10.1016/J.JBI.2019.103292
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
* ORCID profile: https://orcid.org/0000-0002-1501-1082""",
    response_description="Add a new evaluation", 
    response_model={})
async def create_evaluation(
        evaluation: CreateEvaluationModel = Body(...),
        current_user: Optional[User] = Depends(get_current_user)
    ):
    evaluation = jsonable_encoder(evaluation)

    # print(str(reusable_oauth2))
    # current_user = get_current_user(str(reusable_oauth2))
    if current_user:
        print('USER!!!')
        print(str(current_user))

    collection = await db["collections"].find_one({"_id": evaluation['collection']})
    if collection is None:
        raise HTTPException(status_code=404, detail=f"Provided collection {id} not found")

    assessment_list = collection['assessments']
    init_eval = {
        '_id': evaluation['_id'],
        'resource_uri': evaluation['resource_uri'],
        'title': evaluation['title'],
        'collection': evaluation['collection'],
        'data': {
            'alternative_uris': [evaluation['resource_uri']]
        },
        '@id': f'{settings.BASE_URI}/evaluation/{evaluation["_id"]}',
        '@context': settings.CONTEXT
    }
    if current_user:
        print('USER!!!')
        print(str(current_user))
        init_eval['author'] = current_user['id']
    else:
        init_eval['author'] = None
    eval = EvaluationModel(**init_eval)
    g = ConjunctiveGraph()

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

    # print(eval.dict(by_alias=True))
    new_evaluation = await db["evaluations"].insert_one(eval.dict(by_alias=True))
    print(type(new_evaluation.inserted_id))
    print(new_evaluation.inserted_id)
    created_evaluation = await db["evaluations"].find_one({"_id": new_evaluation.inserted_id})
    created_evaluation['_id'] = str(created_evaluation['_id'])
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_evaluation)


@router.get(
    "/evaluations", response_description="List all evaluations", 
    response_model=List[EvaluationModel]
)
async def list_evaluations():
    return await db["evaluations"].find().to_list(1000)


@router.get(
    "/evaluations/{id}", response_description="Get a single evaluation", response_model=EvaluationModel
)
async def show_evaluation(id: PyObjectId) -> EvaluationModel:
    print(id)
    evaluation = await db["evaluations"].find_one({"_id": id})
    print(evaluation)
    if evaluation is not None:
        return evaluation

    raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")


