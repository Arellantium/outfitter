# app/schemas/acquistoPostOut.py
from pydantic import BaseModel
from typing import Optional

class AcquistoOut(BaseModel):
    id: int
    description: str
    author: str
    image_url: Optional[str]
    

    class Config:
        from_attributes = True
