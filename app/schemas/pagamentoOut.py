from pydantic import BaseModel
from datetime import datetime

class PagamentoOut(BaseModel):
    id: int
    acquisto_id: int
    metodo_pagamento: str
    importo: float
    status: str
    data_pagamento: datetime

    class Config:
        from_attributes = True
