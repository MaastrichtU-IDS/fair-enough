from fastapi import FastAPI, APIRouter, Request, Response, Body
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from pydantic import BaseModel, Field

import requests
import rdflib
from rdflib import Graph, URIRef
from rdflib.namespace import RDF, DC, DCTERMS, RDFS
from pyshex import ShExEvaluator
from pyshex.shex_evaluator import EvaluationResult

import datetime
import urllib.parse

router = APIRouter()

class EvalInput(BaseModel):
    subject: str = 'https://raw.githubusercontent.com/ejp-rd-vp/resource-metadata-schema/master/data/example-rdf/turtle/patientRegistry.ttl'
    # https://ejprd.fair-dtls.surf-hosted.nl/wp13-fdp/dataset/c5414323-eab1-483f-a883-77951f246972


patientregistry_shex = """PREFIX : <http://purl.org/ejp-rd/metadata-model/v1/shex/>
PREFIX dcat:  <http://www.w3.org/ns/dcat#>
PREFIX dct:   <http://purl.org/dc/terms/>
PREFIX ejp:   <http://purl.org/ejp-rd/vocabulary/>
PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX sio:  <http://semanticscience.org/resource/>
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
:patientRegistryShape IRI {
  a [ejp:PatientRegistry];
  dct:title xsd:string;
  dct:description xsd:string*;
  ejp:populationCoverage @:populationCoverageShape*;
  dcat:theme IRI+;
  dct:publisher @:organisationShape;
  foaf:page IRI*
}
:locationShape IRI {
  a [dct:Location];
  dct:title xsd:string;
  dct:description xsd:string*;
}
:organisationShape IRI {
  a [foaf:Organisation];
  dct:title xsd:string;
  dct:description xsd:string*;
  dct:spatial @:locationShape*;
  foaf:page IRI*
}
:populationCoverageShape IRI {
  a [sio:SIO_001166];
  rdfs:label ["National" "International" "Regional"]
}"""

rdf_test = """@prefix : <http://purl.org/ejp-rd/metadata-model/v1/example-rdf/> .
@prefix dcat:  <http://www.w3.org/ns/dcat#> .
@prefix dct:   <http://purl.org/dc/terms/> .
@prefix ejp:   <http://purl.org/ejp-rd/vocabulary/> .
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .
@prefix sio:  <http://semanticscience.org/resource/> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ordo: <http://www.orpha.net/ORDO/> .
:patientRegistry a ejp:PatientRegistry ;
  dct:publisher :organisation ;        
  dct:title "Von Hippel-Lindau registry" ;
  dct:description "Registry from Von Hippel-Lindau";
  ejp:populationCoverage  :population_coverage ;
  dcat:theme  ordo:Orphanet_892 ;
  foaf:page "https://www.uniklinik-freiburg.de/medizin4.html" .

:organisation a foaf:NotOrganisation ;
  dct:title "EKlinik für Innere Medizin IV" ;
  dct:spatial  :location .
:population_coverage  a sio:SIO_001166 ;
  rdfs:label  "Regional" .
:location a dct:Location ;
  dct:title  "Germany" ."""


@router.post("/fm-f4-shex", name="Findable Rare Diseases",
    description="FAIR Metrics F4 for Rare Diseases, validate metadata with a ShEx expression.",
    response_model=dict,
)            
def fairmetrics_shex(eval: EvalInput = Body(...)) -> dict:
    eval = jsonable_encoder(eval)
    score = 0
    subject_uri = URIRef(eval['subject'])
    comment = ''
    shex_failed = False

    # Get and parse RDF from the resource
    r = requests.get(subject_uri)
    rdf_str = r.text
    # rdf_str = rdf_test
    g = Graph()
    g.parse(data=rdf_str)
    print(f"Parsed {len(g)} triples")

    evaluator = ShExEvaluator(rdf_str, patientregistry_shex,
        start="http://purl.org/ejp-rd/metadata-model/v1/shex/patientRegistryShape",
    )
    for s, p, o in g.triples((None, RDF.type, URIRef('http://purl.org/ejp-rd/vocabulary/PatientRegistry'))):
        print('Evaluating subject ' + str(s))
        for result in evaluator.evaluate(focus=str(s)):
            # comment = comment + f"{result.focus}: "
            if result.result:
                comment = comment + f'ShEx Passing for <{result.focus}> \n'
                if not shex_failed:
                    score = 1
            else:
                comment = comment + f'ShEx Failing for <{result.focus}> due to' + result.reason + ' \n'
                shex_failed = True
                score = 0
    print(comment)
    # rval = evaluator.evaluate(good_eg_1, focus="http://example.org/good_", rdf_format="json-ld")

    eval_time = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")

    eval_service_url = 'http://w3id.org/FAIR_Tests/tests/rd_fairmetrics_shex'
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
            "@value": float(score),
            "@type": "http://www.w3.org/2001/XMLSchema#float"
            }
        ]
        }
    ]

    return JSONResponse(result)
