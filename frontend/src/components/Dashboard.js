import React from 'react';
import NavbarApp from './NavbarApp';
import CarouselOutfit from './CarouselOutfit';
import DashboardStats from './DashboardStats';
import PhotoGrid from './PhotoGrid';
import Footer from './Footer';

function Dashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarApp />
      <main className="flex-grow-1">
        <CarouselOutfit />
        <DashboardStats />
        <PhotoGrid /> {/* Gestisce tutto il fetch e scroll */}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;