from pydantic import BaseModel

class PagamentoUpdate(BaseModel):
    status: str  # stato aggiornato, es. 'completato', 'fallito', 'annullato'

    class Config:
        from_attributes = True
