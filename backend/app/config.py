import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    API_PATH: str = "/api"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # Those defaults are used by GitHub Actions for testing
    # The settings used by Docker deployment are in the .env file
    PROJECT_NAME: str = 'FAIR enough API'
    # SERVER_NAME: str = 'localhost'
    # SERVER_HOST: AnyHttpUrl = 'http://localhost'

    ORCID_CLIENT_ID: Optional[str]
    ORCID_CLIENT_SECRET: Optional[str]
    OAUTH_REDIRECT_URI: str = 'http://localhost/api/auth'

    MONGODB_URL: str = f'mongodb://root:{SECRET_KEY}@mongodb:27017/'


    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


    class Config:
        case_sensitive = True


settings = Settings()
