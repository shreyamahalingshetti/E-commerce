'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import Link from 'next/link';
import {
  Store,
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  ShoppingBag,
  DollarSign,
  Box,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  category: string;
  image_url: string | null;
  owner_id: number;
}

interface OrderItem {
  id: number;
  product_id: number;
  seller_id: number;
  product_name: string;
  price: string | number;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSellerProducts();
    fetchSellerOrders();
  }, [user]);

  const fetchSellerProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get(`/products?owner_id=${user.id}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch seller products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSellerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/seller');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditDescription(product.description || '');
    setEditPrice(String(product.price || ''));
    setEditStock(String(product.stock || '0'));
    setEditCategory(product.category || '');
    setEditImageUrl(product.image_url || '');
    setModalError(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaveLoading(true);
    setModalError(null);

    try {
      await api.put(`/products/${editingProduct.id}`, {
        name: editName,
        description: editDescription,
        price: parseFloat(editPrice),
        stock: parseInt(editStock, 10),
        category: editCategory,
        image_url: editImageUrl
      });
      setEditingProduct(null);
      fetchSellerProducts();
    } catch (err: any) {
      setModalError(err.response?.data?.error || 'Failed to update product.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  const shopName = user?.business_name || `${user?.name || 'Seller'}'s Shop`;

  return (
    <ProtectedRoute allowedRoles={['sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px 60px' }}>
        {/* Shop Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: '#fff',
            marginBottom: '36px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Store size={14} /> Seller Hub
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
              {shopName}
            </h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '15px' }}>
              Owner: <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <Link
            href="/products/new"
            className="btn-primary"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <PlusCircle size={18} />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Section 1: Seller's Products */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={22} style={{ color: 'var(--accent-blue)' }} />
              <span>My Products</span>
              <span style={{ fontSize: '14px', background: '#e2e8f0', color: '#475569', padding: '2px 10px', borderRadius: '12px', marginLeft: '6px' }}>
                {products.length}
              </span>
            </h2>
          </div>

          {loadingProducts ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                background: '#f8fafc'
              }}
            >
              <ShoppingBag size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 6px 0', color: '#334155' }}>No products listed yet</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                Start adding items to your shop inventory.
              </p>
              <Link
                href="/products/new"
                style={{
                  color: '#2563eb',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <PlusCircle size={16} /> Add your first product
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{ height: '180px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}
                      >
                        No image available
                      </div>
                    )}
                    {product.category && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 6px 0', color: '#1e293b' }}>
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#64748b',
                        margin: '0 0 12px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                      }}
                    >
                      {product.description || 'No description'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
                          ${parseFloat(String(product.price)).toFixed(2)}
                        </span>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Stock: {product.stock}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(product)}
                          title="Edit product"
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          title="Delete product"
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Orders for Seller's Products */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={22} style={{ color: '#16a34a' }} />
            <span>Orders for My Products</span>
            <span style={{ fontSize: '14px', background: '#e2e8f0', color: '#475569', padding: '2px 10px', borderRadius: '12px', marginLeft: '6px' }}>
              {orders.length}
            </span>
          </h2>

          {loadingOrders ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                background: '#fff'
              }}
            >
              <p style={{ color: '#64748b', margin: 0 }}>No orders received for your products yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '12px',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                        Order #{order.id}
                      </span>
                      {order.customer_name && (
                        <span style={{ marginLeft: '12px', color: '#475569', fontSize: '14px' }}>
                          Customer: <strong>{order.customer_name}</strong> ({order.customer_email})
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: String(order.status).toLowerCase() === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: String(order.status).toLowerCase() === 'paid' ? '#15803d' : '#b45309'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Purchased Items owned by seller */}
                  <div style={{ margin: '12px 0' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>
                      Items Ordered:
                    </h4>
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {order.items.map((item, idx) => (
                          <li key={idx} style={{ margin: '4px 0', fontSize: '14px', color: '#334155' }}>
                            <strong>{item.product_name}</strong> — {item.quantity} x ${parseFloat(String(item.price)).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '14px', color: '#94a3b8' }}>No item details available</p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px dashed #e2e8f0',
                      fontSize: '13px',
                      color: '#64748b'
                    }}
                  >
                    <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                      Order Total: ${parseFloat(String(order.total_amount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '520px',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                  Edit Product #{editingProduct.id}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="e.g. Electronics"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
