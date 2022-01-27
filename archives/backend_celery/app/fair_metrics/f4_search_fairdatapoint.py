from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse, PlainTextResponse
from app.models import MetricResult, MetricInput
from rdflib import Graph, URIRef
from rdflib.namespace import RDF, DC, DCTERMS, RDFS
import requests


metric_id = 'RD-F4'
metric_name = "FAIR Metrics Domain Specific - Use of Rare Disease (RD) specific Search Engines to find the (meta)data of the indexed resource"
metric_description = """We extract the title property of the resource from the metadata document and check if the RD specific search engine returns the metadata document of the resource that we are testing."""
metric_version = 'Hvst-1.4.0:RD-F4-Tst-0.0.3'

class TestInput(MetricInput):
    subject = 'https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972'


api = APIRouter()

@api.get(f"/{metric_id}", name=metric_name,
    description=metric_description, response_model=str, response_class=PlainTextResponse(media_type='text/x-yaml'),
)
def metric_yaml() -> str:
    return PlainTextResponse(content=test_yaml, media_type='text/x-yaml')


@api.post(f"/{metric_id}", name=metric_name,
    description=metric_description, response_model=dict,
)            
def metric_test(input: TestInput = Body(...)) -> dict:
    result = MetricResult(subject=input.subject, metric_test=metric_id)
    fdp_search_url = "https://home.fairdatapoint.org/search"

    # Download and parse RDF available at the subject URL
    r = requests.get(input.subject)
    g = Graph()
    g.parse(data=r.text)
    # print(f"Parsed {len(g)} triples")

    # Get the subject resource title from the RDF
    subject_title = None
    result.comment = 'Could not find the resource in FAIR Data Point search'
    title_preds = [ RDFS.label, DC.title, DCTERMS.title, URIRef('http://schema.org/name')]
    for title_pred in title_preds: 
        for s, p, o in g.triples((result.subject, title_pred, None)):
            subject_title = str(o)
            # print(f"Searching for this title in the FDP search: {o}")
        if subject_title:
            break
    
    # Search if the subject can be found by searching its title in the FAIR Data Point search
    if subject_title:
        payload = {'q': subject_title}
        headers = {
            'Content-Type': "application/json"
        }
        response = requests.post(fdp_search_url, json=payload, headers=headers)

        for res in response.json():
            if res['uri'] == str(result.subject):
                result.score += 1
                result.comment = 'The subject has been found when searching in the FAIR Data Points'
                break
    else:
        result.comment = f'The subject title could not be found in the resource RDF available at {input.subject}'

    return JSONResponse(result.toJsonld())


test_yaml = f"""swagger: '2.0'
info:
 version: {metric_version}
 title: "{metric_name}"
 x-tests_metric: 'https://w3id.org/rd-fairmetrics/RD-R1'
 description: >-
   {metric_description}
 x-applies_to_principle: "F4"
 contact:
  x-organization: "EJP-RD & ELIXIR Metrics for Rare Disease"
  url: "https://github.com/LUMC-BioSemantics/RD-FAIRmetrics"
  name: 'Rajaram Kaliyaperumal'
  x-role: "responsible developer"
  email: r.kaliyaperumal@lumc.nl
  x-id: '0000-0002-1215-167X'
host: w3id.org/rd-fairness-tests
basePath: /rest/tests/
schemes:
  - https
paths:
 {metric_id}:
  post:
   parameters:
    - name: content
      in: body
      required: true
      schema:
        $ref: '#/definitions/schemas'
   consumes:
     - application/json
   produces:
     - application/json
   responses:
     "200":
       description: >-
        The response is a binary (1/0), success or failure
definitions:
  schemas:
    required:
     - subject
    properties:
        subject:
          type: string
          description: >-
            the GUID being tested
"""