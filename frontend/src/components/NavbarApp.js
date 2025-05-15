import React, { useState }from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaUserCircle, FaLock } from 'react-icons/fa';
import './NavbarApp.css'; // stile personalizzato
import { useNavigate } from 'react-router-dom';


const NavbarApp = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8006/utente/${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert('Utente non trovato');
        return;
      }

      const user = await res.json();
      navigate(`/profilo/${user.nome}`);
    } catch (err) {
      console.error('Errore nella ricerca utente:', err);
      alert('Errore nella ricerca');
    }
  };

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
            <FaUserCircle
              size={20}
              className="nav-icon"
              onClick={() => navigate('/profilo')}
              style={{ cursor: 'pointer' }}
            />
            <FaLock size={18} className="nav-icon" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NavbarApp;
