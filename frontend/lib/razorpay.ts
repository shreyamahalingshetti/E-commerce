import api from './api';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (orderData: any, router?: any) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const options = {
    key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: 'INR',
    name: 'RBAC Store',
    description: 'Order Payment',
    order_id: orderData.id,
    prefill: {
      name: orderData.user_name || 'Customer',
      email: orderData.user_email || ''
    },
    handler: async function (response: any) {
      try {
        await api.post('/payments/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
        alert('Payment verified! Order placed successfully.');
        if (router && typeof router.push === 'function') {
          router.push('/orders');
        } else if (typeof window !== 'undefined') {
          window.location.href = '/orders';
        }
      } catch (err: any) {
        alert(err.response?.data?.error || 'Payment verification failed');
      }
    },
    theme: {
      color: '#4f46e5'
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};

export const displayRazorpayCheckout = openRazorpayCheckout;
