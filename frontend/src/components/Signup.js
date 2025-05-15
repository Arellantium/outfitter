import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Inserisci uno username';
    if (!email.includes('@')) newErrors.email = 'Email non valida';
    if (password.length < 6) newErrors.password = 'La password deve avere almeno 6 caratteri';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
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
      alert('Errore durante la registrazione.');
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex p-0">
      <Row className="w-100 g-0">
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

        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center bg-light">
          <div className="w-75 p-4">
            <h2 className="text-center mb-4">
              <span style={{ color: 'black' }}>St</span>
              <span style={{ color: '#666' }}>AI</span>
              <span style={{ color: 'black' }}>list</span>
            </h2>

            <Form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
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
