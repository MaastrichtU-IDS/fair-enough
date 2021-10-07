from app.models.assessment import AssessmentModel
from app.models.evaluation import EvaluationModel
import requests
from googlesearch import search

class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '4'
    title = 'The resource Indexed in a searchable resource'
    description = """Search for existing metadata about the resource URI in data repositories, such as DataCite, RE3data. 
Search for the URI using the resource title in search engines (Google)"""
    max_score = 1
    max_bonus = 1

    def evaluate(self, eval: EvaluationModel, g):
        datacite_endpoint = 'https://api.datacite.org/repositories'
        re3data_endpoint = 'https://re3data.org/api/beta/repositories'
        datacite_dois_api = 'https://api.datacite.org/dois/'
        # metadata_catalog = https://rdamsc.bath.ac.uk/api/m
        # headers = {"Accept": "application/json"}

        # If DOI: check for metadata in DataCite API
        try:
            if 'uri_doi' in eval.data and eval.data['uri_doi']:
                doi = eval.data['uri_doi']
                self.check('Checking DataCite API for metadata about the DOI: ' + doi)
                r = requests.get(datacite_dois_api + doi, timeout=10)
                datacite_json = r.json()
                datacite_data = datacite_json['data']['attributes']
                print(datacite_json['data']['attributes'].keys())
                # ['id', 'type', 'attributes', 'relationships']
                if datacite_data:
                    self.bonus('Retrieved metadata about ' + doi + ' from DataCite API')
                    eval.data['datacite'] = {}
                    print('datacite_data')
                    print(datacite_data.keys())

                    if 'titles' in datacite_data.keys():
                        eval.data['datacite']['title'] = datacite_data['titles'][0]['title']
                        print('tiiitle')
                        print(eval.data['datacite']['title'])
                        if not 'resource_title' in eval.data:
                            eval.data['resource_title'] = eval.data['datacite']['title']

                    if 'descriptions' in datacite_data.keys():
                        eval.data['datacite']['description'] = datacite_data['descriptions'][0]['description']
                    
            else:
                self.warning('DOI could not be found, skipping search in DataCite API')
        except Exception as e:
            self.warning('Search in DataCite API failed: ' + e.args[0])

        # self.check('Checking RE3data APIs from DataCite API for metadata about ' + uri)
        # p = {'query': 're3data_id:*'}
        # req = requests.get(datacite_endpoint, params=p, headers=headers)
        # print(req.json())


        # Check google search using the resource title and its alternative URIs
        if 'resource_title' in eval.data.keys():
            resource_title = eval.data['resource_title']
            
            resource_uris = eval.data['alternative_uris']

            self.check('Run Google search for: ' + resource_title)
            search_results = list(search(resource_title, tld="co.in", num=20, stop=1, pause=1))
            print(search_results)

            found_uris = list(set(resource_uris).intersection(search_results))
            # if any(i in resource_uris for i in search_results):
            if found_uris:
                self.success('Found the resource URI ' + ', '.join(found_uris) + ' when searching on Google')
            else:
                self.error('Did not find one of the resource URIs ' + ', '.join(resource_uris) + ' in: '+ ', '.join(search_results))
        else:
            self.error('No resource title found, cannot search in google')

            
        return eval, g 

