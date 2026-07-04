import { useMemo, useState } from 'react';
import { useCart, type CartItem, type PaymentMethod } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  Trash2,
  Receipt,
  CreditCard,
  Landmark,
  Wallet,
  ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';

const paymentOptions: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}> = [
  {
    id: 'debito',
    label: 'Débito',
    description: 'Pago con tarjeta de débito',
    icon: Landmark,
  },
  {
    id: 'credito',
    label: 'Crédito',
    description: 'Pago con tarjeta de crédito',
    icon: CreditCard,
  },
  {
    id: 'efectivo',
    label: 'Efectivo',
    description: 'Pago en efectivo',
    icon: Wallet,
  },
  {
    id: 'transferencia',
    label: 'Transferencia',
    description: 'Pago por transferencia bancaria',
    icon: ArrowRightLeft,
  },
];

const businessLabel = 'Espacio Kihnally';
const printStyles = `
  <style>
    body { margin: 0; padding: 16px; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #fff; }
    .ticket { max-width: 320px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; }
    .center { text-align: center; }
    .muted { color: #475569; }
    .row { display: flex; justify-content: space-between; gap: 12px; margin: 6px 0; }
    .divider { border-top: 1px dashed #94a3b8; margin: 12px 0; }
    .item { display: flex; justify-content: space-between; gap: 12px; margin: 8px 0; align-items: flex-start; }
    .item-name { flex: 1; font-size: 14px; line-height: 1.35; }
    .item-price { white-space: nowrap; font-size: 14px; }
    .total { font-size: 18px; font-weight: 700; }
    h1, h2, p { margin: 0; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    h2 { font-size: 14px; margin-bottom: 12px; }
    @media print { body { padding: 0; } .ticket { border: 0; border-radius: 0; } }
  </style>
`;

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>('debito');
  const [closeStep, setCloseStep] = useState<'payment' | 'tip'>('payment');
  const [includeTip, setIncludeTip] = useState(false);

  const activeOpenTable = selectedTable ? openTables[selectedTable] : undefined;

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
    const safeMinutes = Math.max(0, minutes);
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours === 0) return `${remainingMinutes} min`;
    return `${hours} h ${remainingMinutes} min`;
  };

  const paymentMethodLabel = (paymentMethod: PaymentMethod) =>
    paymentOptions.find((option) => option.id === paymentMethod)?.label ?? paymentMethod;

  const suggestedTip = Math.round(currentTableTotal * 0.1);
  const totalWithTip = currentTableTotal + suggestedTip;

  const escapeHtml = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const openPrintWindow = (title: string, bodyHtml: string) => {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=420,height=720');

    if (!printWindow) {
      toast.error('No se pudo abrir la impresión. Revisa si el navegador bloqueó la ventana.');
      return;
    }

    printWindow.document.write(`
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(title)}</title>
          ${printStyles}
        </head>
        <body>
          ${bodyHtml}
          <script>
            window.onload = () => {
              setTimeout(() => window.print(), 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const buildItemsHtml = (tableItems: CartItem[]) =>
    tableItems
      .map(
        (item) => `
          <div class="item">
            <div class="item-name">${escapeHtml(item.name)} x${item.quantity}</div>
            <div class="item-price">${escapeHtml(
              formatPrice(item.price * item.quantity)
            )}</div>
          </div>
        `
      )
      .join('');

  const buildOrderMessage = (
    tableId: string,
    tableItems: CartItem[],
    sentAt: string,
    title: string
  ) => {
    let message = `📋 *${title}*\n\n`;
    message += `🪑 *Mesa:* ${tableId}\n`;
    message += `📅 *Fecha:* ${formatDateTime(sentAt)}\n\n`;
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
    message += `\n*Total pedido:* ${formatPrice(total)}\n\n`;
    message += 'Gracias 😊';
    return message;
  };

  const buildFinalMessage = ({
    tableId,
    tableItems,
    openedAt,
    closedAt,
    total,
    subtotal,
    tipAmount,
    paymentMethod,
    elapsedMinutes,
  }: {
    tableId: string;
    tableItems: CartItem[];
    openedAt: string;
    closedAt: string;
    subtotal: number;
    tipAmount: number;
    total: number;
    paymentMethod: PaymentMethod;
    elapsedMinutes: number;
  }) => {
    let message = '🧾 *Cuenta Final Espacio Kihnally*\n\n';
    message += `🪑 *Mesa:* ${tableId}\n`;
    message += `📅 *Apertura:* ${formatDateTime(openedAt)}\n`;
    message += `✅ *Cierre:* ${formatDateTime(closedAt)}\n`;
    message += `⏱️ *Tiempo de atención:* ${formatElapsedMinutes(elapsedMinutes)}\n`;
    message += `💳 *Medio de pago:* ${paymentMethodLabel(paymentMethod)}\n\n`;
    message += '*Consumo:*\n';

    tableItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(
        item.price * item.quantity
      )}\n`;
    });

    message += `\n*Subtotal consumo:* ${formatPrice(subtotal)}\n`;
    message += `*Propina:* ${tipAmount > 0 ? formatPrice(tipAmount) : 'No incluida'}\n`;
    message += `*Total final:* ${formatPrice(total)}\n\n`;
    message += 'Gracias 😊';
    return message;
  };

  const printPartialTicket = ({
    tableId,
    tableItems,
    sentAt,
  }: {
    tableId: string;
    tableItems: CartItem[];
    sentAt: string;
  }) => {
    const total = tableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    openPrintWindow(
      `Pedido Mesa ${tableId}`,
      `
        <section class="ticket">
          <div class="center">
            <h1>${businessLabel}</h1>
            <h2>Pedido parcial</h2>
          </div>
          <div class="row"><span>Mesa</span><strong>${escapeHtml(tableId)}</strong></div>
          <div class="row"><span>Fecha</span><span>${escapeHtml(formatDateTime(sentAt))}</span></div>
          <div class="divider"></div>
          ${buildItemsHtml(tableItems)}
          <div class="divider"></div>
          <div class="row total"><span>Total pedido</span><span>${escapeHtml(
            formatPrice(total)
          )}</span></div>
          <div class="divider"></div>
          <p class="center muted">Ticket generado desde la garzona</p>
        </section>
      `
    );
  };

  const printFinalTicket = ({
    tableId,
    tableItems,
    openedAt,
    closedAt,
    subtotal,
    tipAmount,
    total,
    paymentMethod,
    elapsedMinutes,
  }: {
    tableId: string;
    tableItems: CartItem[];
    openedAt: string;
    closedAt: string;
    subtotal: number;
    tipAmount: number;
    total: number;
    paymentMethod: PaymentMethod;
    elapsedMinutes: number;
  }) => {
    openPrintWindow(
      `Cuenta Mesa ${tableId}`,
      `
        <section class="ticket">
          <div class="center">
            <h1>${businessLabel}</h1>
            <h2>Cuenta final</h2>
          </div>
          <div class="row"><span>Mesa</span><strong>${escapeHtml(tableId)}</strong></div>
          <div class="row"><span>Apertura</span><span>${escapeHtml(
            formatDateTime(openedAt)
          )}</span></div>
          <div class="row"><span>Cierre</span><span>${escapeHtml(
            formatDateTime(closedAt)
          )}</span></div>
          <div class="row"><span>Atención</span><span>${escapeHtml(
            formatElapsedMinutes(elapsedMinutes)
          )}</span></div>
          <div class="row"><span>Pago</span><span>${escapeHtml(
            paymentMethodLabel(paymentMethod)
          )}</span></div>
          <div class="divider"></div>
          ${buildItemsHtml(tableItems)}
          <div class="divider"></div>
          <div class="row"><span>Subtotal</span><span>${escapeHtml(
            formatPrice(subtotal)
          )}</span></div>
          <div class="row"><span>Propina</span><span>${escapeHtml(
            tipAmount > 0 ? formatPrice(tipAmount) : 'No incluida'
          )}</span></div>
          <div class="row total"><span>Total</span><span>${escapeHtml(
            formatPrice(total)
          )}</span></div>
          <div class="divider"></div>
          <p class="center muted">Gracias por su visita</p>
        </section>
      `
    );
  };

  const handlePrintCurrentOrderTicket = () => {
    if (!selectedTable) {
      toast.error('Selecciona la mesa antes de imprimir el pedido');
      return;
    }

    if (items.length === 0) {
      toast.error('No hay productos nuevos para imprimir');
      return;
    }

    printPartialTicket({
      tableId: selectedTable,
      tableItems: items,
      sentAt: new Date().toISOString(),
    });
  };

  const handlePrintFinalTicketPreview = () => {
    if (!selectedTable) {
      toast.error('Selecciona una mesa para imprimir la cuenta');
      return;
    }

    if (currentTableItems.length === 0) {
      toast.error('No hay productos acumulados para imprimir esta cuenta');
      return;
    }

    const openedAt = activeOpenTable?.openedAt ?? new Date().toISOString();
    const closedAt = new Date().toISOString();
    const subtotal = currentTableTotal;
    const tipAmount = includeTip ? suggestedTip : 0;
    const total = subtotal + tipAmount;
    const elapsedMinutes = Math.max(
      0,
      Math.round(
        (new Date(closedAt).getTime() - new Date(openedAt).getTime()) / 60000
      )
    );

    printFinalTicket({
      tableId: selectedTable,
      tableItems: currentTableItems,
      openedAt,
      closedAt,
      subtotal,
      tipAmount,
      total,
      paymentMethod: selectedPaymentMethod,
      elapsedMinutes,
    });
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=56933806302&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendCurrentOrder = async () => {
    if (items.length === 0) {
      toast.error('Agrega productos antes de enviar un pedido parcial');
      return;
    }

    if (!selectedTable) {
      toast.error('Selecciona la mesa antes de enviar el pedido');
      return;
    }

    const sentAt = new Date().toISOString();
    openWhatsApp(
      buildOrderMessage(selectedTable, items, sentAt, 'Pedido Espacio Kihnally')
    );
    await submitCurrentOrder();
    toast.success('Pedido enviado. La mesa quedó abierta para seguir agregando productos.');
  };

  const handleStartCloseTable = () => {
    if (!selectedTable) {
      toast.error('Selecciona una mesa para cerrar la cuenta');
      return;
    }

    if (currentTableItems.length === 0) {
      toast.error('No hay productos acumulados para cerrar esta mesa');
      return;
    }

    setSelectedPaymentMethod('debito');
    setIncludeTip(false);
    setCloseStep('payment');
    setIsPaymentModalOpen(true);
  };

  const handleConfirmCloseTable = async () => {
    const result = await closeTable(selectedPaymentMethod, includeTip);
    if (!result) {
      toast.error('No se pudo cerrar la mesa');
      return;
    }

    openWhatsApp(
      buildFinalMessage({
        tableId: result.tableId,
        tableItems: result.items,
        openedAt: result.openedAt,
        closedAt: result.closedAt,
        subtotal: result.subtotal,
        tipAmount: result.tipAmount,
        total: result.total,
        paymentMethod: result.paymentMethod,
        elapsedMinutes: result.elapsedMinutes,
      })
    );

    setIsPaymentModalOpen(false);
    setCloseStep('payment');
    setIncludeTip(false);
    toast.success('Cuenta final enviada y mesa cerrada.');
  };

  const hasOpenTable = selectedTable && openTables[selectedTable];
  const hasAccumulatedItems = currentTableItems.length > items.length;
  const openedAtLabel = useMemo(() => {
    if (!activeOpenTable?.openedAt) return null;
    return formatDateTime(activeOpenTable.openedAt);
  }, [activeOpenTable]);

  if (!isCartOpen) return null;

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

        <div className="md:hidden px-6 pt-4">
          <div className="bg-ocean-900 text-white rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Mesa activa</p>
              <p className="font-semibold">
                {selectedTable ? `Mesa ${selectedTable}` : 'Selecciona una mesa'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Productos nuevos</p>
              <p className="font-semibold">{totalItems}</p>
            </div>
          </div>
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
              disabled={items.length > 0 && Boolean(selectedTable)}
              className="w-full px-4 py-3 bg-white border-2 border-ocean-200 text-ocean-900 rounded-xl font-medium focus:outline-none focus:border-ocean-500 transition-colors disabled:bg-ocean-50 disabled:text-ocean-400"
            >
              <option value="">Elige una mesa</option>
              {Array.from({ length: 20 }, (_, index) => (
                <option key={index + 1} value={`${index + 1}`}>
                  Mesa {index + 1}
                </option>
              ))}
            </select>
            {items.length > 0 && selectedTable && (
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
              {openedAtLabel && (
                <div className="flex items-center justify-between text-sm text-ocean-700">
                  <span>Apertura mesa</span>
                  <span>{openedAtLabel}</span>
                </div>
              )}
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

        <div className="border-t border-ocean-100 p-5 md:p-6 space-y-4 bg-white">
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
              className="w-full py-4 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm md:text-base"
            >
              <Send className="w-5 h-5" />
              <span>Enviar pedido y dejar mesa abierta</span>
            </button>
            <button
              onClick={handlePrintCurrentOrderTicket}
              className="w-full py-3 border-2 border-ocean-200 text-ocean-700 rounded-xl font-medium hover:bg-ocean-50 transition-colors"
            >
              Imprimir ticket del pedido
            </button>
            <button
              onClick={handleStartCloseTable}
              className="w-full py-4 bg-ocean-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ocean-800 transition-colors text-sm md:text-base"
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

      {isPaymentModalOpen && closeStep === 'payment' && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => setIsPaymentModalOpen(false)}
          />
          <div className="fixed inset-x-4 top-1/2 z-[61] mx-auto w-auto max-w-md -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ocean-900">
                  Cerrar mesa
                </h3>
                <p className="mt-2 text-sm text-ocean-600">
                  Elige el medio de pago antes de enviar la cuenta final por WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-lg p-2 hover:bg-ocean-50 transition-colors"
              >
                <X className="w-5 h-5 text-ocean-600" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPaymentMethod(option.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      selectedPaymentMethod === option.id
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-ocean-200 hover:bg-ocean-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 shadow-sm">
                        <Icon className="w-5 h-5 text-ocean-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-ocean-900">{option.label}</p>
                        <p className="text-sm text-ocean-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-sand-100 p-4 text-sm text-ocean-700">
              La cuenta incluirá fecha, hora, medio de pago y tiempo total desde la apertura de la mesa.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 rounded-xl border border-ocean-200 px-4 py-3 font-medium text-ocean-700 hover:bg-ocean-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => setCloseStep('tip')}
                className="flex-1 rounded-xl bg-ocean-900 px-4 py-3 font-medium text-white hover:bg-ocean-800 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </>
      )}

      {isPaymentModalOpen && closeStep === 'tip' && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[62]"
            onClick={() => {
              setIsPaymentModalOpen(false);
              setCloseStep('payment');
            }}
          />
          <div className="fixed inset-x-4 top-1/2 z-[63] mx-auto w-auto max-w-md -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-ocean-900">
                  Propina sugerida
                </h3>
                <p className="mt-2 text-sm text-ocean-600">
                  ¿Desea agregar propina? En Chile la sugerida es el 10% del consumo.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setCloseStep('payment');
                }}
                className="rounded-lg p-2 hover:bg-ocean-50 transition-colors"
              >
                <X className="w-5 h-5 text-ocean-600" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIncludeTip(false)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  !includeTip
                    ? 'border-ocean-500 bg-ocean-50'
                    : 'border-ocean-200 hover:bg-ocean-50'
                }`}
              >
                <p className="font-semibold text-ocean-900">Sin propina</p>
                <p className="text-sm text-ocean-600">
                  Total a cobrar: {formatPrice(currentTableTotal)}
                </p>
              </button>

              <button
                onClick={() => setIncludeTip(true)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  includeTip
                    ? 'border-ocean-500 bg-ocean-50'
                    : 'border-ocean-200 hover:bg-ocean-50'
                }`}
              >
                <p className="font-semibold text-ocean-900">Agregar propina sugerida</p>
                <p className="text-sm text-ocean-600">
                  10%: {formatPrice(suggestedTip)} | Total a cobrar: {formatPrice(totalWithTip)}
                </p>
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-sand-100 p-4 text-sm text-ocean-700">
              Medio de pago seleccionado: {paymentMethodLabel(selectedPaymentMethod)}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handlePrintFinalTicketPreview}
                className="flex-1 rounded-xl border border-ocean-200 px-4 py-3 font-medium text-ocean-700 hover:bg-ocean-50 transition-colors"
              >
                Imprimir ticket
              </button>
              <button
                onClick={() => setCloseStep('payment')}
                className="flex-1 rounded-xl border border-ocean-200 px-4 py-3 font-medium text-ocean-700 hover:bg-ocean-50 transition-colors"
              >
                Cambiar medio de pago
              </button>
              <button
                onClick={handleConfirmCloseTable}
                className="flex-1 rounded-xl bg-ocean-900 px-4 py-3 font-medium text-white hover:bg-ocean-800 transition-colors"
              >
                Enviar cuenta final
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartDrawer;
