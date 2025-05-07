from typing import Optional, List
from pydantic import BaseModel

class ArticoloOut(BaseModel):
    id: int
    nome: str
    taglia: str
    condizione: str
    prezzo: float
    venduto: bool

    class Config:
        from_attributes = True


class OutfitOut(BaseModel):
    id: int
    post_id: int
    nome: str
    sconto_percentuale: float
    prezzo_finale: float
    venduto: bool
    articoli: List[ArticoloOut] = []  # ⬅️ Articoli associati all'outfit

    class Config:
        from_attributes = True