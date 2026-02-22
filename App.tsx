
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Story from './pages/Story';
import VisitStore from './pages/VisitStore';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ExperiencePage from './pages/ExperiencePage';
import Contact from './pages/Contact';
import TestAPI from './pages/TestAPI';
import OrderTracking from './pages/OrderTracking';

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/story" element={<Story />} />
              <Route path="/visit" element={<VisitStore />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/my-orders" element={<OrderTracking />} />
              <Route path="/test-api" element={<TestAPI />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
