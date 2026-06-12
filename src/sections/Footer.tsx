import { Anchor, Heart, Instagram, MapPin, MessageCircle } from 'lucide-react';

type FooterProps = {
  mode: 'customer' | 'staff';
};

const Footer = ({ mode }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const staffHref = `${import.meta.env.BASE_URL}?vista=garzona#menu`;
  const customerHref = `${import.meta.env.BASE_URL}#inicio`;

  const footerLinks = {
    navegacion:
      mode === 'staff'
        ? [
            { name: 'Inicio', href: '#inicio' },
            { name: 'Menú operativo', href: '#menu' },
            { name: 'Versión cliente', href: customerHref },
          ]
        : [
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
  };

  return (
    <footer className="bg-ocean-900 text-white">
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
          <div className="lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-ocean-500 rounded-full">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-semibold">Espacio Kihnally</span>
            </a>
            <p className="text-ocean-200 text-sm mb-2">Donde el Norte se siente</p>
            <p className="text-ocean-300 text-sm mb-6">
              {mode === 'staff'
                ? 'Versión operativa para garzona y administración del servicio.'
                : 'Explora nuestra carta digital, descubre productos y pide a la garzona tus favoritos.'}
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

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              {mode === 'staff' ? 'Accesos' : 'Contacto'}
            </h4>
            <div className="space-y-3">
              {mode === 'staff' ? (
                <>
                  <a
                    href={customerHref}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ocean-100 hover:bg-white/10 transition-colors"
                  >
                    Abrir versión cliente
                  </a>
                  <a
                    href={staffHref}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ocean-100 hover:bg-white/10 transition-colors"
                  >
                    Mantener modo garzona
                  </a>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
