import { useState } from 'react';
import {
  UtensilsCrossed,
  Star,
  Plus,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { menuCategories, type MenuProduct } from '@/data/menuData';
import { toast } from 'sonner';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('novedades');
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const { addItem, setIsCartOpen } = useCart();
  const { products } = useMenu();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);

  const filteredItems = products.filter((item) => item.category === activeCategory);

  const handleAddToCart = (item: MenuProduct) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    });

    setAddedItems((prev) => [...prev, item.id]);
    toast.success(`${item.name} agregado al pedido`);

    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-white to-ocean-50/50">
      <div className="section-padding max-w-7xl mx-auto">
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

        <div className="flex justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {menuCategories.map((category) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-ocean hover:shadow-ocean-lg transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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

              <div className="p-5">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-display text-xl font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-ocean-500 shrink-0">
                    {formatPrice(item.price)}
                  </span>
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-ocean-600">
            No hay productos en esta categoría todavía.
          </div>
        )}

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
