'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import SearchFilterBar, { FilterValues } from '../components/SearchFilterBar';
import { PackageX } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    minPrice: '',
    maxPrice: '',
    keyword: ''
  });

  const fetchProducts = useCallback(async (currentFilters: FilterValues) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
      if (currentFilters.keyword) params.keyword = currentFilters.keyword;

      const res = await api.get('/products', { params });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, []);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Explore Products
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
          Discover items from verified sellers across all categories.
        </p>
      </div>

      <SearchFilterBar
        filters={filters}
        setFilters={setFilters}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              style={{
                height: '320px',
                background: '#f1f5f9',
                borderRadius: '12px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          ))}
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            border: '2px dashed #e2e8f0',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            background: '#ffffff'
          }}
        >
          <PackageX size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#334155' }}>No products found</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Try adjusting your search keywords or price filters to see available products.
          </p>
        </div>
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
