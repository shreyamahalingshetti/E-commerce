export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const displayRazorpayCheckout = async (orderData, onSuccess) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'E-Commerce RBAC',
    description: 'Purchase Order Payment',
    order_id: orderData.id,
    handler: function (response) {
      onSuccess(response);
    },
    theme: {
      color: '#3399cc'
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
