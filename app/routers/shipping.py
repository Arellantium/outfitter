from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.configuration.database import get_db
from app.services.auth import get_current_user
from app.models.models import ShippingInfo, Utente
from app.schemas.shippingInfoCreate import ShippingInfoCreate
from app.schemas.shippingInfoOut import ShippingInfoOut

router = APIRouter(prefix="/shipping", tags=["Shipping"])

@router.post("/", response_model=ShippingInfoOut)
def add_shipping_info(data: ShippingInfoCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(Utente).filter(Utente.nome == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    shipping = ShippingInfo(utente_id=user.id, **data.dict())
    db.add(shipping)
    db.commit()
    db.refresh(shipping)
    return shipping

@router.get("/", response_model=list[ShippingInfoOut])
def get_my_shipping_info(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(Utente).filter(Utente.nome == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    return db.query(ShippingInfo).filter(ShippingInfo.utente_id == user.id).all()
