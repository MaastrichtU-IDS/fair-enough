from app.models import AssessmentModel, EvaluationModel
import os
from urllib.parse import urlparse
import requests


class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '1'
    role = 'check'
    title = 'Resource identifier is unique and persistent'
    description = 'Check if the identifier of the resource is unique (HTTP) and persistent (some HTTP domains)'
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 2
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):
        accepted_persistent = ['doi.org', 'purl.org', 'identifiers.org', 'w3id.org']

        # TODO: use https://pythonhosted.org/IDUtils/

        self.check('Checking if the given resource URI ' + eval.resource_uri + ' is a valid URL using urllib.urlparse')
        result = urlparse(eval.resource_uri)
        if result.scheme and result.netloc:
            # Get URI protocol retrieved in f1_1_assess_unique_identifier
            eval.data['uri_protocol'] = result.scheme
            eval.data['uri_location'] = result.netloc
            if result.netloc == 'doi.org':
                eval.data['uri_doi'] = result.path[1:]
            self.success('Validated the given resource URI ' + eval.resource_uri + ' is a URL')
        else:
            self.error('Could not validate the given resource URI ' + eval.resource_uri + ' is a URL')    


        # Check if URL resolve and if redirection
        r = requests.head(eval.resource_uri)
        r = requests.get(eval.resource_uri)
        r.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xxx
        self.log('Successfully resolved ' + eval.resource_uri, '☑️')
        if r.history:
            self.log("Request was redirected to " + r.url + '. Adding as alternative URI')
            eval.data['alternative_uris'].append(r.url)
        


        self.check('Check if the given resource URI ' + eval.resource_uri + ' use a persistent URI, one of: ' + ', '.join(accepted_persistent))
        if eval.data['uri_location'] in accepted_persistent:
            # Checking URI location extracted by f1_1_assess_unique_identifier
            # self.score += 1
            self.success('Validated the given resource URI ' + eval.resource_uri + ' is a persistent URL')
        else:
            r = urlparse(eval.resource_uri)
            if r.netloc and r.netloc in accepted_persistent:
                self.success('Validated the given resource URI ' + eval.resource_uri + ' is a persistent URL')
            else:
                self.error('The given resource URI ' + eval.resource_uri + ' is not considered a persistent URL')

        # Quick fix to add an alternative URI for doi.org that is used as identifier in the metadata
        if eval.data['uri_location'] == 'doi.org':
            eval.data['alternative_uris'].append(eval.resource_uri.replace('https://doi.org/', 'http://dx.doi.org/'))
            eval.data['alternative_uris'].append(eval.resource_uri.lower())

        return eval, g



