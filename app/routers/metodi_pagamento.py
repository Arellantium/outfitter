from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db
from app.services.auth import get_current_user
from app.models.models import MetodoPagamento, Utente
from app.schemas.metodoPagamentoCreate import MetodoPagamentoCreate
from app.schemas.metodoPagamentoOut import MetodoPagamentoOut
from sqlalchemy import select

router = APIRouter(prefix="/metodi-pagamento", tags=["Metodi di Pagamento"])

# POST /metodi-pagamento
@router.post("/", response_model=MetodoPagamentoOut)
async def aggiungi_metodo_pagamento(
    metodo: MetodoPagamentoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    utente = result.scalars().first()

    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    
    carta_mascherata = f"**** **** **** {metodo.numero_carta[-4:]}"
 
    nuovo_metodo = MetodoPagamento(
        utente_id=utente.id,
        intestatario=metodo.intestatario,
        numero_carta=carta_mascherata,
        scadenza=metodo.scadenza,
        circuito=metodo.circuito
    )

    db.add(nuovo_metodo)
    await db.commit()
    await db.refresh(nuovo_metodo)
    return nuovo_metodo

# GET /metodi-pagamento
@router.get("/", response_model=list[MetodoPagamentoOut])
async def get_metodi_pagamento(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    utente = result.scalars().first()

    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    result = await db.execute(select(MetodoPagamento).where(MetodoPagamento.utente_id == utente.id))
    metodi = result.scalars().all()
    return metodi

# DELETE /metodi-pagamento/{id}
@router.delete("/{id}")
async def delete_metodo_pagamento(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(MetodoPagamento).where(MetodoPagamento.id == id))
    metodo = result.scalars().first()

    if not metodo:
        raise HTTPException(status_code=404, detail="Metodo di pagamento non trovato")

    await db.delete(metodo)
    await db.commit()
    return {"message": "Metodo di pagamento eliminato"}