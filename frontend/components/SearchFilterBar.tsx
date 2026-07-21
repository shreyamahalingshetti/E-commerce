'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface FilterValues {
  keyword: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface SearchFilterBarProps {
  onFilterChange?: (filters: FilterValues) => void;
  filters?: FilterValues;
  setFilters?: React.Dispatch<React.SetStateAction<FilterValues>>;
  onApply?: () => void;
}

export default function SearchFilterBar({
  onFilterChange,
  filters: parentFilters,
  setFilters: parentSetFilters,
  onApply
}: SearchFilterBarProps) {
  const [internalFilters, setInternalFilters] = useState<FilterValues>({
    keyword: parentFilters?.keyword || '',
    category: parentFilters?.category || '',
    minPrice: parentFilters?.minPrice || '',
    maxPrice: parentFilters?.maxPrice || ''
  });

  const [debouncedKeyword, setDebouncedKeyword] = useState(internalFilters.keyword);

  // Sync parent filters if provided
  useEffect(() => {
    if (parentFilters) {
      setInternalFilters(parentFilters);
    }
  }, [parentFilters]);

  // 400ms debounce for keyword input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(internalFilters.keyword);
    }, 400);

    return () => clearTimeout(handler);
  }, [internalFilters.keyword]);

  // Trigger callback when filters (with debounced keyword) change
  useEffect(() => {
    const activeFilters = { ...internalFilters, keyword: debouncedKeyword };

    if (parentSetFilters) {
      parentSetFilters(activeFilters);
    }
    if (onFilterChange) {
      onFilterChange(activeFilters);
    }
    if (onApply) {
      onApply();
    }
  }, [debouncedKeyword, internalFilters.category, internalFilters.minPrice, internalFilters.maxPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInternalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const resetValues = { keyword: '', category: '', minPrice: '', maxPrice: '' };
    setInternalFilters(resetValues);
    setDebouncedKeyword('');
    if (parentSetFilters) parentSetFilters(resetValues);
    if (onFilterChange) onFilterChange(resetValues);
    if (onApply) onApply();
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
        {/* Search Keyword Input */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Search Products
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              name="keyword"
              placeholder="Title or description..."
              value={internalFilters.keyword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Category Input / Select */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Category
          </label>
          <select
            name="category"
            value={internalFilters.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              background: '#fff'
            }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Footwear">Footwear</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Min Price Input */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Min Price ($)
          </label>
          <input
            type="number"
            name="minPrice"
            placeholder="0"
            min="0"
            value={internalFilters.minPrice}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Max Price Input */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Max Price ($)
          </label>
          <input
            type="number"
            name="maxPrice"
            placeholder="No limit"
            min="0"
            value={internalFilters.maxPrice}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Reset Button */}
        <div>
          <button
            type="button"
            onClick={handleReset}
            style={{
              width: '100%',
              padding: '9px 16px',
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
