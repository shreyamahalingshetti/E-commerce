'use client';

import React from 'react';

export default function SearchFilterBar({ search, setSearch }: { search: string; setSearch: (val: string) => void }) {
  return (
    <div style={{ margin: '10px 0' }}>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '10px' }}
      />
    </div>
  );
}
