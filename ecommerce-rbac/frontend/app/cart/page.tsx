'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import CartItem from '../../components/CartItem';
import api from '../../lib/api';
import { displayRazorpayCheckout } from '../../lib/razorpay';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const orderRes = await api.post('/payments/create-order', { amount: totalAmount });
      displayRazorpayCheckout(orderRes.data, async (response: any) => {
        await api.post('/payments/verify', response);
        await api.post('/orders', {
          total_amount: totalAmount,
          items: cart,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id
        });
        alert('Order placed successfully!');
        fetchCart();
      });
    } catch (err) {
      alert('Checkout failed');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'sales', 'admin']}>
      <div>
        <h2>Shopping Cart</h2>
        {cart.map((item) => (
          <CartItem key={item.id} item={item} onUpdate={fetchCart} />
        ))}
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        {cart.length > 0 && <button onClick={handleCheckout} style={{ padding: '10px 20px' }}>Checkout with Razorpay</button>}
      </div>
    </ProtectedRoute>
  );
}
