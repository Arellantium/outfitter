from fastapi import APIRouter, HTTPException, Form, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.models import Like, Follow, CommentoProfilo, Post, Utente
from app.configuration.database import get_db
from app.services.auth import get_current_user

router = APIRouter(prefix="/social", tags=["Social Interactions"])

# =========================
# 1. LIKE / UNLIKE
# =========================

@router.post("/like/{post_id}")
def like_post(post_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # Controlla se il like esiste già
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    utente = db.query(Utente).filter(Utente.nome == current_user).first()
    if not utente:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    existing_like = db.query(Like).filter_by(post_id=post_id, utente_id=utente.id).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Hai già messo like a questo post")

    like = Like(post_id=post_id, utente_id=utente.id)
    db.add(like)
    post.likes += 1
    db.commit()
    return {"message": f"Like aggiunto al post {post_id}"}

@router.post("/unlike/{post_id}")
def unlike_post(post_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post non trovato")

    utente = db.query(Utente).filter(Utente.nome == current_user).first()
    like = db.query(Like).filter_by(post_id=post_id, utente_id=utente.id).first()

    if not like:
        raise HTTPException(status_code=404, detail="Like non trovato")

    db.delete(like)
    post.likes = max(0, post.likes - 1)
    db.commit()
    return {"message": f"Like rimosso dal post {post_id}"}

# =========================
# 2. FOLLOW / UNFOLLOW
# =========================

@router.post("/follow/{user_id}")
def follow_user(user_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    current = db.query(Utente).filter(Utente.nome == current_user).first()
    if current.id == user_id:
        raise HTTPException(status_code=400, detail="Non puoi seguire te stesso")

    existing = db.query(Follow).filter_by(follower_id=current.id, seguito_id=user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Segui già questo utente")

    follow = Follow(follower_id=current.id, seguito_id=user_id)
    db.add(follow)
    db.commit()
    return {"message": f"Ora segui l'utente con ID {user_id}"}

@router.post("/unfollow/{user_id}")
def unfollow_user(user_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    current = db.query(Utente).filter(Utente.nome == current_user).first()
    follow = db.query(Follow).filter_by(follower_id=current.id, seguito_id=user_id).first()

    if not follow:
        raise HTTPException(status_code=404, detail="Relazione di follow non trovata")

    db.delete(follow)
    db.commit()
    return {"message": f"Hai smesso di seguire l'utente con ID {user_id}"}

@router.get("/followers/{user_id}")
def get_followers(user_id: int, db: Session = Depends(get_db)):
    followers = db.query(Follow).filter(Follow.seguito_id == user_id).all()
    follower_ids = [f.follower_id for f in followers]
    return {"user_id": user_id, "followers": follower_ids}

@router.get("/following/{user_id}")
def get_following(user_id: int, db: Session = Depends(get_db)):
    following = db.query(Follow).filter(Follow.follower_id == user_id).all()
    followed_ids = [f.seguito_id for f in following]
    return {"user_id": user_id, "following": followed_ids}

# =========================
# 3. COMMENTI PROFILO
# =========================

@router.post("/commento/{destinatario_id}")
def add_comment(destinatario_id: int, contenuto: str = Form(...), db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    autore = db.query(Utente).filter(Utente.nome == current_user).first()

    comment = CommentoProfilo(
        autore_id=autore.id,
        destinatario_id=destinatario_id,
        contenuto=contenuto,
        approvato=True  # o False se vuoi approvazione manuale
    )
    db.add(comment)
    db.commit()
    return {"message": "Commento aggiunto con successo"}

@router.get("/commenti/{user_id}")
def get_comments(user_id: int, db: Session = Depends(get_db)):
    commenti = db.query(CommentoProfilo).filter(CommentoProfilo.destinatario_id == user_id, CommentoProfilo.approvato == True).all()
    return {"destinatario_id": user_id, "commenti": [
        {
            "autore_id": c.autore_id,
            "contenuto": c.contenuto
        } for c in commenti
    ]}
