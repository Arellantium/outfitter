from pydantic import BaseModel

class ArticoloBase(BaseModel):
    id: int
    post_id: int
    nome: str
    taglia: str
    condizione: str
    prezzo: float
    venduto: bool

    class Config:
        from_attributes = True