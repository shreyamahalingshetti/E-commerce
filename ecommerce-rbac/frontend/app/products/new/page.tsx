'use client';

import React from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ProductForm from '../../../components/ProductForm';

export default function NewProductPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'sales']}>
      <div style={{ maxWidth: '600px', margin: '20px auto' }}>
        <h2>Add New Product</h2>
        <ProductForm />
      </div>
    </ProtectedRoute>
  );
}
