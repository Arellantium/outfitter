import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Payments from './components/Payments'; 
import Shipping from './components/Shipping';
import CreatePost from './components/CreatePost.js';
import DashboardPage from './components/Dashboard'; 
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
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
