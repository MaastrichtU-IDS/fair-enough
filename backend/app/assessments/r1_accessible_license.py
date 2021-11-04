from app.models import AssessmentModel, EvaluationModel
import requests
from rdflib import Literal, RDF, URIRef
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, OWL, SKOS, FOAF

class Assessment(AssessmentModel):
    fair_type = 'r'
    metric_id = '1'
    role = 'check'
    title = 'Check accessible Usage License'
    description = """The existence of a license document, for BOTH (independently) the data and its associated metadata, and the ability to retrieve those documents
Resolve the licenses IRI"""
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 1
    max_bonus = 1

    def evaluate(self, eval: EvaluationModel, g):
        found_license = False

        self.check('Checking for license in RDF metadata. To do: DataCite and extruct')
        if 'license' in eval.data.keys():
            found_license = True
        else:
            license_uris = [DCTERMS.license, URIRef('http://schema.org/license')]
            # Get license from RDF metadata
            for license_uri in license_uris:
                for s, p, license in g.triples((None,  license_uri, None)):
                    self.log(f'Found license with {license_uri}: {str(license)}')
                    eval.data['license'] = str(license)
                    found_license = True

        if found_license:
            self.success('Found license in metadata: ' + str(license))
        else:
            self.error('Could not find license information in metadata')


        if 'license' in eval.data.keys():
            self.check('Check if license is approved by the Open Source Initiative, in the SPDX licenses list')
            # https://github.com/vemonet/fuji/blob/master/fuji_server/helper/preprocessor.py#L229
            spdx_licenses_url = 'https://raw.github.com/spdx/license-list-data/master/json/licenses.json'
            spdx_licenses = requests.get(spdx_licenses_url).json()['licenses']
            for license in spdx_licenses:
                if eval.data['license'] in license['seeAlso']:
                    if license['isOsiApproved'] == True:
                        self.bonus('License approved by the Open Source Initiative (' + str(eval.data['license']) + ')')

        return eval, g

