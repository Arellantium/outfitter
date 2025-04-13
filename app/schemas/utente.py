from pydantic import BaseModel, field_validator
from app.validators.common_validators import validate_email

# Schema Pydantic per la risposta dell'utente
class UtenteBase(BaseModel):
    id: int
    nome: str
    email: str
    provider_social: str | None = None
    guadagni_totali: int

    @field_validator("email", mode="before")
    def email_validator(cls, value):
        return validate_email(value) 

    class Config:
        from_attributes = True  # Questo è necessario per permettere a Pydantic di lavorare con i modelli SQLAlchemy
