from pydantic import BaseModel


#Schema di input quando l utente vuole salvare un post, usato in POST/saved per dire quale post salvare
class SalvataggioBase(BaseModel):
    post_id : int

