import os
from fastapi import FastAPI, APIRouter, Body, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional, List
from app.db import get_db
from rdflib import ConjunctiveGraph
from app.models.evaluation import EvaluationData, CreateEvaluationModel, EvaluationModel, EvaluationResults, EvaluationScore, UpdateEvaluationModel

router = APIRouter()
db = get_db()


@router.post("/", 
    description="""Try also:
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
""",
    response_description="Add a new evaluation", 
    response_model={})
async def create_evaluation(evaluation: CreateEvaluationModel = Body(...)):
    evaluation = jsonable_encoder(evaluation)
    collection = await db["collections"].find_one({"_id": evaluation['collection']})
    if collection is None:
        raise HTTPException(status_code=404, detail=f"Provided collection {id} not found")

    assessment_list = collection['assessments']
    # eval = EvaluationModel(
    #     id=evaluation['_id'],
    #     reso
    # )
    init_eval = {
        '_id': evaluation['_id'],
        'resource_uri': evaluation['resource_uri'],
        'title': evaluation['title'],
        'collection': evaluation['collection'],
        'data': {
            'alternative_uris': [evaluation['resource_uri']]
        }
    }
    eval = EvaluationModel(**init_eval)
    g = ConjunctiveGraph()

    # Import each assessment listed in the collection
    for assess_name in assessment_list:
        print('Import ' + assess_name)
        import importlib
        Assessment = getattr(importlib.import_module('app.assessments.' + assess_name), "Assessment")
        # module = __import__('app.assessments.' + assess_name, fromlist=['Assessment'])
        # Assessment = getattr(module, 'Assessment')
        assess = Assessment()
        try: 
            eval, g = assess.runEvaluate(eval, g)
        except Exception as e:
            print('❌ Error running the test ' + assess_name)
            print(e)

    print(eval)

    # Calculate the total score
    # for fair_type in ['f', 'a', 'i', 'r']:
    for result in eval.results:
        eval.score.total_score += result['score']
        eval.score.total_score_max += result['max_score']
        # if 'bonus_score' in result.keys() and 'max_bonus' in result.keys():
        eval.score.total_bonus += result['bonus_score']
        eval.score.total_bonus_max += result['max_bonus']
    if eval.score.total_score_max > 0:
        eval.score.percent = str(int(eval.score.total_score * 100 / eval.score.total_score_max)) + '%'
    else:
        eval.score.percent = '0%'

    print(eval.dict(by_alias=True))
    new_evaluation = await db["evaluations"].insert_one(eval.dict(by_alias=True))
    created_evaluation = await db["evaluations"].find_one({"_id": new_evaluation.inserted_id})
    created_evaluation['_id'] = str(created_evaluation['_id'])
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_evaluation)

@router.get(
    "/", response_description="List all evaluations", 
    response_model=List[EvaluationModel]
)
async def list_evaluations():
    return await db["evaluations"].find().to_list(1000)


@router.get(
    "/{id}", response_description="Get a single evaluation", response_model=EvaluationModel
)
async def show_evaluation(id: str):
    evaluation = await db["evaluations"].find_one({"_id": id})
    if evaluation is not None:
        return evaluation

    raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")


# @router.put("/{id}", response_description="Update a evaluation", response_model=EvaluationModel)
# async def update_evaluation(
#         id: str, 
#         evaluation: UpdateEvaluationModel = Body(...),
#         current_user: models.User = Depends(login.get_current_user) ):

#     evaluation = {k: v for k, v in evaluation.dict().items() if v is not None}

#     if len(evaluation) >= 1:
#         update_result = await db["evaluations"].update_one({"_id": id}, {"$set": evaluation})

#         if update_result.modified_count == 1:
#             updated_evaluation = await db["evaluations"].find_one({"_id": id})
#             if updated_evaluation is not None:
#                 return updated_evaluation
#     existing_evaluation = await db["evaluations"].find_one({"_id": id})
#     if existing_evaluation is not None:
#         return existing_evaluation

#     raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")


# @router.delete("/{id}", response_description="Delete a evaluation")
# async def delete_evaluation(id: str):
#     delete_result = await db["evaluations"].delete_one({"_id": id})

#     if delete_result.deleted_count == 1:
#         return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

#     raise HTTPException(status_code=404, detail=f"Evaluation {id} not found")
