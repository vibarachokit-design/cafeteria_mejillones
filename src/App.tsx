import { useEffect, useMemo } from 'react';
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

type ViewMode = 'customer' | 'staff';

function App() {
  const viewMode = useMemo<ViewMode>(() => {
    if (typeof window === 'undefined') return 'customer';

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('vista')?.toLowerCase();

    if (mode === 'garzona' || mode === 'staff' || mode === 'operacion') {
      return 'staff';
    }

    return 'customer';
  }, []);

  useEffect(() => {
    document.title = 'Espacio Kihnally - Donde el Norte se siente';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;

    const timeoutId = window.setTimeout(() => {
      const menuSection = document.getElementById('menu');
      menuSection?.scrollIntoView({ block: 'start' });
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [viewMode]);

  return (
    <MenuProvider>
      <CartProvider>
        <div className="min-h-screen bg-ocean-50/30">
          <Navbar mode={viewMode} />
          <main>
            <Hero mode={viewMode} />
            <Menu mode={viewMode} />
            {viewMode === 'customer' ? (
              <>
                <About />
                <Gallery />
                <Contact />
              </>
            ) : null}
          </main>
          <Footer mode={viewMode} />
          {viewMode === 'staff' ? (
            <>
              <CartDrawer />
              <AdminPanel />
            </>
          ) : null}
          <Toaster position="top-center" richColors />
        </div>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;
