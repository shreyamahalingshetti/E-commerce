'use client';

import React from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ProductForm from '../../../components/ProductForm';

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'sales_person', 'sales']}>
      <div style={{ maxWidth: '640px', margin: '40px auto', padding: '32px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Add New Product
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Fill in product details and upload an image to publish it to the store catalog.
        </p>

        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}
