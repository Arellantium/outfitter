# StAIlist - Requisiti Tecnici e Specifiche Funzionali

Benvenuto nel repository del progetto **StAIlist**. Questo documento descrive i requisiti tecnici e le specifiche funzionali principali della piattaforma. StAIlist è un'applicazione social-commerce incentrata sulla condivisione e vendita di outfit e articoli di moda.

StAIlist è progettato per offrire un'esperienza intuitiva e interattiva per gli utenti che vogliono mostrare, scoprire e acquistare outfit curati, combinando elementi sociali con funzionalità e-commerce.

---

##  Autenticazione e Registrazione

Gestione dell'accesso utenti tramite:
- Email e password (con hashing sicuro tramite bcrypt)

**Tabelle coinvolte:** `Utente`

**Campi principali:** `email`, `password_hash`, `provider_social`

**Funzionalità backend:**
- Generazione token JWT (facoltativa)
- Login via OAuth2

---

##  Creazione e Visualizzazione Post

Ogni post rappresenta un outfit, composto da immagini e articoli collegati.

**Tabelle:** `Post`, `Utente`

**Campi chiave:**
- `Post`: `utente_id`, `stato`, `data_pubblicazione`, `visualizzazioni`, `visibile`
**Azioni backend:**
- Upload immagini (max 5)
- Salvataggio post e articoli
- Calcolo dinamico del prezzo scontato outfit

---

##  Acquisto Articoli o Outfit

Gli utenti possono acquistare un outfit completo.

**Tabelle:**  `Post`, `Outfit`

**Campi principali:**  `post_id`, `utente_id`, `data_acquisto`

**Azioni backend:**
- Verifica disponibilità
- Aggiornamento campo `venduto`
- Salvataggio transazione

---

##  Like ai Post

Un utente può mettere "mi piace" a un post una sola volta.

**Tabella:** `Like`

**Azioni backend:**
- Controllo esistenza like (toggle)

---

##  Segui / Smetti di Seguire

Sistema di follow/unfollow tra utenti.

**Tabella:** `Follower`

**Campi:** `follower_id`, `seguito_id`

**Azioni backend:**
- Inserimento unico (indice UNIQUE)
- Conteggio follower

---

##  AI Personal Shopper (Estendibile)

Modulo di raccomandazione personalizzato per l'utente basato su:
- Preferenze
- Cronologia acquisti
- Interazioni social

**Tabelle coinvolte:** `Utente`, `Acquisto`, `Like`, `Post`

**Azioni backend:**
- Analisi comportamentale
- Raccomandazioni dinamiche
- API REST per suggerimenti e chatbot

---

##  API e Architettura

- Tutte le operazioni CRUD disponibili tramite API REST
- Autenticazione tramite JWT o sessioni
- Upload file gestito via endpoint sicuri



---


**Autori**: Alessandro Arellano, Tommaso Dionisi 

