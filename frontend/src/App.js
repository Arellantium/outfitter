import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import CreatePost from './components/CreatePost.js';
import DashboardPage from './components/Dashboard';
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
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/checkout"
          element={isAuthenticated ? <CheckoutProcess /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-post"
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
