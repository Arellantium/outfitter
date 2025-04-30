from pydantic import BaseModel

class OutfitCreate(BaseModel):
    post_id: int
    nome: str
    sconto_percentuale: float | None = None
    prezzo_finale: float
    venduto: bool = False

