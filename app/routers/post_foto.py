from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import shutil, os

from app.configuration.database import get_db
from app.models import Post as PostModel
from app.services.auth import get_current_user
from app.schemas.post import PostOut  # Schema Pydantic per la risposta

router = APIRouter(prefix="/posts", tags=["Posts"])

# ======================
# CREA UN NUOVO POST
# ======================
@router.post("/", response_model=PostOut)
async def create_post(
    description: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    post = PostModel(
        description=description,
        author=current_user,
        created_at=datetime.utcnow(),
        likes=0
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    # Salva immagine
    os.makedirs("images", exist_ok=True)
    file_location = f"images/{post.id}_{image.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Aggiorna image_url nel database
    post.image_url = file_location
    db.commit()
    db.refresh(post)

    return post

# ======================
# OTTIENI TUTTI I POST
# ======================
@router.get("/", response_model=list[PostOut])
def get_posts(db: Session = Depends(get_db)):
    return db.query(PostModel).all()

# ======================
# OTTIENI POST PER ID
# ======================
@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")
    return post

# ======================
# ELIMINA UN POST
# ======================
@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    if post.author != current_user:
        raise HTTPException(status_code=403, detail="Non puoi eliminare questo post")

    # Rimuove immagine se esiste
    if post.image_url and os.path.exists(post.image_url):
        os.remove(post.image_url)

    db.delete(post)
    db.commit()
    return {"message": "Post eliminato con successo"}

# ======================
# AGGIUNGI LIKE
# ======================
@router.patch("/{post_id}/like", response_model=PostOut)
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    post.likes += 1
    db.commit()
    db.refresh(post)
    return post
