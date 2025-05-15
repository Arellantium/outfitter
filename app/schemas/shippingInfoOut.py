from pydantic import BaseModel, Field


class ShippingInfoOut(BaseModel):
    id: int
    utente_id: int