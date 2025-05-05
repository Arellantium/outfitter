from pydantic import BaseModel, Field, validator
from app.validators.common_validators import validate_email

class UserCreateRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=6, max_length=20)
    email: str

    @validator("email")
    def email_validator(cls, value):
        return validate_email(value)    