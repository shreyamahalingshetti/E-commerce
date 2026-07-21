'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      alert('Failed to remove item from wishlist.');
    }
  };

  const handleMoveToCart = async (item: any) => {
    const productId = item.product_id || item.id;
    try {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      alert('Item moved to cart!');
    } catch (err) {
      alert('Failed to move item to cart.');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '24px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>My Wishlist</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ef4444' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Your wishlist is empty</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Explore items and save your favorites here for later.</p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {wishlistItems.map((item) => {
              const productId = item.product_id || item.id;
              return (
                <div key={item.id || item.product_id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      No Image
                    </div>
                  )}

                  <h3 style={{ marginTop: '14px', fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: '#0f172a' }}>{item.name}</h3>
                  <p style={{ fontWeight: 700, color: '#2563eb', fontSize: '17px', marginBottom: '16px' }}>₹{parseFloat(String(item.price)).toFixed(2)}</p>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ShoppingCart size={15} />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => handleRemove(productId)}
                      style={{ padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
