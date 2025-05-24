import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; // InputGroup non era usato, rimosso per pulizia
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { FaCalendarAlt, FaGlobeAmericas, FaVenusMars } from 'react-icons/fa'; // Esempio icone

const themeColors = {
  primary: '#d9a86c',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0',
  accent: '#6c757d',
  text: '#333',
  lightText: '#555',
  surface: '#ffffff',
  error: '#d32f2f',
  success: '#388e3c',
  inputBorder: '#ced4da',
  inputFocusBorder: '#c89f65',
};

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  // const [nationality, setNationality] = useState(''); // Rimosso
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Inserisci uno username';
    else if (username.trim().length < 3) newErrors.username = 'Username troppo corto (min 3 caratteri)';

    if (!email.trim()) newErrors.email = 'Inserisci un\'email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email non valida';

    if (!password) newErrors.password = 'Inserisci una password';
    else if (password.length < 6) newErrors.password = 'La password deve avere almeno 6 caratteri';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Le password non coincidono';

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
        body: JSON.stringify({ username, password, email, birthDate, gender }) // Aggiunti birthDate e gender se vuoi mandarli
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registrazione avvenuta con successo:', data);
        alert('Registrazione completata! Ora puoi effettuare il login.');
        navigate('/login');
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Errore sconosciuto dal server.' }));
        console.error('Errore dal server:', errorData);
        setErrors({ form: errorData.detail || `Errore ${response.status}: ${response.statusText}` });
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setErrors({ form: 'Impossibile connettersi al server. Riprova più tardi.' });
    }
  };

  const inputStyleBase = {
    borderRadius: '25px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    boxShadow: 'none',
  };

  const getInputStyle = (fieldHasError) => ({
    ...inputStyleBase,
    borderColor: fieldHasError ? themeColors.error : themeColors.inputBorder,
  });
  
  const focusedInputStyle = {
    borderColor: themeColors.inputFocusBorder,
    // boxShadow: `0 0 0 0.25rem ${themeColors.inputFocusBorder}40`, // Ombra bootstrap-like, può essere rimossa se non voluta
  };


  return (
    <Container fluid className="min-vh-100 d-flex p-0" style={{ backgroundColor: themeColors.secondary, overflow: 'hidden' }}> {/* overflow: 'hidden' per rimuovere scrollbars */}
      <Row className="w-100 g-0 align-items-stretch">
        <Col md={6} className="d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0577/2515/7538/files/La_Dolce_Vita_2.png?v=1716226691)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%', // Modificato per migliorare la visualizzazione dell'immagine
              height: '100%',
            }}
          />
        </Col>

        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center py-4 py-md-5" style={{ backgroundColor: themeColors.surface }}> {/* Ridotto padding verticale se necessario */}
          <div className="p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
            <h1 className="text-center mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: themeColors.text }}>
              Crea il Tuo Account
            </h1>
            <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
              Entra a far parte della nostra community di stile!
            </p>

            {errors.form && <div className="alert alert-danger text-center" style={{fontSize: '0.9rem'}}>{errors.form}</div>}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="signupUsername">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Scegli il tuo username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                  style={getInputStyle(!!errors.username)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? themeColors.error : themeColors.inputBorder}
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="La tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                  style={getInputStyle(!!errors.email)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? themeColors.error : themeColors.inputBorder}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupPassword">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Crea una password sicura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                  style={getInputStyle(!!errors.password)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? themeColors.error : themeColors.inputBorder}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="signupConfirmPassword">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Conferma Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Riscrivi la password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  style={getInputStyle(!!errors.confirmPassword)}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? themeColors.error : themeColors.inputBorder}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupBirthDate">
                    <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Data di Nascita</Form.Label>
                    <Form.Control
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={getInputStyle(false)} // Non ha validazione di errore qui, quindi false
                      onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                      onBlur={(e) => e.target.style.borderColor = themeColors.inputBorder}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupGender">
                    <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Sesso</Form.Label>
                    <Form.Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={getInputStyle(false)} // Non ha validazione di errore qui, quindi false
                      onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                      onBlur={(e) => e.target.style.borderColor = themeColors.inputBorder}
                    >
                      <option value="">Seleziona...</option>
                      <option value="male">Maschio</option>
                      <option value="female">Femmina</option>
                      <option value="other">Altro</option>
                      <option value="prefer_not_to_say">Preferisco non specificare</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Nazionalità rimossa */}

              <div className="d-grid mt-2"> {/* Aggiunto un po' di margine sopra il bottone */}
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
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    boxShadow: `0 4px 10px ${themeColors.primary}50`,
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Registrati
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-0" style={{color: themeColors.lightText, fontSize: '0.9rem'}}>
                Hai già un account?{' '}
                <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: themeColors.primary, fontWeight: 'bold', textDecoration: 'none' }}>
                  Accedi qui
                </a>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;