from pydantic import BaseModel, EmailStr

class UtenteOut(BaseModel):
    id: int
    nome: str
    email: EmailStr
    guadagni_totali: int

    class Config:
        from_attributes = True