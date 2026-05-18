import { useEffect, useRef, useState } from 'react';
import { Anchor, Heart, Award, Users, Coffee, Waves } from 'lucide-react';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const stats = [
  { icon: Heart, value: 5, suffix: '+', label: 'Años de experiencia' },
  { icon: Users, value: 10000, suffix: '+', label: 'Clientes satisfechos' },
  { icon: Coffee, value: 50, suffix: '+', label: 'Productos únicos' },
  { icon: Award, value: 100, suffix: '%', label: 'Ingredientes frescos' },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="nosotros" ref={sectionRef} className="hidden md:block py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ocean-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sand-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="section-padding max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-ocean-lg">
                <img
                  src={asset('bahia.jpg')}
                  alt="Bahía de Mejillones"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-ocean-lg max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-ocean-100 rounded-lg">
                    <Anchor className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-ocean-900">Desde 2020</p>
                    <p className="text-ocean-600 text-sm">Tradición norteña</p>
                  </div>
                </div>
                <p className="text-ocean-600 text-sm">
                  "Donde el Norte se siente"
                </p>
                <p className="text-ocean-400 text-xs mt-2">— Espacio Kihnally</p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-ocean-500/10 rounded-full animate-pulse" />
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-coral-500/10 rounded-full animate-pulse delay-300" />
            </div>
          </div>

          {/* Content Side */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
              <Waves className="w-4 h-4 text-ocean-600" />
              <span className="text-ocean-700 text-sm font-medium">Nuestra Historia</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-6">
              Un Rincón del Norte
            </h2>

            <div className="space-y-4 text-ocean-700 mb-8">
              <p>
                Espacio Kihnally nació del amor por el café de especialidad y la gastronomía local de 
                Mejillones. Ubicados en el corazón de esta histórica ciudad del norte de Chile, 
                hemos creado un espacio donde cada producto lleva el sabor y la esencia del desierto 
                y el mar.
              </p>
              <p>
                Nuestro nombre rinde homenaje a la identidad norteña. Como dice nuestro eslogan, 
                aquí es "Donde el Norte se siente". Cada taza de café, cada pizza artesanal y cada 
                refresco del desierto celebra la riqueza de nuestra tierra.
              </p>
              <p>
                Nos enorgullece trabajar con productores locales y ofrecer una experiencia única 
                que combina la tradición cafetera con la creatividad de sabores inspirados en el 
                norte de Chile. Desde nuestras Tazas con Alma hasta las Pizzas Rondas del Desierto, 
                cada producto cuenta una historia.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                'Café de especialidad',
                'Pizzas artesanales',
                'Productos locales',
                'Ambiente acogedor',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ocean-500 rounded-full" />
                  <span className="text-ocean-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://www.instagram.com/espacio_kihnally"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ocean-500 text-white rounded-full font-medium hover:bg-ocean-600 transition-colors duration-300"
            >
              <span>Síguenos en Instagram</span>
              <Waves className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`text-center p-6 bg-ocean-50/50 rounded-2xl transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="inline-flex p-3 bg-ocean-100 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-ocean-600" />
                </div>
                <p className="font-display text-3xl font-bold text-ocean-900 mb-1">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-ocean-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;



