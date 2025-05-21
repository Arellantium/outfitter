import React, { useState, useEffect, useRef } from 'react'; // Aggiunto useRef
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaArrowLeft } from 'react-icons/fa'; // Icone per upload e back

// Palette di colori (puoi centralizzarla)
const themeColors = {
  primary: '#d9a86c', // Oro/Bronzo principale
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0', // Sfondo pagina chiaro / beige
  accent: '#6c757d',
  text: '#333',
  lightText: '#555',
  surface: '#ffffff', // Sfondo dei form/card
  error: '#d32f2f',
  inputBorder: '#d1d5db', // Grigio chiaro per bordi input
  inputFocusBorder: '#c89f65',
  placeholderText: '#9ca3af',
};

const styles = {
  body: {
    margin: 0,
    padding: '2rem 1rem',
    fontFamily: "'Poppins', sans-serif", // Font di base
    backgroundColor: themeColors.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Per permettere scroll se il contenuto è lungo
    minHeight: '100vh',
  },
  container: {
    backgroundColor: themeColors.surface,
    padding: '2.5rem', // Più padding
    borderRadius: '20px', // Angoli più arrotondati
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)', // Ombra più morbida e ampia
    maxWidth: '600px', // Leggermente più largo
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem', // Meno spazio sotto il titolo principale
    fontFamily: "'Playfair Display', serif", // Font elegante per il titolo
    color: themeColors.text, // Testo scuro per il titolo
    fontWeight: 700,
    fontSize: '2.2rem', // Titolo più grande
  },
  subtitle: { // Aggiunto un sottotitolo
    textAlign: 'center',
    marginBottom: '2.5rem',
    color: themeColors.lightText,
    fontSize: '1rem',
  },
  inputGroup: {
    marginBottom: '1.8rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.6rem',
    color: themeColors.text,
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.9rem 1.1rem',
    border: `1px solid ${themeColors.inputBorder}`,
    borderRadius: '12px', // Angoli più arrotondati per gli input
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#f9fafb', // Sfondo leggermente grigio per input
    color: themeColors.text,
    '::placeholder': { // Stile per il placeholder
      color: themeColors.placeholderText,
    },
  },
  textarea: {
    resize: 'vertical',
    minHeight: '100px',
  },
  // Stili per l'input file personalizzato
  fileInputWrapper: {
    border: `2px dashed ${themeColors.inputBorder}`,
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    marginBottom: '1rem', // Spazio se c'è anteprima sotto
  },
  fileInputWrapperHover: { // Stile per l'hover
    borderColor: themeColors.primary,
    backgroundColor: '#fdf9f5',
  },
  fileInputText: {
    color: themeColors.lightText,
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  fileInputIcon: {
    color: themeColors.primary,
    fontSize: '2.5rem', // Icona più grande
    marginBottom: '0.8rem',
  },
  // Nasconde l'input file di default
  hiddenInputFile: {
    display: 'none',
  },
  button: {
    width: '100%',
    padding: '0.9rem 1rem',
    background: `linear-gradient(135deg, ${themeColors.primaryDarker}, ${themeColors.primary})`,
    color: themeColors.surface,
    fontWeight: '600', // Più bold
    letterSpacing: '0.5px',
    border: 'none',
    borderRadius: '30px', // Pill shape
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease', // Transizione più completa
    marginTop: '1rem',
    boxShadow: `0 6px 12px ${themeColors.primary}50`, // Ombra più pronunciata
    textTransform: 'uppercase', // Testo in maiuscolo
  },
  buttonHover: { // Stile per l'hover del bottone principale
    opacity: 0.9,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 15px ${themeColors.primary}70`,
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  previewContainer: {
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    border: `1px solid ${themeColors.inputBorder}`,
    borderRadius: '12px', // Angoli arrotondati
    overflow: 'hidden',
    padding: '0.5rem', // Piccolo padding interno
    backgroundColor: '#f9fafb',
  },
  previewImage: {
    width: '100%',
    maxHeight: '350px', // Anteprima leggermente più alta
    objectFit: 'contain',
    display: 'block',
    borderRadius: '8px', // Angoli arrotondati per l'immagine
  },
  backLink: {
    display: 'flex', // Per allineare icona e testo
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem',
    color: themeColors.lightText,
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  },
  backLinkHover: {
    color: themeColors.primary,
  },
  errorMessage: {
    color: themeColors.error,
    backgroundColor: `${themeColors.error}20`, // Sfondo errore più tenue
    padding: '1rem', // Più padding
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    border: `1px solid ${themeColors.error}50`,
  },
};

function CreatePost() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isDragOver, setIsDragOver] = useState(false); // Per stile drag-over
  const fileInputRef = useRef(null); // Ref per triggerare il click sull'input file

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
        setImage(file);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
        setError(''); // Resetta errore se c'era per il tipo file
    } else {
        setImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        if (file) { // Se un file è stato selezionato ma non è un'immagine
            setError("Formato file non supportato. Seleziona un'immagine (PNG, JPG, GIF).");
        }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError("Per favore, carica un'immagine per il tuo outfit.");
      return;
    }
    if (!description.trim()) {
        setError("Per favore, aggiungi una descrizione al tuo outfit.");
        return;
    }
    if (!token) {
      setError('Autenticazione richiesta. Effettua il login.');
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append('description', description);
    data.append('image', image);

    try {
      const res = await fetch('http://localhost:8000/posts/', { // Assicurati endpoint corretto
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' NON è necessario qui, il browser lo imposta con FormData
        },
        body: data,
      });

      if (res.ok) {
        alert('Post caricato con successo!');
        navigate('/'); // Reindirizza alla home (o alla pagina del feed)
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Errore sconosciuto. Riprova.' }));
        console.error('Errore dal server:', errorData);
        if (res.status === 401 || res.status === 403) {
          setError(`Autorizzazione fallita: ${errorData.detail || 'Non autorizzato.'} Potrebbe essere necessario effettuare nuovamente il login.`);
        } else {
          setError(`Errore nel caricamento: ${errorData.detail || res.statusText}`);
        }
      }
    } catch (err) {
      console.error('Errore di rete o server:', err);
      setError('Errore di connessione. Controlla la tua rete e riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stili dinamici per hover
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isBackLinkHovered, setIsBackLinkHovered] = useState(false);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Condividi il Tuo Stile</h1>
        <p style={styles.subtitle}>Carica una foto del tuo outfit e ispira la community!</p>

        {error && <p style={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.inputGroup}>
            <label htmlFor="image" style={styles.label}>Immagine dell'Outfit</label>
            <div
              style={{
                ...styles.fileInputWrapper,
                ...(isDragOver ? styles.fileInputWrapperHover : {}),
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver} // Per consistenza su alcuni browser
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg, image/gif"
                // required // La validazione la facciamo in handleSubmit
                onChange={handleImageChange}
                ref={fileInputRef}
                style={styles.hiddenInputFile}
              />
              <FaUpload style={styles.fileInputIcon} />
              <p style={styles.fileInputText}>
                {image ? image.name : "Trascina un'immagine qui o clicca per selezionare"}
              </p>
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
            <textarea
              id="description"
              name="description"
              placeholder="Descrivi il tuo look, i brand, l'ispirazione..."
              // required // Validazione in handleSubmit
              value={description}
              onChange={handleDescriptionChange}
              style={{ ...styles.input, ...styles.textarea, '::placeholder': styles.input['::placeholder'] }}
              rows="5"
            />
          </div>

          <button
            type="submit"
            style={isLoading
                ? { ...styles.button, ...styles.buttonLoading }
                : isButtonHovered ? {...styles.button, ...styles.buttonHover} : styles.button
            }
            disabled={isLoading}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {isLoading ? 'Pubblicazione...' : 'Pubblica Outfit'}
          </button>
        </form>
        <a
          href="/" // href corretto
          style={isBackLinkHovered ? {...styles.backLink, ...styles.backLinkHover} : styles.backLink}
          onClick={(e) => {
            e.preventDefault();
            navigate('/'); // Naviga a '/' (home)
          }}
          onMouseEnter={() => setIsBackLinkHovered(true)}
          onMouseLeave={() => setIsBackLinkHovered(false)}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Torna alla Home
        </a>
      </div>
    </div>
  );
}

export default CreatePost;