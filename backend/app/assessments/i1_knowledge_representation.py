from urllib.parse import urlparse
from app.models import AssessmentModel, EvaluationModel
import json
import rdflib
# JSON-LD workaround 
# from pyld import jsonld
# from rdflib import ConjunctiveGraph
# from rdflib.serializer import Serializer

class Assessment(AssessmentModel):
    fair_type = 'i'
    metric_id = '1'
    role = 'check'
    title = 'Metadata uses a formal knowledge representation language'
    description = "Parse resource metadata found as RDF using rdflib"
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 1
    max_bonus = 1

    def evaluate(self, eval: EvaluationModel, g):
        # https://github.com/vemonet/fuji/blob/master/fuji_server/helper/preprocessor.py#L190

        if 'content_negotiation' in eval.data.keys():
            self.check('Check metadata available from content negotiation already retrieved by f2_machine_readable_metadata: ' + ', '.join(eval.data['content_negotiation'].keys()))
            for mime_type, rdf_data in eval.data['content_negotiation'].items():                   
                g = self.parseRDF(rdf_data, mime_type, msg='content negotiation RDF')

                # print(g.serialize(format='turtle', indent=2))
                if len(g) > 1:
                    self.success('Successfully parsed the RDF metadata retrieved with content negotiation. It contains ' + str(len(g)) + ' triples')

                break # Only parse the first RDF metadata file entry


        self.check('Check embedded metadata available from extruct')
        if 'extruct' in eval.data.keys() and 'json-ld' in eval.data['extruct'].keys():
            extruct_g = rdflib.ConjunctiveGraph()
            try:
                # print(json.dumps(eval.data['extruct']['json-ld'], indent=2))
                extruct_g.parse(data=json.dumps(eval.data['extruct']['json-ld']), format='json-ld')
                self.success('JSON-LD metadata embedded in HTML from extruct successfully parsed with RDFLib')
            except Exception as e:
                self.warning('Could not parse JSON-LD metadata from extruct with RDFLib')
                print(e)
        # TODO: other format? microdata, dublincore, etc
        else:
            self.warning('No metadata embedded in HTML available for parsing from extruct')

        return eval, g

