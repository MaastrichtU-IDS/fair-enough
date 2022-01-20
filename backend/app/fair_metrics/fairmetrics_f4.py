from fastapi import FastAPI, APIRouter, Request, Response, Body
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from pydantic import BaseModel, Field

import requests
import rdflib
from rdflib import Graph, URIRef
from rdflib.namespace import RDF, DC, DCTERMS, RDFS

import datetime
import urllib.parse

router = APIRouter()


class EvalInput(BaseModel):
    subject: str = 'https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972'
    # https://ejprd.fair-dtls.surf-hosted.nl/wp13-fdp/dataset/c5414323-eab1-483f-a883-77951f246972


@router.post("/fm-f4-raredisease", name="Findable Rare Diseases",
    description="FAIR Metrics F4 for Rare Diseases",
    response_model=dict,
)            
def fairmetrics_f4(eval: EvalInput = Body(...)) -> dict:
    eval = jsonable_encoder(eval)
    fair_score = 0
    subject_uri = URIRef(eval['subject'])
    fdp_search_url = "https://home.fairdatapoint.org/search"
    comment = 'Could not find the resource in FAIR Data Point search'

    # Get and parse RDF from the resource
    r = requests.get(subject_uri)
    g = Graph()
    g.parse(data=r.text)
    print(f"Parsed {len(g)} triples")

    # Get the resource title
    subject_title = None
    title_preds = [ RDFS.label, DC.title, DCTERMS.title, URIRef('http://schema.org/name')]
    for title_pred in title_preds: 
        for s, p, o in g.triples((subject_uri, title_pred, None)):
            subject_title = str(o)
            print(f"Searching for this title in the FDP search: {o}")
        if subject_title:
            break
    
    # Search if title in FAIR Data Point search
    if subject_title:
        payload = {'q': subject_title}
        headers = {
            'Content-Type': "application/json"
        }
        response = requests.post(fdp_search_url, json=payload, headers=headers)

        for res in response.json():
            if res['uri'] == str(subject_uri):
                fair_score += 1
                comment = 'Resources corresponding to the subject found in the FAIR Data Point search'
                break

    else:
        comment = 'The subject title could not be found in the resource RDF.'


    eval_time = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")

    eval_service_url = 'http://w3id.org/FAIR_Tests/tests/rd_fairmetrics_f4'
    eval_uri = f"{eval_service_url}#{urllib.parse.quote(str(subject_uri))}/result-{eval_time}"
    print('eval_uri', eval_uri)

    result = [
    {
        "@id": eval_uri,
        "@type": [
            "http://fairmetrics.org/resources/metric_evaluation_result"
        ],
        "http://purl.obolibrary.org/obo/date": [
            {
                "@value": eval_time,
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        ],
        "http://schema.org/softwareVersion": [
        {
            "@value": "0.1",
            "@type": "http://www.w3.org/2001/XMLSchema#float"
        }
        ],
        "http://schema.org/comment": [
            {
            "@value": comment,
            "@language": "en"
            }
        ],
        "http://semanticscience.org/resource/SIO_000332": [
            {
            "@value": str(subject_uri),
            "@language": "en"
            }
        ],
        "http://semanticscience.org/resource/SIO_000300": [
            {
            "@value": float(fair_score),
            "@type": "http://www.w3.org/2001/XMLSchema#float"
            }
        ]
        }
    ]

    return JSONResponse(result)
