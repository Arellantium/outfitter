from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.configuration.database import get_db
from app.models.models import Salvataggio, Post, Utente
from app.services.auth import get_current_user
from app.schemas.salvataggioBase import SalvataggioBase
from app.schemas.salvataggioOut import SalvataggioPostOut

router = APIRouter(prefix="/saved", tags=["Saved"])

# Salva un post
@router.post("/", response_model=SalvataggioPostOut)
def save_post(
    data: SalvataggioBase,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Utente).filter(Utente.nome == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    post = db.query(Post).filter(Post.id == data.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    already_saved = db.query(Salvataggio).filter_by(utente_id=user.id, post_id=post.id).first()
    if already_saved:
        raise HTTPException(status_code=400, detail="Hai già salvato questo post")

    new_saved = Salvataggio(utente_id=user.id, post_id=post.id)
    db.add(new_saved)
    db.commit()
    db.refresh(post)
    return post

# Ottieni tutti i post salvati da un utente
@router.get("/", response_model=list[SalvataggioPostOut])
def get_saved_posts(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Utente).filter(Utente.nome == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    saved_posts = (
        db.query(Post)
        .join(Salvataggio, Post.id == Salvataggio.post_id)
        .filter(Salvataggio.utente_id == user.id)
        .distinct()
        .all()
    )
    return saved_posts

# Rimuovi un post salvato
@router.delete("/{post_id}")
def delete_saved_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Utente).filter(Utente.nome == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    saved = db.query(Salvataggio).filter_by(post_id=post_id, utente_id=user.id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Post non salvato")

    db.delete(saved)
    db.commit()
    return {"message": "Post rimosso dai salvati"}
