import { useMemo, useState } from 'react';
import { Settings2, X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import {
  availableProductImages,
  asset,
  menuCategories,
  type MenuProduct,
} from '@/data/menuData';
import { toast } from 'sonner';

const ADMIN_SESSION_KEY = 'espacio-kihnally-admin-session';
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? 'kihnally2026';

const AdminPanel = () => {
  const { products, updateProduct, addProduct, removeProduct, resetProducts } = useMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id ?? 0);
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'ok';
  });

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) ?? products[0] ?? null,
    [products, selectedProductId]
  );

  const handleFieldChange = <K extends keyof MenuProduct>(
    key: K,
    value: MenuProduct[K]
  ) => {
    if (!selectedProduct) return;
    updateProduct({
      ...selectedProduct,
      [key]: value,
    });
  };

  const handleCreateProduct = () => {
    const nextId = addProduct();
    setSelectedProductId(nextId);
    toast.success('Nuevo producto creado');
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    removeProduct(selectedProduct.id);
    setSelectedProductId(products.find((item) => item.id !== selectedProduct.id)?.id ?? 0);
    toast.success('Producto eliminado');
  };

  const handleReset = () => {
    resetProducts();
    setSelectedProductId(products[0]?.id ?? 1);
    toast.success('Menú restaurado a la versión original');
  };

  const handleUnlock = () => {
    if (pinInput !== ADMIN_PIN) {
      toast.error('Clave incorrecta');
      return;
    }

    window.localStorage.setItem(ADMIN_SESSION_KEY, 'ok');
    setIsUnlocked(true);
    setPinInput('');
    toast.success('Panel administrador desbloqueado');
  };

  const handleLock = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsUnlocked(false);
    setIsOpen(false);
    setPinInput('');
    toast.success('Panel administrador bloqueado');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-ocean-900 text-white rounded-full px-4 py-3 shadow-ocean-lg hover:bg-ocean-800 transition-colors flex items-center gap-2"
      >
        <Settings2 className="w-4 h-4" />
        <span className="text-sm font-medium">Admin menú</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          {!isUnlocked ? (
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl p-8 flex flex-col justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-ocean-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-ocean-600" />
              </button>
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-ocean-900">
                    Panel administrador
                  </h2>
                  <p className="text-ocean-600 mt-2">
                    Ingresa la clave para editar productos y precios.
                  </p>
                </div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(event) => setPinInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUnlock();
                    }
                  }}
                  placeholder="Clave de administrador"
                  className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                />
                <button
                  onClick={handleUnlock}
                  className="w-full py-3 bg-ocean-500 text-white rounded-xl font-medium hover:bg-ocean-600 transition-colors"
                >
                  Entrar
                </button>
                <p className="text-xs text-ocean-500">
                  Esta clave es una protección simple del lado del cliente. Si luego quieres
                  seguridad real, conviene pasar el panel a backend con autenticación.
                </p>
              </div>
            </div>
          ) : (
            <div className="fixed inset-y-0 right-0 w-full max-w-6xl bg-white z-50 shadow-2xl grid grid-cols-1 lg:grid-cols-[320px_1fr]">
              <div className="border-r border-ocean-100 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl text-ocean-900 font-semibold">
                      Administrador
                    </h2>
                    <p className="text-sm text-ocean-600">
                      Cambia productos y precios sin tocar el código.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-ocean-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-ocean-600" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleCreateProduct}
                    className="w-full py-3 bg-ocean-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo producto</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restaurar menú original</span>
                  </button>
                  <button
                    onClick={handleLock}
                    className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                  >
                    Bloquear panel
                  </button>
                </div>

                <div className="space-y-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                        selectedProduct?.id === product.id
                          ? 'bg-ocean-500 text-white border-ocean-500'
                          : 'bg-white text-ocean-900 border-ocean-200 hover:bg-ocean-50'
                      }`}
                    >
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm opacity-80">
                        {menuCategories.find((item) => item.id === product.category)?.name ??
                          product.category}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 lg:p-8 overflow-y-auto">
                {selectedProduct ? (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full sm:w-56 h-56 object-cover rounded-3xl shadow-ocean"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-display text-3xl font-semibold text-ocean-900">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-ocean-600">
                          ID #{selectedProduct.id}
                        </p>
                        <button
                          onClick={handleDeleteProduct}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar producto</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-ocean-700">Nombre</span>
                        <input
                          value={selectedProduct.name}
                          onChange={(event) => handleFieldChange('name', event.target.value)}
                          className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-ocean-700">Precio</span>
                        <input
                          type="number"
                          min="0"
                          value={selectedProduct.price}
                          onChange={(event) =>
                            handleFieldChange('price', Number(event.target.value) || 0)
                          }
                          className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                        />
                      </label>
                    </div>

                    <label className="space-y-2 block">
                      <span className="text-sm font-medium text-ocean-700">Descripción</span>
                      <textarea
                        value={selectedProduct.description}
                        onChange={(event) =>
                          handleFieldChange('description', event.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                      />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-ocean-700">Categoría</span>
                        <select
                          value={selectedProduct.category}
                          onChange={(event) =>
                            handleFieldChange('category', event.target.value)
                          }
                          className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                        >
                          {menuCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-ocean-700">Imagen</span>
                        <select
                          value={selectedProduct.image}
                          onChange={(event) =>
                            handleFieldChange('image', event.target.value)
                          }
                          className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                        >
                          {availableProductImages.map((imageName) => (
                            <option key={imageName} value={asset(imageName)}>
                              {imageName}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex items-center gap-3 p-4 border border-ocean-200 rounded-2xl">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedProduct.popular)}
                        onChange={(event) =>
                          handleFieldChange('popular', event.target.checked)
                        }
                      />
                      <span className="text-ocean-800 font-medium">
                        Mostrar como producto destacado
                      </span>
                    </label>

                    <div className="bg-ocean-50 rounded-2xl p-4 text-sm text-ocean-700">
                      Los cambios se guardan automáticamente en este navegador. Si quieres volver
                      al menú original, usa “Restaurar menú original”.
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-ocean-500">
                    No hay productos para editar.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminPanel;
