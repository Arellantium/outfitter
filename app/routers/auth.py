from fastapi import APIRouter, HTTPException, Depends, status
from datetime import timedelta
from app.services import auth
from pydantic import BaseModel
from app.configuration.settings import settings
from app.schemas.TokenRequest import TokenRequest  # ✅ Import del nuovo schema
from app.routers.users import pwd_context
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db
from sqlalchemy import select, delete
from app.models.models import Utente

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Schema per restituire il token
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@router.post("/token", tags=["auth"] , response_model=TokenResponse)
async def login_for_access_token(form_data: TokenRequest, db: AsyncSession=Depends(get_db)):
    logger.info(f"Richiesta di accesso per l'utente: {form_data.username}")

    hashed_password = pwd_context.hash(form_data.password)

    result = await db.execute(select(Utente).where(Utente.nome == form_data.username))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username errato",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not pwd_context.verify(form_data.password, user.password_hash):
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
