from typing import Optional
from pydantic import BaseModel

class OutfitOut(BaseModel):
    id: int
    post_id: Optional[int]
    nome: str
    sconto_percentuale: int
    prezzo_finale: float
    venduto: bool

    class Config:
        from_attributes= True