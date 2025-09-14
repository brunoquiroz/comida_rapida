import React from 'react';
import Hero from '../components/public/Hero';
import Menu from '../components/public/Menu';
import FeaturedProduct from '../components/public/FeaturedProduct';
import About from '../components/public/About';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';
import WhatsAppButton from '../components/public/WhatsAppButton';
import CartDrawer from '../components/public/CartDrawer';

function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Menu />
      <FeaturedProduct />
      <About />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}

export default Home; 