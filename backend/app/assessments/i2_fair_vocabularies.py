from app.models import AssessmentModel, EvaluationModel
import os
import requests
import re
import io

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '2'
    title = 'Use FAIR Vocabularies'
    description = """The metadata values and qualified relations should 
themselves be FAIR, for example, terms from open, community-accepted 
vocabularies published in an appropriate knowledge-exchange format. 
Resolve IRIs, check FAIRness of the returned documents."""
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):
        uri = eval.resource_uri
        # LOV docs: https://lov.linkeddata.es/dataset/lov/api
        lov_api = 'https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list'
        lod_cloudnet = 'https://lod-cloud.net/lod-data.json'


        # self.check('Checking RDF metadata vocabularies')
        # rdflib_ns = [n for n in g.namespace_manager.namespaces()]
        rdflib_ns = [n for n in g.namespaces()]
        print(rdflib_ns)

        # Extract namespace manually since RDFLib can't do it
        extracted_ns = []
        for row in io.StringIO(g.serialize(format='turtle')):
            if row.startswith('@prefix'):
                pattern = re.compile("^.*<(.*?)>")
                ns = pattern.search(row).group(1)
                extracted_ns.append(ns)
        print(extracted_ns)
        
        validated_ns = set()
        tested_ns = set()
        ignore_ns = []
        self.check('Check if used vocabularies in Linked Open Vocabularies: ' + lov_api)
        lov_list = requests.get(lov_api).json()
        for vocab in lov_list:
            if vocab['nsp'] in ignore_ns:
                continue

            # Check for manually extracted ns
            for ns in extracted_ns:
                tested_ns.add(ns)
                if vocab['nsp'].startswith(ns):
                    validated_ns.add(ns)

            # Check for RDFLib extracted ns
            for index, tuple in rdflib_ns:
                tested_ns.add(tuple[1])
                # if vocab['nsp'].startswith(tuple[1]):
                if tuple[1].startswith(vocab['nsp']):
                    validated_ns.add(tuple[1])

        if len(validated_ns) > 0:
            self.success('Found vocabularies used by the resource metadata in the LOV: ' + ', '.join(validated_ns))
        else:
            self.error('Could not find vocabularies used by the resource metadata in the LOV: ' + ', '.join(tested_ns))
        
        
        # self.check('Check if used vocabularies in the LOD cloud: ' + lod_cloudnet)
        # https://github.com/vemonet/fuji/blob/master/fuji_server/helper/preprocessor.py#L368

            
        return eval, g

