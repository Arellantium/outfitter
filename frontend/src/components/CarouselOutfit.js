// src/components/CarouselOutfit.js
import React from 'react';
import { Carousel, Button, CarouselItem, CarouselCaption } from 'react-bootstrap'; 
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaMagic, FaStream, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const slidesData = [
  {
    id: 'ai-slide',
    src: "https://cdn.shopify.com/s/files/1/0577/2515/7538/files/1.png?v=1720522011",
    alt: 'Intelligenza Artificiale e Innovazione nella Moda',
    title: 'Il Futuro dello Stile è AI',
    description: 'Sperimenta outfit generati dall\'AI e consigli di stile avveniristici, su misura per te.',
    buttonText: 'Inizia con l\'AI',
    buttonIcon: <FaMagic size="1em" className="me-2" />,
    link: '/landingPage', 
    objectPosition: 'center center',
    // Aggiungiamo uno stile specifico per questo bottone
    buttonStyleKey: 'aiButton', // Chiave per selezionare uno stile specifico
  },
  {
    id: 'feed-slide',
    src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Feed di ispirazioni di moda',
    title: 'Un Mondo di Ispirazione',
    description: 'Immergiti nel feed: outfit, tendenze e la creatività della nostra community.',
    buttonText: 'Esplora il Feed',
    buttonIcon: <FaStream size="1em" className="me-2" />,
    link: '#feed-section',
    objectPosition: 'center center',
    buttonStyleKey: 'defaultButton', // Stile di default per gli altri bottoni
  },
  {
    id: 'create-post-slide',
    src: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    alt: 'Crea e condividi il tuo outfit',
    title: 'Mostra il Tuo Stile Unico',
    description: 'Crea post, condividi i tuoi look e diventa una fonte d\'ispirazione.',
    buttonText: '+ Pubblica Outfit',
    buttonIcon: <FaPlusCircle size="1em" className="me-2" />,
    link: '/create-post', 
    objectPosition: 'center 30%', 
    buttonStyleKey: 'defaultButton',
  }
];

// Definiamo gli stili dei bottoni qui per una facile gestione
const buttonStyles = {
  defaultButton: {
    base: {
      fontWeight: 500, 
      borderRadius: '25px',
      padding: '0.7rem 1.6rem', // Leggermente più padding
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: '1px solid rgba(255, 255, 255, 0.7)', // Bordo bianco semitrasparente
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Sfondo molto trasparente
      color: 'rgba(255, 255, 255, 0.9)', // Testo bianco semitrasparente
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      transition: 'all 0.2s ease-in-out',
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.9)',
      color: '#FFFFFF',
    }
  },
  aiButton: { // Stile specifico per il bottone AI - più prominente
    base: {
      fontWeight: '600', 
      borderRadius: '30px',
      padding: '0.8rem 2rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      // Esempio con un colore oro/bronzo (assicurati che queste variabili siano nel tuo CSS globale o sostituisci con esadecimali)
      backgroundColor: 'var(--lp-accent-primary, #CAA870)', // Fallback a un colore esadecimale
      color: 'var(--lp-text-on-accent, white)', 
      border: 'none', // Nessun bordo se lo sfondo è solido
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      transition: 'all 0.2s ease-in-out',
    },
    hover: {
      transform: 'translateY(-3px) scale(1.03)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
      backgroundColor: 'var(--lp-accent-primary-darker, #B08D57)',
    }
  }
  // Puoi aggiungere altre opzioni di stile qui:
  // ghostButton: { base: {...}, hover: {...} }
};


const CarouselOutfit = () => {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    // ... (logica di navigazione come prima)
    if (!link) return;
    if (link.startsWith('#')) {
      const elementId = link.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`[CarouselOutfit] Elemento con ID '${elementId}' non trovato.`);
        navigate('/'); 
      }
    } else {
      navigate(link);
    }
  };

  return (
    <div className="container-lg py-4 px-md-0">
      <Carousel
        interval={4500}
        pause="hover"
        prevIcon={<FaArrowAltCircleLeft size={35} style={{ color: 'rgba(255, 255, 255, 0.85)', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }} />}
        nextIcon={<FaArrowAltCircleRight size={35} style={{ color: 'rgba(255, 255, 255, 0.85)', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }} />}
        fade 
        indicators={true}
        className="shadow-lg rounded overflow-hidden"
      >
        {slidesData.map((slide) => {
          // Seleziona lo stile del bottone in base alla chiave o usa il default
          const selectedButtonStyle = buttonStyles[slide.buttonStyleKey]?.base || buttonStyles.defaultButton.base;
          const selectedButtonHoverStyle = buttonStyles[slide.buttonStyleKey]?.hover || buttonStyles.defaultButton.hover;

          return (
            <CarouselItem 
              key={slide.id} 
              style={{ 
                minHeight: '420px',
                height: '65vh',     
                maxHeight: '600px',
                backgroundColor: '#777' 
              }}
            >
              <img
                className="d-block w-100 h-100"
                src={slide.src}
                alt={slide.alt}
                style={{ 
                  objectFit: 'cover',   
                  objectPosition: slide.objectPosition || 'center center',
                }}
                onError={(e) => {
                  console.error(`Errore caricamento immagine per slide "${slide.alt}": ${e.target.src}`);
                  e.target.style.display = 'none';
                  const parentItem = e.target.closest('.carousel-item');
                  if (parentItem) {
                    parentItem.style.backgroundColor = '#DDD'; // Sfondo grigio se immagine non carica
                    // Potresti aggiungere un testo di errore qui se vuoi, ma potrebbe essere complicato da stilizzare dinamicamente
                  }
                }}
              />
              <CarouselCaption 
                className="px-4 py-3" 
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.50)', 
                  borderRadius: '0.375rem', 
                  bottom: '2rem', 
                  left: '5%', 
                  right: '5%',
                  textAlign: 'center'
                }}
              >
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                  <h2
                    className="mb-2" 
                    style={{
                      fontFamily: "'Playfair Display', serif", 
                      fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', 
                      fontWeight: 700, 
                      color: '#FFFFFF',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p 
                    className="d-none d-md-block mb-3"
                    style={{
                      fontFamily: "'Poppins', sans-serif", 
                      fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
                      color: 'rgba(250, 250, 250, 0.9)', 
                      lineHeight: 1.5,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
                    }}
                  >
                    {slide.description}
                  </p>
                  {slide.buttonText && slide.link && (
                    <Button 
                      onClick={() => handleNavigate(slide.link)}
                      className="mt-1" // Rimosso variant per controllo completo con style
                      style={selectedButtonStyle} // Applica lo stile scelto
                      onMouseEnter={(e) => { Object.assign(e.currentTarget.style, selectedButtonHoverStyle); }}
                      onMouseLeave={(e) => { Object.assign(e.currentTarget.style, selectedButtonStyle); }}
                    >
                      {slide.buttonIcon}
                      {slide.buttonText}
                    </Button>
                  )}
                </div>
              </CarouselCaption>
            </CarouselItem>
          );
        })}
      </Carousel>
    </div>
  );
};

export default CarouselOutfit;