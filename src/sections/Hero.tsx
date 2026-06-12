import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Clock,
  Home,
  MapPin,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

type HeroProps = {
  mode: 'customer' | 'staff';
};

const Hero = ({ mode }: HeroProps) => {
  const waveRef1 = useRef<SVGPathElement>(null);
  const waveRef2 = useRef<SVGPathElement>(null);
  const waveRef3 = useRef<SVGPathElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute;

      if (day === 2) {
        setIsOpen(false);
        return;
      }

      if (day === 0 || day === 5 || day === 6) {
        setIsOpen(currentTime >= 17 * 60 && currentTime <= 23 * 60 + 30);
        return;
      }

      setIsOpen(currentTime >= 17 * 60 && currentTime <= 23 * 60);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationId: number;
    let offset = 0;

    const animateWaves = () => {
      offset += 0.01;

      const generateWavePath = (
        amplitude: number,
        frequency: number,
        phase: number,
        yOffset: number
      ) => {
        let path = `M 0 ${yOffset}`;
        for (let x = 0; x <= 1440; x += 10) {
          const y = yOffset + Math.sin(x * frequency + offset + phase) * amplitude;
          path += ` L ${x} ${y}`;
        }
        path += ' L 1440 1080 L 0 1080 Z';
        return path;
      };

      if (waveRef1.current) {
        waveRef1.current.setAttribute('d', generateWavePath(20, 0.008, 0, 750));
      }
      if (waveRef2.current) {
        waveRef2.current.setAttribute('d', generateWavePath(25, 0.006, 1, 800));
      }
      if (waveRef3.current) {
        waveRef3.current.setAttribute('d', generateWavePath(30, 0.004, 2, 850));
      }

      animationId = requestAnimationFrame(animateWaves);
    };

    animateWaves();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const customerIntro = {
    eyebrow: 'Carta para explorar',
    slogan: 'Sabores del norte, sin apuro',
    description:
      'Revisa todos nuestros productos, descubre favoritos de la casa y elige con calma lo que vas a pedir.',
    primary: 'Explorar menú',
  };

  const staffIntro = {
    eyebrow: 'Modo operativo',
    slogan: 'Toma pedidos con rapidez',
    description:
      'Selecciona mesa, arma pedidos, mantenlos abiertos y envía la cuenta final sin perder el ritmo del servicio.',
    primary: 'Ir al menú operativo',
    secondary: 'Ver mi pedido',
  };

  const intro = mode === 'customer' ? customerIntro : staffIntro;

  return (
    <section id="inicio" className="relative min-h-[88vh] md:min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={asset('hero-cafe.jpg')}
          alt="Espacio Kihnally"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/60 via-ocean-800/40 to-ocean-900/70" />
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 180, 216, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 180, 216, 0.1)" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 180, 216, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 180, 216, 0.15)" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(10, 77, 104, 0.5)" />
            <stop offset="100%" stopColor="rgba(10, 77, 104, 0.2)" />
          </linearGradient>
        </defs>
        <path ref={waveRef1} fill="url(#waveGradient1)" />
        <path ref={waveRef2} fill="url(#waveGradient2)" />
        <path ref={waveRef3} fill="url(#waveGradient3)" />
      </svg>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-bubble"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-[88vh] md:min-h-screen flex flex-col justify-center items-center section-padding pt-20 pb-24 md:pb-0">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <img
              src={asset('logo-kihnally.png')}
              alt="Espacio Kihnally"
              className="h-20 sm:h-32 mx-auto drop-shadow-2xl"
            />
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full border mb-4 ${
              isOpen
                ? 'bg-green-500/20 border-green-400/30'
                : 'bg-red-500/20 border-red-400/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
            />
            <span className={`text-sm font-medium ${isOpen ? 'text-green-300' : 'text-red-300'}`}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-ocean-300" />
            <span className="text-white/90 text-sm font-medium">{intro.eyebrow}</span>
          </div>

          <p className="text-xl sm:text-3xl text-ocean-300 mb-4 md:mb-6 font-light tracking-wide">
            {intro.slogan}
          </p>

          <p className="text-base sm:text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            {intro.description}
          </p>

          <div className="hidden sm:flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Home className="w-4 h-4 text-ocean-300" />
              <span className="text-white/90 text-sm">En el local</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <ShoppingBag className="w-4 h-4 text-ocean-300" />
              <span className="text-white/90 text-sm">Para llevar</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Truck className="w-4 h-4 text-ocean-300" />
              <span className="text-white/90 text-sm">A domicilio</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 md:mb-12">
            <a
              href="#menu"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-ocean-500 text-white rounded-full font-medium text-base sm:text-lg shadow-ocean hover:shadow-ocean-lg hover:scale-105 transition-all duration-300"
            >
              <span>{intro.primary}</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>

            {mode === 'staff' ? (
              <button
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-medium text-base sm:text-lg border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{staffIntro.secondary}</span>
                {totalItems > 0 ? (
                  <span className="ml-2 px-2 py-0.5 bg-coral-500 text-white text-sm font-bold rounded-full">
                    {totalItems}
                  </span>
                ) : null}
              </button>
            ) : null}
          </div>

          {mode === 'customer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Clock className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Pide con calma</p>
                  <p className="text-white font-medium">Revisa fotos y precios</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <MapPin className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Ubicación</p>
                  <p className="text-white font-medium">Pje. Lord Cochrane 049</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Phone className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Atención</p>
                  <p className="text-white font-medium">Elige y luego pide</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Clock className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Operación rápida</p>
                  <p className="text-white font-medium">Mesa primero, pedido después</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <MapPin className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Turno activo</p>
                  <p className="text-white font-medium">Mesas abiertas sincronizadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Phone className="w-5 h-5 text-ocean-300" />
                <div className="text-left">
                  <p className="text-white/60 text-xs">Cierre</p>
                  <p className="text-white font-medium">Cuenta final por WhatsApp</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
