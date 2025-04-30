from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.configuration.database import get_db
from app.models.models import Acquisto, Utente, Outfit, Articolo
from app.schemas.acquistoCreate import AcquistoCreate
from app.schemas.acquistoOut import AcquistoOut
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/acquisti", response_model=AcquistoOut, tags=["acquisti"])
def create_acquisto(acquisto: AcquistoCreate, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    utente = db.query(Utente).filter(Utente.nome == current_username).first()
    if not utente:
        raise HTTPException(status_code=404, detail="user not found")
    
    nuovo_acquisto = Acquisto(utente_id = utente.id, outfit_id = acquisto.outfit_id, articolo_id = acquisto.articolo_id, prezzo_pagato = acquisto.prezzo_pagato)
    db.add(nuovo_acquisto)
    db.commit()
    db.refresh(nuovo_acquisto)
    return nuovo_acquisto

@router.get("/acquisti/{id}", response_model=AcquistoOut, tags=["aquisti"])
def get_acquisto(id: int, db: Session = Depends(get_db)):
    acquisto = db.query(Acquisto).filter(Acquisto.id == id).first()
    if acquisto is None:
        raise HTTPException(status_code=404, detail="acquisto non trovato")
    return acquisto

@router.get("/acquisti", response_model=list[AcquistoOut], tags=["acquisti"])
def list_acquisti(db: Session = Depends(get_db)):
    return db.query(Acquisto).all()

@router.delete("/acquisti/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["acquisti"])
def delete_acquisto(id: int, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    acquisto = db.query(Acquisto).filter(Acquisto.id == id).first()
    if acquisto is None:
        raise HTTPException(status_code=404, detail="acquisto non trovato")
    
    db.delete(acquisto)
    db.commit()
    return 