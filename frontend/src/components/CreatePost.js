import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError("Per favore, seleziona un'immagine.");
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
      const res = await fetch('http://localhost:8000/posts/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert('Post caricato con successo!');
        navigate('/home');
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Errore sconosciuto durante il caricamento.' }));
        console.error('Errore dal server:', errorData);
        if (res.status === 401 || res.status === 403) {
          setError(`Errore di autorizzazione: ${errorData.detail || 'Non autorizzato.'} Effettua nuovamente il login.`);
        } else {
          setError(`Errore durante il caricamento: ${errorData.detail || res.statusText}`);
        }
      }
    } catch (err) {
      console.error('Errore di rete:', err);
      setError('Errore di rete o server non raggiungibile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Crea un Nuovo Post</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.inputGroup}>
            <label htmlFor="description" style={styles.label}>Descrizione Outfit</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descrivi il tuo outfit, i capi, l'occasione..."
              required
              value={description}
              onChange={handleDescriptionChange}
              style={{ ...styles.input, ...styles.textarea }}
              rows="4"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="image" style={styles.label}>Immagine dell'Outfit</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg, image/gif"
              required
              onChange={handleImageChange}
              style={styles.inputFile}
            />
          </div>

          {previewUrl && (
            <div style={styles.previewContainer}>
              <img src={previewUrl} alt="Anteprima" style={styles.previewImage} />
            </div>
          )}

          <button
            type="submit"
            style={isLoading ? { ...styles.button, ...styles.buttonLoading } : styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Caricamento...' : 'Pubblica Post'}
          </button>
        </form>
        <a
          href="/home"
          style={styles.backLink}
          onClick={(e) => {
            e.preventDefault();
            navigate('/home');
          }}
        >
          ← Torna alla Home
        </a>
      </div>
    </div>
  );
}

const themeColors = {
  primary: '#d9a86c',
  secondary: '#ffdbb3',
  text: '#333',
  lightText: '#555',
  background: '#f0e9e0',
  surface: '#fff',
  error: '#d32f2f',
  success: '#388e3c',
  disabled: '#ccc',
};

const styles = {
  body: {
    margin: 0,
    padding: '2rem 1rem',
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: themeColors.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
  },
  container: {
    backgroundColor: themeColors.surface,
    padding: '2rem 2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    maxWidth: '550px',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: themeColors.primary,
    fontWeight: 600,
    fontSize: '1.8rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: themeColors.text,
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: `1px solid ${themeColors.disabled}`,
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#fff',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
  },
  inputFile: {
    width: '100%',
    padding: '0.8rem',
    border: `1px dashed ${themeColors.disabled}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: '1rem',
    background: `linear-gradient(to right, ${themeColors.secondary}, ${themeColors.primary})`,
    color: themeColors.text,
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    marginTop: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  previewContainer: {
    marginTop: '1rem',
    marginBottom: '1.5rem',
    border: `1px solid ${themeColors.disabled}`,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '8px',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.5rem',
    color: themeColors.lightText,
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  errorMessage: {
    color: themeColors.error,
    backgroundColor: `${themeColors.error}20`,
    padding: '0.8rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
};

export default CreatePost;
