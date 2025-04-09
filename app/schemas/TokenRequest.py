from pydantic import BaseModel, Field, field_validator
import re

class TokenRequest(BaseModel):
    username: str
    password: str

    @field_validator("username", mode="before")
    @classmethod
    def username_validator(cls, value):
        import re
        pattern = r'^[a-zA-Z0-9_.-]{3,20}$'
        if not re.match(pattern, value):
            raise ValueError(
                "Lo username può contenere solo lettere, numeri, underscore (_), punti (.) e trattini (-), e deve essere lungo tra 3 e 20 caratteri."
            )
        return value

    @field_validator("password", mode="before")
    @classmethod
    def password_validator(cls, value):
        # Lunghezza minima e massima
        if len(value) < 8 or len(value) > 20:
            raise ValueError("La password deve essere lunga tra 8 e 20 caratteri.")

        # Almeno una lettera maiuscola
        if not re.search(r"[A-Z]", value):
            raise ValueError("La password deve contenere almeno una lettera maiuscola.")

        # Almeno una lettera minuscola
        if not re.search(r"[a-z]", value):
            raise ValueError("La password deve contenere almeno una lettera minuscola.")

        # Almeno un numero
        if not re.search(r"[0-9]", value):
            raise ValueError("La password deve contenere almeno un numero.")

        # Almeno un carattere speciale
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("La password deve contenere almeno un carattere speciale.")

        return value