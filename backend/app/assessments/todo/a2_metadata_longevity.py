from app.models.assessment import AssessmentModel
from app.models.evaluation import EvaluationModel
import os
import requests

class Assessment(AssessmentModel):
    fair_type = 'a'
    metric_id = '2'
    title = 'Metadata Longevity'
    description = """The existence of metadata even in the absence/removal of data
Cross-references to data from third-party's FAIR data and metadata will 
naturally degrade over time, and become 'stale links'.  
In such cases, it is important for FAIR providers to continue to provide 
descriptors of what the data was to assist in the continued interpretation of 
those third-party data. As per FAIR Principle F3, this metadata remains 
discoverable, even in the absence of the data, because it contains an 
explicit reference to the IRI of the data"""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):


        self.check('Checking for metadata in long term repository?')

            
        return eval, g

