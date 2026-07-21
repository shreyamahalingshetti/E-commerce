'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    keyword: ''
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.keyword) params.keyword = filters.keyword;

      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Products Catalog</h1>
      <SearchFilterBar filters={filters} setFilters={setFilters} onApply={fetchProducts} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No products found matching your filters.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

