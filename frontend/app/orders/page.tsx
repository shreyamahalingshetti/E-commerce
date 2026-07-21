'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Package,
  Store,
  Shield,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = user?.role || 'user';
  const isSeller = role === 'sales_person' || role === 'sales';
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (!user) return;

    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isAdmin) {
          const [ordersRes, statsRes] = await Promise.all([
            api.get('/orders/all').catch(() => ({ data: [] })),
            api.get('/orders/stats').catch(() => ({ data: { totalSales: 0, totalOrders: 0 } }))
          ]);
          setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
          setStats(statsRes.data || { totalSales: 0, totalOrders: 0 });
        } else if (isSeller) {
          const ordersRes = await api.get('/orders/seller');
          setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        } else {
          const ordersRes = await api.get('/orders/mine');
          setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [user, isAdmin, isSeller]);

  const totalSalesVal = parseFloat(String(stats?.totalSales || stats?.total_sales || 0));
  const totalOrdersCount = stats?.totalOrders || stats?.total_orders || orders.length;

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px 60px' }}>

        {/* Admin Revenue & Stats Bar */}
        {isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '14px', padding: '24px', color: '#ffffff', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Total Sales Revenue</span>
                <TrendingUp size={24} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>
                ₹{totalSalesVal.toFixed(2)}
              </div>
              <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px', display: 'block' }}>All platform customer transactions</span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '14px', padding: '24px', color: '#ffffff', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Total Orders Placed</span>
                <CreditCard size={24} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>
                {totalOrdersCount}
              </div>
              <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px', display: 'block' }}>Completed purchases across store</span>
            </div>
          </div>
        )}

        {/* Page Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAdmin ? (
              <Shield size={28} style={{ color: '#0f172a' }} />
            ) : isSeller ? (
              <Store size={28} style={{ color: '#0284c7' }} />
            ) : (
              <Package size={28} style={{ color: '#2563eb' }} />
            )}
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {isAdmin ? 'All Platform Orders' : isSeller ? 'Seller Sales Orders' : 'My Order History'}
            </h2>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '16px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontSize: '16px' }}>
            Loading order details...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '56px 24px',
              textAlign: 'center',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <ShoppingBag size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              {isSeller ? 'No orders on your products yet' : 'No orders yet'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              {isSeller
                ? 'When customers purchase products from your shop, sales orders will be displayed here.'
                : 'When you place an order, your purchase history will appear here.'}
            </p>
            {!isSeller && (
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Browse Products</span>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const itemsList = Array.isArray(order.items) ? order.items : [];
              const orderTotal = parseFloat(String(order.total_amount || 0));

              return (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '24px',
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Order #{order.id}</span>
                      {(isAdmin || isSeller) && order.customer_name && (
                        <span style={{ marginLeft: '12px', fontSize: '14px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                          Customer: <strong>{order.customer_name}</strong> {order.customer_email ? `(${order.customer_email})` : ''}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        padding: '5px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: String(order.status).toLowerCase() === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: String(order.status).toLowerCase() === 'paid' ? '#15803d' : '#b45309'
                      }}
                    >
                      {order.status || 'Paid'}
                    </span>
                  </div>

                  {/* Order Items List */}
                  <div style={{ margin: '14px 0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      {isSeller ? 'Your Products in this Order:' : 'Purchased Items:'}
                    </h4>
                    {itemsList.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {itemsList.map((item: any, idx: number) => {
                          const itemPrice = parseFloat(String(item.price || 0));
                          const itemTotal = itemPrice * (Number(item.quantity) || 1);

                          return (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#334155'
                              }}
                            >
                              <div>
                                <strong style={{ color: '#0f172a' }}>{item.product_name || item.name || 'Product'}</strong>
                                <span style={{ color: '#64748b', marginLeft: '8px' }}>
                                  ({item.quantity} × ₹{itemPrice.toFixed(2)})
                                </span>
                              </div>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                                ₹{itemTotal.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '14px', color: '#94a3b8' }}>No item details recorded</p>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                    <span>Placed on: {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>
                      Total Amount: ₹{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
