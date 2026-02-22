
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CartItem, PlacedOrder } from '../types';
import { api } from '../services/googleSheetAPI';

const LS_KEY = 'purechain_orders';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutResult {
  success: boolean;
  orders: PlacedOrder[];
  error?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<CheckoutResult>;
  totalItems: number;
  subtotal: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getSavedOrders(): PlacedOrder[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveOrders(orders: PlacedOrder[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  /**
   * Place an order for every cart item:
   * 1. Write a row to the Orders sheet for each item
   * 2. Reduce stock for each item
   * 3. Persist order IDs in localStorage for tracking
   * 4. Clear the cart
   */
  const checkout = useCallback(async (): Promise<CheckoutResult> => {
    if (cart.length === 0) {
      return { success: false, orders: [], error: 'Cart is empty' };
    }

    const dateTime = new Date().toISOString();
    const newOrders: PlacedOrder[] = [];

    try {
      // Process each cart item
      for (const item of cart) {
        // Create order row in Orders sheet
        const orderResult = await api.createOrder({
          'Product_id': item.id,
          'Quantity': item.quantity,
          'Date and Time': dateTime,
          'Status': 'Pending',
          'Process Time': '',
        });

        const orderId = orderResult?.id ?? `ORD-${Date.now()}-${item.id}`;

        // Reduce stock (negative quantity = reduction)
        try {
          await api.updateStock(item.id, -item.quantity);
        } catch (stockErr) {
          // Non-fatal: order placed but stock update failed (log only)
          console.warn('Stock update failed for', item.id, stockErr);
        }

        newOrders.push({
          orderId: String(orderId),
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          dateTime,
          status: 'Pending',
        });
      }

      // Persist to localStorage (append to existing)
      const existing = getSavedOrders();
      saveOrders([...existing, ...newOrders]);

      clearCart();
      return { success: true, orders: newOrders };
    } catch (err: any) {
      return {
        success: false,
        orders: newOrders,
        error: err.message ?? 'Checkout failed. Please try again.',
      };
    }
  }, [cart, clearCart]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, checkout, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
