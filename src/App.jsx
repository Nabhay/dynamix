import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GooeyNav from './components/GooeyNav';
import Home from './pages';
import About from './pages/About';
import Contact from './pages/Contact';
import Marketplace from './pages/Marketplace';
import Auth from './pages/Auth';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
        radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
        radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
        linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
      `
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 100 }}>
        <GooeyNav
          items={navItems}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/testimonials" element={<Testimonials />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
