'use client';

import React from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ProductForm from '../../../components/ProductForm';

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'sales_person', 'sales']}>
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Add New Product</h2>
        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}

