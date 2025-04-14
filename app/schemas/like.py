from pydantic import BaseModel

class Likebase(BaseModel):
    id: int
    utente_id: int
    post_id: int 

    class Config:
        from_attributes = True
        