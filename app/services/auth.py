from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.configuration.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Crea un token JWT includendo la data di scadenza.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Scadenza predefinita: 30 minuti
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """
    Verifica e decodifica il token JWT.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenziali non valide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency per ottenere l'utente corrente a partire dal token.
    """
    print("TOKEN RICEVUTO:", token)
    return verify_token(token)

# Funzione per ottenere l'utente corrente dal token JWT
def get_current_user_name(token: str):
    try:
        # Decodifica il token JWT usando la chiave segreta
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Estrai l'utente dal campo 'sub'
        username: str = payload.get("sub")
        
        # Se 'sub' non esiste, solleva un'eccezione
        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Token non valido, l'utente non è stato trovato nel token"
            )
        
        # Restituisce il nome dell'utente (username)
        return username
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )