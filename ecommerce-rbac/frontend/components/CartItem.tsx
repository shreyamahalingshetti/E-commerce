'use client';

import React from 'react';
import api from '../lib/api';

export default function CartItem({ item, onUpdate }: { item: any; onUpdate: () => void }) {
  const handleRemove = async () => {
    try {
      await api.delete(`/cart/${item.id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
      <div>
        <h4>{item.name}</h4>
        <p>${item.price} x {item.quantity}</p>
      </div>
      <button onClick={handleRemove} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none' }}>Remove</button>
    </div>
  );
}
