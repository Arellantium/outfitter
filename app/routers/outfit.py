from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, aliased
from app.configuration.dependencies_database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import  Utente, Post, Like
from app.schemas.outfitCreate import OutfitCreate, ArticoloCreate
from app.schemas.outfitOut import OutfitOut
from app.schemas.outiftPostResponse import OutfitPostResponse
from app.services.auth import get_current_user
from typing import List
from sqlalchemy import select, delete, desc, text, func
from app.configuration.database import engine
from sqlalchemy import cast, Integer


router = APIRouter()

@router.get("/outfit-posts", tags=["outfit"], response_model=List[OutfitPostResponse])
async def get_posts_feed_paginati_async(db: Session = Depends(get_db), current_user: str = Depends(get_current_user), pagina: int = 1, per_pagina: int = 10):
    
    result = await db.execute(select(Utente).where(Utente.nome == current_user))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    
    LikeAlias = aliased(Like)

    offset = (pagina - 1) * per_pagina

    stmt = (
        select(
            Post.id.label("id"),
            Utente.id.label("user_id"),
            Utente.nome.label("user"),
            Post.id.label("id_image"),
            Post.description,
            Post.image_url.label("uri"),
            Post.prezzo_finale.label("price"),
            Post.venduto.label("sold"),
            func.coalesce(LikeAlias.id.isnot(None), False).label("like")
        )
        .outerjoin(LikeAlias, (LikeAlias.post_id == Post.id) & (LikeAlias.utente_id == user.id))
        .join(Utente, Post.author_id == Utente.id)
        .order_by(Post.created_at.desc())
        .limit(per_pagina)
        .offset(offset)
    )
    print(pagina, ".......", per_pagina, "................", offset)
    result = await db.execute(stmt)
    rows = result.fetchall()

    return [
        OutfitPostResponse(
            user=row.user,
            user_id=str(row.user_id),
            id_image=str(row.id_image),
            uri=row.uri,
            price=str(row.price),
            like=row.like,
            sold=row.sold,
            description=row.description
        )
        for row in rows
    ]


@router.post("/init-author-id")
async def inizializza_author_id():
    async with engine.begin() as conn:
        # 1. Aggiungi colonna author_id se non esiste
        await conn.execute(text("""
            ALTER TABLE post
            ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES utente(id)
        """))

        # 2. Controlla se esiste la colonna author PRIMA di aggiornare i dati
        check_column = await conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'post' AND column_name = 'author'
        """))
        column_exists = check_column.scalar()

        if column_exists:
            await conn.execute(text("""
                UPDATE post
                SET author_id = utente.id
                FROM utente
                WHERE post.author = utente.nome
            """))

            # 3. Elimina colonna author solo se esiste
            await conn.execute(text("""
                ALTER TABLE post
                DROP COLUMN IF EXISTS author
            """))

    return {
        "success": True,
        "message": "Colonna author_id inizializzata con successo. Colonna 'author' gestita in sicurezza."
    }