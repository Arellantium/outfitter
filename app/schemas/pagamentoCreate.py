from pydantic import BaseModel
from datetime import datetime

class PagamentoCreate(BaseModel):
    acquisto_id: int
    metodo_pagamento: str  # esempio: 'carta di credito', 'PayPal', etc.
    importo: float
    status: str = "in attesa"  # lo stato può essere 'in attesa', 'completato', 'fallito'

    class Config:
        from_attributes = True
