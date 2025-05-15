from pydantic import BaseModel

class AcquistoCreate(BaseModel):
    outfit_id: int
    articolo_id:int 
    prezzo_pagato: float