from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import urllib.parse
import json
import requests
import yaml
from rdflib import Graph, URIRef
# Plugin and serializer required to parse jsonld with rdflib
from pyld import jsonld

# from app import models
# from app.models.evaluation import EvaluationModel
from app.config import settings
# import logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)


async def register_test(test, db):
    existing_test = await db["metrics_tests"].find_one({"_id": test['url']})
    if not existing_test is None:
        raise HTTPException(status_code=422, detail=f"Provided metrics test URL {test['url']} has already been registered")

    try: 
        res = requests.get(test['url'])
        testInfo = yaml.load(res.text, Loader=yaml.FullLoader)

        if not testInfo['info']['x-tests_metric']:
            raise HTTPException(status_code=422, detail='Missing the field info.x-tests_metric in the YAML')
        if not testInfo['info']['x-applies_to_principle']:
            raise HTTPException(status_code=422, detail='Missing the field info.x-applies_to_principle in the YAML')
        testInfo['_id'] = test['url']
        print(testInfo)
        new_entry = await db["metrics_tests"].insert_one(testInfo)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=testInfo)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


class MetricInput(BaseModel):
    subject: str


class MetricResult(BaseModel):
    subject: Optional[URIRef]
    comment: str = ''
    score: int = 0
    bonus: int = 0
    softwareVersion: str = '0.1'
    date: str = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
    id: Optional[str]
    metric_test: Optional[str]


    def __init__(self, subject: str, metric_test: str) -> None:
        super().__init__()
        self.subject = URIRef(subject)
        self.metric_test = metric_test
        self.id = f"{settings.BASE_URI}/metrics/{self.metric_test}#{urllib.parse.quote(str(self.subject))}/result-{self.date}"


    def toJsonld(self):
        return [
            {
                "@id": self.id,
                "@type": [
                    "http://fairmetrics.org/resources/metric_evaluation_result"
                ],
                "http://purl.obolibrary.org/obo/date": [
                    {
                        "@value": self.date,
                        "@type": "http://www.w3.org/2001/XMLSchema#date"
                    }
                ],
                "http://schema.org/softwareVersion": [
                {
                    "@value": self.softwareVersion,
                    "@type": "http://www.w3.org/2001/XMLSchema#float"
                }
                ],
                "http://schema.org/comment": [
                    {
                    "@value": self.comment,
                    "@language": "en"
                    }
                ],
                "http://semanticscience.org/resource/SIO_000332": [
                    {
                    "@value": str(self.subject),
                    "@language": "en"
                    }
                ],
                "http://semanticscience.org/resource/SIO_000300": [
                    {
                    "@value": float(self.score),
                    "@type": "http://www.w3.org/2001/XMLSchema#float"
                    }
                ]
            }
        ]


    def parseRDF(self, rdf_data, mime_type: str = 'No mime type', msg: str = ''):
        # https://rdflib.readthedocs.io/en/stable/plugin_parsers.html
        rdflib_formats = ['turtle', 'json-ld', 'xml', 'ntriples', 'nquads', 'trig', 'n3']
        if type(rdf_data) == dict:
            if '@context' in rdf_data.keys() and (rdf_data['@context'].startswith('http://schema.org') or rdf_data['@context'].startswith('https://schema.org')):
                # Regular content negotiation dont work with schema.org: https://github.com/schemaorg/schemaorg/issues/2578
                rdf_data['@context'] = 'https://schema.org/docs/jsonldcontext.json'
            # RDFLib JSON-LD has issue with encoding: https://github.com/RDFLib/rdflib/issues/1416
            rdf_data = jsonld.expand(rdf_data)
            rdf_data = json.dumps(rdf_data)
            # rdf_data = json.dumps(rdf_data).encode('utf-8').decode('utf-8')
            rdflib_formats = ['json-ld']
        g = Graph()
        for rdf_format in rdflib_formats:
            try:
                # print(type(rdf_data))
                g.parse(data=rdf_data, format=rdf_format)
                print(str(len(g)) + ' triples parsed. Metadata from ' + mime_type + ' ' + msg + ' parsed with RDFLib parser ' + rdf_format, '☑️')
                # self.log(str(g.serialize(format='turtle', indent=2)))
                break
            except Exception as e:
                print('Could not parse ' + mime_type + ' metadata from ' + msg + ' with RDFLib parser ' + rdf_format + ' ' + str(e))
        return g


    class Config:
        arbitrary_types_allowed = True


yaml_params = """  post:
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