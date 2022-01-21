from fastapi import APIRouter

from app.api import login, evaluations, collections, assessments
from app import fair_metrics
# from app.metrics import 

api_router = APIRouter()
api_router.include_router(evaluations.router, tags=["evaluations"])
api_router.include_router(assessments.router, tags=["assessments"])
# api_router.include_router(evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(collections.router, prefix="/collections", tags=["collections"])
api_router.include_router(login.router, tags=["login"])

## Add FAIR metrics API calls here
# api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(fair_metrics.router, prefix="/metrics", tags=["metrics"])
