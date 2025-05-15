from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.configuration.dependencies_database import get_db
from app.models.models import Like, Follow, CommentoProfilo, Post, Utente
from app.services.auth import get_current_user

from app.schemas.like import Likebase
from app.schemas.follow import FollowBase
from app.schemas.commentoProfilo import CommentoProfiloBase

router = APIRouter(prefix="/social", tags=["Social Interactions"])

# =========================
# 1. LIKE / UNLIKE
# =========================

@router.post("/like/{post_id}")
async def like_post(post_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    result = await db.execute(select(Post).filter_by(id=post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    result = await db.execute(select(Utente).filter_by(nome=current_user))
    utente = result.scalar_one_or_none()
    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    result = await db.execute(select(Like).filter_by(post_id=post_id, utente_id=utente.id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Hai già messo like a questo post")

    like = Like(post_id=post_id, utente_id=utente.id)
    db.add(like)
    post.likes += 1
    await db.commit()
    return {"message": f"Like aggiunto al post {post_id}"}


@router.post("/unlike/{post_id}")
async def unlike_post(post_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    result = await db.execute(select(Post).filter_by(id=post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    result = await db.execute(select(Utente).filter_by(nome=current_user))
    utente = result.scalar_one_or_none()
    result = await db.execute(select(Like).filter_by(post_id=post_id, utente_id=utente.id))
    like = result.scalar_one_or_none()

    if not like:
        raise HTTPException(status_code=404, detail="Like non trovato")

    await db.delete(like)
    post.likes = max(0, post.likes - 1)
    await db.commit()
    return {"message": f"Like rimosso dal post {post_id}"}


# =========================
# 2. FOLLOW / UNFOLLOW
# =========================

@router.post("/follow/{user_id}")
async def follow_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    result = await db.execute(select(Utente).filter_by(nome=current_user))
    current = result.scalar_one_or_none()
    if current.id == user_id:
        raise HTTPException(status_code=400, detail="Non puoi seguire te stesso")

    result = await db.execute(select(Follow).filter_by(follower_id=current.id, seguito_id=user_id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Segui già questo utente")

    follow = Follow(follower_id=current.id, seguito_id=user_id)
    db.add(follow)
    await db.commit()
    return {"message": f"Ora segui l'utente con ID {user_id}"}


@router.post("/unfollow/{user_id}")
async def unfollow_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    result = await db.execute(select(Utente).filter_by(nome=current_user))
    current = result.scalar_one_or_none()

    result = await db.execute(select(Follow).filter_by(follower_id=current.id, seguito_id=user_id))
    follow = result.scalar_one_or_none()

    if not follow:
        raise HTTPException(status_code=404, detail="Relazione di follow non trovata")

    await db.delete(follow)
    await db.commit()
    return {"message": f"Hai smesso di seguire l'utente con ID {user_id}"}


@router.get("/followers/{user_id}", response_model=List[FollowBase])
async def get_followers(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Follow).filter(Follow.seguito_id == user_id))
    return result.scalars().all()


@router.get("/following/{user_id}", response_model=List[FollowBase])
async def get_following(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Follow).filter(Follow.follower_id == user_id))
    return result.scalars().all()
