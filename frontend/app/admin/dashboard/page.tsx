'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ total_sales: number; total_orders: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '24px' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Admin Analytics Dashboard</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading analytics...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #0070f3 0%, #0051a8 100%)',
                color: '#fff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 112, 243, 0.25)'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', opacity: 0.9, fontWeight: 'normal' }}>Total Sales</h3>
              <p style={{ margin: '12px 0 0 0', fontSize: '38px', fontWeight: 'bold' }}>
                ${parseFloat(String(stats?.total_sales || 0)).toFixed(2)}
              </p>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                color: '#fff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.25)'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', opacity: 0.9, fontWeight: 'normal' }}>Total Orders</h3>
              <p style={{ margin: '12px 0 0 0', fontSize: '38px', fontWeight: 'bold' }}>
                {stats?.total_orders || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

