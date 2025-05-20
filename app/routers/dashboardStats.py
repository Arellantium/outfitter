from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.models import Utente, Post, Acquisto, CommentoProfilo
from app.configuration.dependencies_database import get_db

router = APIRouter()

@router.get("/dashboard/metrics")
async def get_dashboard_metrics(session: AsyncSession = Depends(get_db)):
    utenti = await session.execute(select(func.count()).select_from(Utente))
    totale_utenti = utenti.scalar_one()

    post = await session.execute(select(func.count()).select_from(Post))
    totale_post = post.scalar_one()

    vendite = await session.execute(select(func.sum(Acquisto.prezzo_pagato)))
    totale_vendite = vendite.scalar_one() or 0  # fallback se None

    feedback = await session.execute(select(func.count()).select_from(CommentoProfilo))
    numero_feedback = feedback.scalar_one()

    # Simuliamo le visite al sito (non tracciate nel DB)
    visite_sito = 9354  # puoi sostituire con valore dinamico o da Redis/logs

    return {
        "utenti_iscritti": totale_utenti,
        "visite_sito": visite_sito,
        "totale_vendite": round(totale_vendite, 2),
        "totale_post": totale_post,
        "numero_feedback": numero_feedback
    }
