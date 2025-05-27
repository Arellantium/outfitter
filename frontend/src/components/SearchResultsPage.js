// src/pages/SearchResultsPage.js (o dove si trova il file)
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, ListGroup, Image, Card, Button } from 'react-bootstrap';

const API_BASE = 'http://localhost:8006'; // Questa costante è ancora necessaria per gli avatar

function useQuery() {
  const { search } = useLocation();
  // useMemo ottimizza leggermente evitando di ricalcolare queryParams ad ogni render se 'search' non cambia
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchResultsPage = () => {
  const queryParams = useQuery();
  const query = queryParams.get('query');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      // Potresti voler mostrare un messaggio più user-friendly o reindirizzare
      setError('Nessun termine di ricerca specificato.');
      return;
    }

    setLoading(true);
    setError(null); // Resetta l'errore ad ogni nuova ricerca
    fetch(`${API_BASE}/search/users?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          // Prova a leggere il corpo dell'errore se disponibile, altrimenti errore generico
          return res.json().catch(() => null).then(errData => {
            throw new Error(errData?.detail || `Errore nella ricerca (status: ${res.status})`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setResults(data || []); // Assicura che data sia sempre un array
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError(err.message || 'Si è verificato un errore sconosciuto durante la ricerca.');
        setResults([]); // Pulisce i risultati in caso di errore
      })
      .finally(() => setLoading(false));
  }, [query]); // L'effetto si riesegue solo se il parametro 'query' cambia

  const handleUserNavigation = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  // Stile per gli item della lista, replicando parte di UserListItem
  const userItemStyle = {
    cursor: 'pointer',
    // Puoi aggiungere altri stili qui se necessario
  };
  const userImageSize = 40; // Dimensione avatar per questa pagina

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center"> {/* Aumentato mt e pt per navbar fissa */}
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
        <p className="mt-2">Caricamento risultati per "{query}"...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">
          <Alert.Heading>Oops! Si è verificato un errore.</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/')}>
              Torna alla Home
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4 mb-4"> {/* Aumentato mt e pt per navbar fissa, mb per spazio sotto */}
      <h2 className="mb-4">
        Risultati per: <mark style={{ backgroundColor: '#e9ecef', padding: '0.2em 0.4em', borderRadius: '0.25rem' }}>"{query}"</mark>
      </h2>

      {results.length === 0 && !loading && (
        <Card className="text-center shadow-sm">
          <Card.Body>
            <Card.Title as="h5" className="mb-3">Nessun utente trovato</Card.Title>
            <Card.Text>
              Spiacenti, la ricerca per "{query}" non ha prodotto risultati.
              Prova a modificare i termini della ricerca o esplora altri contenuti.
            </Card.Text>
            <Button variant="primary" onClick={() => navigate('/')} className="mt-2">
              Torna alla Home
            </Button>
          </Card.Body>
        </Card>
      )}

      {results.length > 0 && (
        <ListGroup variant="flush"> {/* 'flush' rimuove bordi e angoli arrotondati */}
          {results.map((utente) => {
            const avatarSrc = utente.avatar_url
              ? `${API_BASE}${utente.avatar_url}`
              : '/default-avatar.png'; // Assicurati di avere un avatar di default in public/

            return (
              <ListGroup.Item
                key={utente.id}
                action // Rende l'item cliccabile con stili hover di Bootstrap
                onClick={() => handleUserNavigation(utente.id)}
                className="d-flex align-items-center p-3 mb-2 bg-white rounded shadow-sm" // Aggiunto padding, margine, sfondo e ombra
                style={userItemStyle} // Applica lo stile per il cursore
              >
                <Image
                  src={avatarSrc}
                  roundedCircle
                  width={userImageSize}
                  height={userImageSize}
                  className="me-3" // Margine a destra per separare dall' testo
                  alt={`Avatar di ${utente.nome || 'utente'}`}
                  onError={(e) => { e.target.src = '/default-avatar.png'; }} // Fallback se l'avatar non carica
                />
                <div>
                  <strong style={{ wordBreak: 'break-word' }}>@{utente.nome}</strong>
                  {utente.display_name && (
                    <span className="text-muted d-block" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
                      {utente.display_name}
                    </span>
                  )}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
};

export default SearchResultsPage;