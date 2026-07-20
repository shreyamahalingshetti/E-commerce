'use client';

import React from 'react';

interface FilterProps {
  category: string;
  minPrice: string;
  maxPrice: string;
  keyword: string;
}

export default function SearchFilterBar({
  filters,
  setFilters,
  onApply
}: {
  filters: FilterProps;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
  onApply: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const handleReset = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', keyword: '' });
    setTimeout(() => onApply(), 0);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Keyword:</label>
          <input
            type="text"
            name="keyword"
            placeholder="Search products..."
            value={filters.keyword}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Category:</label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Electronics, Clothing"
            value={filters.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Min Price:</label>
          <input
            type="number"
            name="minPrice"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Max Price:</label>
          <input
            type="number"
            name="maxPrice"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Filter
          </button>
          <button type="button" onClick={handleReset} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

