import React, { useState } from 'react';
import NavbarApp from './NavbarApp';
import CarouselOutfit from './CarouselOutfit';
import DashboardStats from './DashboardStats';
import PhotoGrid from './PhotoGrid';
import Footer from './Footer';
import AiChatPopup from './AiChatPopup';
import { BsChatDotsFill } from 'react-icons/bs'; // Importa un'icona di chat

function Dashboard() {
  const [isAiChatVisible, setIsAiChatVisible] = useState(false);

  const handleShowAiChat = () => setIsAiChatVisible(true);
  const handleCloseAiChat = () => setIsAiChatVisible(false);

  // Stili per il bottone fluttuante (FAB)
  const fabStyle = {
    position: 'fixed',
    bottom: '25px', // Un po' sopra il footer o dove preferisci
    right: '25px',
    backgroundColor: '#d9a86c', // Colore primario del tuo tema (da CarouselOutfit)
    color: 'white',
    border: 'none',
    borderRadius: '50%', // Per renderlo circolare
    width: '60px',       // Dimensioni del cerchio
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    cursor: 'pointer',
    zIndex: 1030, // Assicurati che sia sopra la maggior parte del contenuto, ma sotto il popup
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  // Stili per l'hover del FAB (opzionale, per un piccolo effetto)
  const fabHoverStyle = {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarApp />
      <main className="flex-grow-1">
        <CarouselOutfit onShowAiChat={handleShowAiChat} />

        <div className="container py-4">
          <DashboardStats />
        </div>

        <section id="feed-section" className="py-4">
          <PhotoGrid />
        </section>
      </main>
      <Footer />

      {/* Bottone fluttuante per la chat AI */}
      {/* Mostra il bottone solo se la chat AI NON è visibile */}
      {!isAiChatVisible && (
        <button
          onClick={handleShowAiChat}
          style={fabStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, fabStyle, fabHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, fabStyle)}
          aria-label="Apri chat AI" // Per accessibilità
          title="Apri chat AI"      // Tooltip al passaggio del mouse
        >
          <BsChatDotsFill size={28} /> {/* Usa l'icona importata */}
        </button>
      )}

      {/* Popup della Chat AI */}
      {isAiChatVisible && <AiChatPopup onClose={handleCloseAiChat} />}
    </div>
  );
}

export default Dashboard;