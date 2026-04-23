import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CartDrawer = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSendWhatsApp = () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!selectedTable) {
      toast.error('Selecciona la mesa antes de enviar el pedido');
      return;
    }

    let message = '📋 *Pedido Espacio Kihnally*\n\n';
    message += `🪑 *Mesa:* ${selectedTable}\n\n`;
    message += '*Productos:*\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n*Total:* ${formatPrice(totalPrice)}\n\n`;
    message += 'Gracias! 😊';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=56933806302&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('¡Pedido enviado por WhatsApp!');
    clearCart();
    setSelectedTable('');
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
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
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
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

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-ocean-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-ocean-400" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ocean-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-ocean-600 text-sm mb-6">
                Agrega productos del menú para comenzar tu pedido
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
                      {/* Quantity Controls */}
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
                      {/* Item Total */}
                      <span className="font-semibold text-ocean-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  {/* Remove Button */}
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ocean-100 p-6 space-y-4">
            {/* Table Selection */}
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
                className="w-full px-4 py-3 bg-white border-2 border-ocean-200 text-ocean-900 rounded-xl font-medium focus:outline-none focus:border-ocean-500 transition-colors"
              >
                <option value="">Elige una mesa</option>
                {Array.from({ length: 20 }, (_, index) => (
                  <option key={index + 1} value={`${index + 1}`}>
                    Mesa {index + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-ocean-600">Subtotal</span>
              <span className="font-medium text-ocean-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-display font-semibold text-ocean-900">
                Total
              </span>
              <span className="font-display font-bold text-ocean-600 text-2xl">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Enviar pedido por WhatsApp</span>
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 border-2 border-ocean-200 text-ocean-600 rounded-xl font-medium hover:bg-ocean-50 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
