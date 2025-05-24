import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import './NavbarApp.css'; // Assicurati che questo file contenga il nuovo CSS
import ProfileDropdown from './ProfileDropdown'; // Assicurati che questi componenti esistano
import CartIconWithBadge from './CartIconWithBadge'; // Assicurati che questi componenti esistano

const NavbarApp = () => {
  const handleLogoClick = () => {
    console.log("Logo clicked! Navigating to home or main page.");
    // Qui potresti inserire la logica di navigazione, es:
    // window.location.href = '/'; // Semplice redirect
    // Oppure, se usi react-router-dom:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements[0].value;
    console.log("Search term:", searchTerm);
    // Qui la logica per gestire la ricerca, es:
    // navigate(/search?query=${encodeURIComponent(searchTerm)});
  };

  return (
    <div className="app-navbar fixed-top">
      <Container fluid>
        <Row className="align-items-center">
          {/* Colonna Logo */}
          <Col xs={6} md={3} className="d-flex align-items-center">
            <div
              className="logo-text ms-2 ms-md-3"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleLogoClick()}
              aria-label="Pagina principale StAIlist"
            >
              <span className="stailist-st">st</span>
              <span className="stailist-ai">AI</span>
              <span className="stailist-list">list</span>
            </div>
          </Col>

          {/* Colonna Icone Destra (Profilo, Carrello) */}
          <Col xs={6} md={3} className="d-flex justify-content-end align-items-center order-md-2">
            <div className="d-flex align-items-center gap-3 gap-lg-4 me-2 me-md-3">
              <ProfileDropdown />
              <CartIconWithBadge />
            </div>
          </Col>

          {/* Colonna Barra di Ricerca */}
          <Col xs={12} md={6} className="order-1 order-md-1 mt-2 mt-md-0 px-3 px-md-2">
            <div className="search-bar-wrapper">
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup className="search-bar">
                  <InputGroup.Text className="search-icon-container">
                    <FaSearch className="search-icon-actual" />
                  </InputGroup.Text>
                  <Form.Control
                    type="search"
                    placeholder="Cerca utenti... "
                    className="search-input"
                    aria-label="Barra di ricerca per utenti, outfit e ispirazioni"
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