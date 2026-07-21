'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Users as UsersIcon,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Store
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  business_name?: string | null;
  created_at: string;
}

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
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders'>('overview');

  // Stats state
  const [stats, setStats] = useState<{ totalSales: number; totalOrders: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});
  const [savingUserIds, setSavingUserIds] = useState<{ [key: number]: boolean }>({});
  const [userMessages, setUserMessages] = useState<{ [key: number]: { type: 'success' | 'error'; text: string } }>({});

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/orders/stats');
      setStats({
        totalSales: parseFloat(String(res.data?.totalSales || res.data?.total_sales || 0)),
        totalOrders: res.data?.totalOrders || res.data?.total_orders || 0
      });
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      const fetchedUsers: UserItem[] = Array.isArray(res.data) ? res.data : [];
      setUsers(fetchedUsers);
      const initialRoleMap: { [key: number]: string } = {};
      fetchedUsers.forEach((u) => {
        initialRoleMap[u.id] = u.role;
      });
      setSelectedRoles(initialRoleMap);
    } catch (err) {
      console.error('Failed to fetch user list:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchAllOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/all');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch all orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAllOrders();
  }, [fetchStats, fetchUsers, fetchAllOrders]);

  const handleRoleChange = (userId: number, newRole: string) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = async (userId: number) => {
    const newRole = selectedRoles[userId];
    if (!newRole) return;

    setSavingUserIds((prev) => ({ ...prev, [userId]: true }));
    setUserMessages((prev) => ({ ...prev, [userId]: undefined as any }));

    try {
      const res = await api.put(`/users/${userId}/role`, { newRole });
      setUserMessages((prev) => ({
        ...prev,
        [userId]: { type: 'success', text: `Role updated to ${res.data?.role || newRole}` }
      }));
      await fetchUsers();
    } catch (err: any) {
      const errorText = err.response?.data?.error || 'Failed to update user role';
      setUserMessages((prev) => ({
        ...prev,
        [userId]: { type: 'error', text: errorText }
      }));
    } finally {
      setSavingUserIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role === 'admin') return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
    if (role === 'sales_person' || role === 'sales') return { background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' };
    return { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' };
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ maxWidth: '1150px', margin: '40px auto', padding: '0 20px 60px' }}>
        
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: '#fff',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '6px 14px',
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
              <Shield size={14} /> Admin Command Center
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
            Platform Control & Analytics
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '15px' }}>
            Manage platform users, roles, revenue statistics, and customer sales orders.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '32px',
            paddingBottom: '2px'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === 'overview' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === 'users' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <UsersIcon size={18} />
            <span>User Management</span>
            <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '12px' }}>
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === 'orders' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={18} />
            <span>All System Orders</span>
            <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '12px' }}>
              {orders.length}
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '16px', padding: '28px', color: '#fff', boxShadow: '0 4px 16px rgba(37,99,235,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Total Sales Revenue</span>
                  <TrendingUp size={28} />
                </div>
                <div style={{ fontSize: '38px', fontWeight: 800 }}>
                  {loadingStats ? '...' : `₹${(stats?.totalSales || 0).toFixed(2)}`}
                </div>
                <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '6px', display: 'block' }}>All platform customer transactions</span>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '16px', padding: '28px', color: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Total Orders Completed</span>
                  <ShoppingBag size={28} />
                </div>
                <div style={{ fontSize: '38px', fontWeight: 800 }}>
                  {loadingStats ? '...' : stats?.totalOrders || 0}
                </div>
                <span style={{ fontSize: '13px', opacity: 0.85, marginTop: '6px', display: 'block' }}>Completed purchases across store</span>
              </div>
            </div>

            {/* Quick summary grid */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Quick System Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Registered Users</span>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{users.length}</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Sellers / Shops</span>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                    {users.filter(u => u.role === 'sales_person' || u.role === 'sales').length}
                  </div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Admins</span>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Platform User Directory</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>View user roles and assign store permissions.</p>
              </div>
            </div>

            {loadingUsers ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No users found in database.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                      <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>User Info</th>
                      <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Current Role</th>
                      <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Business Name</th>
                      <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Joined Date</th>
                      <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelf = Number(u.id) === Number(currentUser?.id);
                      const currentSelectedRole = selectedRoles[u.id] || u.role;
                      const isRoleChanged = currentSelectedRole !== u.role;
                      const isSaving = savingUserIds[u.id];
                      const msg = userMessages[u.id];

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                ...getRoleBadgeStyle(u.role)
                              }}
                            >
                              {u.role === 'sales_person' ? 'Seller' : u.role}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: '#334155' }}>
                            {u.business_name ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Store size={14} style={{ color: '#0284c7' }} />
                                <span>{u.business_name}</span>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                            {new Date(u.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select
                                  value={currentSelectedRole}
                                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                  disabled={isSelf || isSaving}
                                  title={isSelf ? 'Cannot change your own role' : 'Select role'}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '13px',
                                    background: isSelf ? '#f1f5f9' : '#ffffff',
                                    cursor: isSelf ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <option value="user">User (Buyer)</option>
                                  <option value="sales_person">Sales Person (Seller)</option>
                                  <option value="admin">Admin</option>
                                </select>

                                {!isSelf && (
                                  <button
                                    onClick={() => handleSaveRole(u.id)}
                                    disabled={!isRoleChanged || isSaving}
                                    style={{
                                      padding: '6px 12px',
                                      background: isRoleChanged ? '#2563eb' : '#e2e8f0',
                                      color: isRoleChanged ? '#ffffff' : '#94a3b8',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontWeight: 600,
                                      fontSize: '12px',
                                      cursor: isRoleChanged ? 'pointer' : 'default',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <Save size={14} />
                                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                  </button>
                                )}
                              </div>

                              {isSelf && (
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                                  (Cannot change your own role)
                                </span>
                              )}

                              {msg && (
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: msg.type === 'success' ? '#16a34a' : '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {msg.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                                  {msg.text}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading all orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                No system orders recorded yet.
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
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Order #{order.id}</span>
                          {order.customer_name && (
                            <span style={{ marginLeft: '12px', color: '#475569', fontSize: '14px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
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
                            background: String(order.status).toLowerCase() === 'paid' ? '#dcfce7' : '#fef3c7',
                            color: String(order.status).toLowerCase() === 'paid' ? '#15803d' : '#b45309'
                          }}
                        >
                          {order.status || 'Paid'}
                        </span>
                      </div>

                      <div style={{ margin: '14px 0' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                          Items Breakdown:
                        </h4>
                        {itemsList.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {itemsList.map((item, idx) => {
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
                                    <strong style={{ color: '#0f172a' }}>{item.product_name || 'Product'}</strong>
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
        )}
      </div>
    </ProtectedRoute>
  );
}
