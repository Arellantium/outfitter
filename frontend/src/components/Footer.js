import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-bg text-white pt-5 pb-3 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="fw-bold">st<span style={{ color: '#c1975c' }}>AI</span>list</h5>
            <p>La tua community per creare, condividere e scoprire outfit ispirati.</p>
          </Col>

          <Col md={4} className="mb-4">
            <h6 className="fw-semibold">Link Utili</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/about" className="footer-link">Chi siamo</a></li>
              <li><a href="/privacy" className="footer-link">Privacy</a></li>
              <li><a href="/contatti" className="footer-link">Contatti</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h6 className="fw-semibold">Contatti</h6>
            <p><FaEnvelope className="me-2" /> info@outfitter.com</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
            </div>
          </Col>
        </Row>

        <hr className="border-light" />

        <Row>
          <Col className="text-center small">
            © {new Date().getFullYear()} stAllist. Tutti i diritti riservati.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
