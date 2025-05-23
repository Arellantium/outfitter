# app/routers/post_foto.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import shutil, os
from app.configuration.dependencies_database import get_db
from app.models.models import Post as PostModel, NascondiPost, Utente
from app.services.auth import get_current_user
from app.schemas.postOut import PostOut
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/", response_model=PostOut)
async def create_post(
    description: str = Form(...),
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    post = PostModel(
        description=description,
        author=current_user,
        created_at=datetime.utcnow().isoformat(),
        likes=0
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)

    os.makedirs("images", exist_ok=True)
    file_location = f"images/{post.id}_{image.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    post.image_url = file_location
    await db.commit()
    await db.refresh(post)

    return post

@router.get("/", response_model=list[PostOut])
async def get_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(PostModel.__table__.select())
    return result.scalars().all()

@router.get("/{post_id}", response_model=PostOut)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(PostModel.__table__.select().where(PostModel.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")
    return post

@router.delete("/{post_id}", response_model=MessageResponse)
async def delete_post(post_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    post = await db.get(PostModel, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")
    if post.author != current_user:
        raise HTTPException(status_code=403, detail="Non puoi eliminare questo post")
    if post.image_url and os.path.exists(post.image_url):
        os.remove(post.image_url)
    await db.delete(post)
    await db.commit()
    return {"message": "Post eliminato con successo"}

@router.patch("/{post_id}/like", response_model=PostOut)
async def like_post(post_id: int, db: AsyncSession = Depends(get_db)):
    post = await db.get(PostModel, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")
    post.likes += 1
    await db.commit()
    await db.refresh(post)
    return post

@router.get("/user/{username}", response_model=list[PostOut])
async def get_user_posts(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        PostModel.__table__.select()
        .where(PostModel.author == username, PostModel.visibile == True)
        .order_by(PostModel.created_at.desc())
    )
    return result.scalars().all()

@router.post("/nascondi/{post_id}", response_model=MessageResponse)
async def nascondi_post(post_id: int, db: AsyncSession = Depends(get_db), current_user: str = Depends(get_current_user)):
    result = await db.execute(Utente.__table__.select().where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    result = await db.execute(NascondiPost.__table__.select().where(
        NascondiPost.post_id == post_id,
        NascondiPost.utente_id == user.id
    ))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Post già nascosto")

    nascondi = NascondiPost(post_id=post_id, utente_id=user.id)
    db.add(nascondi)
    await db.commit()
    return {"message": f"Post {post_id} nascosto"}
