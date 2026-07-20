'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin', 'sales']}>
      <div>
        <h2>Admin & Sales Dashboard</h2>
        <h3>All Orders</h3>
        {orders.map((o) => (
          <div key={o.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <p>Order #{o.id} by {o.user_name} ({o.user_email})</p>
            <p>Total: ${o.total_amount} | Status: {o.status}</p>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
