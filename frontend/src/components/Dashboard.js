import React, { useState } from 'react';
import NavbarApp from './NavbarApp';
import CarouselOutfit from './CarouselOutfit';
import DashboardStats from './DashboardStats';
import PhotoGrid from './PhotoGrid';
import Footer from './Footer';
import AiChatPopup from './AiChatPopup';

function Dashboard() {
  const [isAiChatVisible, setIsAiChatVisible] = useState(false);

  const handleShowAiChat = () => setIsAiChatVisible(true);
  const handleCloseAiChat = () => setIsAiChatVisible(false);

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

      {isAiChatVisible && <AiChatPopup onClose={handleCloseAiChat} />}
    </div>
  );
}

export default Dashboard;
