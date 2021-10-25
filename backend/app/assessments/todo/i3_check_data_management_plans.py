from app.models import AssessmentModel, EvaluationModel
import os

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '3'
    role = 'check'
    title = 'Check Data Management Plan'
    description = """An assessment to test if a DMP is properly defined. To be developed
For a collection on evaluating digital Data Management Plans
We can reuse SPARQL queries from the maDMP-evaluation repository: 
https://github.com/raffaelfoidl/maDMP-evaluation/tree/v1.2/queries"""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):

        self.check('Checking DMP')
            
        return eval, g

