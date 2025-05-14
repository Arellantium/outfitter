from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.configuration.dependencies_database import get_db
from app.services.auth import get_current_user
from app.models.models import ShippingInfo, Utente
from app.schemas.shippingInfoCreate import ShippingInfoCreate
from app.schemas.shippingInfoOut import ShippingInfoOut
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

router = APIRouter(prefix="/shipping", tags=["Shipping"])

@router.post("/", response_model=ShippingInfoOut)
async def add_shipping_info(
    data: ShippingInfoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    shipping = ShippingInfo(utente_id=user.id, **data.dict())
    db.add(shipping)
    await db.commit()
    await db.refresh(shipping)
    return shipping


@router.get("/", response_model=list[ShippingInfoOut])
async def get_my_shipping_info(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Recupera l'utente asincronamente
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # Recupera gli indirizzi spedizione per l'utente
    result = await db.execute(select(ShippingInfo).where(ShippingInfo.utente_id == user.id))
    shipping_list = result.scalars().all()

    return shipping_list


