from pydantic import BaseModel

class AcquistoCreate(BaseModel):
    post_id: int
    prezzo_pagato: float