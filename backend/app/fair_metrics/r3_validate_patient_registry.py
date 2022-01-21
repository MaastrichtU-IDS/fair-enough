from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from app.models import MetricResult, MetricInput
from rdflib import Graph, URIRef
from rdflib.namespace import RDF, DC, DCTERMS, RDFS
from pyshex import ShExEvaluator
import requests


metric_id = 'r3-validate-patient-registry'
metric_name = "Validate Patient Registry metadata"
metric_description = """FAIR Metrics R3 (meet community standards) for Patient Registry, 
validates that all entities with the rdf:type <http://purl.org/ejp-rd/vocabulary/PatientRegistry> in the subject RDF metadata are valid using a ShEx expression.

The ShEx expression used can be found at <https://github.com/ejp-rd-vp/resource-metadata-schema/blob/master/docs/patient-registry.md#shex>"""

class TestInput(MetricInput):
    subject = 'https://raw.githubusercontent.com/ejp-rd-vp/resource-metadata-schema/master/data/example-rdf/turtle/patientRegistry.ttl'


api = APIRouter()
@api.post(f"/{metric_id}", name=metric_name,
    description=metric_description, response_model=dict,
)            
def metric_test(input: TestInput = Body(...)) -> dict:
    result = MetricResult(subject=input.subject, metric_test=metric_id)
    shex_failed = False

    # Download and parse RDF available at the subject URL
    r = requests.get(input.subject)
    rdf_str = r.text
    # rdf_str = rdf_test
    g = Graph()
    g.parse(data=rdf_str)
    # print(f"Parsed {len(g)} triples")

    evaluator = ShExEvaluator(rdf_str, patientregistry_shex,
        start="http://purl.org/ejp-rd/metadata-model/v1/shex/patientRegistryShape",
    )
    # Check all entities with type ejp:PatientRegistry
    for s, p, o in g.triples((None, RDF.type, URIRef('http://purl.org/ejp-rd/vocabulary/PatientRegistry'))):
        # print('ShEx evaluate focus entity ' + str(s))
        # For specific RDF format: evaluator.evaluate(rdf_format="json-ld")
        for shex_eval in evaluator.evaluate(focus=str(s)):
            # comment = comment + f"{result.focus}: "
            if shex_eval.result:
                result.comment = result.comment + f'ShEx Passing for <{shex_eval.focus}> \n'
                if not shex_failed:
                    result.score = 1
            else:
                result.comment = result.comment + f'ShEx Failing for <{shex_eval.focus}> due to' + shex_eval.reason + ' \n'
                shex_failed = True
                result.score = 0

    return JSONResponse(result.toJsonld())


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

# TO REMOVE: A test case that fails to check pyshex works
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

:organisation a foaf:NotAnOrganisation ;
  dct:title "EKlinik für Innere Medizin IV" ;
  dct:spatial  :location .
:population_coverage  a sio:SIO_001166 ;
  rdfs:label  "Regional" .
:location a dct:Location ;
  dct:title  "Germany" ."""

