import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
// Rimuovi Payments e Shipping se sono i vecchi componenti singoli e userai CheckoutProcess
// import Payments from './components/Payments';
// import Shipping from './components/Shipping';
import CreatePost from './components/CreatePost.js';
import DashboardPage from './components/Dashboard';
import CheckoutProcess from './components/Checkout/CheckoutProcess'; // <-- IMPORTA IL TUO NUOVO COMPONENTE CHECKOUT

function App() {
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;

  // NOTA: L'alert dentro il JSX della rotta "/" è un side-effect.
  // Sarebbe meglio gestirlo in un useEffect nel DashboardPage o dopo il login.
  // Per ora lo lascio come da tuo codice originale per non stravolgere troppo.
  // if (isAuthenticated && window.location.pathname === '/' && !sessionStorage.getItem('welcomeAlertShown')) {
  //   alert('Accesso effettuato!');
  //   sessionStorage.setItem('welcomeAlertShown', 'true'); // Per mostrarlo solo una volta per sessione
  // }


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ROTTA PER IL CHECKOUT (PROTETTA) */}
        <Route
          path="/checkout"
          element={
            isAuthenticated ? (
              <CheckoutProcess />
            ) : (
              <Navigate to="/login?redirect=/checkout" replace /> // Opzionale: reindirizza dopo il login
            )
          }
        />

       

      </Routes>
    </Router>
  );
}

export default App;