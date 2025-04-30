from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.configuration.database import get_db
from app.models.models import Outfit
from app.schemas.outfitCreate import OutfitCreate
from app.schemas.outfitOut import OutfitOut
from app.services.auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/outfit", response_model=OutfitOut, tags=["outfit"])
def create_outfit(outfit: OutfitCreate, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    new_outift = Outfit(**outfit.dict())
    db.add(new_outift)
    db.commit()
    db.refresh(new_outift)
    return new_outift

@router.get("/outfit/{id}", response_model=OutfitOut, tags=["outfit"])
def get_outfit(id:int, db: Session = Depends(get_db)):
    outfit = db.query(Outfit).filter(Outfit.id == id).first()
    if outfit is None:
        raise HTTPException(status_code=404, detail="outfit not found")
    return outfit

@router.put("/outfit/{id}", response_model=OutfitOut, tags=["outfit"])
def update_outfit(id: int, outfit_update: OutfitCreate, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    outfit = db.query(Outfit).filter(Outfit.id == id).first()
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    
    for key, value in outfit_update.dict(exclude_unset=True).items():
        setattr(outfit, key, value)

    db.commit()
    db.refresh(outfit)
    return outfit

@router.delete("/outfit/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["outfit"])
def delete_outfit(id: int, current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    outfit = db.query(Outfit).filter(Outfit.id == id).first()
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    
    db.delete(outfit)
    db.commit()
    return 

#GET /outfit  mi ritorna tutti gli outfit
#GET /outfit?venduto=false   mi ritorna solo gli outfit disponibili
#GET /outfit?venduto=true    mi ritorna solo gli outfit già venduti
@router.get("/outfit", response_model=List[OutfitOut], tags=["outfit"])
def list_outfits(venduto: bool = Query(default=None), db: Session = Depends(get_db)):
    query = db.query(Outfit)
    if venduto is not None:
        query = query.filter(Outfit.venduto == venduto)
    return query.all()