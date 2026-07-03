import { useMemo, useRef, useState } from 'react';
import {
  Settings2,
  X,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  Download,
  FileUp,
  ChartNoAxesCombined,
  RefreshCw,
  Cloud,
  CloudOff,
} from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import {
  availableProductImages,
  asset,
  menuCategories,
  type MenuProduct,
} from '@/data/menuData';
import { toast } from 'sonner';

const ADMIN_SESSION_KEY = 'espacio-kihnally-admin-session';
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? 'kihnally2026';
const MAX_IMAGE_DIMENSION = 1280;
const MAX_IMAGE_DATA_URL_LENGTH = 900000;
const paymentMethodLabel = {
  debito: 'Debito',
  credito: 'Credito',
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
} as const;

const AdminPanel = () => {
  const {
    products,
    updateProduct,
    addProduct,
    removeProduct,
    resetProducts,
    importProducts,
    syncEnabled,
    syncStatus,
    syncError,
    lastSyncedAt,
    syncNow,
  } = useMenu();
  const { salesHistory } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(
    products[0]?.id ?? 0
  );
  const [pinInput, setPinInput] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'ok';
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const selectedProduct = useMemo(
    () =>
      products.find((item) => item.id === selectedProductId) ?? products[0] ?? null,
    [products, selectedProductId]
  );

  const now = new Date();
  const todayKey = now.toLocaleDateString('sv-SE');
  const weekStart = new Date(now);
  const dayOfWeek = weekStart.getDay();
  const weekOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStart.setDate(weekStart.getDate() + weekOffset);
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todaysSales = useMemo(
    () => salesHistory.filter((sale) => sale.closedAt.slice(0, 10) === todayKey),
    [salesHistory, todayKey]
  );

  const todaySummary = useMemo(() => {
    const totalSales = todaysSales.length;
    const totalRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTips = todaysSales.reduce((sum, sale) => sum + sale.tipAmount, 0);
    const totalProducts = todaysSales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemsSum, item) => itemsSum + item.quantity, 0),
      0
    );

    const productMap = new Map<
      string,
      { quantity: number; revenue: number }
    >();

    todaysSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const current = productMap.get(item.name) ?? { quantity: 0, revenue: 0 };
        productMap.set(item.name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.quantity * item.price,
        });
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalSales,
      totalRevenue,
      totalTips,
      totalProducts,
      topProducts,
    };
  }, [todaysSales]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatElapsedMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} min`;
    return `${hours} h ${remainingMinutes} min`;
  };

  const syncStatusLabel = {
    disabled: 'SincronizaciÃ³n desactivada',
    loading: 'Cargando menÃº compartido',
    saving: 'Guardando cambios en Supabase',
    synced: 'MenÃº sincronizado',
    error: 'Error de sincronizaciÃ³n',
  }[syncStatus];

  const lastSyncLabel = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'AÃºn no hay una sincronizaciÃ³n registrada';

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
    toast.success('MenÃº restaurado a la versiÃ³n original');
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
    setPinInput('');
    setIsOpen(false);
    toast.success('Panel administrador bloqueado');
  };

  const optimizeImageFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('No se pudo leer la imagen'));
          return;
        }

        const image = new Image();
        image.onload = () => {
          const scale = Math.min(
            1,
            MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
          );
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('No se pudo procesar la imagen'));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          let quality = 0.82;
          let result = canvas.toDataURL('image/webp', quality);

          while (result.length > MAX_IMAGE_DATA_URL_LENGTH && quality > 0.45) {
            quality -= 0.08;
            result = canvas.toDataURL('image/webp', quality);
          }

          if (result.length > MAX_IMAGE_DATA_URL_LENGTH) {
            reject(
              new Error(
                'La imagen sigue siendo muy pesada. Prueba con una foto más liviana.'
              )
            );
            return;
          }

          resolve(result);
        };

        image.onerror = () => reject(new Error('No se pudo cargar la imagen'));
        image.src = reader.result;
      };

      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });

  const handleImageFile = async (file?: File) => {
    if (!file || !selectedProduct) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen válido');
      return;
    }

    try {
      const optimizedImage = await optimizeImageFile(file);
      handleFieldChange('image', optimizedImage);
      toast.success('Imagen actualizada');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo procesar la imagen'
      );
    }
  };

  const handleExportSales = (period: 'daily' | 'weekly' | 'monthly') => {
    const filteredSales = salesHistory.filter((sale) => {
      const closedAtDate = new Date(sale.closedAt);

      if (period === 'daily') {
        return sale.closedAt.slice(0, 10) === todayKey;
      }

      if (period === 'weekly') {
        return closedAtDate >= weekStart;
      }

      return closedAtDate >= monthStart;
    });

    if (filteredSales.length === 0) {
      const periodLabel =
        period === 'daily' ? 'hoy' : period === 'weekly' ? 'esta semana' : 'este mes';
      toast.error(`No hay ventas cerradas en ${periodLabel} para exportar`);
      return;
    }

    const rows = [
      [
        'Fecha',
        'Hora Apertura',
        'Hora Cierre',
        'Mesa',
        'Medio de Pago',
        'Tiempo Atencion (min)',
        'Subtotal Consumo',
        'Propina',
        'Total Final',
        'Producto',
        'Cantidad',
        'Precio Unitario',
        'Subtotal',
      ],
    ];

    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        rows.push([
          sale.closedAt.slice(0, 10),
          new Date(sale.openedAt).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          new Date(sale.closedAt).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sale.tableId,
          paymentMethodLabel[sale.paymentMethod],
          String(sale.elapsedMinutes),
          String(sale.subtotal),
          String(sale.tipAmount),
          String(sale.total),
          item.name,
          String(item.quantity),
          String(item.price),
          String(item.price * item.quantity),
        ]);
      });
    });

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ventas-${period}-${todayKey}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    const successLabel =
      period === 'daily' ? 'diarias' : period === 'weekly' ? 'semanales' : 'mensuales';
    toast.success(`Archivo de ventas ${successLabel} exportado`);
  };

  const handleBackupExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      products,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `respaldo-menu-${todayKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Respaldo del menÃº exportado');
  };

  const handleBackupImport = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(String(reader.result));
        const importedProducts = Array.isArray(raw) ? raw : raw.products;

        if (!Array.isArray(importedProducts) || importedProducts.length === 0) {
          throw new Error('Formato invÃ¡lido');
        }

        importProducts(importedProducts);
        setSelectedProductId(importedProducts[0]?.id ?? 0);
        toast.success('Respaldo del menÃº importado');
      } catch {
        toast.error('No se pudo importar el respaldo del menÃº');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-ocean-900 text-white rounded-full px-4 py-3 shadow-ocean-lg hover:bg-ocean-800 transition-colors flex items-center gap-2"
      >
        <Settings2 className="w-4 h-4" />
        <span className="text-sm font-medium">Admin menÃº</span>
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
                    Ingresa la clave para editar productos, revisar ventas y respaldar el menÃº.
                  </p>
                </div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(event) => setPinInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleUnlock();
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
              </div>
            </div>
          ) : (
            <div className="fixed inset-y-0 right-0 w-full max-w-7xl bg-white z-50 shadow-2xl grid grid-cols-1 lg:grid-cols-[320px_1fr]">
              <div className="border-r border-ocean-100 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl text-ocean-900 font-semibold">
                      Administrador
                    </h2>
                    <p className="text-sm text-ocean-600">
                      Productos, ventas y respaldos.
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
                  <div className="border border-ocean-200 rounded-2xl p-4 bg-ocean-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-ocean-900">
                          MenÃº compartido con la garzona
                        </p>
                        <p className="text-sm text-ocean-600">{syncStatusLabel}</p>
                        <p className="text-xs text-ocean-500">{lastSyncLabel}</p>
                        {syncError && (
                          <p className="text-xs text-red-600">{syncError}</p>
                        )}
                      </div>
                      {syncEnabled ? (
                        <Cloud className="w-5 h-5 text-ocean-600 shrink-0" />
                      ) : (
                        <CloudOff className="w-5 h-5 text-ocean-400 shrink-0" />
                      )}
                    </div>
                    <button
                      onClick={() => void syncNow()}
                      disabled={!syncEnabled || syncStatus === 'loading'}
                      className="mt-4 w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sincronizar ahora</span>
                    </button>
                  </div>

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
                    <span>Restaurar menÃº original</span>
                  </button>
                  <button
                    onClick={() => handleExportSales('daily')}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <ChartNoAxesCombined className="w-4 h-4" />
                    <span>Exportar ventas diarias</span>
                  </button>
                  <button
                    onClick={() => handleExportSales('weekly')}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <ChartNoAxesCombined className="w-4 h-4" />
                    <span>Exportar ventas semanales</span>
                  </button>
                  <button
                    onClick={() => handleExportSales('monthly')}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <ChartNoAxesCombined className="w-4 h-4" />
                    <span>Exportar ventas mensuales</span>
                  </button>
                  <button
                    onClick={handleBackupExport}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Respaldar menÃº</span>
                  </button>
                  <button
                    onClick={() => backupInputRef.current?.click()}
                    className="w-full py-3 border border-ocean-200 text-ocean-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-50 transition-colors"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Importar respaldo</span>
                  </button>
                  <input
                    ref={backupInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(event) => handleBackupImport(event.target.files?.[0])}
                  />
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
                <div className="max-w-5xl mx-auto space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ChartNoAxesCombined className="w-5 h-5 text-ocean-600" />
                      <h3 className="font-display text-2xl font-semibold text-ocean-900">
                        Reporte del dÃ­a
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-ocean-50 rounded-2xl p-5">
                        <p className="text-sm text-ocean-600">Mesas cerradas hoy</p>
                        <p className="text-3xl font-display font-semibold text-ocean-900">
                          {todaySummary.totalSales}
                        </p>
                      </div>
                      <div className="bg-ocean-50 rounded-2xl p-5">
                        <p className="text-sm text-ocean-600">Ingresos de hoy</p>
                        <p className="text-3xl font-display font-semibold text-ocean-900">
                          {formatPrice(todaySummary.totalRevenue)}
                        </p>
                      </div>
                      <div className="bg-ocean-50 rounded-2xl p-5">
                        <p className="text-sm text-ocean-600">Productos vendidos</p>
                        <p className="text-3xl font-display font-semibold text-ocean-900">
                          {todaySummary.totalProducts}
                        </p>
                      </div>
                      <div className="bg-ocean-50 rounded-2xl p-5">
                        <p className="text-sm text-ocean-600">Propinas de hoy</p>
                        <p className="text-3xl font-display font-semibold text-ocean-900">
                          {formatPrice(todaySummary.totalTips)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-ocean-100 rounded-3xl p-5">
                      <p className="font-semibold text-ocean-900 mb-4">
                        Productos mÃ¡s vendidos hoy
                      </p>
                      {todaySummary.topProducts.length > 0 ? (
                        <div className="space-y-3">
                          {todaySummary.topProducts.map((product) => (
                            <div
                              key={product.name}
                              className="flex items-center justify-between gap-4"
                            >
                              <div>
                                <p className="font-medium text-ocean-900">{product.name}</p>
                                <p className="text-sm text-ocean-500">
                                  {product.quantity} vendidos
                                </p>
                              </div>
                              <p className="font-semibold text-ocean-700">
                                {formatPrice(product.revenue)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-ocean-500">
                          AÃºn no hay ventas cerradas hoy en este dispositivo.
                        </p>
                      )}
                    </div>

                    {todaysSales.length > 0 && (
                      <div className="bg-white border border-ocean-100 rounded-3xl p-5">
                        <p className="font-semibold text-ocean-900 mb-4">
                          Ultimos cierres de hoy
                        </p>
                        <div className="space-y-4">
                          {todaysSales.slice(0, 5).map((sale) => (
                            <div
                              key={sale.id}
                              className="rounded-2xl border border-ocean-100 p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="font-medium text-ocean-900">
                                  Mesa {sale.tableId}
                                </p>
                                <p className="text-sm text-ocean-500">
                                  {paymentMethodLabel[sale.paymentMethod]}
                                </p>
                              </div>
                              <div className="mt-3 grid gap-2 text-sm text-ocean-600 sm:grid-cols-2">
                                <p>Apertura: {formatDateTime(sale.openedAt)}</p>
                                <p>Cierre: {formatDateTime(sale.closedAt)}</p>
                                <p>Tiempo: {formatElapsedMinutes(sale.elapsedMinutes)}</p>
                                <p>Subtotal: {formatPrice(sale.subtotal)}</p>
                                <p>Propina: {formatPrice(sale.tipAmount)}</p>
                                <p>Total: {formatPrice(sale.total)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-ocean-600" />
                      <h3 className="font-display text-2xl font-semibold text-ocean-900">
                        Editor de productos
                      </h3>
                    </div>

                    {selectedProduct ? (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full sm:w-56 h-56 object-cover rounded-3xl shadow-ocean"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-display text-3xl font-semibold text-ocean-900">
                              {selectedProduct.name}
                            </h4>
                            <p className="text-ocean-600">ID #{selectedProduct.id}</p>
                            <button
                              onClick={handleDeleteProduct}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar producto</span>
                            </button>
                          </div>
                        </div>

                        <div
                          onDragOver={(event) => {
                            event.preventDefault();
                            setIsDraggingImage(true);
                          }}
                          onDragLeave={() => setIsDraggingImage(false)}
                          onDrop={(event) => {
                            event.preventDefault();
                            setIsDraggingImage(false);
                            handleImageFile(event.dataTransfer.files?.[0]);
                          }}
                          className={`border-2 border-dashed rounded-2xl p-5 transition-colors ${
                            isDraggingImage
                              ? 'border-ocean-500 bg-ocean-50'
                              : 'border-ocean-200 bg-white'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <p className="font-medium text-ocean-900">
                                Subir foto del producto
                              </p>
                              <p className="text-sm text-ocean-600">
                                Arrastra una imagen aquÃ­ o sÃºbela desde tu equipo.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-ocean-500 text-white rounded-xl font-medium hover:bg-ocean-600 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Subir imagen</span>
                            </button>
                          </div>
                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleImageFile(event.target.files?.[0])}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-ocean-700">Nombre</span>
                            <input
                              value={selectedProduct.name}
                              onChange={(event) =>
                                handleFieldChange('name', event.target.value)
                              }
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
                                handleFieldChange(
                                  'price',
                                  Number(event.target.value) || 0
                                )
                              }
                              className="w-full px-4 py-3 border border-ocean-200 rounded-xl focus:outline-none focus:border-ocean-500"
                            />
                          </label>
                        </div>

                        <label className="space-y-2 block">
                          <span className="text-sm font-medium text-ocean-700">DescripciÃ³n</span>
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
                            <span className="text-sm font-medium text-ocean-700">CategorÃ­a</span>
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
                            <span className="text-sm font-medium text-ocean-700">
                              Imagen base
                            </span>
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
                          {syncEnabled
                            ? 'Los cambios del menÃº se guardan aquÃ­ y tambiÃ©n se reflejan en el celular que use el mismo Supabase.'
                            : 'Los cambios del menÃº se guardan automÃ¡ticamente en este navegador.'}
                        </div>

                        <div className="bg-sand-100 rounded-2xl p-4 text-sm text-ocean-700">
                          Usa â€œRespaldar menÃºâ€ para guardar una copia del menÃº editado y
                          â€œImportar respaldoâ€ para restaurarlo despuÃ©s si cambias de navegador o
                          borras cachÃ©.
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-ocean-500">
                        No hay productos para editar.
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminPanel;
