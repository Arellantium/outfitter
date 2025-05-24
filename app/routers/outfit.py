from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.configuration.dependencies_database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Outfit, Articolo, Utente, Post, Like
from app.schemas.outfitCreate import OutfitCreate, ArticoloCreate
from app.schemas.outfitOut import OutfitOut
from app.schemas.outiftPostResponse import OutfitPostResponse
from app.services.auth import get_current_user
from typing import List
from sqlalchemy import select, delete, exists, desc, and_, text
from app.configuration.database import engine
from sqlalchemy import cast, DateTime




router = APIRouter()

@router.post(
    "/outfit",
    response_model=OutfitOut,
    tags=["outfit"],
    summary="Crea un nuovo outfit",
    description="""
Registra un nuovo outfit nel sistema. I campi obbligatori sono specificati nel payload.  
**Errori gestiti:**
- `422`: dati non validi
- `500`: errore interno durante la creazione
"""
)
async def create_outfit(
    outfit: OutfitCreate,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Crea un nuovo outfit a partire dai dati forniti.

    :param outfit: payload con i dati dell'outfit
    :param current_username: utente autenticato (non usato direttamente ma necessario per protezione)
    :param db: sessione DB asincrona
    :return: outfit creato
    """
    new_outfit = Outfit(
            post_id=outfit.post_id,
            nome=outfit.nome,
            sconto_percentuale=outfit.sconto_percentuale or 0,
            prezzo_finale=outfit.prezzo_finale,
            venduto=outfit.venduto
        )

    db.add(new_outfit)
    await db.flush()  # otteniamo new_outfit.id

      # 2. Crea gli articoli associati, se presenti
    for articolo_data in outfit.articoli:
        nuovo_articolo = Articolo(
            post_id=outfit.post_id,
            nome=articolo_data.nome,
            taglia=articolo_data.taglia,
            condizione=articolo_data.condizione,
            prezzo=articolo_data.prezzo,
            venduto=articolo_data.venduto,
            outfit_id=new_outfit.id  # 🔗 associazione
        )
        db.add(nuovo_articolo)
    await db.commit()
    await db.refresh(new_outfit)
    return new_outfit


@router.get(
    "/outfit/{id}",
    response_model=OutfitOut,
    tags=["outfit"],
    summary="Recupera un outfit per ID",
    description="""
Restituisce i dettagli di un outfit a partire dal suo ID univoco.  
**Errori gestiti:**
- `404`: outfit non trovato
- `500`: errore durante l'accesso al DB
"""
)
async def get_outfit(id: int, db: AsyncSession = Depends(get_db)):
    """
    Ottiene un outfit dato il suo ID.

    :param id: identificativo numerico dell'outfit
    :param db: sessione DB asincrona
    :return: oggetto OutfitOut
    """
    result = await db.execute(select(Outfit).where(Outfit.id == id))
    outfit = result.scalars().first()
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit


@router.put(
    "/outfit/{id}",
    response_model=OutfitOut,
    tags=["outfit"],
    summary="Aggiorna un outfit esistente con eventuali articoli",
    description="""
Aggiorna un outfit già esistente identificato dal suo ID.  
Se viene fornita una lista di articoli, quelli esistenti saranno cancellati e sostituiti.  
**Errori gestiti:**
- `404`: outfit non trovato
- `422`: errore di validazione
- `500`: errore interno durante l'aggiornamento
"""
)
async def update_outfit(
    id: int,
    outfit_update: OutfitCreate,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Outfit).where(Outfit.id == id))
    outfit = result.scalars().first()

    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")

    # ✅ Aggiorna i campi dell'outfit (escludendo 'articoli' dalla sovrascrittura diretta)
    update_data = outfit_update.dict(exclude_unset=True, exclude={"articoli"})
    for key, value in update_data.items():
        setattr(outfit, key, value)

    # 🔄 Se sono stati forniti nuovi articoli, elimina i precedenti e ricrea
    if outfit_update.articoli:
        # 1. Elimina articoli associati esistenti
        await db.execute(delete(Articolo).where(Articolo.outfit_id == id))

        # 2. Aggiungi i nuovi articoli
        for articolo_data in outfit_update.articoli:
            nuovo_articolo = Articolo(
                post_id=outfit.post_id,
                nome=articolo_data.nome,
                taglia=articolo_data.taglia,
                condizione=articolo_data.condizione,
                prezzo=articolo_data.prezzo,
                venduto=articolo_data.venduto,
                outfit_id=id
            )
            db.add(nuovo_articolo)

    await db.commit()
    await db.refresh(outfit)
    return outfit


@router.delete(
    "/outfit/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["outfit"],
    summary="Elimina un outfit tramite ID",
    description="""
Elimina un outfit dal database dato il suo ID.  
**Errori gestiti:**
- `404`: outfit non trovato
- `500`: errore durante l'eliminazione
"""
)
async def delete_outfit(
    id: int,
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Elimina un outfit.

    :param id: ID dell'outfit da eliminare
    :param current_username: utente autenticato
    :param db: sessione DB asincrona
    """
    result = await db.execute(select(Outfit).where(Outfit.id == id))
    outfit = result.scalars().first()

    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")

    await db.delete(outfit)
    await db.commit()


#GET /outfit  mi ritorna tutti gli outfit
#GET /outfit?venduto=false   mi ritorna solo gli outfit disponibili
#GET /outfit?venduto=true    mi ritorna solo gli outfit già venduti
@router.get(
    "/outfit",
    response_model=List[OutfitOut],
    tags=["outfit"],
    summary="Elenca tutti gli outfit (con filtro opzionale per stato venduto)",
    description="""
Restituisce l'elenco di tutti gli outfit registrati nel sistema.  
Puoi opzionalmente filtrare per stato `venduto=true|false`.  
**Errori gestiti:**
- `500`: errore nella query
"""
)
async def list_outfits(
    venduto: bool = Query(default=None, description="Filtra per stato venduto (true o false)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Elenca tutti gli outfit, con possibilità di filtro per stato 'venduto'.

    :param venduto: valore booleano opzionale
    :param db: sessione DB asincrona
    :return: lista di outfit
    """
    stmt = select(Outfit)
    if venduto is not None:
        stmt = stmt.where(Outfit.venduto == venduto)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch(
    "/outfit/{id}/articoli",
    tags=["outfit"],
    summary="Aggiorna solo gli articoli di un outfit",
    description="""
Aggiorna la lista di articoli associati a un outfit, senza toccare i dati dell’outfit.  
Sostituisce completamente i vecchi articoli con i nuovi forniti.
"""
)
async def aggiorna_articoli_outfit(
    id: int,
    nuovi_articoli: List[ArticoloCreate],
    current_username: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verifica che l'outfit esista
    result = await db.execute(select(Outfit).where(Outfit.id == id))
    outfit = result.scalars().first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit non trovato")

    # Elimina articoli esistenti associati all'outfit
    await db.execute(delete(Articolo).where(Articolo.outfit_id == id))

    # Crea nuovi articoli e li collega all'outfit
    for articolo_data in nuovi_articoli:
        nuovo_articolo = Articolo(
            nome=articolo_data.nome,
            taglia=articolo_data.taglia,
            condizione=articolo_data.condizione,
            prezzo=articolo_data.prezzo,
            venduto=articolo_data.venduto,
            post_id=outfit.post_id,
            outfit_id=outfit.id
        )
        db.add(nuovo_articolo)

    await db.commit()
    return {"msg": f"{len(nuovi_articoli)} articoli aggiornati per outfit ID {id}"}

@router.get("/outfit-posts", tags=["outfit"], response_model=List[OutfitPostResponse])
async def get_outfit_posts(current_user_id: int = 1, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            Utente.nome.label("user"),
            Post.id.label("id_image"),
            Post.image_url.label("uri"),
            Post.prezzo_finale.label("price"),
            Post.venduto.label("sold"),
            Post.description.label("description"),
            exists().where(
                and_(
                    Like.utente_id == current_user_id,
                    Like.post_id == Post.id
                )
            ).label("like")
        )
        .join(Utente, Post.author_id == Utente.id)
        .where(Post.visibile == True)
        .order_by(desc(cast(Post.created_at, DateTime)))  # Ordinamento dal più recente al meno recente
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        OutfitPostResponse(
            user=row.user,
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