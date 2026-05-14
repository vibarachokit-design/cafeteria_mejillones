import { useCart } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  Trash2,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    selectedTable,
    setSelectedTable,
    openTables,
    submitCurrentOrder,
    closeTable,
    currentTableItems,
    currentTableTotal,
  } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);

  const buildMessage = (tableId: string, tableItems: typeof currentTableItems, title: string) => {
    let message = `📋 *${title}*\n\n`;
    message += `🪑 *Mesa:* ${tableId}\n\n`;
    message += '*Productos:*\n';

    tableItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(
        item.price * item.quantity
      )}\n`;
    });

    const total = tableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    message += `\n*Total:* ${formatPrice(total)}\n\n`;
    message += 'Gracias 😊';
    return message;
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=56933806302&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendCurrentOrder = () => {
    if (items.length === 0) {
      toast.error('Agrega productos antes de enviar un pedido parcial');
      return;
    }

    if (!selectedTable) {
      toast.error('Selecciona la mesa antes de enviar el pedido');
      return;
    }

    openWhatsApp(
      buildMessage(selectedTable, items, 'Pedido Espacio Kihnally')
    );
    submitCurrentOrder();
    toast.success('Pedido enviado. La mesa quedó abierta para seguir agregando productos.');
  };

  const handleCloseTable = () => {
    if (!selectedTable) {
      toast.error('Selecciona una mesa para cerrar la cuenta');
      return;
    }

    const result = closeTable();
    if (!result) {
      toast.error('No hay productos acumulados para cerrar esta mesa');
      return;
    }

    openWhatsApp(
      buildMessage(result.tableId, result.items, 'Cuenta Final Espacio Kihnally')
    );
    toast.success('Cuenta final enviada y mesa cerrada.');
  };

  if (!isCartOpen) return null;

  const hasOpenTable = selectedTable && openTables[selectedTable];
  const hasAccumulatedItems = currentTableItems.length > items.length;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-6 border-b border-ocean-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ocean-500 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ocean-900">
                Tu Pedido
              </h2>
              <p className="text-ocean-600 text-sm">
                {totalItems} {totalItems === 1 ? 'producto nuevo' : 'productos nuevos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-ocean-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-ocean-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="table-select"
              className="block text-sm font-medium text-ocean-700"
            >
              Selecciona tu mesa
            </label>
            <select
              id="table-select"
              value={selectedTable}
              onChange={(event) => setSelectedTable(event.target.value)}
              disabled={items.length > 0}
              className="w-full px-4 py-3 bg-white border-2 border-ocean-200 text-ocean-900 rounded-xl font-medium focus:outline-none focus:border-ocean-500 transition-colors disabled:bg-ocean-50 disabled:text-ocean-400"
            >
              <option value="">Elige una mesa</option>
              {Array.from({ length: 20 }, (_, index) => (
                <option key={index + 1} value={`${index + 1}`}>
                  Mesa {index + 1}
                </option>
              ))}
            </select>
            {items.length > 0 && (
              <p className="text-xs text-ocean-500">
                Para evitar mezclar pedidos, la mesa se puede cambiar cuando el pedido nuevo esté vacío.
              </p>
            )}
          </div>

          {Object.keys(openTables).length > 0 && (
            <div className="bg-ocean-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-ocean-900 mb-3">Mesas abiertas</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(openTables).map((table) => (
                  <button
                    key={table.tableId}
                    onClick={() => {
                      if (items.length > 0 && selectedTable !== table.tableId) {
                        toast.error('Envía o vacía el pedido nuevo antes de cambiar de mesa');
                        return;
                      }
                      setSelectedTable(table.tableId);
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTable === table.tableId
                        ? 'bg-ocean-500 text-white'
                        : 'bg-white text-ocean-700 border border-ocean-200 hover:bg-ocean-100'
                    }`}
                  >
                    Mesa {table.tableId}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTable && (hasOpenTable || hasAccumulatedItems) && (
            <div className="bg-sand-100 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-ocean-900">
                Mesa {selectedTable} sigue abierta
              </p>
              <div className="flex items-center justify-between text-sm text-ocean-700">
                <span>Acumulado mesa</span>
                <span>{formatPrice(currentTableTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-ocean-700">
                <span>Pedido nuevo</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center pt-10">
              <div className="w-20 h-20 bg-ocean-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-ocean-400" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ocean-900 mb-2">
                No hay productos nuevos en el carrito
              </h3>
              <p className="text-ocean-600 text-sm mb-6">
                Puedes agregar productos o cerrar la mesa si ya quieres enviar la cuenta final.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 bg-ocean-500 text-white rounded-full font-medium hover:bg-ocean-600 transition-colors"
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-ocean-50/50 rounded-xl p-4 flex gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-ocean-900 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-ocean-500 text-sm mb-2">
                      {formatPrice(item.price)} c/u
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-ocean-200 hover:bg-ocean-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-ocean-600" />
                        </button>
                        <span className="w-8 text-center font-medium text-ocean-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-ocean-200 hover:bg-ocean-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-ocean-600" />
                        </button>
                      </div>
                      <span className="font-semibold text-ocean-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-ocean-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-ocean-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-ocean-600">Pedido nuevo</span>
            <span className="font-medium text-ocean-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ocean-600">Acumulado mesa</span>
            <span className="font-medium text-ocean-900">
              {formatPrice(currentTableTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-display font-semibold text-ocean-900">
              Cuenta final actual
            </span>
            <span className="font-display font-bold text-ocean-600 text-2xl">
              {formatPrice(currentTableTotal)}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSendCurrentOrder}
              className="w-full py-4 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Enviar pedido y dejar mesa abierta</span>
            </button>
            <button
              onClick={handleCloseTable}
              className="w-full py-4 bg-ocean-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-800 transition-colors"
            >
              <Receipt className="w-5 h-5" />
              <span>Cerrar mesa y enviar cuenta final</span>
            </button>
            <button
              onClick={clearCart}
              className="w-full py-3 border-2 border-ocean-200 text-ocean-600 rounded-xl font-medium hover:bg-ocean-50 transition-colors"
            >
              Vaciar pedido nuevo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
