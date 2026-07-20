'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['user', 'sales', 'admin']}>
      <div>
        <h2>My Orders</h2>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
