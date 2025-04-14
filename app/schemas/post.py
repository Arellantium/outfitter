from pydantic import BaseModel

class PostBase(BaseModel):
    id: int
    data_publicazione: str
    visualizzazioni: int
    stato: str
    visibile: bool

    class Config:
        from_attributes = True  # Questo è necessario per permettere a Pydantic di lavorare con i modelli SQLAlchemy
