from pydantic import BaseModel

class CommentoProfiloBase(BaseModel):
    id: int
    autore_id: int
    destinatario_id: int
    contenuto: str
    approvato: bool

    class Config:
        from_attributes = True