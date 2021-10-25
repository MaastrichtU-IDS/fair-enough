from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
import json
from rdflib import Graph
from rdflib.term import URIRef
# Plugin and serializer required for rdflib-jsonld
# from rdflib import ConjunctiveGraph, Graph, plugin
# from rdflib.serializer import Serializer
from pyld import jsonld

from app import models
from app.models.evaluation import EvaluationModel
from app.config import settings
# import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

class AssessmentModel(BaseModel):
    id: Optional[str]
    title: str
    description: str
    file_url: Optional[str]
    fair_type: str
    metric_id: str
    role: str = 'check'
    author: str = 'https://orcid.org/0000-0002-1501-1082'
    score: int = 0
    max_score: int = 1
    bonus_score: int = 0
    max_bonus: int = 0
    logs: List[str] = []
    uri: Optional[str] = Field(alias="@id")
    context: str = Field(settings.CONTEXT, alias="@context")


    def __init__(self, filename: str) -> None:
        super().__init__()
        self.id = filename
        self.uri = f"{settings.BASE_URI}/assessment/{self.id}"
        self.file_url = 'https://github.com/MaastrichtU-IDS/fair-enough/blob/main/backend/app/assessments/' + filename + '.py'


    def evaluate(self, eval: EvaluationModel, g = None):
        return eval, g


    def runEvaluate(self, eval: EvaluationModel, g = None):
        try:
            eval, g = self.evaluate(eval, g)
            # Adding output of this assessment to the evaluation results
            eval.results.append(self.dict(by_alias=True))
        except Exception as e:
            self.error('Error running assessment ' + self.id + '. Getting: ' + str(e))
            eval.results.append(self.dict(by_alias=True))
        return eval, g


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

        # self.log(rdf_data)
        g = Graph()
        for rdf_format in rdflib_formats:
            try:
                # print(type(rdf_data))
                g.parse(data=rdf_data, format=rdf_format)
                self.log(str(len(g)) + ' triples parsed. Metadata from ' + mime_type + ' ' + msg + ' parsed with RDFLib parser ' + rdf_format, '☑️')
                # self.log(str(g.serialize(format='turtle', indent=2)))
                break
            except Exception as e:
                self.warning('Could not parse ' + mime_type + ' metadata from ' + msg + ' with RDFLib parser ' + rdf_format + ' ' + str(e))
        return g


    def extract_property(self, property, preds: List, eval: EvaluationModel, g, multi_results: bool = False):
        # self.log(str(preds))
        for resource_uri in eval.data['alternative_uris']:
            uri_ref = URIRef(resource_uri)
            for pred in preds:
                if multi_results:
                    for s, p, o in g.triples((uri_ref,  pred, None)):
                        if property not in eval.data.keys():
                            eval.data[property] = []
                        eval.data[property].append(str(o))
                        self.log(f'Found a {property} with predicate {str(pred)} in the resource metadata: {str(o)}')
                
                else:
                    # Single result
                    if property not in eval.data.keys():
                        prop_value = g.value(uri_ref, pred)
                        if prop_value:
                            eval.data[property] = prop_value
                            self.log(f'Found a {property} with predicate {str(pred)} in the resource metadata: {eval.data[property]}')
                            break
        return eval, g


    def log(self, log_msg: str, prefix: str = None):
        # TODO: add time .replace(microsecond=0)
        # log_msg = str(datetime.datetime.now().replace(microsecond=0)) + ' ' + log_msg
        log_msg = '[' + str(datetime.datetime.now().strftime("%Y-%m-%d@%H:%M:%S")) + '] ' + log_msg 
        if prefix:
            log_msg = prefix + ' ' + log_msg
        self.logs.append(log_msg)
        print(log_msg)
        # logger = logging.getLogger(__name__)
        # logger = logging.getLogger(self.filename)
        # logger(log_msg)


    def warning(self, log_msg: str):
        self.log(log_msg, '⚠️')


    def error(self, log_msg: str):
        # self.max_score += 1
        self.log(log_msg, '❌')


    def success(self, log_msg: str):
        if self.score >= self.max_score:
            self.bonus(log_msg + '. Assessment score already at the max (' + str(self.score) + '), adding as a bonus point.')
            # self.warning('Could not increase assessment ' + self.id + ' score: already at ' + str(self.score) + ', the same value as the max score. Fix the scoring of this assessment')
        else:
            self.score += 1
            self.log(log_msg, '✅')


    def bonus(self, log_msg: str):
        # if self.bonus_score >= self.max_bonus:
        #     self.warning('Could not increase assessment ' + self.id + ' bonus score: already at ' + str(self.score) + ', the same value as the max bonus score. Fix the scoring of this assessment')
        # else:
        #     self.bonus_score += 1
        self.bonus_score += 1
        self.log(log_msg, '🚀')


    def check(self, log_msg: str):
        self.log(log_msg, '🔎')


    def advice(self, log_msg: str):
        self.log(log_msg, 'ℹ️')

