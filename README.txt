Per la creazione delle cartelle, esguire setup_project.sh con il comando
> bash setup_project.sh

Al termine, vedrai la creazione delle cartelle e dei file base. Da qui potrai iniziare a implementare il codice della tua applicazione seguendo il pattern MVC, dove:

* models: conterrà i modelli e la definizione del database.
* views: potrai utilizzarla per i template se decidi di renderizzare pagine lato server.
* controllers (o routers): gestirà la logica degli endpoint.
* services: per la logica di business.
* utils e config: per le funzioni di utilità e le configurazioni.
* frontend: per il codice della parte client.


Per aggiornare le librerie che sono installate con pip usare il comando :
> pip freeze > requirements.txt

Quando un altro sviluppatore o un ambiente di produzione deve configurare lo stesso ambiente, basterà eseguire:
> pip install -r requirements.txt

Per fare partire il server
> uvicorn app.main:app --reload

> Per utilizzare il log se deve aggiugere questo su ogni file
import logging
logger = logging.getLogger(__name__)

poi usare logger.info(....)

Se trovi errore che non trova un import dopo che modifichi il main.py
eseguire questo script che sta dentro del progetto dal terminale

python tools/clean_pycache.py