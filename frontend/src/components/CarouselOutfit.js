// src/components/CarouselOutfit.js
import React, { useState } from 'react';
import { Carousel, Button, CarouselItem, CarouselCaption } from 'react-bootstrap';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaMagic, FaStream, FaPlusCircle } from 'react-icons/fa';
import CreatePost from './CreatePost'; // Assicurati che questo sia il CreatePost.js aggiornato con il campo prezzo

const themeColors = {
  primary: '#d9a86c',
  primaryDarker: '#b08d57',
  secondary: '#f0e9e0',
  surface: '#ffffff',
};

const slidesData = [
  {
    id: 'ai-slide',
    src: "https://cdn.shopify.com/s/files/1/0577/2515/7538/files/look_7.jpg?v=1689157238",
    alt: 'Intelligenza Artificiale e Innovazione nella Moda',
    title: 'Il Futuro dello Stile è AI',
    description: 'Sperimenta outfit generati dall\'AI e consigli di stile, su misura per te.',
    buttonText: 'Inizia con l\'AI',
    buttonIcon: <FaMagic size="1em" className="me-2" />,
    action: 'navigate',
    target: '/landingPage',
    objectPosition: 'center 35%',
    buttonStyleKey: 'defaultButton',
  },
  {
    id: 'feed-slide',
    src: 'https://cdn.shopify.com/s/files/1/0577/2515/7538/t/3/assets/img_2075-1666011104627.jpg?v=1666011138',
    alt: 'Feed di ispirazioni di moda',
    title: 'Un Mondo di Ispirazione',
    description: 'Immergiti nel feed: outfit, tendenze e la creatività della nostra community.',
    buttonText: 'Esplora il Feed',
    buttonIcon: <FaStream size="1em" className="me-2" />,
    action: 'scroll',
    target: 'feed-section',
    objectPosition: 'center 44%',
    buttonStyleKey: 'defaultButton',
  },
  {
    id: 'create-post-slide',
    src: 'https://cdn.shopify.com/s/files/1/0577/2515/7538/t/3/assets/facetune_08122022025329-1670881657612.JPG?v=1670881666',
    alt: 'Crea e condividi il tuo outfit',
    title: 'Mostra il Tuo Stile Unico',
    description: 'Crea post, condividi i tuoi look e diventa una fonte d\'ispirazione.',
    buttonText: '+ Pubblica Outfit',
    buttonIcon: <FaPlusCircle size="1em" className="me-2" />,
    action: 'modal',
    target: 'createPost',
    objectPosition: 'center 49%', // MODIFICATO per spostare l'immagine un po' in su
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
      }
    } else if (action === 'navigate') {
      // Considera di usare useNavigate da react-router-dom se il tuo progetto lo utilizza
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
        indicators={true}
      >
        {slidesData.map((slide) => {
          const currentButtonStyles = buttonStyles[slide.buttonStyleKey] || buttonStyles.defaultButton;
          return (
            <CarouselItem
              key={slide.id}
              style={{
                minHeight: '500px',
                height: '75vh',
                maxHeight: '850px',
                backgroundColor: '#777' // Fallback background se l'immagine non carica
              }}
            >
              <img
                className="d-block w-100 h-100"
                src={slide.src}
                alt={slide.alt}
                style={{ objectFit: 'cover', objectPosition: slide.objectPosition || 'center center' }}
                onError={(e) => {
                  console.error(`Errore caricamento immagine per slide "${slide.alt}": ${e.target.src}`);
                  // Log 추가: 어떤 이미지가 로드되지 않았는지, 어떤 에러가 발생했는지 확인 (Commento originale dell'utente mantenuto)
                  console.log('Errore target:', e.target);
                  console.log('Errore evento:', e);
                  e.target.style.display = 'none'; // Nasconde l'immagine rotta
                  const parentItem = e.target.closest('.carousel-item');
                  if (parentItem) {
                    parentItem.style.backgroundColor = '#DDD'; // Sfondo di fallback più scuro
                    // Fallback text if image fails
                    const fallbackText = document.createElement('p');
                    fallbackText.innerText = `Impossibile caricare: ${slide.alt}`;
                    fallbackText.style.position = 'absolute';
                    fallbackText.style.top = '50%';
                    fallbackText.style.left = '50%';
                    fallbackText.style.transform = 'translate(-50%, -50%)';
                    fallbackText.style.color = '#333';
                    fallbackText.style.textAlign = 'center';
                    fallbackText.style.padding = '20px';
                    fallbackText.style.fontFamily = "'Poppins', sans-serif"; // Aggiunto font per coerenza
                    parentItem.appendChild(fallbackText);
                  }
                }}
              />
              <CarouselCaption
                className="px-4 py-3"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.40)',
                  borderRadius: '0.375rem',
                  bottom: 'clamp(1rem, 5vh, 2.5rem)',
                  left: '5%',
                  right: '5%',
                  textAlign: 'center',
                }}
              >
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.7rem, 4.5vw, 2.7rem)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="d-none d-md-block mb-3"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
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
                      className="mt-1"
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
            padding: '20px',
          }}
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="custom-modal-content-scroll" // Per eventuale CSS custom della scrollbar
            style={{
              backgroundColor: 'transparent', // CreatePost gestisce il suo sfondo
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
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