from pydantic import BaseModel, Field
from typing import Annotated

class MetodoPagamentoCreate(BaseModel):
    intestatario: str
    numero_carta: Annotated[str, Field(min_length=16, max_length=16)]
    scadenza: Annotated[str, Field(pattern=r"^\d{2}/\d{2}$")]  # formato MM/YY
    cvv: Annotated[str, Field(min_length=3, max_length=4)]  # solo in input
    circuito: str  # Visa, MasterCard, ecc.

    class Config:
        from_attributes = True
