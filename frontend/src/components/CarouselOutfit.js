// src/components/CarouselOutfit.js
import React, { useState } from 'react';
import { Carousel, Button, CarouselItem, CarouselCaption } from 'react-bootstrap';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaMagic, FaStream, FaPlusCircle } from 'react-icons/fa';
import CreatePost from './CreatePost'; // Assicurati che questo sia il CreatePost.js aggiornato con il campo prezzo

// Definizione di themeColors usata in CreatePost, potrebbe essere utile per lo sfondo del modale
// Se non è già centralizzata, potresti volerla mettere in un file separato e importarla
const themeColors = {
  primary: '#d9a86c',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0', // Sfondo pagina chiaro / beige (potrebbe essere lo sfondo del contenitore del modale)
  surface: '#ffffff', // Sfondo dei form/card (usato da CreatePost internamente)
  // ...altri colori se necessari
};

const slidesData = [
  {
    id: 'ai-slide',
    src: "https://cdn.shopify.com/s/files/1/0577/2515/7538/files/1.png?v=1720522011",
    alt: 'Intelligenza Artificiale e Innovazione nella Moda',
    title: 'Il Futuro dello Stile è AI',
    description: 'Sperimenta outfit generati dall\'AI e consigli di stile, su misura per te.',
    buttonText: 'Inizia con l\'AI',
    buttonIcon: <FaMagic size="1em" className="me-2" />,
    action: 'navigate',
    target: '/landingPage',
    objectPosition: 'center 40%',
    buttonStyleKey: 'defaultButton',
  },
  {
    id: 'feed-slide',
    src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1920&auto=format&fit=crop',
    alt: 'Feed di ispirazioni di moda',
    title: 'Un Mondo di Ispirazione',
    description: 'Immergiti nel feed: outfit, tendenze e la creatività della nostra community.',
    buttonText: 'Esplora il Feed',
    buttonIcon: <FaStream size="1em" className="me-2" />,
    action: 'scroll',
    target: 'feed-section',
    objectPosition: 'center center',
    buttonStyleKey: 'defaultButton',
  },
  {
    id: 'create-post-slide',
    src: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1920&auto=format&fit=crop',
    alt: 'Crea e condividi il tuo outfit',
    title: 'Mostra il Tuo Stile Unico',
    description: 'Crea post, condividi i tuoi look e diventa una fonte d\'ispirazione.',
    buttonText: '+ Pubblica Outfit',
    buttonIcon: <FaPlusCircle size="1em" className="me-2" />,
    action: 'modal',
    target: 'createPost', // Questo identifica l'azione del modale
    objectPosition: 'center 30%',
    buttonStyleKey: 'defaultButton',
  }
];

const buttonStyles = {
  defaultButton: {
    base: {
      fontWeight: 500,
      borderRadius: '25px',
      padding: '0.7rem 1.6rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      color: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      transition: 'all 0.2s ease-in-out',
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      borderColor: 'rgba(255, 255, 255, 1)',
      color: '#FFFFFF',
    }
  }
  // aiButton: { ... } // Se hai altri stili di bottone
};

