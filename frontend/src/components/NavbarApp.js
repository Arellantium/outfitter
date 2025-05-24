// src/components/NavbarApp.js
import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import './NavbarApp.css'; // stile personalizzato
import ProfileDropdown from './ProfileDropdown'; // Assicurati di avere questo componente
import CartIconWithBadge from './CartIconWithBadge'; // Assicurati di avere questo componente

const NavbarApp = () => {
  // Funzione per gestire il click sul logo, ad esempio per tornare alla home
  const handleLogoClick = () => {
    // Esempio: window.location.href = '/';
    // Se usi react-router, useresti useNavigate()
    console.log("Logo clicked! Navigating to home or main page.");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Logica per la ricerca
    const searchTerm = event.target.elements[0].value;
    console.log("Search term:", searchTerm);
    // Qui potresti chiamare una funzione per eseguire la ricerca
  };

  // Il colore beige dalla LandingPage.css è var(--lp-primary)
  // Assicurati che questa variabile CSS sia disponibile globalmente.
  // Se non lo è, puoi sostituire 'var(--lp-primary)' con il valore esadecimale es. '#CAA870'.
  const stColor = { color: '#000000' }; // Nero per "st"
  const aiColor = { color: 'var(--lp-primary)' }; // Beige per "AI"
  const listColor = { color: '#000000' }; // Nero per "list"

  return (
    <div className="app-navbar fixed-top">
      <Container fluid>
        <Row className="align-items-center">
          {/* LOGO */}
          <Col xs={6} md={3} className="d-flex align-items-center">
            <div
              className="logo-text ms-2 ms-md-3" // Aggiunto ms-2 per un po' di spazio su mobile
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
              aria-label="Pagina principale StAIlist"
            >
              <span className="stailist-st" style={stColor}>st</span>
              <span className="stailist-ai" style={aiColor}>AI</span>
              <span className="stailist-list" style={listColor}>list</span>
            </div>
          </Col>

          {/* ICONS (prima nel DOM per layout mobile, ma visivamente dopo la search su desktop grazie a order-md-2) */}
          <Col xs={6} md={3} className="d-flex justify-content-end align-items-center order-md-2">
            <div className="d-flex align-items-center gap-3 gap-lg-4 me-2 me-md-3"> {/* Aggiunto me-2 per spazio su mobile */}
              <ProfileDropdown />
              <CartIconWithBadge />
            </div>
          </Col>

          {/* SEARCH BAR (order-1 per metterla dopo logo/icone su mobile, order-md-1 per metterla in mezzo su desktop) */}
          <Col xs={12} md={6} className="order-1 order-md-1 mt-2 mt-md-0 px-3 px-md-2"> {/* px per padding orizzontale */}
            <div className="search-bar-wrapper">
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup className="search-bar">
                  <InputGroup.Text className="search-icon-container"> {/* Classe per il contenitore icona */}
                    <FaSearch className="search-icon-actual" /> {/* Classe per l'icona stessa */}
                  </InputGroup.Text>
                  <Form.Control
                    type="search"
                    placeholder="Cerca utenti..."
                    className="search-input"
                    aria-label="Barra di ricerca"
                  />
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarApp;