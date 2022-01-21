from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from app.models import MetricResult, MetricInput
from rdflib import Graph, URIRef
from rdflib.namespace import RDF, DC, DCTERMS, RDFS
import requests


metric_id = 'f4-search-fairdatapoint'
metric_name = "Searchable in FAIR Data Point"
metric_description = """FAIR Metrics F4: resource is indexed in a searchable resource. 
Search for the resource title in FAIR Data Point, implemented originally for Rare Diseases"""

class TestInput(MetricInput):
    subject = 'https://w3id.org/ejp-rd/fairdatapoints/wp13/dataset/c5414323-eab1-483f-a883-77951f246972'


api = APIRouter()
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
