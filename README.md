# Outfitters - Requisiti Tecnici e Specifiche Funzionali

Benvenuto nel repository del progetto **Outfitters**. Questo documento descrive i requisiti tecnici e le specifiche funzionali principali della piattaforma. Outfitters è un'applicazione social-commerce incentrata sulla condivisione e vendita di outfit e articoli di moda.

Outfitters è progettato per offrire un'esperienza intuitiva e interattiva per gli utenti che vogliono mostrare, scoprire e acquistare outfit curati, combinando elementi sociali con funzionalità e-commerce.

---

##  Autenticazione e Registrazione

Gestione dell'accesso utenti tramite:
- Email e password (con hashing sicuro tramite bcrypt)
- Provider social: Google, Apple, Facebook (OAuth2)

**Tabelle coinvolte:** `Utente`

**Campi principali:** `email`, `password_hash`, `provider_social`

**Funzionalità backend:**
- Generazione token JWT (facoltativa)
- Login via OAuth2

---

##  Creazione e Visualizzazione Post

Ogni post rappresenta un outfit, composto da immagini e articoli collegati.

**Tabelle:** `Post`, `Articolo`, `Outfit`, `Utente`

**Campi chiave:**
- `Post`: `utente_id`, `stato`, `data_pubblicazione`, `visualizzazioni`, `visibile`
- `Articolo`: `post_id`, `nome`, `taglia`, `condizione`, `prezzo`, `venduto`
- `Outfit`: `post_id`, `prezzo_finale`, `sconto_percentuale`, `venduto`

**Azioni backend:**
- Upload immagini (max 5)
- Salvataggio post e articoli
- Calcolo dinamico del prezzo scontato outfit

---

##  Acquisto Articoli o Outfit

Gli utenti possono acquistare un singolo articolo o un outfit completo.

**Tabelle:** `Acquisto`, `Articolo`, `Outfit`

**Campi principali:** `articolo_id`, `outfit_id`, `utente_id`, `data_acquisto`

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

##  Commenti al Profilo

Gli utenti possono commentare il profilo di altri. I commenti sono visibili solo se approvati.

**Tabella:** `CommentoProfilo`

**Campi:** `autore_id`, `destinatario_id`, `contenuto`, `approvato`

**Azioni backend:**
- Salvataggio commento (`approvato = FALSE` di default)
- Endpoint per approvazione/rifiuto

---

##  Nascondere Post

Possibilità per un utente di nascondere post di altri utenti.

**Tabella:** `NascondiPost`

**Azioni backend:**
- Esclusione dei post nascosti nella feed

---

##  Bloccare un Profilo

Blocco totale di interazione tra due utenti.

**Tabella:** `BloccoUtente`

**Azioni backend:**
- Filtraggio di contenuti e interazioni tra utenti bloccati

---

##  AI Personal Shopper (Estendibile)

Modulo di raccomandazione personalizzato per l'utente basato su:
- Preferenze
- Cronologia acquisti
- Interazioni social

**Tabelle coinvolte:** `Utente`, `Acquisto`, `Like`, `Articolo`, `Outfit`

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

