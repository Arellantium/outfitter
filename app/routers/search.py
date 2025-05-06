from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db

from app.models.models import Utente, Post, Outfit, Articolo
from app.schemas.utenteOut import UtenteOut
from app.schemas.postOut import PostOut
from app.schemas.outfitOut import OutfitOut
from app.schemas.articolo import ArticoloBase 

router = APIRouter(prefix="/search", tags=["Search"])

#  Cerca utenti per nome
@router.get("/users", response_model=list[UtenteOut])
async def search_users(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Utente).where(Utente.nome.ilike(f"%{q}%")))
    utenti = result.scalars().all()
    if not utenti:
        raise HTTPException(status_code=404, detail="Nessun utente trovato")
    return utenti

#  Cerca post per autore o descrizione
@router.get("/posts", response_model=list[PostOut])
async def search_posts(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post).where(
            or_(
                Post.author.ilike(f"%{q}%"),
                Post.description.ilike(f"%{q}%")
            )
        )
    )
    posts = result.scalars().all()
    if not posts:
        raise HTTPException(status_code=404, detail="Nessun post trovato")
    return posts

#  Cerca outfit per nome
@router.get("/outfits", response_model=list[OutfitOut])
async def search_outfits(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Outfit).where(Outfit.nome.ilike(f"%{q}%")))
    outfits = result.scalars().all()
    if not outfits:
        raise HTTPException(status_code=404, detail="Nessun outfit trovato")
    return outfits

# Cerca articoli per nome, condizione o taglia
@router.get("/articles", response_model=list[ArticoloBase])
async def search_articles(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Articolo).where(
            or_(
                Articolo.nome.ilike(f"%{q}%"),
                Articolo.condizione.ilike(f"%{q}%"),
                Articolo.taglia.ilike(f"%{q}%")
            )
        )
    )
    articoli = result.scalars().all()
    if not articoli:
        raise HTTPException(status_code=404, detail="Nessun articolo trovato")
    return articoli

