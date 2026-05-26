'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

export type CartProductInput = {
  code: string;
  name: string;
  slug: string;
  price: number | null;
  imageUrl?: string | null;
  size?: string | null;
  finish?: string | null;
};

export type CartItem = CartProductInput & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (code: string) => void;
  updateQuantity: (code: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  lastAddedName: string | null;
  clearLastAdded: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'tokohpl-cart-v1';

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(999, Math.floor(quantity)));
}

export function formatRupiah(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  })
    .format(value)
    .replace('IDR', 'Rp')
    .trim();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item && item.code && item.name && item.slug));
        }
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const clearLastAdded = useCallback(() => setLastAddedName(null), []);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    const qty = normalizeQuantity(quantity);

    setItems((current) => {
      const existing = current.find((item) => item.code === product.code);

      if (existing) {
        return current.map((item) =>
          item.code === product.code
            ? { ...item, quantity: normalizeQuantity(item.quantity + qty) }
            : item
        );
      }

      return [...current, { ...product, quantity: qty }];
    });

    setLastAddedName(product.name);
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((code: string) => {
    setItems((current) => current.filter((item) => item.code !== code));
  }, []);

  const updateQuantity = useCallback((code: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.code !== code));
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.code === code ? { ...item, quantity: normalizeQuantity(quantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      lastAddedName,
      clearLastAdded
    }),
    [
      items,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      lastAddedName,
      clearLastAdded
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
