'use client';

import React, { useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product created successfully!');
      router.push('/');
    } catch (err) {
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Price:</label>
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Image Upload:</label>
        <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
      </div>
      <button type="submit" style={{ padding: '10px 20px' }}>Save Product</button>
    </form>
  );
}
