'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(console.error);
    }
  }, [id]);

  if (!product) return <div>Loading product...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>{product.name}</h2>
      {product.image_url && <img src={product.image_url} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />}
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
    </div>
  );
}
