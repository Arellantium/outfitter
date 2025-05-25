# app/schemas/acquistoPostOut.py
from pydantic import BaseModel
from typing import Optional

class AcquistoOut(BaseModel):
    id: int
    utente_id: int
    post_id: int
    data_acquisto: str
    prezzo_pagato: float
    

    class Config:
        from_attributes = True
