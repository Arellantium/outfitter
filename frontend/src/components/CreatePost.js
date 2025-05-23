// src/components/CreatePost.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaArrowLeft, FaTimes, FaDollarSign } from 'react-icons/fa';

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
  inputBorder: '#d1d5db',
  inputFocusBorder: '#c89f65',
  placeholderText: '#9ca3af',
};

// Stili con modifiche per larghezza e altezza
const styles = {
  bodyPage: {
    margin: 0,
    padding: '2rem 1rem',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: themeColors.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Centra verticalmente se il contenuto è più corto dello schermo
    minHeight: '100vh',
  },
  bodyModal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    backgroundColor: themeColors.surface,
    padding: '2rem', // Ridotto leggermente per guadagnare spazio verticale
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Ombra leggermente aggiustata
    maxWidth: '650px', // *** AUMENTATO per renderlo "poco più largo" ***
    width: '100%',
    boxSizing: 'border-box',
  },
  closeButton: {
    position: 'absolute',
    top: '10px', // Leggermente più in alto
    right: '15px', // Leggermente più a sinistra
    background: 'transparent',
    border: 'none',
    fontSize: '1.4rem', // Leggermente più piccolo
    color: themeColors.accent,
    cursor: 'pointer',
    padding: '0.4rem',
    lineHeight: '1',
    zIndex: 10,
  },
  closeButtonHover: {
    color: themeColors.primaryDarker,
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem', // Ridotto
    fontFamily: "'Playfair Display', serif",
    color: themeColors.text,
    fontWeight: 700,
    fontSize: '2rem', // Ridotto
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '1rem', // Ridotto
    color: themeColors.lightText,
    fontSize: '0.95rem', // Ridotto
  },
  errorMessageContainer: {
    minHeight: '52px', // Calibra attentamente: (padding error * 2) + (font-size error * line-height error)
                        // Es: (0.8rem*16*2) + (0.85rem*16*1.2) = 25.6 + 16.32 = 41.92px. 52px dà margine.
    marginBottom: '1rem', // Ridotto
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  errorMessage: {
    color: themeColors.error,
    backgroundColor: `${themeColors.error}1A`, // Più tenue
    padding: '0.8rem 1rem', // Ridotto
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '0.85rem', // Ridotto
    border: `1px solid ${themeColors.error}4D`, // Più tenue
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: '1.2',
  },
  inputGroup: {
    marginBottom: '1.25rem', // Ridotto
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem', // Ridotto
    color: themeColors.text,
    fontSize: '0.85rem', // Ridotto
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem', // Ridotto
    border: `1px solid ${themeColors.inputBorder}`,
    borderRadius: '10px',
    fontSize: '0.9rem', // Ridotto
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#f9fafb',
    color: themeColors.text,
    '::placeholder': {
      color: themeColors.placeholderText,
    },
  },
  inputWithIconWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: themeColors.accent,
    fontSize: '1rem', // Ridotto
  },
  inputFieldWithIcon: {
    paddingLeft: '2.5rem', // Adattato all'icona più piccola
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px', // *** RIDOTTO per guadagnare spazio ***
    // maxHeight: '120px', // Potresti considerare un maxHeight per la textarea
    // overflowY: 'auto',  // e scroll interno alla textarea se necessario
  },
  fileInputWrapper: {
    border: `2px dashed ${themeColors.inputBorder}`,
    borderRadius: '10px',
    padding: '1.5rem', // Ridotto
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    marginBottom: '1rem',
  },
  fileInputWrapperHover: {
    borderColor: themeColors.primary,
    backgroundColor: '#fdf9f5',
  },
  fileInputText: {
    color: themeColors.lightText,
    fontSize: '0.9rem', // Ridotto
    marginBottom: '0.4rem',
  },
  fileInputIcon: {
    color: themeColors.primary,
    fontSize: '2rem', // Ridotto
    marginBottom: '0.5rem', // Ridotto
  },
  hiddenInputFile: {
    display: 'none',
  },
  button: {
    width: '100%',
    padding: '0.8rem 1rem', // Ridotto
    background: `linear-gradient(135deg, ${themeColors.primaryDarker}, ${themeColors.primary})`,
    color: themeColors.surface,
    fontWeight: '600',
    letterSpacing: '0.5px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem', // Ridotto
    transition: 'all 0.3s ease',
    marginTop: '1.25rem', // Ridotto
    boxShadow: `0 5px 10px ${themeColors.primary}40`,
    textTransform: 'uppercase',
  },
  buttonHover: { /* ... invariato ... */ },
  buttonLoading: { /* ... invariato ... */ },
  previewContainer: {
    marginTop: '1rem', // Ridotto
    marginBottom: '1rem', // Ridotto
    border: `1px solid ${themeColors.inputBorder}`,
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '0.4rem',
    backgroundColor: '#f9fafb',
  },
  previewImage: {
    width: '100%',
    maxHeight: '200px', // *** RIDOTTO DRASTICAMENTE per guadagnare molto spazio verticale ***
                        // Questo è il trade-off maggiore per evitare lo scroll
    objectFit: 'contain',
    display: 'block',
    borderRadius: '8px',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.5rem', // Ridotto
    color: themeColors.lightText,
    textDecoration: 'none',
    fontSize: '0.9rem', // Ridotto
    transition: 'color 0.2s ease',
  },
  backLinkHover: {
    color: themeColors.primary,
  },
};

