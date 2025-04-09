from fastapi import APIRouter, HTTPException, Depends, status
from datetime import timedelta
from app.services import auth
from pydantic import BaseModel
from app.configuration.settings import settings
from app.schemas.TokenRequest import TokenRequest  # ✅ Import del nuovo schema

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Schema per restituire il token
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@router.post("/token", tags=["auth"] , response_model=TokenResponse)
def login_for_access_token(form_data: TokenRequest):
    logger.info(f"Richiesta di accesso per l'utente: {form_data.username}")
    # In un caso reale, dovresti verificare le credenziali dell'utente
    if form_data.username != "pippo.rossi_21" or form_data.password != "@aP9Lm$z2#rW":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username o password errati",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Creiamo il token, includendo "sub" (subject) con il nome utente
    access_token = auth.create_access_token(
        data={"sub": form_data.username},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
