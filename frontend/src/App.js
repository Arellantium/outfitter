import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
// import Payments from './components/Payments'; // Commentato se non usato direttamente come route
// import Shipping from './components/Shipping'; // Commentato se non usato direttamente come route
import CreatePost from './components/CreatePost.js'; // Assicurati che il percorso sia corretto e che il componente esista
import DashboardPage from './components/Dashboard'; 
import ChatPage from './components/ChatPage.js';
import LandingPage from './components/LandingPage.js';
import CheckoutProcess from './components/CheckoutProcess.js';
import ProfilePage from './components/ProfiloPage.js'; // Nota: "ProfiloPage" con la 'o' maiuscola

function App() {
  // Verifica l'autenticazione in modo semplice (potrebbe essere più complesso in un'app reale)
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token; // Converte in booleano: true se token esiste, false altrimenti

  return (
    <Router>
      <Routes>
        {/* Route principale: Dashboard se autenticato, altrimenti reindirizza a Login */}
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

        {/* Route protette: accessibili solo se autenticato */}
        <Route 
          path="/chatPage" 
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/landingPage" // Anche la landing page AI potrebbe richiedere autenticazione
          element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/checkout" 
          element={isAuthenticated ? <CheckoutProcess /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/create-post" // NUOVA ROUTE AGGIUNTA
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" replace />} 
        />

        {/* Potresti voler aggiungere una route catch-all per pagine non trovate (404) */}
        {/* Esempio: <Route path="*" element={<NotFoundPage />} /> */}
        
      </Routes>
    </Router>
  );
}

export default App;