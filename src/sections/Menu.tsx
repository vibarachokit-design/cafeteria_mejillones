import { useState } from 'react';
import { Coffee, UtensilsCrossed, Pizza, Sandwich, CupSoda, Sparkles, Star, Plus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // NOVEDADES
  {
    id: 1,
    name: 'Tropical Coldbrew',
    description: 'Café de especialidad infusionado en frío, syrup de maracuyá, agua con gas y toque exótico de pulpa de mango',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
    popular: true,
  },
  {
    id: 2,
    name: 'Mocktail de Hibiscus',
    description: 'Refrescante y levemente ácida, elaborada con flor de jamaica, jugo de limón natural y hojas frescas de menta',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
  },
  {
    id: 3,
    name: 'Leche Dorada',
    description: 'Deliciosa combinación de cúrcuma, especias y leche vegetal o tradicional. Propiedades antiinflamatorias y antioxidantes',
    price: '$3.500',
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
  },
  {
    id: 4,
    name: 'Torta Helada',
    description: 'Torta congelada de frambuesa con merengue, ideal para refrescarse con algo dulce',
    price: '.000',
    image: asset('postre.jpg'),
    category: 'novedades',
  },
  // TAZAS CON ALMA
  {
    id: 5,
    name: 'Expresso',
    description: 'Intenso café de grano expresso',
    price: '$2.000',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 6,
    name: 'Americano',
    description: 'Taza intensa y aromática preparada con café de grano recién molido. Sabor profundo y cuerpo suave',
    price: '$3.190',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 7,
    name: 'Cortado',
    description: 'Espresso intenso suavizado con un toque de leche caliente. Equilibrio perfecto entre fuerza y cremosidad',
    price: '$3.290',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 8,
    name: 'Capuccino Tradicional',
    description: 'Clásico y reconfortante: espresso con leche vaporizada y una suave capa de espuma. Cremoso y equilibrado',
    price: '$3.900',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
    popular: true,
  },
  {
    id: 9,
    name: 'Capuccino Sabores',
    description: 'Tu clásico capuchino con un toque único. Disponible en vainilla, canela, caramelo o avellana',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 10,
    name: 'Mockaccino',
    description: 'Fusión irresistible de espresso, leche vaporizada y chocolate. Cremoso, suave y con toque dulce',
    price: '$3.900',
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  // REFRESCOS DEL DESIERTO
  {
    id: 11,
    name: 'Milkshake Sabores',
    description: 'Batido a base de helado de vainilla. Elige tu sabor: chocolate, café o cookies',
    price: '$4.500',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 12,
    name: 'Matcha Latte Helado',
    description: 'Refrescante mezcla de té verde matcha con leche fría y hielo. Suave, vegetal y lleno de antioxidantes',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 13,
    name: 'Chai Latte Ice',
    description: 'Infusión especiada de té negro con canela, jengibre, clavo y cardamomo, con leche fría y hielo',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 14,
    name: 'Manzanilla Latte Ice',
    description: 'Infusión relajante de manzanilla con leche fría y hielo. Suave, floral y naturalmente dulce',
    price: '$3.800',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 15,
    name: 'Menta Latte Ice',
    description: 'Infusión refrescante de menta con leche fría y hielo. Ligero, herbal y revitalizante',
    price: '$3.800',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 16,
    name: 'Bombón Ice',
    description: 'Versión helada del clásico café bombón: espresso sobre leche condensada fría, servido con hielo',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 17,
    name: 'Caramel Latte Ice',
    description: 'Espresso con leche fría, hielo y toque de jarabe de caramelo. Dulce, cremoso y tostado',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 18,
    name: 'Café Helado',
    description: 'Café filtrado o espresso servido bien frío, con hielo y toque de azúcar o leche a elección',
    price: '$4.000',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 19,
    name: 'Frapuccino',
    description: 'Batido cremoso de café con hielo, leche y toque dulce. Elige sabor: vainilla, caramelo, chocolate o café clásico',
    price: '$4.000',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 20,
    name: 'Limonadas Sabores',
    description: 'Refrescante limonada con opción de sabores: jengibre, menta o albahaca',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 21,
    name: 'Jugos Naturales',
    description: 'Preparado al momento con pulpa de fruta natural. Elige: piña, mango, melón o berries. Con agua o con leche',
    price: '$4.200',
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  // PIZZAS RONDAS DEL DESIERTO
  {
    id: 22,
    name: 'Pizza Napolitana Artesanal',
    description: 'Masa hecha por nosotros con queso, tomate, jam?n, or?gano y aceitunas. Sabor aut?ntico directo del horno',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
    popular: true,
  },
  {
    id: 23,
    name: 'Pizza Colores',
    description: 'Masa artesanal con queso fundido, jam?n, piment?n, tomate cherry y aceitunas. Explosi?n de color y sabor',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 24,
    name: 'Pizza Vegetariana',
    description: 'Masa artesanal con queso fundido, champi?ones salteados, piment?n y aceitunas. Fresca y llena de sabor',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 25,
    name: 'Pizza Hawaiana',
    description: 'Masa artesanal con queso fundido, jam?n y trozos de pi?a jugosa. Combinaci?n dulce y salada cl?sica',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 26,
    name: 'Pizza Choclo & Queso',
    description: 'Masa artesanal con queso fundido, granos de choclo, piment?n y aceitunas. Suave y colorida',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 27,
    name: 'Pizza Queso & Albahaca',
    description: 'Masa artesanal con queso fundido, tomate fresco y albahaca reci?n cosechada de nuestro huerto',
    price: '.500',
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 28,
    name: 'Pizza Española',
    description: 'Masa artesanal con queso fundido, jamón, salame, pimentón y tomate fresco. Intensa y colorida',
    price: '$5.500',
    image: asset('cafe-latte.jpg'),
    category: 'pizzas',
  },
  // SELLADITOS & TOSTADAS
  {
    id: 29,
    name: 'Selladito Jamón & Queso',
    description: 'Clásico pan de molde sellado y dorado, relleno con jamón y queso derretido. Simple y sabroso',
    price: '$2.500',
    image: asset('cafe-latte.jpg'),
    category: 'selladitos',
  },
  {
    id: 30,
    name: 'Selladito Espinaca & Queso',
    description: 'Pan de molde dorado y sellado, relleno con queso fundido y espinaca salteada. Suave y sabroso',
    price: '.700',
    image: asset('empanadas.jpg'),
    category: 'selladitos',
  },
  {
    id: 31,
    name: 'Selladito Queso & Champiñón',
    description: 'Pan de molde sellado y crujiente, relleno con queso fundido y champiñones salteados',
    price: '$2.700',
    image: asset('cafe-latte.jpg'),
    category: 'selladitos',
  },
  {
    id: 32,
    name: 'Tostada Palta',
    description: 'Pan de molde dorado y crujiente, untado con palta fresca. Ideal para un desayuno liviano',
    price: '.000',
    image: asset('empanadas.jpg'),
    category: 'selladitos',
    popular: true,
  },
  // CIABATTA RAÍCES DEL NORTE
  {
    id: 33,
    name: 'Ciabatta Carne',
    description: 'Crujiente pan ciabatta relleno con carne desmenuzada, palta fresca, lechuga y tomate. Sabroso y nutritivo',
    price: '.700',
    image: asset('empanadas.jpg'),
    category: 'ciabatta',
    popular: true,
  },
  // BEBIDAS
  {
    id: 34,
    name: 'Bebidas Express',
    description: 'Refrescos clásicos bien fríos: Coca-Cola, Fanta, Sprite',
    price: '$1.000',
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
  {
    id: 35,
    name: 'Bebidas 600ml',
    description: 'Refrescos clásicos bien fríos: Coca-Cola, Fanta, Sprite',
    price: '$1.800',
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
  {
    id: 36,
    name: 'Agua',
    description: 'Agua con o sin gas',
    price: '$1.200',
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
];

const categories = [
  { id: 'novedades', name: 'Novedades', icon: Sparkles },
  { id: 'tazas', name: 'Tazas con Alma', icon: Coffee },
  { id: 'refrescos', name: 'Refrescos del Desierto', icon: CupSoda },
  { id: 'pizzas', name: 'Pizzas', icon: Pizza },
  { id: 'selladitos', name: 'Selladitos', icon: Sandwich },
  { id: 'ciabatta', name: 'Ciabatta', icon: UtensilsCrossed },
  { id: 'bebidas', name: 'Bebidas', icon: CupSoda },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('novedades');
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const { addItem, setIsCartOpen } = useCart();

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    // Convertir precio de string a número
    const priceNumber = parseInt(item.price.replace(/[$.]/g, ''), 10);
    
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: priceNumber,
    });

    // Mostrar feedback visual
    setAddedItems((prev) => [...prev, item.id]);
    toast.success(`${item.name} agregado al pedido`);

    // Remover del estado de agregados después de 2 segundos
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-white to-ocean-50/50">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
            <UtensilsCrossed className="w-4 h-4 text-ocean-600" />
            <span className="text-ocean-700 text-sm font-medium">Nuestra Carta</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">
            Menú del Día
          </h2>
          <p className="text-ocean-600 max-w-2xl mx-auto">
            Descubre nuestra selección de productos preparados con ingredientes frescos 
            y café de especialidad. Sabores que celebran el norte de Chile.
          </p>
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        <div className="flex justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-ocean-500 text-white shadow-ocean scale-105'
                    : 'bg-white text-ocean-700 hover:bg-ocean-50 border border-ocean-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-ocean hover:shadow-ocean-lg transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {item.popular && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Popular</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-ocean-500">{item.price}</span>
                </div>
                <p className="text-ocean-600 text-sm mb-4">{item.description}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedItems.includes(item.id)
                      ? 'bg-green-500 text-white'
                      : 'border-2 border-ocean-200 text-ocean-600 hover:bg-ocean-500 hover:text-white hover:border-ocean-500'
                  }`}
                >
                  {addedItems.includes(item.id) ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Agregado</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Agregar al pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View Cart Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ocean-900 text-white rounded-full font-medium hover:bg-ocean-800 transition-colors duration-300"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Ver Mi Pedido</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;



