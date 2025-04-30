from pydantic import BaseModel, EmailStr

class UtenteOut(BaseModel):
    nome: str
    email: EmailStr

    class Config:
        from_attributes = True