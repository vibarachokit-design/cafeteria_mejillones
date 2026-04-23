import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Mail, Send, Facebook, Instagram, MessageCircle, Home, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Dirección',
    content: 'Pje. Lord Cochrane 049',
    subContent: 'Mejillones, Antofagasta, Chile',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    content: '+56 9 3380 6302',
    subContent: 'Llamadas y WhatsApp',
  },
  {
    icon: Clock,
    title: 'Horario',
    content: 'Lunes a Domingo',
    subContent: 'Martes: Cerrado',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'espaciokihnally@gmail.com',
    subContent: 'Responde en 24 hrs',
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/espacio_kihnally', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send?phone=56933806302', label: 'WhatsApp' },
];

const schedule = [
  { day: 'Domingo', hours: '17:00 - 23:30' },
  { day: 'Lunes', hours: '17:00 - 23:00' },
  { day: 'Martes', hours: 'Cerrado' },
  { day: 'Miércoles', hours: '17:00 - 23:00' },
  { day: 'Jueves', hours: '17:00 - 23:00' },
  { day: 'Viernes', hours: '17:00 - 23:30' },
  { day: 'Sábado', hours: '17:00 - 23:30' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    setCurrentDay(days[new Date().getDay()]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('¡Mensaje enviado!', {
      description: 'Nos pondremos en contacto contigo pronto.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contacto" className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-ocean-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="section-padding max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
            <Mail className="w-4 h-4 text-ocean-600" />
            <span className="text-ocean-700 text-sm font-medium">Contáctanos</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">
            Visítanos
          </h2>
          <p className="text-ocean-600 max-w-2xl mx-auto">
            Estamos ubicados en el corazón de Mejillones. 
            Ven a disfrutar de una experiencia única con los sabores del norte.
          </p>
        </div>

        {/* Service Types */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-5 py-3 bg-ocean-50 rounded-xl">
            <Home className="w-5 h-5 text-ocean-600" />
            <span className="text-ocean-700 font-medium">En el local</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-ocean-50 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-ocean-600" />
            <span className="text-ocean-700 font-medium">Para llevar</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-ocean-50 rounded-xl">
            <Truck className="w-5 h-5 text-ocean-600" />
            <span className="text-ocean-700 font-medium">A domicilio</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="p-5 bg-ocean-50/50 rounded-2xl hover:bg-ocean-100/50 transition-colors duration-300"
                  >
                    <div className="inline-flex p-3 bg-ocean-500 rounded-xl mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-ocean-900 mb-1">
                      {info.title}
                    </h3>
                    <p className="text-ocean-700">{info.content}</p>
                    <p className="text-ocean-500 text-sm">{info.subContent}</p>
                  </div>
                );
              })}
            </div>

            {/* Schedule */}
            <div className="p-6 bg-ocean-50 rounded-2xl mb-6">
              <h3 className="font-display font-semibold text-ocean-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-ocean-600" />
                Horarios de Atención
              </h3>
              <div className="space-y-2">
                {schedule.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between py-2 px-3 rounded-lg ${
                      item.day === currentDay ? 'bg-ocean-100' : ''
                    }`}
                  >
                    <span className={`text-sm ${item.day === currentDay ? 'font-medium text-ocean-900' : 'text-ocean-600'}`}>
                      {item.day}
                    </span>
                    <span className={`text-sm ${item.day === currentDay ? 'font-medium text-ocean-900' : 'text-ocean-600'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-ocean-900 rounded-2xl text-white">
              <h3 className="font-display font-semibold text-lg mb-4">
                Síguenos en redes
              </h3>
              <p className="text-white/70 mb-6">
                Mantente al día con nuestras novedades, promociones especiales y eventos.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 rounded-2xl overflow-hidden h-48 bg-ocean-100 relative">
              <img
                src="/bahia.jpg"
                alt="Ubicación"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ocean-900/40 flex items-center justify-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=-23.0997271,-70.4567622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white rounded-full font-medium text-ocean-900 hover:bg-ocean-50 transition-colors"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-ocean-50/50 rounded-3xl p-8">
            <h3 className="font-display text-2xl font-semibold text-ocean-900 mb-2">
              Envíanos un mensaje
            </h3>
            <p className="text-ocean-600 mb-6">
              ¿Tienes alguna consulta o quieres hacer una reserva? Escríbenos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-ocean-700 text-sm font-medium mb-2">
                  Nombre completo
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="bg-white border-ocean-200 focus:border-ocean-500 focus:ring-ocean-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-ocean-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    className="bg-white border-ocean-200 focus:border-ocean-500 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-ocean-700 text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+56 9 3380 6302"
                    className="bg-white border-ocean-200 focus:border-ocean-500 focus:ring-ocean-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ocean-700 text-sm font-medium mb-2">
                  Mensaje
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  required
                  rows={5}
                  className="bg-white border-ocean-200 focus:border-ocean-500 focus:ring-ocean-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-ocean-500 hover:bg-ocean-600 text-white rounded-xl font-medium text-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Enviar mensaje
                  </span>
                )}
              </Button>
            </form>

            {/* WhatsApp Direct */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-800 text-sm mb-3">
                ¿Prefieres escribirnos directamente?
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=56933806302"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chatear por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
