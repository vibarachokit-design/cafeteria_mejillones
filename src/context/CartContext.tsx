import React, { createContext, useContext, useMemo, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export type PaymentMethod =
  | 'debito'
  | 'credito'
  | 'efectivo'
  | 'transferencia';

export interface OpenTable {
  tableId: string;
  items: CartItem[];
  openedAt: string;
  lastSentAt: string | null;
}

export interface SaleRecord {
  id: string;
  tableId: string;
  openedAt: string;
  closedAt: string;
  subtotal: number;
  tipAmount: number;
  total: number;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  elapsedMinutes: number;
}

interface CloseTableResult {
  tableId: string;
  items: CartItem[];
  openedAt: string;
  closedAt: string;
  subtotal: number;
  tipAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  elapsedMinutes: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedTable: string;
  setSelectedTable: (tableId: string) => void;
  openTables: Record<string, OpenTable>;
  submitCurrentOrder: () => OpenTable | null;
  closeTable: (
    paymentMethod: PaymentMethod,
    includeTip: boolean
  ) => CloseTableResult | null;
  currentTableItems: CartItem[];
  currentTableTotal: number;
  salesHistory: SaleRecord[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ITEMS_KEY = 'espacio-kihnally-cart-items';
const TABLE_KEY = 'espacio-kihnally-selected-table';
const OPEN_TABLES_KEY = 'espacio-kihnally-open-tables';
const SALES_HISTORY_KEY = 'espacio-kihnally-sales-history';
const TIP_RATE = 0.1;

const mergeItems = (items: CartItem[]) => {
  const merged = new Map<number, CartItem>();

  items.forEach((item) => {
    const existing = merged.get(item.id);
    if (existing) {
      merged.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      return;
    }

    merged.set(item.id, { ...item });
  });

  return Array.from(merged.values());
};

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const normalizeOpenTables = (tables: Record<string, OpenTable>) => {
  return Object.fromEntries(
    Object.entries(tables).map(([tableId, table]) => [
      tableId,
      {
        tableId,
        items: Array.isArray(table.items) ? table.items : [],
        openedAt: table.openedAt ?? table.lastSentAt ?? new Date().toISOString(),
        lastSentAt: table.lastSentAt ?? null,
      },
    ])
  );
};

const normalizeSalesHistory = (sales: SaleRecord[]) => {
  return sales.map((sale) => {
    const openedAt = sale.openedAt ?? sale.closedAt;
    const closedAt = sale.closedAt;
    const elapsedMinutes =
      sale.elapsedMinutes ??
      Math.max(
        0,
        Math.round(
          (new Date(closedAt).getTime() - new Date(openedAt).getTime()) / 60000
        )
      );

    return {
      ...sale,
      openedAt,
      subtotal: sale.subtotal ?? sale.total,
      tipAmount: sale.tipAmount ?? 0,
      paymentMethod: sale.paymentMethod ?? 'efectivo',
      elapsedMinutes,
    };
  });
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage(ITEMS_KEY, []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTable, setSelectedTableState] = useState<string>(() =>
    readStorage(TABLE_KEY, '')
  );
  const [openTables, setOpenTables] = useState<Record<string, OpenTable>>(() =>
    normalizeOpenTables(readStorage(OPEN_TABLES_KEY, {}))
  );
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>(() =>
    normalizeSalesHistory(readStorage(SALES_HISTORY_KEY, []))
  );

  const persistItems = (nextItems: CartItem[]) => {
    setItems(nextItems);
    window.localStorage.setItem(ITEMS_KEY, JSON.stringify(nextItems));
  };

  const persistTables = (nextTables: Record<string, OpenTable>) => {
    setOpenTables(nextTables);
    window.localStorage.setItem(OPEN_TABLES_KEY, JSON.stringify(nextTables));
  };

  const setSelectedTable = (tableId: string) => {
    setSelectedTableState(tableId);
    window.localStorage.setItem(TABLE_KEY, JSON.stringify(tableId));
  };

  const persistSalesHistory = (nextSalesHistory: SaleRecord[]) => {
    setSalesHistory(nextSalesHistory);
    window.localStorage.setItem(
      SALES_HISTORY_KEY,
      JSON.stringify(nextSalesHistory)
    );
  };

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    persistItems(
      items.some((item) => item.id === newItem.id)
        ? items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...items, { ...newItem, quantity: 1 }]
    );
  };

  const removeItem = (id: number) => {
    persistItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    persistItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    persistItems([]);
  };

  const submitCurrentOrder = () => {
    if (!selectedTable || items.length === 0) return null;

    const now = new Date().toISOString();
    const existingTable = openTables[selectedTable];
    const nextTable: OpenTable = {
      tableId: selectedTable,
      items: mergeItems([...(existingTable?.items ?? []), ...items]),
      openedAt: existingTable?.openedAt ?? now,
      lastSentAt: now,
    };

    persistTables({
      ...openTables,
      [selectedTable]: nextTable,
    });
    persistItems([]);

    return nextTable;
  };

  const closeTable = (paymentMethod: PaymentMethod, includeTip: boolean) => {
    if (!selectedTable) return null;

    const existingTable = openTables[selectedTable];
    const allItems = mergeItems([...(existingTable?.items ?? []), ...items]);
    if (allItems.length === 0) return null;

    const tableId = selectedTable;
    const openedAt = existingTable?.openedAt ?? new Date().toISOString();
    const closedAt = new Date().toISOString();
    const subtotal = allItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tipAmount = includeTip ? Math.round(subtotal * TIP_RATE) : 0;
    const total = subtotal + tipAmount;
    const elapsedMinutes = Math.max(
      0,
      Math.round(
        (new Date(closedAt).getTime() - new Date(openedAt).getTime()) / 60000
      )
    );

    const nextTables = { ...openTables };
    delete nextTables[selectedTable];
    persistTables(nextTables);
    persistItems([]);

    persistSalesHistory([
      {
        id: `${tableId}-${closedAt}`,
        tableId,
        openedAt,
        closedAt,
        subtotal,
        tipAmount,
        total,
        items: allItems,
        paymentMethod,
        elapsedMinutes,
      },
      ...salesHistory,
    ]);
    setSelectedTable('');

    return {
      tableId,
      items: allItems,
      openedAt,
      closedAt,
      subtotal,
      tipAmount,
      total,
      paymentMethod,
      elapsedMinutes,
    };
  };

  const currentTableItems = useMemo(() => {
    if (!selectedTable) return items;
    return mergeItems([...(openTables[selectedTable]?.items ?? []), ...items]);
  }, [items, openTables, selectedTable]);

  const currentTableTotal = currentTableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
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
      salesHistory,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      selectedTable,
      openTables,
      currentTableItems,
      currentTableTotal,
      salesHistory,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
