from app.models.assessment import AssessmentModel
from app.models.evaluation import EvaluationModel
import os
import requests
from rdflib import Literal, RDF, URIRef
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, OWL, SKOS, FOAF

"""
R1: Accessible Usage License
"""
class Assessment(AssessmentModel):
    fair_type = 'r'
    metric_id = '1'
    title = 'Accessible Usage License'
    description = """The existence of a license document, for BOTH (independently) the data and its associated metadata, and the ability to retrieve those documents
Resolve the licenses IRI
"""
    filename = os.path.basename(__file__)
    max_score = 1
    max_bonus = 1

    def evaluate(self, eval: EvaluationModel, g):
        uri = eval.resource_uri
        found_license = False

        self.check('Checking for license in RDF metadata. To do: DataCite and extruct')
        if 'license' in eval.data.keys():
            found_license = True
        else:
            # Get license from RDF metadata
            for s, p, license in g.triples((None,  DCTERMS.license, None)):
                self.log('Found license with dcterms:license: ' + str(license))
                eval.data['license'] = str(license)
                found_license = True

        if found_license:
            self.success('Found license in metadata: ' + str(license))
        else:
            self.error('Could not find license information in metadata')

        if 'license' in eval.data.keys():
            self.check('Check for licenses infos in SPDX licenses list (isOsiApproved')
            # https://github.com/vemonet/fuji/blob/master/fuji_server/helper/preprocessor.py#L229
            spdx_licenses_url = 'https://raw.github.com/spdx/license-list-data/master/json/licenses.json'
            spdx_licenses = requests.get(spdx_licenses_url).json()['licenses']
            for license in spdx_licenses:
                if eval.data['license'] in license['seeAlso']:
                    self.bonus('Found the resource license ' + str(eval.data['license']) + ' in the SPDX license list')
            # print('spdx_licenses')
            # print(spdx_licenses)

        return eval, g

