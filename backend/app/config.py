import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    API_PATH: str = ""
    # BASE_URI: str = f"http://localhost{API_PATH}"
    BASE_URI: str = "https://w3id.org/fair-enough"
    
    TESTS_API_URL: str = f"http://tests-api:80"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DEV_MODE: bool = False

    # Those defaults are used by GitHub Actions for testing
    # The settings used by Docker deployment are in the .env file
    PROJECT_NAME: str = 'FAIR enough API'
    EVALUATION_LICENSE: str = 'http://creativecommons.org/licenses/by/4.0/'
    # SERVER_NAME: str = 'localhost'
    # SERVER_HOST: AnyHttpUrl = 'http://localhost'

    FRONTEND_URL: str = 'http://localhost:19006'
    OAUTH_REDIRECT_FRONTEND: str = 'http://localhost:19006/collections/create'

    ORCID_CLIENT_ID: Optional[str]
    ORCID_CLIENT_SECRET: Optional[str]
    OAUTH_REDIRECT_URI: str = 'http://localhost/api/auth'

    MONGODB_URL: str = f'mongodb://root:oursecretkey@mongodb:27017/'

    # CONTEXT = 'https://raw.githubusercontent.com/MaastrichtU-IDS/fair-enough/main/context.jsonld'
    CONTEXT = {
        "eval": "http://w3id.org/FAIR_Evaluator/schema#",
        "prov": "https://www.w3.org/ns/prov#",
        "dct": "http://purl.org/dc/terms/",
        "schema": "http://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "sio": "http://semanticscience.org/resource/",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "skos": "http://www.w3.org/2004/02/skos/core#",

        "_id": "http://purl.org/dc/terms/identifier",
        "title": "http://purl.org/dc/terms/title",
        "description": "http://rdfs.org/ns/void#description",
        "homepage": "http://www.w3.org/ns/dcat#publisher",
        "author": "http://purl.org/dc/elements/1.1/authoredBy",
        "creator": "http://purl.org/dc/terms/creator",
        "created": "http://purl.org/pav/version",
        "assessments": "http://www.w3.org/ns/ldp#contains",
        "contains": "http://www.w3.org/ns/ldp#contains",
        "license": "http://purl.org/dc/terms/license",

        "summary": "http://semanticscience.org/resource/isDescribedBy",
        "subject": "http://semanticscience.org/resource/SIO_000332",
        "collection": "http://www.w3.org/ns/ldp#contains",
        "created_at": "http://purl.obolibrary.org/obo/date",
        "score": "http://semanticscience.org/resource/SIO_000300",
        "score_max": "http://semanticscience.org/resource/hasCapability",
        "score_percent": "http://semanticscience.org/resource/hasConcretization",
        "metadata": "http://semanticscience.org/resource/metadata",
        # "metadata": "http://semanticscience.org/resource/SIO_001330"
    }

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


    # SENTRY_DSN: Optional[HttpUrl] = None

    # @validator("SENTRY_DSN", pre=True)
    # def sentry_dsn_can_be_blank(cls, v: str) -> Optional[str]:
    #     if len(v) == 0:
    #         return None
    #     return v


    class Config:
        case_sensitive = True


settings = Settings()
