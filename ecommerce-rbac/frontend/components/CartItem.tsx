'use client';

import React from 'react';
import api from '../lib/api';

export default function CartItem({ item, onUpdate }: { item: any; onUpdate: () => void }) {
  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${item.id}`, { quantity: newQty });
      onUpdate();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/cart/${item.id}`);
      onUpdate();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const itemTotal = Number(item.price) * item.quantity;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {item.image_url && (
          <img src={item.image_url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
        )}
        <div>
          <h4 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h4>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            ${parseFloat(item.price).toFixed(2)} each
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            style={{ padding: '4px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ padding: '0 12px', fontWeight: 'bold' }}>{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            style={{ padding: '4px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer' }}
          >
            +
          </button>
        </div>

        <span style={{ fontWeight: 'bold', width: '80px', textAlign: 'right' }}>
          ${itemTotal.toFixed(2)}
        </span>

        <button
          onClick={handleRemove}
          style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

