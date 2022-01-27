from app.models import AssessmentModel, EvaluationModel, MetricInput
import requests
# from googlesearch import search

from fastapi import APIRouter, Body, Depends
from fastapi_utils.cbv import cbv
from rdflib import Graph

# @cbv(router)
class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '4'
    role = 'check'
    title = 'The resource is indexed in a searchable resource'
    description = """Search for existing metadata about the resource URI in data repositories, such as DataCite, RE3data."""
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 1
    max_bonus = 0

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
                    self.success('Retrieved metadata about ' + doi + ' from DataCite API')
                    eval.data['datacite'] = {}
                    print('datacite_data')
                    print(datacite_data.keys())

                    if 'titles' in datacite_data.keys():
                        eval.data['datacite']['title'] = datacite_data['titles'][0]['title']
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


        ## Check google search using the resource title and its alternative URIs
        ## Might be against Google TOS
        # if 'resource_title' in eval.data.keys():
        #     resource_title = eval.data['resource_title']
            
        #     resource_uris = eval.data['alternative_uris']

        #     self.check('Running Google search for: ' + resource_title)
        #     search_results = list(search(resource_title, tld="co.in", num=20, stop=20, pause=1))
        #     print(search_results)

        #     found_uris = list(set(resource_uris).intersection(search_results))
        #     # if any(i in resource_uris for i in search_results):
        #     if found_uris:
        #         self.success('Found the resource URI ' + ', '.join(found_uris) + ' when searching on Google for ' + resource_title)
        #     else:
        #         self.error('Did not find one of the resource URIs ' + ', '.join(resource_uris) + ' in: '+ ', '.join(search_results))
        # else:
        #     self.error('No resource title found, cannot search in google')

            
        return eval, g 


    # class RunEvaluate:
    #     # def evaluate(eval: EvaluationModel, g):
    #     #     evaluate(eval, g)
    #     def __init__(self, evaluate = None, metric_label: str = ''):
    #         self.evaluate = evaluate()
    #         self.metric_label = metric_label


    metric_label = fair_type + metric_id + '_' + title.lower().replace(' ', '_')
    api: APIRouter = APIRouter()
    @api.post(
        "/" + metric_label,
        name=title,
        description=description,
        response_description="FAIR metric score", 
    )
    def fair_metrics(
            self,
            input: MetricInput = Body(...)
        ) -> dict:
        try: 
            init_eval = {
                'resource_uri': input.subject,
                'title': 'Run assessment',
                'collection': 'fair-metrics',
                'data': {'alternative_uris': [input.subject]},
                # '@id': f'{settings.BASE_URI}/evaluation/run-assessment',
                # '@context': settings.CONTEXT
            }
            eval = EvaluationModel(**init_eval)
            g = Graph()

            eval, g = self.evaluate(eval, g)
            # return eval.results[0].dict(with_alias=True)
            print(eval.results[0])
            eval.results[0]['data'] = eval.data
            return eval.results[0]
        except Exception as e:
            print('❌ Error running the assessment ' + self.metric_label)
            print(e)
