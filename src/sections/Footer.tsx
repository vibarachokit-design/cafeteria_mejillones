import { Anchor, Heart, Instagram, MessageCircle, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { name: 'Inicio', href: '#inicio' },
      { name: 'Menú', href: '#menu' },
      { name: 'Nosotros', href: '#nosotros' },
      { name: 'Galería', href: '#galeria' },
      { name: 'Contacto', href: '#contacto' },
    ],
    servicios: [
      { name: 'Café de especialidad', href: '#menu' },
      { name: 'Pizzas artesanales', href: '#menu' },
      { name: 'Refrescos del desierto', href: '#menu' },
      { name: 'Para llevar', href: '#contacto' },
      { name: 'A domicilio', href: '#contacto' },
    ],
    legal: [
      { name: 'Términos y condiciones', href: '#' },
      { name: 'Política de privacidad', href: '#' },
    ],
  };

  return (
    <footer className="bg-ocean-900 text-white">
      {/* Wave Divider */}
      <div className="relative h-20 bg-ocean-50/50">
        <svg
          className="absolute bottom-0 w-full h-20"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L48 73.3C96 67 192 53 288 48C384 43 480 48 576 53.3C672 59 768 64 864 64C960 64 1056 59 1152 53.3C1248 48 1344 43 1392 40.7L1440 38V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            fill="#0a4d68"
          />
        </svg>
      </div>

      <div className="section-padding max-w-7xl mx-auto pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-ocean-500 rounded-full">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-semibold">Espacio Kihnally</span>
            </a>
            <p className="text-ocean-200 text-sm mb-2">
              Donde el Norte se siente
            </p>
            <p className="text-ocean-300 text-sm mb-6">
              Disfruta de la mejor experiencia gastronómica en Mejillones. 
              Café de especialidad, pizzas artesanales y sabores del norte.
            </p>
            <div className="flex gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=56933806302"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-ocean-800 rounded-lg hover:bg-ocean-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/espacio_kihnally"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-ocean-800 rounded-lg hover:bg-ocean-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Navegación</h4>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ocean-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ocean-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ocean-400 mt-0.5" />
                <div>
                  <p className="text-ocean-200 text-sm">Pje. Lord Cochrane 049</p>
                  <p className="text-ocean-300 text-xs">Mejillones, Chile</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-ocean-400" />
                <p className="text-ocean-200 text-sm">+56 9 3380 6302</p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-ocean-200 text-sm">espaciokihnally@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ocean-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ocean-300 text-sm text-center md:text-left">
              © {currentYear} Espacio Kihnally. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-1 text-ocean-300 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-coral-500 fill-current" />
              <span>en Mejillones, Chile</span>
            </div>
            <div className="flex gap-4">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-ocean-300 hover:text-white text-xs transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
