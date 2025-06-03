from pydantic import BaseModel

class OutfitPostResponse(BaseModel):
    user: str
    user_id: str
    id_image: str
    uri: str
    price: str
    like: bool
    sold: bool
    description: str
