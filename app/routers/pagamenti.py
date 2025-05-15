from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db
from app.services.pagamenti_service import process_payment_success, process_payment_failure
from app.schemas.pagamentoOut import PagamentoOut
from app.schemas.pagamentoUpdate import PagamentoUpdate
from app.models.models import Pagamento
from sqlalchemy.future import select

router = APIRouter()

@router.post("/payment-success", response_model=PagamentoOut, tags=["pagamenti"])
async def payment_success(acquisto_id: int, db: AsyncSession = Depends(get_db)):
    pagamento = await process_payment_success(acquisto_id, db)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Acquisto non trovato")
    return pagamento

@router.post("/payment-failure", response_model=PagamentoOut, tags=["pagamenti"])
async def payment_failure(acquisto_id: int, db: AsyncSession = Depends(get_db)):
    pagamento = await process_payment_failure(acquisto_id, db)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Acquisto non trovato")
    return pagamento

@router.put("/payment/{payment_id}", response_model=PagamentoOut, tags=["pagamenti"])
async def update_payment_status(payment_id: int, payment_update: PagamentoUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pagamento).filter(Pagamento.id == payment_id))
    pagamento = result.scalars().first()

    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento non trovato")

    pagamento.status = payment_update.status
    await db.commit()
    await db.refresh(pagamento)
    return pagamento
