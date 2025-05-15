from pydantic import BaseModel

class Acquistobase(BaseModel):
    id: int 
    utente_id: int
    articolo_id: int
    outfit_id: int
    data_acquisto: str

    class Config:
        from_attributes = True