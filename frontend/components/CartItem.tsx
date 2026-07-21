'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }: { item: any }) {
  const { updateQuantity, removeFromCart } = useCart();
  const productId = item.product_id || item.id;

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      await updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleIncrease = async () => {
    await updateQuantity(productId, item.quantity + 1);
  };

  const handleRemove = async () => {
    await removeFromCart(productId);
  };

  const itemTotal = Number(item.price) * item.quantity;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
        ) : (
          <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '11px' }}>
            No Image
          </div>
        )}
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{item.name}</h4>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            ₹{parseFloat(String(item.price)).toFixed(2)} each
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            style={{ padding: '6px 12px', background: item.quantity <= 1 ? '#f8fafc' : '#f1f5f9', border: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', fontWeight: 700, color: '#334155' }}
          >
            -
          </button>
          <span style={{ padding: '0 14px', fontWeight: 600, fontSize: '15px' }}>{item.quantity}</span>
          <button
            onClick={handleIncrease}
            style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#334155' }}
          >
            +
          </button>
        </div>

        <span style={{ fontWeight: 700, width: '90px', textAlign: 'right', fontSize: '16px', color: '#0f172a' }}>
          ₹{itemTotal.toFixed(2)}
        </span>

        <button
          onClick={handleRemove}
          aria-label="Remove item"
          style={{ padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
