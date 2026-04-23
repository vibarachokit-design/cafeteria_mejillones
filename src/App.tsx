import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Menu from './sections/Menu';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import CartDrawer from './sections/CartDrawer';

function App() {
  useEffect(() => {
    document.title = 'Espacio Kihnally - Donde el Norte se siente';
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-ocean-50/30">
        <Navbar />
        <main>
          <Hero />
          <Menu />
          <About />
          <Gallery />
          <Contact />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </div>
    </CartProvider>
  );
}

export default App;
