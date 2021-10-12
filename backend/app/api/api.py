from fastapi import APIRouter

from app.api import login, evaluations, collections, assessments

api_router = APIRouter()
api_router.include_router(evaluations.router, tags=["evaluations"])
api_router.include_router(assessments.router, tags=["assessments"])
# api_router.include_router(evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(collections.router, prefix="/collections", tags=["collections"])
api_router.include_router(login.router, tags=["login"])
