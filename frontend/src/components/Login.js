import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'; // Card è già importata
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Palette di colori (idealmente importata da un file comune)
const themeColors = {
  primary: '#d9a86c',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0', // Sfondo pagina
  accent: '#6c757d',
  text: '#333',
  lightText: '#555',
  surface: '#ffffff', // Sfondo card
  error: '#d32f2f',
  inputBorder: '#ced4da',
  inputFocusBorder: '#c89f65',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Per favore, inserisci username e password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8006/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        let errorDetail = `Errore ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch (jsonError) {
            console.warn("La risposta d'errore non era JSON:", await response.text());
        }
        console.error('Errore HTTP:', response.status, errorDetail);
        setError(errorDetail);
        return;
      }
   
      const data = await response.json();
      console.log('Risposta del server:', data);

      if (data.access_token && data.token_type) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        navigate('/');
      } else {
        console.warn('Token non presente nella risposta:', data);
        setError('Credenziali non valide o token non ricevuto.');
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError('Errore di connessione o server non raggiungibile.');
    }
  };

  const inputStyle = {
    borderRadius: '25px',
    borderColor: themeColors.inputBorder,
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    boxShadow: 'none',
  };

  const focusedInputStyle = {
    borderColor: themeColors.inputFocusBorder,
    boxShadow: `0 0 0 0.25rem ${themeColors.inputFocusBorder}40`,
  };

  return (
    <Container 
        fluid 
        className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4" // Aggiunto padding per schermi piccoli
        style={{ backgroundColor: themeColors.secondary }}
    >
      {/* Row non è più strettamente necessaria per una singola colonna centrata, 
          ma la usiamo per coerenza con Col e per il justify-content-center */}
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}> {/* Colonna più stretta per il form */}
          <Card 
            className="shadow-lg" 
            style={{ 
                borderRadius: '20px', // Angoli più arrotondati per la Card
                border: 'none', // Rimuove il bordo di default della Card
                backgroundColor: themeColors.surface 
            }}
          >
            <Card.Body className="p-4 p-lg-5"> {/* Più padding su schermi grandi */}
              <div className="text-center mb-4">
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: themeColors.text, fontSize: '2.5rem' }}>
                      Bentornato!
                  </h1>
                  <p style={{ color: themeColors.lightText, fontSize: '1rem' }}>
                      Accedi per continuare il tuo viaggio nello stile.
                  </p>
              </div>

              {error && <div className="alert alert-danger text-center" style={{fontSize: '0.9rem', borderRadius: '15px'}}>{error}</div>}

              <Form onSubmit={handleLogin} noValidate>
                <Form.Group className="mb-3" controlId="loginUsername">
                  <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Il tuo username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                    onBlur={(e) => e.target.style.borderColor = themeColors.inputBorder}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="La tua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                    onBlur={(e) => e.target.style.borderColor = themeColors.inputBorder}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    style={{
                      background: `linear-gradient(to right, ${themeColors.primaryDarker}, ${themeColors.primary})`,
                      borderColor: themeColors.primary, // O 'transparent' se preferisci nessun bordo visibile
                      color: themeColors.surface,
                      fontWeight: 'bold',
                      padding: '0.8rem',
                      borderRadius: '30px',
                      fontSize: '1.05rem',
                      letterSpacing: '0.5px',
                      transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: `0 5px 15px ${themeColors.primary}40`, // Ombra più pronunciata
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    Accedi
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0" style={{color: themeColors.lightText, fontSize: '0.9rem'}}>
                  Non hai ancora un account?{' '}
                  <a
                      href="/signup"
                      onClick={(e) => { e.preventDefault(); navigate('/signup'); }}
                      style={{ color: themeColors.primary, fontWeight: '600', textDecoration: 'none' }}
                  >
                    Registrati ora
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;