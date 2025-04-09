#!/bin/bash
# Script per creare la struttura di cartelle per un progetto FastAPI seguendo il pattern MVC

# Creazione della cartella principale "app" e delle relative sottocartelle
mkdir -p app/models
mkdir -p app/views
mkdir -p app/controllers
mkdir -p app/services
mkdir -p app/utils
mkdir -p app/config
mkdir -p app/routers

# Creazione della cartella per il frontend (se necessario)
mkdir -p frontend

# Creazione di file base
touch app/main.py
touch requirements.txt

echo "Struttura di cartelle e file base creata con successo!"
