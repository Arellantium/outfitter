from pydantic import BaseModel
from typing import List, Optional


class ArticoloCreate(BaseModel):
    nome: str
    taglia: str
    condizione: str
    prezzo: float
    venduto: bool = False

class OutfitCreate(BaseModel):
    post_id: int
    nome: str
    sconto_percentuale: Optional[float] = None
    prezzo_finale: float
    venduto: bool = False
    articoli: List[ArticoloCreate] = []

