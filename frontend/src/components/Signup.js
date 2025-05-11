import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8006/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      });

      const data = await response.json();
      console.log('Registrazione avvenuta con successo:', data);
      alert('Registrazione completata!');
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      alert('Errore durante la registrazione. ');
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex p-0">
      <Row className="w-100 g-0">
        {/* Left Side - Fashion Image */}
        <Col md={6} className="d-none d-md-block">
          <div
            style={{
              backgroundImage: 'url(https://compass-media.vogue.it/photos/6703a668e6a3c9f0869f1908/4:3/w_1920,c_limit/GettyImages-2173423733.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100vh',
              width: '100%'
            }}
          ></div>
        </Col>

        {/* Right Side - Form */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center bg-light">
          <div className="w-75 p-4">
            <h2 className="text-center mb-4">
              <span style={{ color: 'black' }}>St</span>
              <span style={{ color: '#666' }}>AI</span>
              <span style={{ color: 'black' }}>list</span>
            </h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Registrati
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;