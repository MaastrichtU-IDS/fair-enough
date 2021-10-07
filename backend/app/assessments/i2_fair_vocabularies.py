from app.models import AssessmentModel, EvaluationModel
import os
import requests

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '2'
    title = 'Use FAIR Vocabularies'
    description = """The metadata values and qualified relations should 
themselves be FAIR, for example, terms from open, community-accepted 
vocabularies published in an appropriate knowledge-exchange format. 
Resolve IRIs, check FAIRness of the returned documents."""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):
        uri = eval.resource_uri
        # LOV docs: https://lov.linkeddata.es/dataset/lov/api
        lov_api = 'https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list'
        lod_cloudnet = 'https://lod-cloud.net/lod-data.json'


        self.check('Checking RDF metadata vocabularies')
        all_ns = [n for n in g.namespace_manager.namespaces()]
        print(all_ns)

        self.check('Check if used vocabularies in Linked Open Vocabularies: ' + lov_api)
        lov_list = requests.get(lov_api).json()
        for vocab in lov_list:
            pass
            # URI used for namespace/prefix:
            # print(vocab['nsp'])


        self.check('Check if used vocabularies in the LOD cloud: ' + lod_cloudnet)
        # https://github.com/vemonet/fuji/blob/master/fuji_server/helper/preprocessor.py#L368

            
        return eval, g

