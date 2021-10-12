from app.models import AssessmentModel, EvaluationModel
import os
import requests
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, OWL, SKOS

class Assessment(AssessmentModel):
    fair_type = 'a'
    metric_id = '1'
    title = 'Access Protocol'
    description = """The access protocol and authorization (if content restricted).
For the protocol , do an HTTP get on the URL to see if it returns a valid document.
Find information about authorization in metadata"""
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 2
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):

        self.check('Access protocol: check resource URI protocol is resolvable for ' + eval.resource_uri)
        try:
            r = requests.get(eval.resource_uri)
            r.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xxx
            self.success('Successfully resolved ' + eval.resource_uri)
            # if r.history:
            #     self.log("Request was redirected to " + r.url + '. Adding as alternative URI')
            #     eval.data['alternative_uris'].append(r.url)

        except Exception as e:
            self.error('Could not resolve ' + eval.resource_uri + '. Getting: ' + e.args[0])


        self.check('Authorization: checking for dct:accessRights in metadata')
        found_access_rights = False
        access_rights_preds = [DCTERMS.accessRights]
        for pred in access_rights_preds:
            for s, p, accessRights in g.triples((None,  pred, None)):
                self.log('Found authorization informations with dcterms:accessRights: ' + str(accessRights))
                eval.data['accessRights'] = str(accessRights)
                found_access_rights = True

        if found_access_rights:
            self.success('Found dcterms:accessRights in metadata: ' + str(accessRights))
        else:
            self.error('Could not find dcterms:accessRights information in metadata')
            self.advice('Make sure your metadata contains informations about access rights using one of those predicates: ' + ', '.join(access_rights_preds))

        return eval, g

