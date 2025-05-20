from pydantic import BaseModel

class OutfitPostResponse(BaseModel):
    user: str
    id_image: str
    uri: str
    price: str
    like: bool
    sold: bool
    description: str
