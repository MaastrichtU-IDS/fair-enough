from app.models.assessment import AssessmentModel
from app.models.evaluation import EvaluationModel
import os
import extruct
import requests
import html
from app.utils import parseRDF, mime_types

class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '2'
    title = 'Metadata is machine-readable'
    description = """This assessment will try to extract as much metadata it can from the resource URI, and put it in eval.data
It can be useful to put it at the start of your collection, and then search for properties in the metadata extracted.
Search for structured metadata at the resource URI. 
Use HTTP requests with content-negotiation (RDF, JSON-LD, JSON), 
and extract metadata from the HTML landing page using extruct"""
    max_score = 1
    max_bonus = 2

    def evaluate(self, eval: EvaluationModel, g):
        uri = eval.resource_uri
        check_mime_types = [ mime_types['rdf'], 'text/turtle', mime_types['jsonld'] ]
        # mime_types['turtle'], mime_types['json']

        r = requests.head(uri)
        print('REQUESTS HEADERS')
        print(r.headers)
        r = requests.get(uri)
        r.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xxx
        self.log('Successfully resolved ' + uri, '☑️')
        if r.history:
            self.log("Request was redirected to " + r.url + '. Adding as alternative URI')
            eval.data['alternative_uris'].append(r.url)
        
        print(r.headers)
        found_signposting = False
        if 'link' in r.headers.keys():
            signposting_links = r.headers['link']
            found_signposting = True
        if 'Link' in r.headers.keys():
            signposting_links = r.headers['Link']
            found_signposting = True
        if found_signposting:
            self.bonus('Found Signposting links: ' + str(signposting_links))
            eval.data['signposting'] = str(signposting_links)
        else:
            self.warning('Could not find Signposting links')

        self.check('Check if machine readable data (e.g. RDF, JSON-LD) can be retrieved using content-negotiation at ' + uri)
        # self.check('Trying (in this order): ' + ', '.join(check_mime_types))
        found_metadata_negotiation = False
        for mime_type in check_mime_types:
            try:
                r = requests.get(uri, headers={'accept': mime_type})
                r.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xxx
                self.log('Found some metadata when asking for ' + mime_type)
                if 'content_negotiation' not in eval.data.keys():
                    eval.data['content_negotiation'] = {}
                contentType = r.headers['Content-Type'].replace(' ', '').replace(';charset=utf-8', '')
                if contentType == 'text/html':
                    self.log('Content-Type retrieved is text/html, not a machine-readable format')
                    continue

                try:
                    # If return JSON-LD
                    eval.data['content_negotiation'][contentType] = r.json()

                    # TODO: quick fix to get alternative ID from JSON-LD
                    if 'url' in r.json():
                        eval.data['alternative_uris'].append(r.json()['url'])
                        # url': 'https://doi.pangaea.de/10.1594/PANGAEA.908011

                except:
                    # If returns RDF, such as turtle
                    eval.data['content_negotiation'][contentType] = r.text
                found_metadata_negotiation = True
                break

            except Exception as e:
                self.warning('Could not find metadata with content-negotiation when asking for: ' + mime_type + '. Getting: ' + e.args[0])

        if found_metadata_negotiation:
            self.success('Found metadata in ' + ', '.join(eval.data['content_negotiation'].keys()) + ' format using content-negotiation')
            # Parse RDF metadata
            for mime_type, rdf_data in eval.data['content_negotiation'].items():
                # https://rdflib.readthedocs.io/en/stable/plugin_parsers.html
                # rdflib_formats = ['turtle', 'json-ld', 'ntriples', 'nquads', 'xml', 'trig', 'n3']
                # print(rdf_data)
                g = parseRDF(rdf_data, mime_type, msg='content negotiation RDF', assessment=self)
                # self.log('RDF metadata size: ' + str(len(g)))
                break # Only parse the first RDF metadata file entry
        else:
            self.warning('Could not find metadata using content-negotiation, checking metadata embedded in HTML with extruct')


        # Extract metadata embedded  in HTML with extruct, if nothing found with content negotiation
        # if len(g) < 1:
        try:
            self.check('Checking for metadata embedded in the HTML page returned by the resource URI ' + uri + ' using extruct')
            get_uri = requests.get(uri, headers={'Accept': 'text/html'})
            html_text = html.unescape(get_uri.text)
            found_metadata_extruct = False
            try:
                extracted = extruct.extract(html_text.encode('utf8'))
                # Check extruct results:
                for extruct_type in extracted.keys():
                    if extracted[extruct_type]:
                        if 'extruct' not in eval.data.keys():
                            eval.data['extruct'] = {}

                        if extruct_type == 'dublincore' and extracted[extruct_type] == [{"namespaces": {}, "elements": [], "terms": []}]:
                            # Handle issue where extruct generate empty dict
                            continue

                        eval.data['extruct'][extruct_type] = extracted[extruct_type]
                        found_metadata_extruct = True

            except Exception as e:
                self.warning('Error when parsing HTML embedded microdata or JSON from ' + uri + ' using extruct. Getting: ' + str(e.args[0]))

            self.log('Extruct DONE')

            if found_metadata_extruct:
                self.success('Found embedded metadata in the resource URI HTML page: ' + ', '.join(eval.data['extruct'].keys()))
            else: 
                self.warning('Could not find embedded microdata or JSON in the HTML at ' + uri + ' using extruct')
        except Exception as e:
            self.warning('Error when running extruct on ' + uri + '. Getting: ' + str(e.args[0]))

        # TODO: extract signposting metadata

        return eval, g

