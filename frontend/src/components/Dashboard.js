// src/Dashboard.js
import React from 'react';
import NavbarApp from './NavbarApp';
import CarouselOutfit from './CarouselOutfit';
import DashboardStats from './DashboardStats'; // Questo può rimanere in un container
import PhotoGrid from './PhotoGrid';
import Footer from './Footer';

function Dashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarApp />
      <main className="flex-grow-1">
        {/* CarouselOutfit full-width */}
        <CarouselOutfit />

        {/* DashboardStats può rimanere dentro un container per avere margini */}
        <div className="container py-4"> {/* Padding per DashboardStats */}
          <DashboardStats />
        </div>

        {/* La sezione del feed ORA È FULL-WIDTH */}
        {/* Applichiamo py-4 direttamente alla section per lo spazio verticale */}
        {/* L'ID è qui per lo scroll */}
        <section id="feed-section" className="py-4">
          {/* PhotoGrid ora gestirà il suo layout interno, potenzialmente usando container-fluid o padding diretti */}
          {/* Il titolo della sezione può essere spostato dentro PhotoGrid o rimosso se PhotoGrid ne ha uno suo */}
          <PhotoGrid />
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;