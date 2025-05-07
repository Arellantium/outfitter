from pydantic import BaseModel, Field
from typing import Annotated

class ShippingInfoCreate(BaseModel):
    full_name: str
    address: str
    city: str
    postal_code: str
    country: str
    phone: Annotated[str, Field(min_length=8)]

    class Config:
        from_attributes = True


