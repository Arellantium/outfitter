from pydantic import BaseModel, Field, field_validator
from app.validators.common_validators import validate_email

class UserCreateRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=6, max_length=20)
    email: str

    
    @field_validator("email", mode="before")
    def email_validator(cls, value):
        return validate_email(value) 