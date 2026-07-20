'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import ProductCard from '../../components/ProductCard';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    api.get('/wishlist').then((res) => setWishlist(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['user', 'sales', 'admin']}>
      <div>
        <h2>My Wishlist</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
