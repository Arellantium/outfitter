from pydantic import BaseModel, EmailStr

class UtenteUpdate(BaseModel):
    nome: str | None = None
    email: EmailStr | None = None
    password: str | None = None