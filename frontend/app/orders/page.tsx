'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Link from 'next/link';
import { Package, Store, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    api.get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to fetch personal orders:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const isSeller = user?.role === 'sales_person' || user?.role === 'sales';
  const isAdmin = user?.role === 'admin';

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px 60px' }}>

        {/* Role Dashboard Banner Link if Seller or Admin */}
        {isSeller && (
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Store size={22} style={{ color: '#0284c7' }} />
              <div>
                <strong style={{ color: '#0369a1', fontSize: '15px' }}>Are you looking for products sold by your shop?</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#0284c7' }}>
                  Manage your inventory and customer sales orders in the Seller Dashboard.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/seller"
              style={{
                background: '#0284c7',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Seller Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {isAdmin && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutDashboard size={22} style={{ color: '#334155' }} />
              <div>
                <strong style={{ color: '#1e293b', fontSize: '15px' }}>System Admin Overview Available</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  View total sales revenue and all customer orders across the platform.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/admin"
              style={{
                background: '#0f172a',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Admin Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Package size={28} style={{ color: '#2563eb' }} />
          <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#0f172a' }}>My Order History</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              background: '#fff'
            }}
          >
            <Package size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155' }}>No orders yet</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
              When you make a purchase, your order history will appear here.
            </p>
            <Link
              href="/"
              style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Explore Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>Order #{order.id}</span>
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
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Items Purchased:</h4>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} style={{ margin: '4px 0', fontSize: '14px', color: '#334155' }}>
                          <strong>{item.product_name}</strong> — {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>No item details available</p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                  <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#2563eb' }}>
                    Total Paid: ${parseFloat(order.total_amount).toFixed(2)}
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
