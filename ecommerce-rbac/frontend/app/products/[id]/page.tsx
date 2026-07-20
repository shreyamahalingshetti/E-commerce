'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = async () => {
    setActionLoading(true);
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to cart. Please login.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    setActionLoading(true);
    try {
      await api.post('/wishlist', { product_id: product.id });
      alert('Product added to wishlist!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to wishlist. Please login.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading product details...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '40px' }}>Product not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', padding: '8px 16px', border: '1px solid #ccc', background: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>
        ← Back to products
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            <div style={{ width: '100%', height: '300px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              No Image Available
            </div>
          )}
        </div>
        <div>
          {product.category && <span style={{ background: '#e0e0e0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase' }}>{product.category}</span>}
          <h1 style={{ marginTop: '10px', marginBottom: '15px' }}>{product.name}</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3', marginBottom: '15px' }}>${parseFloat(product.price).toFixed(2)}</p>
          <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>{product.description || 'No description provided.'}</p>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>Stock: <strong>{product.stock} available</strong></p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold' }}>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock || 99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleAddToCart}
              disabled={actionLoading}
              style={{ flex: 1, padding: '12px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={actionLoading}
              style={{ flex: 1, padding: '12px 20px', background: '#e00', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ♥ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

