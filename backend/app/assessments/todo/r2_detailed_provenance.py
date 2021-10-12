from app.models import AssessmentModel, EvaluationModel
import os
import requests

class Assessment(AssessmentModel):
    fair_type = 'r'
    metric_id = '2'
    title = 'Detailed Provenance'
    description = """That there is provenance information associated with the data, covering at least two primary types of provenance information:
- Who/what/When produced the data (i.e. for citation)
- Why/How was the data produced (i.e. to understand context and relevance of the data)
"""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):


        self.check('Checking RDF metadata for prov and pav metadata')
        # Author, contributor, creationDate

            
        return eval, g

