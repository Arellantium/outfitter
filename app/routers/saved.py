from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.dependencies_database import get_db
from app.models.models import Salvataggio, Post, Utente
from app.services.auth import get_current_user
from app.schemas.salvataggioBase import SalvataggioBase
from app.schemas.salvataggioOut import SalvataggioPostOut
from sqlalchemy import select, desc

router = APIRouter(prefix="/saved", tags=["Saved"])

# Salva un post
@router.post("/", response_model=SalvataggioPostOut)
async def save_post(
    data: SalvataggioBase,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    result = await db.execute(select(Post).where(Post.id == data.post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    result = await db.execute(
        select(Salvataggio).where(Salvataggio.utente_id == user.id, Salvataggio.post_id == post.id)
    )
    already_saved = result.scalar_one_or_none()
    if already_saved:
        raise HTTPException(status_code=400, detail="Hai già salvato questo post")

    new_saved = Salvataggio(utente_id=user.id, post_id=post.id)
    db.add(new_saved)
    await db.commit()
    await db.refresh(post)
    return post

# Ottieni tutti i post salvati da un utente
@router.get("/salvati", tags=["utente"])
async def get_user_salvataggi(
    db: AsyncSession = Depends(get_db),
    current_user_name: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user_name))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    stmt = (
        select(Post)
        .join(Salvataggio, Salvataggio.post_id == Post.id)
        .where(Salvataggio.utente_id == user.id)
        .order_by(desc(Post.created_at))
    )
    result = await db.execute(stmt)
    posts = result.scalars().all()

    return [
        {
            "post_id": post.id,
            "description": post.description,
            "image_url": post.image_url,
            "prezzo_finale": post.prezzo_finale,
            "venduto": post.venduto
        }
        for post in posts
    ]

# Rimuovi un post salvato
@router.delete("/{post_id}")
async def delete_saved_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    result = await db.execute(
        select(Salvataggio).where(Salvataggio.post_id == post_id, Salvataggio.utente_id == user.id)
    )
    saved = result.scalar_one_or_none()
    if not saved:
        raise HTTPException(status_code=404, detail="Post non salvato")

    await db.delete(saved)
    await db.commit()
    return {"message": "Post rimosso dai salvati"}