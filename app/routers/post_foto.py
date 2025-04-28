from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from pydantic import BaseModel

app = FastAPI()

class Post(BaseModel):
    id : int
    