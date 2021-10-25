from app.models import AssessmentModel, EvaluationModel
import os

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '3'
    role = 'check'
    title = 'Check the content of a SPARQL endpoint'
    description = """An assessment to run queries to check the content of a SPARQL endpoint
For a collection on evaluation knowledge graphs
Reuse https://github.com/MaastrichtU-IDS/d2s-cli/blob/master/d2s/generate_metadata.py"""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):

        self.check('Checking DMP')
            
        return eval, g

