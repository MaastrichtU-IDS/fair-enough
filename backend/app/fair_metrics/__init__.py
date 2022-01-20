from fastapi import APIRouter

from app.fair_metrics import fairmetrics_f4, fairmetrics_shex

# Add new routes for metrics evaluations here

router = APIRouter()

router.include_router(fairmetrics_f4.router)
router.include_router(fairmetrics_shex.router)
