from pydantic import BaseModel
from typing import Optional

class SalvataggioPostOut(BaseModel):
    id: int
    description: str
    author: str
    image_url: Optional[str]
    created_at: str
    likes: int
    visualizzazioni: int
    stato: str
    visibile: bool

    class Config:
        from_attributes = True
