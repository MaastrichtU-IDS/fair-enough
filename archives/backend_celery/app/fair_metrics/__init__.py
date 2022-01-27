from fastapi import APIRouter

from app.fair_metrics import f4_search_fairdatapoint, r3_validate_patient_registry

# Add new routes for new metrics evaluations here
router = APIRouter()

router.include_router(f4_search_fairdatapoint.api)
router.include_router(r3_validate_patient_registry.api)
