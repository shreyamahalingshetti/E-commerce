'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

export interface CartItemType {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number | string;
  description?: string;
  image_url?: string | null;
  category?: string;
}

interface CartContextType {
  cartItems: CartItemType[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!user) return false;
    try {
      await api.post('/cart', { productId, product_id: productId, quantity });
      await refreshCart();
      return true;
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      throw err;
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      throw err;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    try {
      await api.delete(`/cart/${productId}`);
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      throw err;
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
