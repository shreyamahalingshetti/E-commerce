'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import CartItem from '../../components/CartItem';
import api from '../../lib/api';
import { openRazorpayCheckout } from '../../lib/razorpay';

import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
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
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Your Shopping Cart</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading cart...</div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Your cart is empty.</div>
        ) : (
          <div>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} onUpdate={fetchCart} />
            ))}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '20px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Amount:</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '14px',
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
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

