from sqlalchemy import Column, Integer, Float, String, Boolean
from app.configuration.database import Base
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Utente(Base):
    __tablename__ = "utente"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    provider_social = Column(String)
    guadagni_totali = Column(Integer, default=0)

class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, index=True)
    
    # Info base del post
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=datetime.utcnow().isoformat)  # oppure usa DateTime
    
    # Relazione con l'autore
    author_id = Column(Integer, ForeignKey("utente.id"), nullable=False)
    autore = relationship("Utente", backref="post")

    # Campi social
    visualizzazioni = Column(Integer, default=0)
    stato = Column(String, default="pubblicato")  # "pubblicato", "bozza"
    visibile = Column(Boolean, default=True)
    likes = Column(Integer, default=0)

    # Campi outfit
    prezzo_finale = Column(Float, nullable=True)  # oppure Float/Decimal se vuoi precisione monetaria
    venduto = Column(Boolean, default=False)
  

class Acquisto(Base):
    __tablename__ = "acquisto"

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, nullable=False)
    post_id = Column(Integer, nullable=True)
    data_acquisto = Column(String, nullable=False)
    prezzo_pagato = Column(Float, nullable = False)

class Follow(Base):
    __tablename__ = "follow"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, nullable=False)
    seguito_id = Column(Integer, nullable=False)

class Like(Base):
    __tablename__ = "like" 

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, nullable=False)
    post_id = Column(Integer, nullable=False)


class MetodoPagamento(Base):
    __tablename__ = "metodo_pagamento"

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, nullable=False)
    intestatario = Column(String, nullable=False)
    numero_carta = Column(String, nullable=False)  # Salvata mascherata
    scadenza = Column(String, nullable=False)
    circuito = Column(String, nullable=False)


class Pagamento(Base):
    __tablename__ = "pagamento"

    id = Column(Integer, primary_key=True, index=True)
    acquisto_id = Column(Integer, ForeignKey("acquisto.id"), nullable=False)
    metodo_pagamento = Column(String, nullable=False)  # es. carta, PayPal
    importo = Column(Float, nullable=False)
    status = Column(String, default="in attesa")  # in attesa, completato, fallito
    data_pagamento = Column(DateTime, default=datetime.utcnow)

    # Relazione opzionale (se vuoi recuperare l'acquisto associato)
    acquisto = relationship("Acquisto", backref="pagamento")


class Salvataggio(Base):
    __tablename__ = "salvataggio"
    id = Column(Integer,primary_key=True, index = True)
    utente_id = Column(Integer,nullable=False)
    post_id = Column(Integer, nullable=False)


class ShippingInfo(Base):
    __tablename__ = "shipping_info"

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, ForeignKey("utente.id"), nullable=False)
    full_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    utente = relationship("Utente", backref="shipping_infos")
