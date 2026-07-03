import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defaultMenuProducts, type MenuProduct } from '@/data/menuData';
import {
  fetchRemoteMenu,
  isMenuSyncEnabled,
  saveRemoteMenu,
  type RemoteMenuPayload,
} from '@/lib/menuSync';

type SyncStatus = 'disabled' | 'loading' | 'saving' | 'synced' | 'error';

interface MenuContextType {
  products: MenuProduct[];
  updateProduct: (product: MenuProduct) => void;
  addProduct: () => number;
  removeProduct: (id: number) => void;
  resetProducts: () => void;
  importProducts: (nextProducts: MenuProduct[]) => void;
  syncStatus: SyncStatus;
  syncError: string;
  lastSyncedAt: string | null;
  syncEnabled: boolean;
  syncNow: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEY = 'espacio-kihnally-menu-products';
const REMOTE_POLL_INTERVAL_MS = 20000;

const loadInitialProducts = () => {
  if (typeof window === 'undefined') return defaultMenuProducts;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultMenuProducts;

  try {
    const parsed = JSON.parse(stored) as MenuProduct[];
    return parsed.length > 0 ? parsed : defaultMenuProducts;
  } catch {
    return defaultMenuProducts;
  }
};

const persistLocalProducts = (nextProducts: MenuProduct[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
  } catch (error) {
    console.warn('No se pudo guardar el menú completo en localStorage.', error);
  }
};

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const syncEnabled = isMenuSyncEnabled();
  const [products, setProducts] = useState<MenuProduct[]>(loadInitialProducts);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    syncEnabled ? 'loading' : 'disabled'
  );
  const [syncError, setSyncError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const productsRef = useRef(products);
  const lastSyncedAtRef = useRef<string | null>(null);
  const skipNextRemoteSaveRef = useRef(false);
  const hasFinishedInitialSyncRef = useRef(!syncEnabled);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    lastSyncedAtRef.current = lastSyncedAt;
  }, [lastSyncedAt]);

  const persist = useCallback(
    (nextProducts: MenuProduct[], options?: { skipRemoteSave?: boolean }) => {
      if (options?.skipRemoteSave) {
        skipNextRemoteSaveRef.current = true;
      }

      setProducts(nextProducts);
      persistLocalProducts(nextProducts);
    },
    []
  );

  const applyRemotePayload = useCallback(
    (payload: RemoteMenuPayload | null) => {
      if (!payload) return;
      if (!Array.isArray(payload.products) || payload.products.length === 0) return;

      const nextSerialized = JSON.stringify(payload.products);
      const currentSerialized = JSON.stringify(productsRef.current);

      if (nextSerialized !== currentSerialized) {
        persist(payload.products, { skipRemoteSave: true });
      }

      setLastSyncedAt(payload.updatedAt);
      setSyncStatus('synced');
      setSyncError('');
    },
    [persist]
  );

  const syncNow = useCallback(async () => {
    if (!syncEnabled) return;

    try {
      setSyncStatus('loading');
      const payload = await fetchRemoteMenu();
      applyRemotePayload(payload);
      hasFinishedInitialSyncRef.current = true;

      if (!payload) {
        setSyncStatus('synced');
        setSyncError('');
      }
    } catch (error) {
      hasFinishedInitialSyncRef.current = true;
      setSyncStatus('error');
      setSyncError(
        error instanceof Error
          ? error.message
          : 'No se pudo sincronizar el menú con Supabase.'
      );
    }
  }, [applyRemotePayload, syncEnabled]);

  useEffect(() => {
    if (!syncEnabled) return;
    void syncNow();
  }, [syncEnabled, syncNow]);

  useEffect(() => {
    if (!syncEnabled || !hasFinishedInitialSyncRef.current) return;

    if (skipNextRemoteSaveRef.current) {
      skipNextRemoteSaveRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setSyncStatus('saving');
        const payload = await saveRemoteMenu(productsRef.current);
        setLastSyncedAt(payload.updatedAt);
        setSyncStatus('synced');
        setSyncError('');
      } catch (error) {
        setSyncStatus('error');
        setSyncError(
          error instanceof Error
            ? error.message
            : 'No se pudieron guardar los cambios del menú en Supabase.'
        );
      }
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [products, syncEnabled]);

  useEffect(() => {
    if (!syncEnabled) return;

    const intervalId = window.setInterval(async () => {
      if (document.hidden) return;

      try {
        const payload = await fetchRemoteMenu();
        if (!payload?.updatedAt) return;

        const currentStamp = lastSyncedAtRef.current ?? '';
        if (payload.updatedAt <= currentStamp) return;

        applyRemotePayload(payload);
      } catch {
        // Keep local menu working if the network briefly fails.
      }
    }, REMOTE_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [applyRemotePayload, syncEnabled]);

  const updateProduct = (product: MenuProduct) => {
    persist(products.map((item) => (item.id === product.id ? product : item)));
  };

  const addProduct = () => {
    const nextId = products.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const newProduct: MenuProduct = {
      id: nextId,
      name: 'Nuevo producto',
      description: 'Describe aqui el producto',
      price: 0,
      image: defaultMenuProducts[0].image,
      category: 'novedades',
      popular: false,
    };
    persist([...products, newProduct]);
    return nextId;
  };

  const removeProduct = (id: number) => {
    persist(products.filter((item) => item.id !== id));
  };

  const resetProducts = () => {
    persist(defaultMenuProducts);
  };

  const importProducts = (nextProducts: MenuProduct[]) => {
    persist(nextProducts);
  };

  const value = useMemo(
    () => ({
      products,
      updateProduct,
      addProduct,
      removeProduct,
      resetProducts,
      importProducts,
      syncStatus,
      syncError,
      lastSyncedAt,
      syncEnabled,
      syncNow,
    }),
    [products, syncStatus, syncError, lastSyncedAt, syncEnabled, syncNow]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
