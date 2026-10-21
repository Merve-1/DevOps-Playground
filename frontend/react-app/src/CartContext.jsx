import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export function CartProvider({ user, children }) {
  const [cartCount, setCartCount] = useState(0);
  const userId = user?.userId;

  const refreshCartCount = useCallback(async () => {
    if (!userId) { setCartCount(0); return; }
    try {
      const cart = await api.getCart();
      setCartCount(cart.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0);
    } catch {
      setCartCount(0);
    }
  }, [userId]);

  useEffect(() => { refreshCartCount(); }, [refreshCartCount]);

  const value = useMemo(() => ({ cartCount, refreshCartCount }), [cartCount, refreshCartCount]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}