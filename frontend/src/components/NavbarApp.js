import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch  } from 'react-icons/fa';
import './NavbarApp.css'; // stile personalizzato
import ProfileDropdown from './ProfileDropdown'; // Assicurati di avere questo componente
import CartIconWithBadge from './CartIconWithBadge'; // Assicurati di avere questo componente

const NavbarApp = () => {
  return (
    <div className="app-navbar shadow-sm py-3 bg-white fixed-top">
      <Container fluid>
        <Row className="align-items-center">
          {/* LOGO */}
          <Col xs={4} md={3} className="d-flex align-items-center">
            <span className="logo-text ms-3">
              <span style={{ color: '#2c2c2c', fontWeight: '700' }}>st</span>
              <span style={{ color: '#c1975c', fontWeight: '800' }}>AI</span>
              <span style={{ color: '#2c2c2c', fontWeight: '700' }}>list</span>
            </span>
          </Col>

          {/* SEARCH */}
          <Col xs={4} md={6}>
            <Form>
              <InputGroup className="search-bar mx-auto">
                <InputGroup.Text className="search-icon">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search outfits or users..."
                  className="search-input"
                />
              </InputGroup>
            </Form>
          </Col>

          {/* ICONS */}
          <Col xs={4} md={3} className="d-flex justify-content-end gap-3">
            <ProfileDropdown />
            <CartIconWithBadge />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarApp;
