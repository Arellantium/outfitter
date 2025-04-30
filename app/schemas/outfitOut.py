from pydantic import BaseModel

class OutfitOut(BaseModel):
    id: int 

    class Config:
        from_attributes= True