from fastapi import APIRouter, HTTPException
from app.ai.chat_logic import fashion_response
from app.schemas.chatRequest import ChatRequest
from app.schemas.chatResponse import ChatResponse 

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        risposta = fashion_response(request.message)
        return ChatResponse(answer=risposta)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante l'elaborazione: {str(e)}")
