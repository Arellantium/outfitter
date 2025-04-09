from sqlalchemy import Column, Integer, String
from app.configuration.database import Base

class Utente(Base):
    __tablename__ = "utente"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    provider_social = Column(String)
    guadagni_totali = Column(Integer, default=0)

