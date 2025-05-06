
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from contextlib import asynccontextmanager

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5001/postgres"  # Puoi cambiarlo in PostgreSQL se vuoi

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

Base = declarative_base()

# Funzione per ottenere la sessione del database
@asynccontextmanager
async def get_db() -> AsyncSession:
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
