import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'; // Aggiunto InputGroup
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
// Potresti voler importare icone se necessario per i campi
// import { FaCalendarAlt, FaGlobeAmericas, FaVenusMars } from 'react-icons/fa';

// Palette di colori (puoi centralizzarla in un file a parte se usata in più posti)
const themeColors = {
  primary: '#d9a86c', // Oro/Bronzo principale
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0', // Sfondo pagina chiaro / beige
  accent: '#6c757d', // Grigio neutro per testo secondario o bordi
  text: '#333',
  lightText: '#555',
  surface: '#ffffff', // Sfondo dei form/card
  error: '#d32f2f',
  success: '#388e3c',
  inputBorder: '#ced4da',
  inputFocusBorder: '#c89f65', // Colore bordo input al focus
};

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Aggiunto per conferma password
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Hook per la navigazione

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Inserisci uno username';
    else if (username.trim().length < 3) newErrors.username = 'Username troppo corto (min 3 caratteri)';

    if (!email.trim()) newErrors.email = 'Inserisci un\'email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email non valida';

    if (!password) newErrors.password = 'Inserisci una password';
    else if (password.length < 6) newErrors.password = 'La password deve avere almeno 6 caratteri';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Le password non coincidono';

    // Validazioni opzionali per i nuovi campi (solo se vuoi che siano obbligatori)
    // if (!birthDate) newErrors.birthDate = 'Inserisci la data di nascita';
    // if (!nationality) newErrors.nationality = 'Seleziona la nazionalità';
    // if (!gender) newErrors.gender = 'Seleziona il sesso';

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
      const response = await fetch('http://localhost:8006/signup', { // Assicurati che l'URL sia corretto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Invia solo i dati necessari al backend.
        // I campi aggiuntivi (birthDate, nationality, gender) sono solo estetici qui.
        body: JSON.stringify({ username, password, email })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registrazione avvenuta con successo:', data);
        alert('Registrazione completata! Ora puoi effettuare il login.');
        navigate('/login'); // Reindirizza alla pagina di login
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Errore sconosciuto dal server.' }));
        console.error('Errore dal server:', errorData);
        // Mostra un errore più generico all'utente o uno specifico se disponibile
        setErrors({ form: errorData.detail || `Errore ${response.status}: ${response.statusText}` });
        // alert(`Errore durante la registrazione: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setErrors({ form: 'Impossibile connettersi al server. Riprova più tardi.' });
      // alert('Errore durante la registrazione. Controlla la console.');
    }
  };

  const inputStyle = {
    borderRadius: '25px', // Angoli più arrotondati per i campi
    borderColor: errors.username ? themeColors.error : themeColors.inputBorder,
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    boxShadow: 'none', // Rimuove ombra di default al focus di Bootstrap
  };

  const focusedInputStyle = {
    borderColor: themeColors.inputFocusBorder,
    boxShadow: `0 0 0 0.25rem ${themeColors.inputFocusBorder}40`, // Ombra al focus personalizzata
  };


  return (
    <Container fluid className="min-vh-100 d-flex p-0" style={{ backgroundColor: themeColors.secondary }}>
      <Row className="w-100 g-0 align-items-stretch"> {/* align-items-stretch per far sì che le colonne prendano tutta l'altezza */}
        {/* Colonna Immagine */}
        <Col md={6} className="d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: 'url(https://compass-media.vogue.it/photos/6703a668e6a3c9f0869f1908/4:3/w_1920,c_limit/GettyImages-2173423733.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%', // Prende l'altezza del genitore (Row -> Container)
            }}
          />
        </Col>

        {/* Colonna Form */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: themeColors.surface }}>
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
                  style={inputStyle}
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
                  style={inputStyle}
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
                  style={inputStyle}
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
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? themeColors.error : themeColors.inputBorder}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>

              {/* Campi Aggiuntivi (Estetici) */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupBirthDate">
                    <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Data di Nascita</Form.Label>
                    <Form.Control
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={inputStyle}
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
                      style={inputStyle}
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

              <Form.Group className="mb-4" controlId="signupNationality">
                <Form.Label style={{ color: themeColors.lightText, fontSize: '0.9rem' }}>Nazionalità</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Es. Italiana"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = focusedInputStyle.borderColor}
                  onBlur={(e) => e.target.style.borderColor = themeColors.inputBorder}
                />
              </Form.Group>


              <div className="d-grid">
                <Button
                  type="submit"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primaryDarker}, ${themeColors.primary})`,
                    borderColor: themeColors.primary,
                    color: themeColors.surface, // Testo bianco sul bottone
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