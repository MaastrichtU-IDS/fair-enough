from app.models.assessment import AssessmentModel
from app.models.evaluation import EvaluationModel
from rdflib import Literal, RDF, URIRef
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, OWL, SKOS, FOAF

class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '3'
    title = 'Resource Identifier is in Metadata'
    description = """Whether the metadata document contains the globally unique and persistent identifier for the digital resource.
Parsing the metadata for the given digital resource GUID."""
    max_score = 1
    max_bonus = 0

    def evaluate(self, eval: EvaluationModel, g):
        alt_uris = eval.data['alternative_uris']

        self.check('Checking RDF metadata to find links to the resource identifiers: ' + ', '.join(alt_uris))
        for alt_uri in alt_uris:
            found_link = False
            uri_ref = URIRef(alt_uri)
            resource_properties = {}
            resource_linked_to = {}
            eval.data['identifier_in_metadata'] = {}
            for p, o in g.predicate_objects(uri_ref):
                found_link = True
                resource_properties[str(p)] = str(o)
            eval.data['identifier_in_metadata']['properties'] = resource_properties
            for s, p in g.subject_predicates(uri_ref):
                found_link = True
                resource_linked_to[str(s)] = str(p)
            eval.data['identifier_in_metadata']['linked_to'] = resource_linked_to
            # eval.data['identifier_in_metadata'] = {
            #     'properties': resource_properties,
            #     'linked_to': resource_linked_to,
            # }
            # print('identifier_in_metadata')
            # print(eval.data['identifier_in_metadata'])

            if found_link:
                self.success('Found links to the URI ' + alt_uri + ' in the metadata: ' 
                    + ', '.join(list(eval.data['identifier_in_metadata']['properties'].keys()) + list(eval.data['identifier_in_metadata']['linked_to'].keys()))
                )
            else: 
                self.warning('Could not find links to the resource URI ' + alt_uri + ' in the metadata')

            # Try to extract title from RDF metadata
            title_preds = [ DC.title, DCTERMS.title, URIRef('https://schema.org/name')]
            for title_pred in title_preds:
                if 'resource_title' not in eval.data.keys():
                    if g.value(uri_ref, title_pred):
                        print(g.value(uri_ref, title_pred))
                        eval.data['resource_title'] = g.value(uri_ref, title_pred)
                        self.log('Found a title with predicate ' + str(title_pred) + ' in the resource metadata: ' + eval.data['resource_title'])
                        break
            
        return eval, g