const CarouselOutfit = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAction = (action, target) => {
    if (action === 'scroll') {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`[CarouselOutfit] Elemento con ID '${target}' non trovato.`);
        // Potresti voler navigare a '/' o a una pagina di errore se l'elemento non è trovato
        // navigate('/'); // Se usi useNavigate da react-router-dom
      }
    } else if (action === 'navigate') {
      // È preferibile usare useNavigate per la navigazione interna all'app React
      // window.location.href = target; // Questo causa un full page reload
      // Se hai react-router-dom configurato, dovresti importare useNavigate:
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate();
      // navigate(target);
      // Per ora, lascio window.location.href come nel tuo codice originale, ma considera di cambiarlo.
      window.location.href = target;
    } else if (action === 'modal' && target === 'createPost') {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="carousel-outfit-component-wrapper">
      <Carousel
        interval={4500}
        pause="hover"
        prevIcon={<FaArrowAltCircleLeft size={35} style={{ color: 'rgba(255, 255, 255, 0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }} />}
        nextIcon={<FaArrowAltCircleRight size={35} style={{ color: 'rgba(255, 255, 255, 0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }} />}
        fade
        indicators={true} // Assicurati che sia 'true' e non solo 'indicators'
      >
        {slidesData.map((slide) => {
          const currentButtonStyles = buttonStyles[slide.buttonStyleKey] || buttonStyles.defaultButton;
          return (
            <CarouselItem key={slide.id} style={{ minHeight: '420px', height: '65vh', maxHeight: '700px', backgroundColor: '#777' }}>
              <img
                className="d-block w-100 h-100"
                src={slide.src}
                alt={slide.alt}
                style={{ objectFit: 'cover', objectPosition: slide.objectPosition || 'center center' }}
                onError={(e) => {
                  console.error(`Errore caricamento immagine per slide "${slide.alt}": ${e.target.src}`);
                  e.target.style.display = 'none'; // Nasconde l'immagine rotta
                  const parentItem = e.target.closest('.carousel-item');
                  if (parentItem) {
                    parentItem.style.backgroundColor = '#DDD'; // Sfondo di fallback
                  }
                }}
              />
              <CarouselCaption
                className="px-4 py-3" // Bootstrap class per padding
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.40)',
                  borderRadius: '0.375rem', // Bootstrap default per sm rounded corners
                  bottom: 'clamp(1rem, 5vh, 2.5rem)', // Responsive bottom positioning
                  left: '5%', // Padding laterale per la caption
                  right: '5%',
                  textAlign: 'center',
                }}
              >
                <div style={{ maxWidth: '700px', margin: '0 auto' }}> {/* Contenitore per centrare e limitare la larghezza del testo */}
                  <h2
                    className="mb-2" // Bootstrap class per margin-bottom
                    style={{
                      fontFamily: "'Playfair Display', serif", // Consigliato per titoli eleganti
                      fontSize: 'clamp(1.7rem, 4.5vw, 2.7rem)', // Responsive font size
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="d-none d-md-block mb-3" // Nasconde su schermi piccoli, margin-bottom
                    style={{
                      fontFamily: "'Poppins', sans-serif", // Consigliato per testo leggibile
                      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', // Responsive font size
                      color: 'rgba(250, 250, 250, 0.95)',
                      lineHeight: 1.55,
                      textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                    }}
                  >
                    {slide.description}
                  </p>
                  {slide.buttonText && (
                    <Button
                      onClick={() => handleAction(slide.action, slide.target)}
                      className="mt-1" // Bootstrap class per margin-top
                      style={currentButtonStyles.base}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, currentButtonStyles.hover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, currentButtonStyles.base)}
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

      {/* MODALE PER CREATE POST */}
      {showModal && (
        <div // Questo è l'OVERLAY
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)', // Sfondo scuro semitrasparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050, // Assicura che sia sopra gli altri contenuti (Bootstrap usa 1040-1050 per modali)
            padding: '20px', // Aggiunge un po' di spazio dai bordi dello schermo per il box del modale
          }}
          onClick={handleCloseModal} // Chiude il modale se si clicca sull'overlay
        >
          <div // Questo è il CONTENITORE DEL MODALE effettivo (per forma, ombra e scroll)
            onClick={(e) => e.stopPropagation()} // Impedisce la chiusura se si clicca dentro il contenuto del modale
            className="custom-modal-content-scroll" // Classe per eventuale stilizzazione della scrollbar (vedi CSS)
            style={{
              backgroundColor: 'transparent', // Lascia che CreatePost gestisca il suo sfondo bianco interno
                                              // Se vuoi uno sfondo diverso per il "frame" del modale, usa es. themeColors.secondary
              borderRadius: '20px', // Angoli arrotondati per il box del modale
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)', // Ombra per dare profondità
              width: '100%', // Occupa la larghezza disponibile (limitata da maxWidth)
              maxWidth: '650px', // Larghezza massima del box del modale
              maxHeight: '90vh', // Altezza massima, se il contenuto è più lungo, appare la scrollbar
              overflowY: 'auto', // Mostra la scrollbar verticale solo se necessario
              // NESSUN PADDING QUI: CreatePost.js gestisce il suo padding interno.
              // Questo evita doppi padding e potenziali problemi di allineamento.
            }}
          >
            <CreatePost isModal={true} onCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselOutfit;