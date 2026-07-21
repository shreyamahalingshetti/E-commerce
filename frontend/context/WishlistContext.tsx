'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

export interface WishlistItemType {
  id: number;
  product_id: number;
  name: string;
  price: number | string;
  description?: string;
  image_url?: string | null;
  category?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItemType[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = async (productId: number): Promise<boolean> => {
    if (!user) return false;
    try {
      await api.post('/wishlist', { productId, product_id: productId });
      await refreshWishlist();
      return true;
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;
    try {
      await api.delete(`/wishlist/${productId}`);
      await refreshWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      throw err;
    }
  };

  const isWishlisted = (productId: number): boolean => {
    return wishlistItems.some(
      (item) => Number(item.product_id) === Number(productId) || Number(item.id) === Number(productId)
    );
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!user) return false;
    try {
      if (isWishlisted(productId)) {
        await removeFromWishlist(productId);
        return false;
      } else {
        await addToWishlist(productId);
        return true;
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      throw err;
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
