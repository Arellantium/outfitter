from fastapi import APIRouter, HTTPException, Depends, status, Header
from app.services.auth import get_current_user, get_current_user_name
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.configuration.dependencies_database import get_db
from app.configuration.database import AsyncSessionLocal
from app.schemas.utente import UtenteBase
from app.schemas.UserCreateRequest import UserCreateRequest
from app.schemas.utenteOut import UtenteOut
from app.schemas.utenteUpdate import UtenteUpdate
from app.models.models import Utente 
from passlib.context import CryptContext

from typing import List


import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/protected", tags=["users"])
def read_protected(current_user: str = Depends(get_current_user)):
    return {"message": f"Ciao {current_user}, hai accesso a questa risorsa protetta!"}

# API GET per elencare tutti gli utenti
@router.get(
    "/utenti",
    tags=["users"],
    response_model=List[UtenteBase],
    summary="Recupera tutti gli utenti",
    description=(
        "Questa endpoint restituisce la lista completa degli utenti registrati "
        "nel sistema. I dati restituiti corrispondono al modello `UtenteBase` e includono "
        "solo i campi pubblici. L'accesso a questa risorsa non richiede autenticazione."
    ),
)
async def get_utenti(current_username: str = Depends(get_current_user),
                    db: AsyncSession = Depends(get_db)):
    """
    Recupera l'elenco completo degli utenti presenti nel database.

    - **response_model**: List[UtenteBase] — lista degli utenti nel formato previsto
    - **db**: sessione asincrona di database fornita via `Depends`
    - **returns**: lista di oggetti utente

    Esegue una query asincrona sulla tabella `utenti` per ottenere tutti i record esistenti.
    """
    result = await db.execute(select(Utente))
    utenti = result.scalars().all()
    return utenti

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post(
    "/signup",
    tags=["users"],
    summary="Registra un nuovo utente",
    description="""
Registra un nuovo utente nel sistema a partire dai dati forniti (nome utente, email e password).  
L'indirizzo email deve essere univoco. In caso contrario, viene restituito un errore 400.  
Possibili errori:
- **400**: email già registrata
- **422**: errore di validazione input (campi mancanti o malformati)
- **500**: errore interno del server durante la registrazione
""",
)
async def signup(user: UserCreateRequest, db: AsyncSession = Depends(get_db)):
    """
    Registra un nuovo utente nel sistema:
    - Verifica che l'email non sia già presente nel database
    - Cripta la password usando bcrypt
    - Crea e salva l'utente nel database

    :param user: oggetto contenente username, email e password
    :param db: sessione asincrona del database
    :return: messaggio di conferma della creazione
    """
    result = await db.execute(select(Utente).where(Utente.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email già registrata"
        )

    hashed_password = pwd_context.hash(user.password)

    new_user = Utente(
        nome=user.username,
        email=user.email,
        password_hash=hashed_password,
        provider_social=None,
        guadagni_totali=0
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "Utente creato con successo"}

@router.get(
    "/me",
    response_model=UtenteOut,
    tags=["users"],
    summary="Recupera i dati dell'utente autenticato",
    description="""
Restituisce le informazioni dell'utente attualmente autenticato in base al token JWT.  
Possibili errori:
- **404**: utente non trovato
- **422**: errore nella validazione del token
- **500**: errore interno durante l'accesso al database
"""
)
async def get_me(
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    authorization: str = Header(...)
):
    """
    Recupera l'utente attualmente autenticato tramite il nome utente derivato dal token JWT.

    :param current_username: nome dell'utente autenticato (iniettato da Depends)
    :param db: sessione asincrona del database
    :return: oggetto UtenteOut contenente le informazioni dell'utente
    """

    username = None

    if authorization.startswith("Bearer "):
        username =  authorization.split(" ")[1]  # Restituisce solo la parte del token
    else:
        raise HTTPException(status_code=403, detail="Invalid authorization header")

    result = await db.execute(select(Utente).where(Utente.nome == get_current_user_name(username)))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put(
    "/me",
    response_model=UtenteOut,
    tags=["users"],
    summary="Aggiorna i dati dell'utente autenticato",
    description="""
Aggiorna il profilo dell'utente autenticato. È possibile modificare nome, email e password.  
Tutti i campi sono opzionali. Se l'utente non esiste, viene restituito un errore 404.  
Possibili errori:
- **404**: utente non trovato
- **422**: errori di validazione nei dati forniti
- **500**: errore durante il commit dei dati aggiornati
"""
)
async def update_me(
    update_data: UtenteUpdate,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Aggiorna le informazioni dell'utente autenticato.

    - Nome, email e password sono opzionali e aggiornabili singolarmente
    - La password viene criptata prima del salvataggio
    - Commit asincrono sulla sessione DB

    :param update_data: oggetto con i dati da aggiornare
    :param current_username: nome utente derivato dal token JWT
    :param db: sessione DB asincrona
    :return: oggetto aggiornato UtenteOut
    """
    result = await db.execute(select(Utente).where(Utente.nome == current_username))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.nome:
        user.nome = update_data.nome
    if update_data.email:
        user.email = update_data.email
    if update_data.password:
        user.password_hash = pwd_context.hash(update_data.password)

    await db.commit()
    await db.refresh(user)

    return user

@router.get(
    "/utente/{username}",
    response_model=UtenteOut,
    tags=["users"],
    summary="Cerca un utente per nome",
    description="Restituisce le informazioni pubbliche di un utente dato il suo nome (username)."
)
async def get_utente_by_username(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Utente).where(Utente.nome == username))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return user