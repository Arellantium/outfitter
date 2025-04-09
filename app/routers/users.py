from fastapi import APIRouter, HTTPException, Depends, status
from app.services.auth import get_current_user

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/protected", tags=["users"])
def read_protected(current_user: str = Depends(get_current_user)):
    return {"message": f"Ciao {current_user}, hai accesso a questa risorsa protetta!"}

@router.get("/test-crash", tags=["users"])
async def test_crash():
    logger.info("🚨 Simulazione crash volontario")
    raise ValueError("Crash simulato per test del middleware")

@router.get("/test-crash-zero", tags=["users"])
async def test_crash():
    # Forza un'eccezione
    1 / 0