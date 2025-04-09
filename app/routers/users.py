from fastapi import APIRouter, HTTPException, Depends, status
from app.services.auth import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.configuration.dependencies_database import get_db
from app.configuration.database import AsyncSessionLocal
from app.schemas.utente import UtenteBase
from app.models.models import Utente 

from typing import List


import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/protected", tags=["users"])
def read_protected(current_user: str = Depends(get_current_user)):
    return {"message": f"Ciao {current_user}, hai accesso a questa risorsa protetta!"}

# API GET per elencare tutti gli utenti
@router.get("/utenti", tags=["Utenti"], response_model=List[UtenteBase])
async def get_utenti(db: AsyncSession = Depends(get_db)):
    # Esegui una query per ottenere tutti i record della tabella "utente"
    
    result = await db.execute(select(Utente))
    utenti = result.scalars().all()
    return utenti    