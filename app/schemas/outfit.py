from pydantic import BaseModel

class OutfitBase(BaseModel):
    id: int
    post_id: int
    nome: str
    sconto_percentuale: int
    prezzo_finale: int
    venduto: bool

    class Config:
        from_attributes = True