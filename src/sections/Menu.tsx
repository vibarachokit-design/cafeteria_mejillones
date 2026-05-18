import { useState } from 'react';
import {
  UtensilsCrossed,
  Star,
  Plus,
  Check,
  ShoppingCart,
  Search,
  ClipboardList,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { menuCategories, type MenuProduct } from '@/data/menuData';
import { toast } from 'sonner';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('novedades');
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    addItem,
    setIsCartOpen,
    totalItems,
    selectedTable,
    setSelectedTable,
  } = useCart();
  const { products } = useMenu();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);

  const filteredItems = products.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return matchesCategory;

    return (
      matchesCategory &&
      (item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch))
    );
  });

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
    <section
      id="menu"
      className="py-20 pb-32 md:pb-20 bg-gradient-to-b from-white to-ocean-50/50"
    >
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
            <UtensilsCrossed className="w-4 h-4 text-ocean-600" />
            <span className="text-ocean-700 text-sm font-medium">Nuestra Carta</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">
            Menú del Día
          </h2>
          <p className="text-ocean-600 max-w-2xl mx-auto hidden md:block">
            Descubre nuestra selección de productos preparados con ingredientes frescos
            y café de especialidad. Sabores que celebran el norte de Chile.
          </p>
        </div>

        <div className="md:hidden sticky top-[88px] z-30 -mx-4 px-4 py-3 mb-6 bg-white/95 backdrop-blur-xl border-y border-ocean-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-[11px] uppercase tracking-wide text-ocean-500 block mb-1">
                Mesa activa
              </label>
              <div className="relative">
                <ClipboardList className="w-4 h-4 text-ocean-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedTable}
                  onChange={(event) => setSelectedTable(event.target.value)}
                  className="w-full appearance-none pl-9 pr-4 py-3 rounded-2xl border border-ocean-200 bg-white text-ocean-900 font-medium focus:outline-none focus:border-ocean-500"
                >
                  <option value="">Selecciona mesa</option>
                  {Array.from({ length: 20 }, (_, index) => (
                    <option key={index + 1} value={`${index + 1}`}>
                      Mesa {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-3 bg-ocean-900 text-white rounded-2xl text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{totalItems > 0 ? totalItems : 'Ver'}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-ocean-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-ocean-500"
            />
          </div>
        </div>

        <div className="hidden md:block mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-ocean-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar producto por nombre o descripción..."
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-ocean-500"
            />
          </div>
        </div>

        <div className="sticky top-[184px] md:top-[84px] z-20 -mx-4 px-4 py-3 md:py-0 md:px-0 mb-8 md:mb-12 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-0 border-y border-ocean-100 md:border-y-0">
          <div className="flex justify-start md:justify-center gap-2 overflow-x-auto pb-1 md:pb-4 scrollbar-hide">
            {menuCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-2xl md:rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm md:text-base min-w-max ${
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-ocean hover:shadow-ocean-lg transition-all duration-500 md:hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-40 md:h-48 overflow-hidden">
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

              <div className="p-4 md:p-5">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="font-display text-lg md:text-xl font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-base md:text-lg font-bold text-ocean-500 shrink-0">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-ocean-600 text-sm mb-4 line-clamp-3 md:line-clamp-none">
                  {item.description}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
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
            No encontramos productos para esa búsqueda en esta categoría.
          </div>
        )}

        <div className="hidden md:block text-center mt-12">
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
