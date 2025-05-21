// src/components/CarouselOutfit.js
import React from 'react'; // Rimosso useState se non lo stiamo usando per l'hover
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
    objectPosition: 'center 40%', // Mantenuta la tua preferenza
    buttonStyleKey: 'aiButton',
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
    buttonStyleKey: 'defaultButton',
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

const buttonStyles = {
  defaultButton: {
    base: {
      fontWeight: 500,
      borderRadius: '25px',
      padding: '0.7rem 1.6rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: '1px solid rgba(255, 255, 255, 0.8)', // Leggermente meno trasparente
      backgroundColor: 'rgba(255, 255, 255, 0.18)', // Leggermente più opaco
      color: 'rgba(255, 255, 255, 0.95)', // Testo più opaco
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      transition: 'all 0.2s ease-in-out',
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      borderColor: 'rgba(255, 255, 255, 1)', // Bordo solido su hover
      color: '#FFFFFF',
    }
  },
  aiButton: {
    base: {
      fontWeight: '600',
      borderRadius: '30px',
      padding: '0.8rem 2rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      backgroundColor: 'var(--lp-accent-primary, #CAA870)',
      color: 'var(--lp-text-on-accent, white)',
      border: '1px solid var(--lp-accent-primary-darker, #B08D57)', // Bordo sottile per definizione
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      transition: 'all 0.2s ease-in-out',
    },
    hover: {
      transform: 'translateY(-3px) scale(1.03)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
      backgroundColor: 'var(--lp-accent-primary-darker, #B08D57)',
      borderColor: 'var(--lp-accent-primary-darker, #A07D47)', // Bordo più scuro su hover
    }
  }
};


const CarouselOutfit = () => {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
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
    // MODIFICA: Rimosso container-lg e px-md-0 dal wrapper per permettere al carosello di essere full-width.
    // Il 'py-4' è stato rimosso da qui ma puoi aggiungerlo se vuoi spazio sopra/sotto il carosello.
    // O, se preferisci, usa <div className="container-fluid"> per un carosello full-width ma con padding Bootstrap.
    <div className="carousel-outfit-component-wrapper"> {/* Wrapper opzionale, puoi rimuoverlo se non necessario */}
      <Carousel
        interval={4500}
        pause="hover"
        prevIcon={<FaArrowAltCircleLeft size={35} style={{ color: 'rgba(255, 255, 255, 0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }} />}
        nextIcon={<FaArrowAltCircleRight size={35} style={{ color: 'rgba(255, 255, 255, 0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }} />}
        fade
        indicators={true}
        // className="shadow-lg rounded overflow-hidden" // Rimosso per layout full-width
                                                       // Applica a CarouselItem se vuoi ombre/bordi per slide
      >
        {slidesData.map((slide) => {
          // Seleziona gli stili del bottone (base e hover)
          const currentButtonStyles = buttonStyles[slide.buttonStyleKey] || buttonStyles.defaultButton;

          return (
            <CarouselItem
              key={slide.id}
              style={{
                minHeight: '420px',
                height: '65vh',
                maxHeight: '700px', // Aumentata leggermente
                backgroundColor: '#777',
                // Esempio se vuoi angoli arrotondati e ombra per ogni slide:
                // borderRadius: '8px',
                // margin: '0 15px', // Se vuoi un po' di spazio tra le slide full-width
                // overflow: 'hidden', // Necessario con borderRadius sull'item
              }}
              // className="shadow-sm" // Puoi aggiungere una classe per l'ombra qui se desideri
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
                    parentItem.style.backgroundColor = '#DDD';
                  }
                }}
              />
              <CarouselCaption
                className="px-4 py-3" // Bootstrap padding classes
                style={{
                  // MODIFICA: Riquadro meno scuro
                  backgroundColor: 'rgba(0, 0, 0, 0.40)', // Era 0.50
                  borderRadius: '0.375rem', // Corrisponde a 'rounded' di Bootstrap
                  bottom: 'clamp(1rem, 5vh, 2.5rem)', // Posizionamento inferiore responsivo
                  left: '5%', // Margine dai lati
                  right: '5%', // Margine dai lati
                  textAlign: 'center',
                  // Non impostare maxWidth qui se left/right sono usati per il posizionamento,
                  // altrimenti il contenuto interno della caption (il div con maxWidth: 700px) lo gestisce.
                }}
              >
                <div style={{ maxWidth: '700px', margin: '0 auto' }}> {/* Contenitore interno per limitare larghezza testo */}
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.7rem, 4.5vw, 2.7rem)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textShadow: '1px 1px 5px rgba(0,0,0,0.8)' // Ombra testo leggermente più marcata
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="d-none d-md-block mb-3"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                      color: 'rgba(250, 250, 250, 0.95)', // Testo leggermente più visibile
                      lineHeight: 1.55,
                      textShadow: '1px 1px 3px rgba(0,0,0,0.7)' // Ombra testo leggermente più marcata
                    }}
                  >
                    {slide.description}
                  </p>
                  {slide.buttonText && slide.link && (
                    <Button
                      onClick={() => handleNavigate(slide.link)}
                      className="mt-1" // Margine superiore
                      style={currentButtonStyles.base} // Applica stile base
                      onMouseEnter={(e) => { Object.assign(e.currentTarget.style, currentButtonStyles.hover); }}
                      onMouseLeave={(e) => { Object.assign(e.currentTarget.style, currentButtonStyles.base); }}
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