# from typing import Dict
import pytest
# from httpx import AsyncClient
from fastapi.testclient import TestClient
import json

# from app.tests.conftest import client
from app.config import settings
from app.models import EvaluationModel
from app.assessments.f2_machine_readable_metadata import Assessment
from rdflib import Graph

# from app.api.evaluations import create_evaluation

testing = [
    {
        'url': 'https://doi.org/10.1594/PANGAEA.908011',
        'expectedScore': '1',
        'expectedTriples': '80'
    },
    {
        'url': 'https://doi.org/10.5281/zenodo.1486394',
        'expectedScore': '1',
        'expectedTriples': '80'
    }
]
# FAIR principle publication: https://doi.org/10.1038/sdata.2016.18
# Zenodo RDFLib library: https://doi.org/10.5281/zenodo.1486394
# Wikidata DOI: https://doi.org/10.1016/J.JBI.2019.103292
# Dataverse NL: https://doi.org/10.34894/DR3I2A
# FAIR Data Point distribution: https://purl.org/fairdatapoint/app/distribution/54a43c3e-8a6f-4a75-95c0-a2cb1e8c74ab
# FAIR sharing: https://doi.org/10.25504/FAIRsharing.jptb1m
# Pangea data repository: https://doi.org/10.1594/PANGAEA.908011
# Interoperability publication: https://doi.org/10.1045/november2015-vandesompel
# Bio2RDF publication: https://doi.org/10.1016/j.jbi.2008.03.004
# SIO publication: https://doi.org/10.1186/2041-1480-5-14
# SIO Ontology: http://semanticscience.org/ontology/sio.owl
# Kaggle: https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge
# RIVM data repository: https://data.rivm.nl/meta/srv/eng/rdf.metadata.get?uuid=1c0fcd57-1102-4620-9cfa-441e93ea5604&approved=true
# NeuroDKG publication: https://doi.org/10.5281/zenodo.5541440
# ORCID profile: https://orcid.org/0000-0002-1501-1082


def test_evaluation_get() -> None:
    test_url = 'https://doi.org/10.1594/PANGAEA.908011'

    eval = EvaluationModel(**{
        'resource_uri': test_url,
        'collection': 'fair-metrics',
        'data': { 'alternative_uris': [test_url] },
        '@id': f'{settings.BASE_URI}/evaluation/test',
        '@context': settings.CONTEXT
    })
    g = Graph()
    
    assess = Assessment('f2_machine_readable_metadata')
    
    eval, g = assess.runEvaluate(eval, g)

    print(g)
    print(eval.results)

    assert eval.results[0]['score'] == 1
    assert len(g) >= 80



# def test_evaluation_create(test_client) -> None:
#     eval_data = {
#         "resource_uri": "https://doi.org/10.1594/PANGAEA.908011",
#         "collection": "fair-metrics"
#     }

#     r = test_client.post(f"{settings.API_PATH}/evaluations",
#         data=json.dumps(eval_data),
#         headers={"Accept": "application/json"}
#     )
#     results = r.json()
#     assert r.status_code == 200
#     assert len(results['results']) > 2
