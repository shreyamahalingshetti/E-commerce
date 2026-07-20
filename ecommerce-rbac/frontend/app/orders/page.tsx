'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let endpoint = '/orders/mine';
    if (user.role === 'admin') {
      endpoint = '/orders/all';
    } else if (user.role === 'sales_person' || user.role === 'sales') {
      endpoint = '/orders/seller';
    }

    setLoading(true);
    api.get(endpoint)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const getTitle = () => {
    if (user?.role === 'admin') return 'All System Orders (Admin View)';
    if (user?.role === 'sales_person' || user?.role === 'sales') return 'Orders for My Products (Seller View)';
    return 'My Orders';
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>{getTitle()}</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No orders found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '20px',
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Order #{order.id}</span>
                    {order.customer_name && (
                      <span style={{ marginLeft: '12px', color: '#666', fontSize: '14px' }}>
                        Customer: <strong>{order.customer_name}</strong> ({order.customer_email})
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background: String(order.status).toLowerCase() === 'paid' ? '#d4edda' : '#fff3cd',
                      color: String(order.status).toLowerCase() === 'paid' ? '#155724' : '#856404'
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ margin: '12px 0' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>Items:</h4>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} style={{ margin: '4px 0', fontSize: '14px' }}>
                          <strong>{item.product_name}</strong> — {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#999' }}>No item details available</p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #eee', fontSize: '14px', color: '#666' }}>
                  <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0070f3' }}>
                    Total Amount: ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

