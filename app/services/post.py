from sqlalchemy import select, func
from sqlalchemy.orm import aliased
from app.models.models import Post, Like, Outfit

def get_posts_feed_paginati(session, utente_id, pagina=1, per_pagina=10):
    LikeAlias = aliased(Like)
    OutfitAlias = aliased(Outfit)
    offset = (pagina - 1) * per_pagina

    query = (
        session.query(
            Post.id,
            Post.description,
            Post.author_id,
            Post.created_at,
            OutfitAlias.venduto.label("outfit_venduto"),
            func.count(LikeAlias.id).label("liked_by_me"),
        )
        .join(OutfitAlias, OutfitAlias.post_id == Post.id)
        .outerjoin(
            LikeAlias,
            (LikeAlias.post_id == Post.id) & (LikeAlias.utente_id == utente_id)
        )
        # *** NESSUN FILTRO SULL'AUTORE! ***
        .group_by(Post.id, OutfitAlias.venduto)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(per_pagina)
    )

    risultati = []
    for row in query:
        risultati.append({
            "post_id": row.id,
            "description": row.description,
            "author_id": row.author_id,
            "created_at": row.created_at,
            "liked": bool(row.liked_by_me),
            "outfit_venduto": bool(row.outfit_venduto),
        })
    return risultati