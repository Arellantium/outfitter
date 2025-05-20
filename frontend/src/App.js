import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Payments from './components/Payments'; 
import Shipping from './components/Shipping';
import CreatePost from './components/CreatePost.js';
import DashboardPage from './components/Dashboard'; 
import ChatPage from './components/ChatPage.js';
import LandingPage from './components/LandingPage.js';
import CheckoutProcess from './components/CheckoutProcess.js';
import ProfilePage from './components/ProfiloPage.js';

function App() {
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              alert('Accesso effettuato!'),
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chatPage" element={<ChatPage />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/checkout" element={<CheckoutProcess />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
