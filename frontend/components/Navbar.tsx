'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '15px', background: '#333', color: '#fff', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#fff', fontWeight: 'bold' }}>E-Shop RBAC</Link>
      <Link href="/" style={{ color: '#fff' }}>Products</Link>
      {user && <Link href="/cart" style={{ color: '#fff' }}>Cart</Link>}
      {user && <Link href="/wishlist" style={{ color: '#fff' }}>Wishlist</Link>}
      {user && <Link href="/orders" style={{ color: '#fff' }}>Orders</Link>}

      {(user?.role === 'admin' || user?.role === 'sales') && (
        <>
          <Link href="/products/new" style={{ color: '#ffc107' }}>Add Product</Link>
          <Link href="/admin/dashboard" style={{ color: '#ffc107' }}>Admin Dashboard</Link>
        </>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Hello, {user.name} ({user.role})</span>
            <button onClick={logout} style={{ padding: '5px 10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: '#fff' }}>Login</Link>
            <Link href="/register" style={{ color: '#fff' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
