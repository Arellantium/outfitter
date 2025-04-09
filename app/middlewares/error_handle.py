from fastapi import Request
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
import traceback

logger = logging.getLogger(__name__)
async def global_error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        error_type = type(e).__name__
        error_msg = str(e)
        logger.error(f"Tipo: {error_type} | Messaggio: {error_msg}")
 
        # Crea risposta dettagliata
        error_response = {
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "tipo": error_type,
            "messaggio": str(e)
        }

        return JSONResponse(
            status_code=500,
            content=error_response
        )
