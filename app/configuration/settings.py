from pydantic_settings import BaseSettings  # ✅ CORRETTO per Pydantic v2+
class Settings(BaseSettings):
    APP_NAME: str = "MyFastAPIApp"
    ENV: str = "development"
    DEBUG: bool = True

    # JWT
    SECRET_KEY: str = "la-tua-chiave-segreta"  # Dovresti usare una chiave sicura in produzione
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    # DB_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
