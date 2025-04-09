# validators/common_validators.py
import re
from pydantic import ValidationError

def validate_email(value: str) -> str:
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(pattern, value):
        raise ValueError("Email non valida")
    return value