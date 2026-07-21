'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/wishlist/${id}`);
      fetchWishlist();
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleMoveToCart = async (item: any) => {
    try {
      await api.post('/cart', { product_id: item.product_id || item.id, quantity: 1 });
      await api.delete(`/wishlist/${item.id}`);
      alert('Moved to cart!');
      fetchWishlist();
    } catch (err) {
      alert('Failed to move item to cart');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '24px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>My Wishlist</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Your wishlist is currently empty.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {wishlist.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  <div style={{ width: '100%', height: '160px', background: '#f0f0f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    No Image
                  </div>
                )}
                <h3 style={{ marginTop: '12px', fontSize: '18px', marginBottom: '8px' }}>{item.name}</h3>
                <p style={{ fontWeight: 'bold', color: '#0070f3', marginBottom: '16px' }}>${parseFloat(item.price).toFixed(2)}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    style={{ padding: '8px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{ padding: '8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

