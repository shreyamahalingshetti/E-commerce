'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import CartItem from '../../components/CartItem';
import { useCart } from '../../context/CartContext';
import api from '../../lib/api';
import { openRazorpayCheckout } from '../../lib/razorpay';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, loading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1),
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckoutLoading(true);
    try {
      const orderRes = await api.post('/payments/create-order', { amount: totalAmount });
      await openRazorpayCheckout(orderRes.data, router);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to initiate checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'sales_person', 'sales', 'admin']}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Your Shopping Cart</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#94a3b8' }}>
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Browse Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <CartItem key={item.id || item.product_id} item={item} />
            ))}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '20px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#475569' }}>Total Amount:</span>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb' }}>₹{totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '14px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              {checkoutLoading ? 'Processing Checkout...' : 'Proceed to Checkout with Razorpay'}
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
