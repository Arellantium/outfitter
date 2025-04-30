from pydantic import BaseModel
from datetime import datetime

class AcquistoOut(BaseModel):
    id: int
    utente_id: int
    data_acquisto: datetime

    class Config:
        from_attributes = True