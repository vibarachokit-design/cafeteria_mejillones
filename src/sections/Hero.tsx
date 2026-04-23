import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Clock, Phone, Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const Hero = () => {
  const waveRef1 = useRef<SVGPathElement>(null);
  const waveRef2 = useRef<SVGPathElement>(null);
  const waveRef3 = useRef<SVGPathElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  // Check if business is open
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute;

      // Tuesday is closed
      if (day === 2) {
        setIsOpen(false);
        return;
      }

      // Sunday: 17:00 - 23:30
      if (day === 0) {
        setIsOpen(currentTime >= 17 * 60 && currentTime <= 23 * 60 + 30);
        return;
      }

      // Friday and Saturday: 17:00 - 23:30
      if (day === 5 || day === 6) {
        setIsOpen(currentTime >= 17 * 60 && currentTime <= 23 * 60 + 30);
        return;
      }

      // Monday, Wednesday, Thursday: 17:00 - 23:00
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
      
      const generateWavePath = (amplitude: number, frequency: number, phase: number, yOffset: number) => {
        let path = `M 0 ${yOffset}`;
        for (let x = 0; x <= 1440; x += 10) {
          const y = yOffset + Math.sin((x * frequency) + offset + phase) * amplitude;
          path += ` L ${x} ${y}`;
        }
        path += ` L 1440 1080 L 0 1080 Z`;
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

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={asset('hero-cafe.jpg')}
          alt="Espacio Kihnally"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/60 via-ocean-800/40 to-ocean-900/70" />
      </div>

      {/* Animated Waves */}
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

      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center section-padding pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img
              src={asset('logo-kihnally.png')}
              alt="Espacio Kihnally"
              className="h-24 sm:h-32 mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full border mb-6 ${
            isOpen 
              ? 'bg-green-500/20 border-green-400/30' 
              : 'bg-red-500/20 border-red-400/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${isOpen ? 'text-green-300' : 'text-red-300'}`}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <MapPin className="w-4 h-4 text-ocean-300" />
            <span className="text-white/90 text-sm font-medium">Mejillones, Chile</span>
          </div>

          {/* Slogan */}
          <p className="text-2xl sm:text-3xl text-ocean-300 mb-6 font-light tracking-wide">
            Donde el Norte se siente
          </p>

          <p className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Disfruta de la mejor experiencia gastronómica en Mejillones. 
            Café de especialidad, pizzas artesanales, refrescos del desierto y dulzura del norte en un ambiente único.
          </p>

          {/* Service Types */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#menu"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-ocean-500 text-white rounded-full font-medium text-lg shadow-ocean hover:shadow-ocean-lg hover:scale-105 transition-all duration-300"
            >
              <span>Ver Menú</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-medium text-lg border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Ver Mi Pedido</span>
              {totalItems > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-coral-500 text-white text-sm font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Clock className="w-5 h-5 text-ocean-300" />
              <div className="text-left">
                <p className="text-white/60 text-xs">Horario</p>
                <p className="text-white font-medium">Lun, Mié-Jue: 17-23h</p>
                <p className="text-white/70 text-xs">Vie-Dom: 17-23:30h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <MapPin className="w-5 h-5 text-ocean-300" />
              <div className="text-left">
                <p className="text-white/60 text-xs">Ubicación</p>
                <p className="text-white font-medium">Pje. Lord Cochrane 049</p>
                <p className="text-white/70 text-xs">Mejillones</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Phone className="w-5 h-5 text-ocean-300" />
              <div className="text-left">
                <p className="text-white/60 text-xs">Contacto</p>
                <p className="text-white font-medium">+56 9 3380 6302</p>
                <p className="text-white/70 text-xs">WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
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



