'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Store } from 'lucide-react';
import api from '../lib/api';

export interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    stock?: number;
    category?: string;
    image_url?: string | null;
    imageUrl?: string | null;
    owner_name?: string;
    shop_name?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to cart. Please log in.');
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post('/wishlist/toggle', { product_id: product.id });
      alert(res.data?.message || 'Wishlist updated!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update wishlist. Please log in.');
    }
  };

  const displayImage = product.image_url || product.imageUrl;
  const shopOrOwner = product.shop_name || product.owner_name;

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%'
      }}
      className="product-card"
    >
      {/* Product Image Container */}
      <div style={{ height: '200px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '13px'
            }}
          >
            No Image
          </div>
        )}

        {product.category && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {product.category}
          </span>
        )}

        {/* Wishlist Heart Button overlay */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            color: '#ef4444'
          }}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {shopOrOwner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            <Store size={13} style={{ color: '#0284c7' }} />
            <span>{shopOrOwner}</span>
          </div>
        )}

        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#0f172a', lineHeight: '1.3' }}>
          {product.name}
        </h3>

        <div style={{ marginTop: 'auto', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
              ${parseFloat(String(product.price)).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
