import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import { ToastContainer } from './components/ui/Toast';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <ToastContainer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;