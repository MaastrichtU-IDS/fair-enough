from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OpenIdConnect
# from jose import jwt
# from pydantic import ValidationError
# from sqlalchemy.orm import Session

from app import models
# from app.core import security
# from app.config import settings
# from app.db.session import SessionLocal
import requests
# import motor.motor_asyncio
from app.config import settings

# Main issues discussing implementing OpenID Connect / OAuth2 in FastAPI:
# https://github.com/tiangolo/fastapi/issues/488
# https://github.com/tiangolo/fastapi/issues/12

reusable_oauth2 = OpenIdConnect(
    openIdConnectUrl='https://orcid.org/.well-known/openid-configuration',
    # flow='implicit' not working
)
# https://github.com/tiangolo/fastapi/issues/12#issuecomment-457706256
# OAuthFlowImplicit OAuthFlowAuthorizationCode
# https://github.com/tiangolo/fastapi/tree/master/fastapi/security

# reusable_oauth2 = OAuth2PasswordBearer(
#     # tokenUrl=f"{settings.API_PATH}/login/access-token"
#     tokenUrl=f"https://orcid.org/oauth/authorize?client_id=APP-TEANCMSUOPYZOGJ3&response_type=code&scope=/authenticate&redirect_uri=http://localhost/api/login/orcid"
# )
# oauth2_scheme = OAuth2AuthorizationCodeBearer(
#     authorizationUrl=settings.AUTHORIZATION_URL,
#     tokenUrl=settings.TOKEN_URL
# )

def get_current_user(
    token: str = Depends(reusable_oauth2)
) -> models.User:
    # curl -i -L -H "Accept: application/json" -H "Authorization: Bearer aa4629f3-b0a2-4edd-b77a-398d7afe3c90" 'https://sandbox.orcid.org/oauth/userinfo'
    orcid_user = requests.get('https://orcid.org/oauth/userinfo',
                        headers={'Accept': 'application/json',
                                'Authorization': 'Bearer ' + token})
    return orcid_user.json()



# def get_current_active_superuser(
#     current_user: models.User = Depends(get_current_user),
# ) -> models.User:
#     # if not crud.user.is_superuser(current_user):
#     #     raise HTTPException(
#     #         status_code=400, detail="The user doesn't have enough privileges"
#     #     )
#     return current_user
