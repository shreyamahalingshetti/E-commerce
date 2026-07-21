'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import ProductForm from '../../../components/ProductForm';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Edit2,
  Trash2,
  Store,
  User,
  X,
  PackageCheck
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data?.data || res.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setActionLoading(true);
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to cart. Please log in.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/wishlist/toggle', { product_id: product.id });
      alert(res.data?.message || 'Product added to wishlist!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update wishlist. Please log in.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setActionLoading(true);
    try {
      await api.delete(`/products/${product.id}`);
      alert('Product deleted successfully.');
      if (user?.role === 'sales_person') {
        router.push('/dashboard/seller');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '32px', textAlign: 'center', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', margin: '8px 0 20px 0' }}>The item you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const isOwnerOrAdmin =
    user && (user.role === 'admin' || Number(user.id) === Number(product.owner_id));

  const displayImage = product.image_url || product.imageUrl;
  const ownerDisplayName = product.shop_name || product.owner_name || 'Verified Seller';

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px 60px' }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          background: 'none',
          border: 'none',
          color: '#475569',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Main Container */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Left Column: Image */}
          <div>
            <div style={{ width: '100%', height: '380px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              {product.category && (
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {product.category}
                </span>
              )}

              {/* Owner / Admin Edit & Delete buttons */}
              {isOwnerOrAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    disabled={actionLoading}
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px 0' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              <Store size={16} style={{ color: '#0284c7' }} />
              <span>Seller: <strong>{ownerDisplayName}</strong></span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', marginBottom: '16px' }}>
              ${parseFloat(String(product.price)).toFixed(2)}
            </div>

            <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', marginBottom: '24px' }}>
              {product.description || 'No detailed description provided for this item.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155', marginBottom: '24px' }}>
              <PackageCheck size={18} style={{ color: '#16a34a' }} />
              <span>In Stock: <strong>{product.stock} items available</strong></span>
            </div>

            {/* Inline Edit Form toggle */}
            {isEditing ? (
              <div style={{ marginTop: '16px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>Edit Product</h3>
                <ProductForm
                  existingProduct={product}
                  onSuccess={() => {
                    setIsEditing(false);
                    fetchProduct();
                  }}
                />
              </div>
            ) : (
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <label style={{ fontWeight: 600, fontSize: '14px', color: '#475569' }}>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: '80px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={actionLoading}
                    style={{
                      flex: 2,
                      padding: '14px 20px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
