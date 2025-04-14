from pydantic import BaseModel

class BloccoutenteBase(BaseModel):
    id: int
    bloccante_id: int
    post_id: int

    class Config:
        from_attributes = True