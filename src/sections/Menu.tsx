import { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { menuCategories, type MenuProduct } from '@/data/menuData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

type MenuProps = {
  mode: 'customer' | 'staff';
};

const Menu = ({ mode }: MenuProps) => {
  const [activeCategory, setActiveCategory] = useState('novedades');
  const [staffShowingProducts, setStaffShowingProducts] = useState(false);
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [highlightCustomerCategory, setHighlightCustomerCategory] = useState(false);
  const customerCategoriesRef = useRef<HTMLDivElement | null>(null);
  const customerProductsRef = useRef<HTMLDivElement | null>(null);
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

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        menuCategories.map((category) => [
          category.id,
          products.filter((item) => item.category === category.id).length,
        ])
      ),
    [products]
  );

  const featuredProducts = useMemo(
    () => products.filter((item) => item.popular).slice(0, 6),
    [products]
  );

  const filteredItems = products.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    if (!normalizedSearch) return matchesCategory;

    return (
      matchesCategory &&
      (item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch))
    );
  });

  const activeCategoryName =
    menuCategories.find((category) => category.id === activeCategory)?.name ?? 'Menú';

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

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);

    if (mode === 'staff') {
      setStaffShowingProducts(true);
    }

    if (mode === 'customer') {
      window.setTimeout(() => {
        customerProductsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 120);
    }
  };

  const handleBackToCategories = () => {
    setStaffShowingProducts(false);
  };

  const handleBackToCustomerCategories = () => {
    setSelectedProduct(null);
    setHighlightCustomerCategory(true);

    window.setTimeout(() => {
      customerCategoriesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);

    window.setTimeout(() => {
      setHighlightCustomerCategory(false);
    }, 1800);
  };

  const ProductCard = ({
    item,
    index,
    customerCard = false,
  }: {
    item: MenuProduct;
    index: number;
    customerCard?: boolean;
  }) => (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-ocean hover:shadow-ocean-lg transition-all duration-500 ${
        customerCard ? 'hover:-translate-y-1 cursor-pointer' : 'md:hover:-translate-y-2'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={
        customerCard
          ? () => {
              setSelectedProduct(item);
            }
          : undefined
      }
      role={customerCard ? 'button' : undefined}
      tabIndex={customerCard ? 0 : undefined}
      onKeyDown={
        customerCard
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedProduct(item);
              }
            }
          : undefined
      }
    >
      <div className={`relative overflow-hidden ${customerCard ? 'h-52 md:h-60' : 'h-40 md:h-48'}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {item.popular ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
            <Star className="w-3 h-3 fill-current" />
            <span>Popular</span>
          </div>
        ) : null}
        {customerCard ? (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ocean-950/85 to-transparent">
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Toca para ver detalle
            </div>
          </div>
        ) : null}
      </div>

      <div className={customerCard ? 'p-5 md:p-6' : 'p-4 md:p-5'}>
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="font-display text-lg md:text-xl font-semibold text-ocean-900 group-hover:text-ocean-600 transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="text-base md:text-lg font-bold text-ocean-500 shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className={`text-ocean-600 text-sm ${customerCard ? 'line-clamp-4' : 'mb-4 line-clamp-3 md:line-clamp-none'}`}>
          {item.description}
        </p>

        {customerCard ? null : (
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
        )}
      </div>
    </div>
  );

  return (
    <>
      <section
        id="menu"
        className={`bg-gradient-to-b from-white to-ocean-50/50 ${
          mode === 'staff' ? 'py-20 pb-32 md:pb-20' : 'py-10 md:py-16'
        }`}
      >
        <div className="section-padding max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-100 rounded-full mb-4">
              <UtensilsCrossed className="w-4 h-4 text-ocean-600" />
              <span className="text-ocean-700 text-sm font-medium">
                {mode === 'staff' ? 'Menú Operativo' : 'Carta para clientes'}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-ocean-900 mb-4">
              {mode === 'staff' ? 'Menú de Servicio' : 'Menú Kihnally'}
            </h2>
            <p className="text-ocean-600 max-w-2xl mx-auto">
              {mode === 'staff'
                ? 'Primero elige una categoría y luego agrega productos al pedido de la mesa.'
                : 'Explora la carta completa, revisa categorías, fotos y precios.'}
            </p>
          </div>

          {mode === 'staff' ? (
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
          ) : (
            <div className="mb-6 md:mb-8">
              <div className="relative max-w-xl mx-auto">
                <Search className="w-4 h-4 text-ocean-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Busca por producto, sabor o descripción..."
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-ocean-500 shadow-sm"
                />
              </div>
            </div>
          )}

          {mode === 'staff' ? (
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
          ) : null}

          {mode === 'staff' ? (
            <>
              <div className="sticky top-[184px] md:top-[84px] z-20 -mx-4 px-4 py-3 md:px-0 mb-8 md:mb-12 bg-white/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-0 border-y border-ocean-100 md:border-y-0">
                {!staffShowingProducts ? (
                  <div className="mx-auto max-w-5xl">
                    <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-ocean-500">
                      Elige una categoría
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 pb-1 md:pb-4">
                      {menuCategories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                          <button
                            key={category.id}
                            onClick={() => handleSelectCategory(category.id)}
                            className={`w-full min-w-0 flex items-center justify-center gap-2 px-3 md:px-5 py-3 rounded-2xl font-medium transition-all duration-300 text-sm md:text-base text-center leading-tight ${
                              isActive
                                ? 'bg-ocean-500 text-white shadow-ocean scale-105'
                                : 'bg-white text-ocean-700 hover:bg-ocean-50 border border-ocean-200'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="break-words">{category.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <button
                      onClick={handleBackToCategories}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ocean-200 bg-white px-4 py-3 text-sm font-medium text-ocean-700 transition-colors hover:bg-ocean-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver a categorías</span>
                    </button>

                    <div className="rounded-2xl bg-ocean-900 px-5 py-3 text-white shadow-ocean">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/65">
                        Categoría activa
                      </p>
                      <p className="font-display text-xl">{activeCategoryName}</p>
                    </div>
                  </div>
                )}
              </div>

              {staffShowingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredItems.map((item, index) => (
                    <ProductCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[32px] border border-dashed border-ocean-200 bg-white/80 p-8 text-center text-ocean-600 shadow-sm">
                  Selecciona una categoría para ver los productos disponibles.
                </div>
              )}
            </>
          ) : (
            <div className="space-y-8">
              {featuredProducts.length > 0 ? (
                <div className="rounded-[32px] bg-ocean-900 text-white p-5 md:p-7 shadow-2xl">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-5 h-5 text-sand-300" />
                    <p className="text-sm uppercase tracking-[0.24em] text-white/70">
                      Destacados de la casa
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {featuredProducts.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        className="group text-left rounded-3xl overflow-hidden bg-white/8 hover:bg-white/12 border border-white/10 transition-all duration-300"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-coral-500 px-3 py-1 text-xs font-medium text-white">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Favorito</span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="font-display text-xl leading-tight text-white">
                              {item.name}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="line-clamp-2 text-sm text-white/75 mb-3">
                            {item.description}
                          </p>
                          <p className="text-lg font-bold text-sand-300">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
                <aside className="lg:sticky lg:top-[92px]" ref={customerCategoriesRef}>
                  <div className="rounded-3xl border border-ocean-100 bg-white shadow-sm p-4 md:p-5">
                    <p className="text-ocean-500 text-xs uppercase tracking-[0.24em] mb-3">
                      Categorías
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      {menuCategories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                          <button
                            key={category.id}
                            onClick={() => handleSelectCategory(category.id)}
                            className={`w-full min-w-0 flex flex-col items-start justify-between gap-2 rounded-2xl px-4 py-3 text-left transition-all duration-300 lg:flex-row lg:items-center lg:gap-3 ${
                              isActive
                                ? `bg-ocean-500 text-white shadow-ocean ${
                                    highlightCustomerCategory
                                      ? 'ring-4 ring-ocean-200 scale-[1.02]'
                                      : ''
                                  }`
                                : 'bg-ocean-50/70 text-ocean-800 hover:bg-ocean-100'
                            }`}
                          >
                            <span className="min-w-0 flex items-center gap-3">
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="font-medium break-words leading-tight">
                                {category.name}
                              </span>
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                                isActive ? 'bg-white/20 text-white' : 'bg-white text-ocean-500'
                              }`}
                            >
                              {categoryCounts[category.id] ?? 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <div ref={customerProductsRef}>
                  <div className="mb-6 rounded-3xl bg-ocean-900 text-white p-5 md:p-6 shadow-xl">
                    <p className="text-white/70 text-sm uppercase tracking-[0.24em] mb-2">
                      {activeCategoryName}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl">
                      {filteredItems.length} producto{filteredItems.length === 1 ? '' : 's'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                    {filteredItems.map((item, index) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        index={index}
                        customerCard
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-ocean-600">
              No encontramos productos para esa búsqueda en esta categoría.
            </div>
          ) : null}

          {mode === 'staff' ? (
            <div className="hidden md:block text-center mt-12">
              <button
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-ocean-900 text-white rounded-full font-medium hover:bg-ocean-800 transition-colors duration-300"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Ver Mi Pedido</span>
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-[28px] border-0 bg-white p-0">
          {selectedProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[280px] md:min-h-[520px]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
                {selectedProduct.popular ? (
                  <div className="absolute top-5 left-5 inline-flex items-center gap-1 rounded-full bg-coral-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Popular</span>
                  </div>
                ) : null}
              </div>

              <div className="p-6 md:p-8 flex flex-col">
                <p className="text-ocean-500 text-xs uppercase tracking-[0.24em] mb-3">
                  {menuCategories.find((item) => item.id === selectedProduct.category)?.name ??
                    activeCategoryName}
                </p>
                <DialogTitle className="font-display text-3xl text-ocean-950 mb-4">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="text-ocean-600 text-base leading-relaxed mb-6">
                  {selectedProduct.description}
                </DialogDescription>

                <div className="rounded-3xl bg-ocean-50 p-5 mb-6">
                  <p className="text-ocean-500 text-xs uppercase tracking-[0.2em] mb-2">
                    Precio
                  </p>
                  <p className="font-display text-4xl text-ocean-900">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>

                <button
                  onClick={handleBackToCustomerCategories}
                  className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-ocean-200 bg-white px-4 py-3 text-sm font-medium text-ocean-700 transition-colors hover:bg-ocean-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Volver a categorías</span>
                </button>

                <div className="mt-auto rounded-3xl border border-ocean-100 bg-white p-4">
                  <p className="text-sm font-semibold text-ocean-900 mb-1">
                    Ideal para decidir con calma
                  </p>
                  <p className="text-sm text-ocean-600">
                    Revisa el detalle completo y luego pide este producto a la garzona cuando estés listo.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Menu;

