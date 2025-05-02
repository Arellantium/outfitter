from fastapi import APIRouter, HTTPException, Form
from typing import List, Dict
from datetime import datetime

router = APIRouter(prefix="/social", tags=["Social Interactions"])

# DATABASE FINTI (IN MEMORIA)
likes_db: Dict[int, int] = {}         # post_id -> numero di likes
follows_db: Dict[str, List[str]] = {} # user_id -> lista di utenti che segue
comments_db: Dict[int, List[Dict]] = {} # post_id -> lista dei commenti


# ===========================
# 1. LIKES
# ===========================

# Aggiungere un like a un post
@router.patch("/like/{post_id}")
async def like_post(post_id: int):
    likes_db[post_id] = likes_db.get(post_id, 0) + 1
    return {"message": f"Like added to post {post_id}", "total_likes": likes_db[post_id]}

# Togliere un like da un post
@router.patch("/unlike/{post_id}")
async def unlike_post(post_id: int):
    if post_id in likes_db and likes_db[post_id] > 0:
        likes_db[post_id] -= 1
        return {"message": f"Like removed from post {post_id}", "total_likes": likes_db[post_id]}
    raise HTTPException(status_code=404, detail="Cannot unlike a post with zero likes")


# ===========================
# 2. FOLLOW / UNFOLLOW
# ===========================

# Seguire un altro utente
@router.post("/follow/{user_id}")
async def follow_user(user_id: str, follower_id: str = Form(...)):
    if user_id == follower_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself.")

    follows_db.setdefault(follower_id, [])

    if user_id not in follows_db[follower_id]:
        follows_db[follower_id].append(user_id)

    return {"message": f"You are now following {user_id}"}

# Smettere di seguire un utente
@router.post("/unfollow/{user_id}")
async def unfollow_user(user_id: str, follower_id: str = Form(...)):
    if follower_id in follows_db and user_id in follows_db[follower_id]:
        follows_db[follower_id].remove(user_id)
        return {"message": f"You unfollowed {user_id}"}
    raise HTTPException(status_code=404, detail="Follow relationship not found")

# Lista follower di un utente
@router.get("/followers/{user_id}")
async def get_followers(user_id: str):
    followers = [follower for follower, following in follows_db.items() if user_id in following]
    return {"user_id": user_id, "followers": followers}

# Lista utenti seguiti da un utente
@router.get("/following/{user_id}")
async def get_following(user_id: str):
    return {"user_id": user_id, "following": follows_db.get(user_id, [])}


# ===========================
# 3. COMMENTI
# ===========================

# Aggiungere un commento a un post
@router.post("/commento/{post_id}")
async def add_comment(post_id: int, author: str = Form(...), text: str = Form(...)):
    comments_db.setdefault(post_id, [])
    comments_db[post_id].append({
        "author": author,
        "text": text,
        "created_at": datetime.utcnow()
    })
    return {"message": f"Comment added to post {post_id}", "comments": comments_db[post_id]}

# Vedere tutti i commenti di un post
@router.get("/commenti/{post_id}")
async def get_comments(post_id: int):
    return {"post_id": post_id, "comments": comments_db.get(post_id, [])}
