from app.models import AssessmentModel, EvaluationModel
import os
import requests

class Assessment(AssessmentModel):
    fair_type = 'r'
    metric_id = '3'
    role = 'check'
    title = 'Meets Community Standards'
    description = """Such certification services may not exist, but this principle serves to encourage the community 
to create both the standard(s) and the verification services for those standards.  
A potentially useful side-effect of this is that it might provide an opportunity for content-verification
e.g. the certification service provides a hash of the data, which can be used to validate that it has not been edited at a later date."""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):


        self.check('Checking RDF metadata')
        # dct:conformsTo point to URI of JSON schema?
        # People could use it to point to the JSON standard (not ideal)
        # Best: get the schema (e.g. JSON schema)

        # Check also: rdfs:isDefinedBy, rdfs:seeAlso?

        return eval, g

