from sqlalchemy.orm import Session
from app.models.models import Acquisto, Pagamento
from datetime import datetime

def process_payment_success(acquisto_id: int, db: Session):
    acquisto = db.query(Acquisto).filter(Acquisto.id == acquisto_id).first()
    if not acquisto:
        return None  # Acquisto non trovato
    
    # Crea una nuova transazione di pagamento
    pagamento = Pagamento(
        acquisto_id=acquisto.id,
        metodo_pagamento="carta di credito",  # Esempio, questo può essere variabile
        importo=acquisto.prezzo_pagato,
        status="completato",
        data_pagamento=datetime.utcnow()
    )
    db.add(pagamento)
    db.commit()

    # Aggiorna lo stato dell'acquisto
    acquisto.status = "completato"
    db.commit()

    return pagamento  # Restituisce l'oggetto Pagamento creato

def process_payment_failure(acquisto_id: int, db: Session):
    acquisto = db.query(Acquisto).filter(Acquisto.id == acquisto_id).first()
    if not acquisto:
        return None  # Acquisto non trovato
    
    # Crea una transazione di pagamento fallito
    pagamento = Pagamento(
        acquisto_id=acquisto.id,
        metodo_pagamento="carta di credito",  # Esempio, questo può essere variabile
        importo=acquisto.prezzo_pagato,
        status="fallito",
        data_pagamento=datetime.utcnow()
    )
    db.add(pagamento)
    db.commit()

    # Aggiorna lo stato dell'acquisto
    acquisto.status = "fallito"
    db.commit()

    return pagamento  # Restituisce l'oggetto Pagamento creato
