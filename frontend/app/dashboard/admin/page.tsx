'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { LayoutDashboard, DollarSign, ShoppingBag, Package, Users } from 'lucide-react';

interface OrderItem {
  id: number;
  product_id: number;
  seller_id: number;
  product_name: string;
  price: string | number;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ total_sales: number; total_orders: number } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchAllOrders();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/orders/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch all orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px 60px' }}>
        {/* Admin Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: '#fff',
            marginBottom: '36px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={14} /> Admin Overview
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
            System Analytics & Orders
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '15px' }}>
            Full system control panel for tracking overall sales and managing all customer orders.
          </p>
        </div>

        {/* Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '14px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: 500, textTransform: 'uppercase' }}>Total Revenue</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '36px', fontWeight: 800 }}>
                {loadingStats ? '...' : `$${parseFloat(String(stats?.total_sales || 0)).toFixed(2)}`}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '12px' }}>
              <DollarSign size={32} />
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '14px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', opacity: 0.9, fontWeight: 500, textTransform: 'uppercase' }}>Total Orders</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '36px', fontWeight: 800 }}>
                {loadingStats ? '...' : stats?.total_orders || 0}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '12px' }}>
              <Package size={32} />
            </div>
          </div>
        </div>

        {/* All System Orders List */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} style={{ color: '#2563eb' }} />
            <span>All System Orders</span>
            <span style={{ fontSize: '14px', background: '#e2e8f0', color: '#475569', padding: '2px 10px', borderRadius: '12px', marginLeft: '6px' }}>
              {orders.length}
            </span>
          </h2>

          {loadingOrders ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                background: '#fff'
              }}
            >
              <p style={{ color: '#64748b', margin: 0 }}>No orders have been placed in the system yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '12px',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                        Order #{order.id}
                      </span>
                      {order.customer_name && (
                        <span style={{ marginLeft: '12px', color: '#475569', fontSize: '14px' }}>
                          Customer: <strong>{order.customer_name}</strong> ({order.customer_email})
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: String(order.status).toLowerCase() === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: String(order.status).toLowerCase() === 'paid' ? '#15803d' : '#b45309'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>
                      Items Breakdown:
                    </h4>
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {order.items.map((item, idx) => (
                          <li key={idx} style={{ margin: '4px 0', fontSize: '14px', color: '#334155' }}>
                            <strong>{item.product_name}</strong> — {item.quantity} x ${parseFloat(String(item.price)).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '14px', color: '#94a3b8' }}>No item details available</p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px dashed #e2e8f0',
                      fontSize: '13px',
                      color: '#64748b'
                    }}
                  >
                    <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0070f3' }}>
                      Total Amount: ${parseFloat(String(order.total_amount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
