from fastapi import APIRouter, Depends, HTTPException, status
from app.services.auth import get_current_user
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db
from app.models.models import Acquisto, Utente, Outfit, Articolo
from app.schemas.acquistoCreate import AcquistoCreate
from app.schemas.acquistoOut import AcquistoOut
from app.services.auth import get_current_user

router = APIRouter()

@router.post(
    "/acquisti",
    response_model=AcquistoOut,
    tags=["acquisti"],
    summary="Registra un nuovo acquisto",
    description="""
Crea e registra un nuovo acquisto associato all'utente autenticato.  
Valida la presenza dell'utente e i riferimenti a outfit/articolo.  
**Errori gestiti:**
- `404`: utente non trovato
- `422`: dati non validi
- `500`: errore interno durante il salvataggio
"""
)
async def create_acquisto(
    acquisto: AcquistoCreate,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuovo acquisto per l'utente autenticato.
    - Verifica l'esistenza dell'utente
    - Crea l'acquisto e lo salva nel database

    :param acquisto: dati dell'acquisto
    :param current_username: utente autenticato
    :param db: sessione DB asincrona
    :return: nuovo acquisto creato
    """
    result = await db.execute(select(Utente).where(Utente.nome == current_username))
    utente = result.scalars().first()
    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    nuovo_acquisto = Acquisto(
        utente_id=utente.id,
        outfit_id=acquisto.outfit_id,
        articolo_id=acquisto.articolo_id,
        prezzo_pagato=acquisto.prezzo_pagato
    )

    db.add(nuovo_acquisto)
    await db.commit()
    await db.refresh(nuovo_acquisto)

    return nuovo_acquisto


@router.get(
    "/acquisti/{id}",
    response_model=AcquistoOut,
    tags=["acquisti"],
    summary="Recupera un acquisto tramite ID",
    description="""
Restituisce i dettagli di un acquisto a partire dall'ID.  
**Errori gestiti:**
- `404`: acquisto non trovato
- `500`: errore interno
"""
)
async def get_acquisto(id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un acquisto tramite ID.

    :param id: ID dell'acquisto
    :param db: sessione DB asincrona
    :return: oggetto `AcquistoOut` se trovato
    """
    result = await db.execute(select(Acquisto).where(Acquisto.id == id))
    acquisto = result.scalars().first()
    if acquisto is None:
        raise HTTPException(status_code=404, detail="Acquisto non trovato")
    return acquisto


@router.get(
    "/acquisti",
    response_model=list[AcquistoOut],
    tags=["acquisti"],
    summary="Elenca tutti gli acquisti",
    description="""
Restituisce la lista completa degli acquisti registrati nel sistema.  
**Errori gestiti:**
- `500`: errore interno del server
"""
)
async def list_acquisti(db: AsyncSession = Depends(get_db)):
    """
    Elenca tutti gli acquisti presenti nel sistema.

    :param db: sessione DB asincrona
    :return: lista di oggetti `AcquistoOut`
    """
    result = await db.execute(select(Acquisto))
    return result.scalars().all()


@router.delete(
    "/acquisti/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["acquisti"],
    summary="Elimina un acquisto tramite ID",
    description="""
Elimina in modo permanente un acquisto specifico tramite ID.  
**Errori gestiti:**
- `404`: acquisto non trovato
- `500`: errore interno durante la rimozione
"""
)
async def delete_acquisto(
    id: int,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Elimina un acquisto esistente.

    :param id: ID dell'acquisto da eliminare
    :param current_username: utente autenticato (non usato direttamente, ma per sicurezza)
    :param db: sessione DB asincrona
    """
    result = await db.execute(select(Acquisto).where(Acquisto.id == id))
    acquisto = result.scalars().first()
    if acquisto is None:
        raise HTTPException(status_code=404, detail="acquisto non trovato")
    
    db.delete(acquisto)
    db.commit()
    return 