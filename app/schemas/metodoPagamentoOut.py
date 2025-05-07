from pydantic import BaseModel

class MetodoPagamentoOut(BaseModel):
    id: int
    intestatario: str
    numero_carta_mascherata: str  # es. **** **** **** 1234
    scadenza: str
    circuito: str

    class Config:
        from_attributes = True
