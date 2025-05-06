# app/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.configuration.database import engine
from app.configuration.dependencies_database import get_db
from app.models.models import Base, Utente
from app.config import setup_logging

setup_logging()
import logging

# Configura il logging
logger = logging.getLogger(__name__)

from app.middlewares.error_handle import global_error_handler
from app.routers import auth, users, acquisto, outfit  # Importa sia auth che users

app = FastAPI()

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
app.include_router(acquisto.router)
app.include_router(outfit.router) 

@app.get("/", tags=["home"])
async def root():
    logger.info("Chiamata all'endpoint root")
    return {"message": "Hello World"}

