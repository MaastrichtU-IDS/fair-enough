from fastapi import APIRouter

from app.api import login, evaluations, collections, metrics_tests


api_router = APIRouter()
api_router.include_router(evaluations.router, tags=["Evaluations"])
api_router.include_router(collections.router, tags=["Collections"])
api_router.include_router(metrics_tests.router, tags=["Metrics tests"])
api_router.include_router(login.router, tags=["Login"])

# api_router.include_router(metrics.router, tags=["Metrics"])