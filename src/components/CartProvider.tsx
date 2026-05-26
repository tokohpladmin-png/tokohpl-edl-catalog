'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export function formatRupiah(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

export type CartItem = {
  slug?: string;
  code?: string;
  name?: string;
  price?: number | null;
  quantity: number;
  imageUrl?: string | null;
  size?: string | null;
  finish?: string | null;
};

type AddableCartItem = Partial<Omit<CartItem, 'quantity'>> & {
  slug?: string;
  code?: string;
  name?: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  itemCount: number;
  isCartOpen: boolean;
  lastAddedName: string | null;
  addItem: (item: AddableCartItem, quantity?: number) => void;
  removeItem: (codeOrSlug: string) => void;
  updateQuantity: (codeOrSlug: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLastAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'tokohpl-cart';

function getItemKey(item: AddableCartItem | CartItem) {
  return item.slug || item.code || item.name || '';
}

function normalizeItem(item: AddableCartItem, quantity?: number): CartItem {
  const finalQuantity = Math.max(1, Number(quantity ?? item.quantity ?? 1) || 1);

  return {
    slug: item.slug,
    code: item.code,
    name: item.name,
    price: typeof item.price === 'number' ? item.price : item.price ?? null,
    quantity: finalQuantity,
    imageUrl: item.imageUrl ?? null,
    size: item.size ?? null,
    finish: item.finish ?? null
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];

        if (Array.isArray(parsed)) {
          setItems(parsed.map((item) => normalizeItem(item, item.quantity)));
        }
      }
    } catch {
      // Ignore invalid localStorage data.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors.
    }
  }, [items]);

  const subtotal = items.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;

    return total + price * quantity;
  }, 0);

  const totalItems = items.reduce((total, item) => total + (item.quantity || 1), 0);
  const itemCount = totalItems;

  const value = useMemo<CartContextValue>(() => ({
    items,
    subtotal,
    totalItems,
    itemCount,
    isCartOpen,
    lastAddedName,
    addItem: (item, quantity) => {
      const normalizedItem = normalizeItem(item, quantity);
      const key = getItemKey(normalizedItem);

      if (!key) return;

      setItems((current) => {
        const existing = current.find((entry) => getItemKey(entry) === key);

        if (existing) {
          return current.map((entry) =>
            getItemKey(entry) === key
              ? { ...entry, quantity: (entry.quantity || 1) + normalizedItem.quantity }
              : entry
          );
        }

        return [...current, normalizedItem];
      });

      setLastAddedName(normalizedItem.name || normalizedItem.code || 'Item');
      setIsCartOpen(true);
    },
    removeItem: (codeOrSlug) => {
      setItems((current) =>
        current.filter((item) => item.slug !== codeOrSlug && item.code !== codeOrSlug && item.name !== codeOrSlug)
      );
    },
    updateQuantity: (codeOrSlug, quantity) => {
      const safeQuantity = Math.max(0, Number(quantity) || 0);

      setItems((current) =>
        current
          .map((item) =>
            item.slug === codeOrSlug || item.code === codeOrSlug || item.name === codeOrSlug
              ? { ...item, quantity: safeQuantity }
              : item
          )
          .filter((item) => (item.quantity || 0) > 0)
      );
    },
    clearCart: () => setItems([]),
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((value) => !value),
    clearLastAdded: () => setLastAddedName(null)
  }), [items, subtotal, totalItems, itemCount, isCartOpen, lastAddedName]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