function CreatePost({ isModal = false, onCloseModal }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isBackLinkHovered, setIsBackLinkHovered] = useState(false);

  const token = localStorage.getItem('access_token');

  useEffect(() => { /* ...logica invariata... */ }, [token, navigate, isModal]);
  useEffect(() => { /* ...logica invariata... */ }, [previewUrl]);

  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setPrice(value);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
        setImage(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
    } else {
        setImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
        if (file) setError("Formato file non supportato. Seleziona un'immagine (PNG, JPG, GIF).");
    }
  };

  const handleImageChange = (e) => processFile(e.target.files[0]);
  const handleFileDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); processFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) { setError("Per favore, carica un'immagine per il tuo outfit."); return; }
    if (!description.trim()) { setError("Per favore, aggiungi una descrizione al tuo outfit."); return; }
    if (!price.trim() || parseFloat(price) <= 0) { setError("Per favore, inserisci un prezzo valido."); return; }
    if (!token) { setError('Autenticazione richiesta. Effettua il login.'); return; }

    setIsLoading(true);
    const data = new FormData();
    data.append('description', description);
    data.append('image', image);
    data.append('price', parseFloat(price).toFixed(2));

    try {
      const res = await fetch('http://localhost:8000/posts/', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data });
      if (res.ok) {
        alert('Post caricato con successo!');
        setDescription(''); setImage(null); setPrice(''); setPreviewUrl(''); setError('');
        if (isModal && onCloseModal) onCloseModal();
        else navigate('/');
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Errore sconosciuto.' }));
        setError(res.status === 401 || res.status === 403 ? `Autorizzazione fallita: ${errorData.detail || 'Non autorizzato.'}` : `Errore caricamento: ${errorData.detail || res.statusText}`);
      }
    } catch (err) {
      setError('Errore di connessione. Controlla la tua rete e riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const wrapperStyle = isModal ? styles.bodyModal : styles.bodyPage;

  return (
    <div style={wrapperStyle}>
      <div style={styles.container}>
        {isModal && onCloseModal && (
          <button
            type="button"
            onClick={onCloseModal}
            style={isCloseButtonHovered ? {...styles.closeButton, ...styles.closeButtonHover} : styles.closeButton}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            aria-label="Chiudi"
          >
            <FaTimes />
          </button>
        )}

        <h1 style={styles.title}>Condividi il Tuo Stile</h1>
        <p style={styles.subtitle}>Carica una foto del tuo outfit e ispira la community!</p>

        <div style={styles.errorMessageContainer}>
          {error && <p style={styles.errorMessage}>{error}</p>}
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.inputGroup}>
            <label htmlFor="image" style={styles.label}>Immagine dell'Outfit</label>
            <div
              style={{ ...styles.fileInputWrapper, ...(isDragOver ? styles.fileInputWrapperHover : {}) }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDrop={handleFileDrop} onDragOver={handleDragOver} onDragEnter={handleDragOver} onDragLeave={handleDragLeave}
            >
              <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/gif"
                onChange={handleImageChange} ref={fileInputRef} style={styles.hiddenInputFile} />
              <FaUpload style={styles.fileInputIcon} />
              <p style={styles.fileInputText}>{image ? image.name : "Trascina un'immagine qui o clicca per selezionare"}</p>
              <p style={{fontSize: '0.8rem', color: themeColors.lightText}}>(Max 5MB, formati PNG, JPG, GIF)</p>
            </div>
          </div>

          {previewUrl && (
            <div style={styles.previewContainer}>
              <img src={previewUrl} alt="Anteprima Outfit" style={styles.previewImage} />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label htmlFor="description" style={styles.label}>Descrizione Outfit</label>
            <textarea id="description" name="description" placeholder="Descrivi il tuo look, i brand, l'ispirazione..."
              value={description} onChange={handleDescriptionChange}
              style={{ ...styles.input, ...styles.textarea, '::placeholder': styles.input['::placeholder'] }}
              rows="4" // *** RIDOTTO rows della textarea ***
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="price" style={styles.label}>Prezzo (EUR)</label>
            <div style={styles.inputWithIconWrapper}>
                <FaDollarSign style={styles.inputIcon} />
                <input
                type="text"
                id="price"
                name="price"
                placeholder="Es. 29.99"
                value={price}
                onChange={handlePriceChange}
                style={{ ...styles.input, ...styles.inputFieldWithIcon, '::placeholder': styles.input['::placeholder'] }}
                inputMode="decimal"
                />
            </div>
          </div>

          <button type="submit"
            style={isLoading ? { ...styles.button, ...styles.buttonLoading } : isButtonHovered ? {...styles.button, ...styles.buttonHover} : styles.button}
            disabled={isLoading} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
            {isLoading ? 'Pubblicazione...' : 'Pubblica Outfit'}
          </button>
        </form>

        {!isModal && (
          <a
            href="/"
            style={isBackLinkHovered ? {...styles.backLink, ...styles.backLinkHover} : styles.backLink}
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            onMouseEnter={() => setIsBackLinkHovered(true)}
            onMouseLeave={() => setIsBackLinkHovered(false)}
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Torna alla Home
          </a>
        )}
      </div>
    </div>
  );
}

export default CreatePost;