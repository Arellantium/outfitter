from pydantic import BaseModel
from typing import Optional

class PostOut(BaseModel):
    id: int
    description: str
    author_id: int
    image_url: Optional[str]
    created_at: str
    likes: int
    visualizzazioni: int
    stato: str
    visibile: bool
    prezzo_finale: Optional[float]
    venduto: bool

    class Config:
        from_attributes = True  # Pydantic v2+, come stai usando correttamente