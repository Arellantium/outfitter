// src/components/NavbarApp.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap'; // Rimosso Image
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NavbarApp.css'; // Assicurati che questo file esista e contenga gli stili necessari
import ProfileDropdown from './ProfileDropdown';
import CartIconWithBadge from './CartIconWithBadge';

const API_BASE = 'http://localhost:8006'; // Ancora necessario se hai altri fetch, ma non per avatar qui

const NavbarApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [autocompleteError, setAutocompleteError] = useState(null);
  const timeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setShowDropdown(false);
      setLoadingAutocomplete(false);
      setAutocompleteError(null);
      return;
    }

    setLoadingAutocomplete(true);
    setAutocompleteError(null);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetch(`${API_BASE}/search/users?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Errore nel caricamento dei suggerimenti.');
          return res.json();
        })
        .then((data) => {
          setResults(data || []);
          setShowDropdown(true);
        })
        .catch((err) => {
          console.error("Autocomplete error:", err);
          setResults([]);
          setAutocompleteError(err.message || 'Si è verificato un errore.');
          setShowDropdown(true);
        })
        .finally(() => {
          setLoadingAutocomplete(false);
        });
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleUserClickFromAutocomplete = useCallback((user) => {
    setQuery('');
    setShowDropdown(false);
    setResults([]);
    if (searchInputRef.current) searchInputRef.current.value = '';
    navigate(`/profile/${user.id}`);
  }, [navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (results.length === 1 && !loadingAutocomplete && !autocompleteError) {
      handleUserClickFromAutocomplete(results[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Rimosso autocompleteUserImageSize perché non più necessario

  return (
    <div className="app-navbar fixed-top bg-light shadow-sm">
      <Container fluid>
        <Row className="align-items-center py-2">
          <Col xs={6} md={3} className="d-flex align-items-center">
            <div
              className="logo-text ms-2 ms-md-3"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
              aria-label="Pagina principale StAIlist"
              style={{ cursor: 'pointer' }}
            >
              <span className="stailist-st">st</span>
              <span className="stailist-ai">AI</span>
              <span className="stailist-list">list</span>
            </div>
          </Col>

          <Col xs={6} md={3} className="d-flex justify-content-end align-items-center order-md-2">
            <div className="d-flex align-items-center gap-3 gap-lg-4 me-2 me-md-3">
              <ProfileDropdown />
              <CartIconWithBadge />
            </div>
          </Col>

          <Col xs={12} md={6} className="order-1 order-md-1 mt-2 mt-md-0 px-3 px-md-2">
            <div ref={dropdownContainerRef} className="position-relative search-bar-container">
              <Form onSubmit={handleFormSubmit} className="search-bar-wrapper">
                <InputGroup className="search-bar">
                  <InputGroup.Text className="search-icon-container bg-transparent border-end-0">
                    <FaSearch className="search-icon-actual" />
                  </InputGroup.Text>
                  <Form.Control
                    ref={searchInputRef}
                    type="search"
                    placeholder="Cerca utenti..."
                    className="search-input border-start-0 shadow-none"
                    aria-label="Cerca utenti"
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (query.length > 0 && (results.length > 0 || autocompleteError || loadingAutocomplete)) {
                         setShowDropdown(true);
                      }
                    }}
                  />
                </InputGroup>
              </Form>

              {showDropdown && (
                <ListGroup
                  className="position-absolute w-100 shadow-sm zindex-dropdown mt-1"
                  style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                >
                  {loadingAutocomplete && (
                    <ListGroup.Item className="text-center py-2">
                      <Spinner animation="border" size="sm" /> Caricamento...
                    </ListGroup.Item>
                  )}
                  {autocompleteError && !loadingAutocomplete && (
                     <ListGroup.Item variant="danger" className="text-center py-2">
                       {autocompleteError}
                     </ListGroup.Item>
                  )}
                  {!loadingAutocomplete && !autocompleteError && results.length === 0 && query.length > 0 && (
                    <ListGroup.Item disabled className="text-center text-muted py-2">Nessun utente trovato per "{query}".</ListGroup.Item>
                  )}

                  {!loadingAutocomplete && !autocompleteError && results.map((utente) => {
                    // Rimosso avatarSrc e il componente Image
                    return (
                      <ListGroup.Item
                        key={utente.id}
                        action
                        onClick={() => handleUserClickFromAutocomplete(utente)}
                        // La classe d-flex align-items-center può rimanere per centrare verticalmente il testo se necessario,
                        // oppure puoi rimuoverla se preferisci un allineamento al top.
                        // Ho rimosso me-2 dall'elemento interno dato che l'immagine non c'è più.
                        className="autocomplete-item py-2"
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Il div ora è l'unico figlio diretto, quindi non c'è bisogno di d-flex qui se non per scopi specifici */}
                        <div>
                          <span style={{ wordBreak: 'break-word' }}>@{utente.nome}</span>
                          {utente.display_name && (
                            <small className="text-muted d-block" style={{ wordBreak: 'break-word', fontSize: '0.8rem' }}>
                              {utente.display_name}
                            </small>
                          )}
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarApp;