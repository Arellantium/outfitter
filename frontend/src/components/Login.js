import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8006/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log('Login avvenuto con successo:', data);
      alert('Accesso effettuato!');
    } catch (error) {
      console.error('Errore durante il login:', error);
      alert('Errore durante il login.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-lg rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">
                <span style={{ color: 'black' }}>St</span>
                <span style={{ color: '#666' }}>AI</span>
                <span style={{ color: 'black' }}>list</span>
              </h2>
              <p className="text-center text-dark mb-4">Log in</p>

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="username"
                    placeholder="Inserisci username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit">
                    Accedi
                  </Button>
                </div>
              </Form>

              <div className="text-center mb-3">
                <small>oppure accedi con</small>
              </div>

              <div className="d-flex justify-content-center gap-3 mb-3">
                <Button variant="outline-primary" className="rounded-circle">
                  <FaFacebook />
                </Button>
                <Button variant="outline-danger" className="rounded-circle">
                  <FaGoogle />
                </Button>
                <Button variant="outline-info" className="rounded-circle">
                  <FaTwitter />
                </Button>
              </div>

              <div className="text-center">
                <small>
                  Non hai un account? <button className="btn btn-link p-0" type="button" onClick={() => window.location.href = '/signup'}>Registrati</button>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
