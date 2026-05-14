import React, { createContext, useContext, useMemo, useState } from 'react';
import { defaultMenuProducts, type MenuProduct } from '@/data/menuData';

interface MenuContextType {
  products: MenuProduct[];
  updateProduct: (product: MenuProduct) => void;
  addProduct: () => number;
  removeProduct: (id: number) => void;
  resetProducts: () => void;
  importProducts: (nextProducts: MenuProduct[]) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEY = 'espacio-kihnally-menu-products';

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

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<MenuProduct[]>(loadInitialProducts);

  const persist = (nextProducts: MenuProduct[]) => {
    setProducts(nextProducts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
  };

  const updateProduct = (product: MenuProduct) => {
    persist(products.map((item) => (item.id === product.id ? product : item)));
  };

  const addProduct = () => {
    const nextId = products.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const newProduct: MenuProduct = {
      id: nextId,
      name: 'Nuevo producto',
      description: 'Describe aquí el producto',
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
    }),
    [products]
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
