import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; // Card rimossa, non più necessaria
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
  surface: '#ffffff', // Sfondo colonna form
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
            // Se la risposta d'errore non è JSON, usa il testo grezzo
            const errorText = await response.text();
            console.warn("La risposta d'errore non era JSON:", errorText);
            if (errorText) errorDetail = errorText; // Usa il testo se disponibile
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
        // Potresti voler salvare anche l'username o l'ID utente se il backend lo restituisce
        // localStorage.setItem('username', username); // Esempio
        navigate('/'); // Reindirizza alla homepage o dashboard
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
    boxShadow: 'none', // Rimosso boxShadow di default
  };

  const focusedInputStyle = {
    borderColor: themeColors.inputFocusBorder,
    // boxShadow: `0 0 0 0.25rem ${themeColors.inputFocusBorder}40`, // Rimosso per coerenza con Signup
  };

  return (
    <Container 
        fluid 
        className="min-vh-100 d-flex p-0"
        style={{ backgroundColor: themeColors.secondary, overflow: 'hidden' }} // Aggiunto overflow: 'hidden'
    >
      <Row className="w-100 g-0 align-items-stretch">
        {/* Colonna Form (a sinistra) */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: themeColors.surface }}>
          <div className="p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="text-center mb-4">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: themeColors.text, fontSize: '2.5rem' }}>
                    Bentornato!
                </h1>
                <p style={{ color: themeColors.lightText, fontSize: '1rem' }}>
                    Accedi per continuare il tuo viaggio nello stile.
                </p>
            </div>

            {error && <div className="alert alert-danger text-center" style={{fontSize: '0.9rem'}}>{error}</div>} {/* Rimosso borderRadius specifico per uniformità */}

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
                    borderColor: themeColors.primary,
                    color: themeColors.surface,
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '30px',
                    fontSize: '1.05rem',
                    letterSpacing: '0.5px',
                    transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: `0 5px 15px ${themeColors.primary}40`,
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
          </div>
        </Col>

        {/* Colonna Immagine (a destra) */}
        <Col md={6} className="d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0577/2515/7538/files/SnapInsta.to_499375822_18063235658118236_6844576782158291344_n_1658e177-30f8-4931-a849-30e2decbc2d2.jpg?v=1747729515)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 70%', // 'center top' per dare priorità alla parte alta del ritratto
              height: '100%',
            
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;