from sqlalchemy import Column, Integer, Float, String, Boolean
from app.configuration.database import Base

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
    data_publicazione = Column(String, nullable=False)
    visualizzazioni = Column(Integer, default=0)
    stato = Column(String, nullable=False)
    visibile = Column(Boolean, default=True)    

class Articolo(Base):
    __tablename__ = "articolo"
   
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer)
    nome = Column(String, nullable=False)
    taglia = Column(String, nullable=False)
    condizione = Column(String, nullable=False)
    prezzo = Column(Float, default=0)
    venduto = Column(Boolean, default=False)

class Outfit(Base):
    __tablename__ = "outfit"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer)
    nome = Column(String, nullable=False)
    sconto_percentuale = Column(Integer,default=0)
    prezzo_finale = Column(Float,default=0)
    venduto = Column(Boolean, default=False)

class Acquisto(Base):
    __tablename__ = "acquisto"

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, nullable=False)
    articolo_id = Column(Integer, nullable=True)
    outfit_id = Column(Integer, nullable=True)
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

class BloccoUtente(Base):
    __tablename__ = "bloccoUtente"

    id = Column(Integer, primary_key= True, index=True)
    bloccante_id = Column(Integer, nullable=False)
    bloccato_id = Column(Integer, nullable=False)

class NascondiPost(Base):
    __tablename__ = "nascondiPost"

    id = Column(Integer, primary_key=True, index=True)
    utente_id = Column(Integer, nullable=False)
    post_id = Column(Integer, nullable=False)

class CommentoProfilo(Base):
    __tablename__ = "commentoProfilo"

    id = Column(Integer, primary_key=True, index=True)
    autore_id = Column(Integer, nullable=False)
    destinatario_id = Column(Integer, nullable=False)
    contenuto = Column(String, nullable=False)
    approvato = Column(Boolean, default=False)


