import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Palette di colori
const themeColors = {
  primary: '#d9a86c',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0',
  accent: '#6c757d',
  text: '#333',
  lightText: '#555',
  surface: '#ffffff',
  error: '#d32f2f',
  inputBorder: '#ced4da',
  inputFocusBorder: '#c89f65',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // Modificato per gestire errori specifici e di form
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Inserisci il tuo username.';
    if (!password) newErrors.password = 'Inserisci la tua password.';
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({}); // Pulisce gli errori di validazione se non ce ne sono più

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
            const errorText = await response.text();
            console.warn("La risposta d'errore non era JSON:", errorText);
            if (errorText) errorDetail = errorText;
        }
        console.error('Errore HTTP:', response.status, errorDetail);
        setErrors({ form: errorDetail }); // Imposta l'errore nel campo 'form'
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
        setErrors({ form: 'Credenziali non valide o token non ricevuto.' });
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setErrors({ form: 'Errore di connessione o server non raggiungibile.' });
    }
  };

  const inputStyleBase = {
    borderRadius: '25px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    boxShadow: 'none',
    width: '100%',
    height: 'calc(1.5em + 1.5rem + 2px)',
    border: `1px solid ${themeColors.inputBorder}`,
    backgroundColor: themeColors.surface,
    color: themeColors.text,
  };

  const getInputStyle = (fieldHasError) => ({
    ...inputStyleBase,
    borderColor: fieldHasError ? themeColors.error : themeColors.inputBorder,
  });
  
  const focusedInputStyle = {
    borderColor: themeColors.inputFocusBorder,
  };

  return (
    <Container 
        fluid 
        className="min-vh-100 d-flex p-0"
        style={{ backgroundColor: themeColors.secondary, overflow: 'hidden' }}
    >
      <Row className="w-100 g-0 align-items-stretch">
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

            {errors.form && <div className="alert alert-danger text-center" style={{fontSize: '0.9rem'}}>{errors.form}</div>}

            <Form onSubmit={handleLogin} noValidate>
              <Form.Group className="mb-3" controlId="loginUsername">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                  style={getInputStyle(!!errors.username)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? themeColors.error : themeColors.inputBorder}
                  // required // La validazione HTML5 può essere rimossa se gestita completamente da JS
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="La tua password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                  style={getInputStyle(!!errors.password)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? themeColors.error : themeColors.inputBorder}
                  // required
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
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

        <Col md={6} className="d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0577/2515/7538/files/SnapInsta.to_499375822_18063235658118236_6844576782158291344_n_1658e177-30f8-4931-a849-30e2decbc2d2.jpg?v=1747729515)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 70%',
              height: '100%',
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;