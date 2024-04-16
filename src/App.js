import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/products" /> : <Login onLogin={handleLogin} />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/products" /> : <Login onLogin={handleLogin} />} />
          <Route path="/products" element={isLoggedIn ? <Products onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={isLoggedIn ? <ProductDetail /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
