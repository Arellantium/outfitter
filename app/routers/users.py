from fastapi import APIRouter, HTTPException, Depends, status
from app.services.auth import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session

from app.configuration.dependencies_database import get_db
from app.configuration.database import AsyncSessionLocal
from app.schemas.utente import UtenteBase
from app.schemas.UserCreateRequest import UserCreateRequest
from app.schemas.utenteOut import UtenteOut
from app.schemas.utenteUpdate import UtenteUpdate
from app.models.models import Utente 
from passlib.context import CryptContext
from app.services.auth import get_current_user

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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", tags=["auth"])
def signup(user: UserCreateRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Utente).filter(Utente.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "Email già registrata"
        )
    
    hashed_password = pwd_context.hash(user.password)

    new_user = Utente(
        nome=user.username,
        email=user.email,
        password_hash = hashed_password,
        provider_social = None,
        guadagni_totali = 0
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "utente creato con successo"}

@router.get("/me", response_model=UtenteOut, tags=["auth"])
def get_me(current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(Utente).filter(Utente.nome == current_username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UtenteOut, tags=["auth"])
def update_me(update_data: UtenteUpdate, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(Utente).filter(Utente.nome == current_username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if update_data.nome:
        user.nome = update_data.nome
    if update_data.email:
        user.email = update_data.email
    if update_data.password:
        user.password_hash = pwd_context.hash(update_data.password)

    db.commit()
    db.refresh(user)

    return user