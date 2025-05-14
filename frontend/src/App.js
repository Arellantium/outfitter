import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import Home from './components/Home';
import Payments from './components/Payments'; 
import Shipping from './components/Shipping';
import CreatePost from './components/CreatePost.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createPost" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;
