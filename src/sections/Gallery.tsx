import { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const galleryImages = [
  {
    src: asset('hero-cafe.jpg'),
    alt: 'Interior de la cafetería con vista al mar',
    category: 'Ambiente',
  },
  {
    src: asset('cafe-latte.jpg'),
    alt: 'Latte art con diseño de ola',
    category: 'Cafés',
  },
  {
    src: asset('mariscos.jpg'),
    alt: 'Paila marina con mejillones frescos',
    category: 'Platos',
  },
  {
    src: asset('empanadas.jpg'),
    alt: 'Empanadas de mariscos',
    category: 'Platos',
  },
  {
    src: asset('caldo.jpg'),
    alt: 'Caldo de mariscos humeante',
    category: 'Platos',
  },
  {
    src: asset('torta.jpg'),
    alt: 'Torta de hojas con frutos rojos',
    category: 'Postres',
  },
  {
    src: asset('postre.jpg'),
    alt: 'Tres leches con caramelo',
    category: 'Postres',
  },
  {
    src: asset('bahia.jpg'),
    alt: 'Vista panorámica de la bahía',
    category: 'Vistas',
  },
];

const categories = ['Todos', 'Ambiente', 'Cafés', 'Platos', 'Postres', 'Vistas'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === 'Todos'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    const newIndex =
      direction === 'prev'
        ? (selectedImage - 1 + filteredImages.length) % filteredImages.length
        : (selectedImage + 1) % filteredImages.length;
    setSelectedImage(newIndex);
  };

  return (
    <section id="galeria" className="py-20 bg-ocean-50/50">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
            <Camera className="w-4 h-4 text-ocean-600" />
            <span className="text-ocean-700 text-sm font-medium">Momentos Especiales</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">
            Galería
          </h2>
          <p className="text-ocean-600 max-w-2xl mx-auto">
            Un vistazo a nuestra cafetería, nuestros platillos y las vistas espectaculares
            que nos rodean en la bahía de Mejillones.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-ocean-500 text-white shadow-ocean'
                  : 'bg-white text-ocean-700 hover:bg-ocean-100 border border-ocean-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                  <p className="text-white/70 text-xs">{image.category}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            <span>Síguenos en @cafebahia</span>
          </a>
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-ocean-950/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[80vh] mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{filteredImages[selectedImage].alt}</p>
              <p className="text-white/60 text-sm">{filteredImages[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
