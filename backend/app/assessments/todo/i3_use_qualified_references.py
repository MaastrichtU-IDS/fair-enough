from app.models import AssessmentModel, EvaluationModel
import os

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '3'
    title = 'Use Qualified References'
    description = """Relationships within (meta)data, and between local 
and third-party data, have explicit and 'useful' semantic meaning. 
The linksets must have qualified references: at least one of the links must be in a different Web domain 
(or the equivalent of a different namespace for non-URI identifiers)"""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):

        self.check('Checking RDF metadata vocabularies')
            
        return eval, g

