from app.models import AssessmentModel, EvaluationModel
from rdflib import Literal, RDF, URIRef
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, OWL, SKOS, FOAF

class Assessment(AssessmentModel):
    fair_type = 'f'
    metric_id = '3'
    title = 'Resource Identifier is in Metadata'
    description = """Whether the metadata document contains the globally unique and persistent identifier for the digital resource.
Parsing the metadata to search for the given digital resource GUID.
And retrieving informations about this resource (title, description, date created, etc)"""
    author = 'https://orcid.org/0000-0002-1501-1082'
    max_score = 1
    max_bonus = 1

    def evaluate(self, eval: EvaluationModel, g):
        alt_uris = eval.data['alternative_uris']

        # FDP specs: https://github.com/FAIRDataTeam/FAIRDataPoint-Spec/blob/master/spec.md
        # For KG: https://www.w3.org/TR/hcls-dataset

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
                break
            else: 
                self.warning('Could not find links to the resource URI ' + alt_uri + ' in the metadata')

            # Try to extract some metadata from the parsed RDF
            title_preds = [ DC.title, DCTERMS.title, RDFS.label, URIRef('http://schema.org/name')]
            eval, g = self.extract_property('resource_title', title_preds, eval, g)

            description_preds = [ DCTERMS.description, URIRef('http://schema.org/description')]
            eval, g = self.extract_property('resource_description', description_preds, eval, g)

            date_created_preds = [ DCTERMS.created, URIRef('http://schema.org/dateCreated')]
            eval, g = self.extract_property('date_created', date_created_preds, eval, g)

        return eval, g

