'use client';

import React from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function ProductCard({ product }: { product: any }) {
  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart. Please log in.');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const res = await api.post('/wishlist/toggle', { product_id: product.id });
      alert(res.data.message);
    } catch (err) {
      alert('Failed to update wishlist. Please log in.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
      {product.image_url && <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link href={`/products/${product.id}`}>
          <button style={{ padding: '5px 10px' }}>Details</button>
        </Link>
        <button onClick={handleAddToCart} style={{ padding: '5px 10px' }}>Add to Cart</button>
        <button onClick={handleToggleWishlist} style={{ padding: '5px 10px' }}>♥ Wishlist</button>
      </div>
    </div>
  );
}
