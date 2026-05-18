import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import { MenuProvider } from '@/context/MenuContext';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Menu from './sections/Menu';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import CartDrawer from './sections/CartDrawer';
import AdminPanel from './sections/AdminPanel';

function App() {
  useEffect(() => {
    document.title = 'Espacio Kihnally - Donde el Norte se siente';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return;
    if (window.location.hash) return;

    const timeoutId = window.setTimeout(() => {
      const menuSection = document.getElementById('menu');
      menuSection?.scrollIntoView({ block: 'start' });
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <MenuProvider>
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
          <AdminPanel />
          <Toaster position="top-center" richColors />
        </div>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;
