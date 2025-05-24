# app/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.database import engine
from app.configuration.dependencies_database import get_db
from app.models.models import Base, Utente
from app.config import setup_logging
from app.routers import pagamenti  # ✅ CORRETTA
from app.routers import outfit, post_foto, social, metodi_pagamento
from app.routers import saved, search, shipping
from app.routers import ai, dashboardStats
from fastapi.middleware.cors import CORSMiddleware


from .models import *



setup_logging()
import logging

# Configura il logging
logger = logging.getLogger(__name__)

from app.middlewares.error_handle import global_error_handler
from app.routers import auth, users, acquisto, outfit  # Importa sia auth che users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # oppure ["*"] per qualsiasi origine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.name = "FastAPI - Outfitter"
app.description = "API per la gestione di un social network di outfitter"
app.version = "0.1.0"
app.license_info = {
    "name": "MIT License",
    "url": "https://opensource.org/licenses/MIT",
}

# ✅ Registra il middleware
app.middleware("http")(global_error_handler)



app.include_router(auth.router)
app.include_router(users.router) 
app.include_router(pagamenti.router)
app.include_router(outfit.router)
app.include_router(post_foto.router)
app.include_router(social.router)
app.include_router(saved.router)
app.include_router(search.router)
app.include_router(acquisto.router)
app.include_router(outfit.router) 
app.include_router(metodi_pagamento.router)
app.include_router(shipping.router)
app.include_router(ai.router)
app.include_router(dashboardStats.router)

@app.get("/", tags=["home"])
async def root():
    logger.info("Chiamata all'endpoint root")
    return {"message": "Hello World"}


