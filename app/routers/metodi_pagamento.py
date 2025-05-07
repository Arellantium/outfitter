from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.configuration.database import get_db
from app.services.auth import get_current_user
from app.models.models import MetodoPagamento, Utente
from app.schemas.metodoPagamentoCreate import MetodoPagamentoCreate
from app.schemas.metodoPagamentoOut import MetodoPagamentoOut

router = APIRouter(prefix="/metodi-pagamento", tags=["Metodi Pagamento"])

# POST /metodi-pagamento
@router.post("/", response_model=MetodoPagamentoOut)
def aggiungi_metodo_pagamento(
    metodo: MetodoPagamentoCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    utente = db.query(Utente).filter(Utente.nome == current_user).first()
    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # Maschera il numero carta per sicurezza
    carta_mascherata = f"**** **** **** {metodo.numero_carta[-4:]}"

    nuovo_metodo = MetodoPagamento(
        utente_id=utente.id,
        intestatario=metodo.intestatario,
        numero_carta=carta_mascherata,
        scadenza=metodo.scadenza,
        circuito=metodo.circuito
    )

    db.add(nuovo_metodo)
    db.commit()
    db.refresh(nuovo_metodo)
    return nuovo_metodo

# GET /metodi-pagamento
@router.get("/", response_model=list[MetodoPagamentoOut])
def get_metodi_pagamento(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    utente = db.query(Utente).filter(Utente.nome == current_user).first()
    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    metodi = db.query(MetodoPagamento).filter_by(utente_id=utente.id).all()
    return metodi

# DELETE /metodi-pagamento/{id}
@router.delete("/{id}")
def delete_metodo_pagamento(id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    metodo = db.query(MetodoPagamento).filter_by(id=id).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Metodo di pagamento non trovato")
    db.delete(metodo)
    db.commit()
    return {"message": "Metodo di pagamento eliminato"}