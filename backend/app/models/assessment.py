from pydantic import BaseModel
from typing import Optional, List
import datetime
import json
from rdflib import ConjunctiveGraph

from app import models
from app.models.evaluation import EvaluationModel
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
    author: str = 'vincent.emonet@gmail.com'
    score: int = 0
    max_score: int = 1
    bonus_score: int = 0
    max_bonus: int = 0
    logs: List[str] = []


    def __init__(self, filename: str) -> None:
        super().__init__()
        self.id = filename
        self.file_url = 'https://github.com/MaastrichtU-IDS/fair-enough/blob/main/backend/app/assessments/' + filename + '.py'


    def evaluate(self, eval: EvaluationModel, g = None):
        return eval, g


    def runEvaluate(self, eval: EvaluationModel, g = None):
        try:
            eval, g = self.evaluate(eval, g)
            # Adding output of this assessment to the evaluation results
            eval.results.append(self.dict())
        except Exception as e:
            self.error('Error running test ' + self.filename + '. Getting: ' + str(e))
            eval.results.append(self.dict())
        return eval, g


    def parseRDF(self, rdf_data, mime_type: str = 'No mime type', msg: str = ''):
        rdflib_formats = ['turtle', 'json-ld', 'xml', 'ntriples', 'nquads', 'trig', 'n3']

        if type(rdf_data) == dict:
            # JSON-LD should work, it was added to RDFLib 6.0.1: https://rdflib.readthedocs.io/en/stable/apidocs/rdflib.plugins.parsers.html#module-rdflib.plugins.parsers.jsonld
            rdf_data = json.dumps(rdf_data)
            # jsonld from RDFLib 6.0.1 broken: https://github.com/RDFLib/rdflib/issues/1423
            # rdf_data = json.dumps(rdf_data, indent=2).encode('utf-8')
            # jsonld from pyld broken with schema.org: https://github.com/digitalbazaar/pyld/issues/154
            # rdf_data = json.dumps(jsonld.expand(rdf_data))
            rdflib_formats = ['json-ld']

        g = ConjunctiveGraph()
        for rdf_format in rdflib_formats:
            try:
                # print(type(rdf_data))
                g.parse(data=rdf_data, format=rdf_format)
                # print(g.serialize(format='turtle', indent=2))
                self.log('Metadata from ' + mime_type + ' ' + msg + ' parsed with RDFLib parser ' + rdf_format, '☑️')
                break
            except Exception as e:
                self.warning('Could not parse ' + mime_type + ' metadata from ' + msg + ' with RDFLib parser ' + rdf_format)
                print(e)
        return g


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
            self.bonus('Assessment score already at the max (' + str(self.score) + '), adding as a bonus point: ' + log_msg)
            self.warning('Could not increase assessment ' + self.filename + ' score: already at ' + str(self.score) + ', the same value as the max score. Fix the scoring of this assessment')
        else:
            self.score += 1
        self.log(log_msg, '✅')


    def bonus(self, log_msg: str):
        # if self.bonus_score >= self.max_bonus:
        #     self.warning('Could not increase assessment ' + self.filename + ' bonus score: already at ' + str(self.score) + ', the same value as the max bonus score. Fix the scoring of this assessment')
        # else:
        #     self.bonus_score += 1
        self.bonus_score += 1
        self.log(log_msg, '🚀')


    def check(self, log_msg: str):
        self.log(log_msg, '🔎')

