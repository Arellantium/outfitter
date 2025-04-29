from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List
import shutil
import os
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["Posts"])

class Post(BaseModel):
    id: int
    description: str
    image_url: str
    author: str
    created_at: datetime
    likes: int = 0

# Simuliamo un database in memoria
posts_db: List[Post] = []

# Endpoint POST - Creare un nuovo post
@router.post("/")
async def create_post(
    description: str = Form(...),
    image: UploadFile = File(...),
    author: str = Form(...)
):
    post_id = len(posts_db) + 1

    # Salva il file immagine localmente
    os.makedirs("images", exist_ok=True)
    file_location = f"images/{post_id}_{image.filename}"  # salvo con id per evitare conflitti
    with open(file_location, "wb") as f:
        shutil.copyfileobj(image.file, f)

    # Crea il post
    post = Post(
        id=post_id,
        description=description,
        image_url=file_location,
        author=author,
        created_at=datetime.utcnow(),
        likes=0
    )
    posts_db.append(post)

    return {"message": "Post creato con successo!", "post": post}

# Endpoint GET - Ottenere tutti i post
@router.get("/")
async def get_posts():
    return posts_db

# Endpoint GET - Ottenere un singolo post per ID
@router.get("/{post_id}")
async def get_post(post_id: int):
    for post in posts_db:
        if post.id == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post non trovato")

# Endpoint DELETE - Eliminare un post per ID
@router.delete("/{post_id}")
async def delete_post(post_id: int):
    global posts_db
    post_to_delete = None
    for post in posts_db:
        if post.id == post_id:
            post_to_delete = post
            break
    if post_to_delete:
        # Elimina l'immagine salvata
        if os.path.exists(post_to_delete.image_url):
            os.remove(post_to_delete.image_url)
        # Rimuovi il post dal database
        posts_db = [p for p in posts_db if p.id != post_id]
        return {"message": "Post eliminato con successo"}
    raise HTTPException(status_code=404, detail="Post non trovato")

# Endpoint PATCH - Aggiungere un like a un post
@router.patch("/{post_id}/like")
async def like_post(post_id: int):
    for post in posts_db:
        if post.id == post_id:
            post.likes += 1
            return {"message": "Like aggiunto!", "likes": post.likes}
    raise HTTPException(status_code=404, detail="Post non trovato")
