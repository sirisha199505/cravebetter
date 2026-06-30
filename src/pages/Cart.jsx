import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, XCircle, Loader } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../config';

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL      = 'kalyani@cravebetter4u.com';

const PAYMENT_METHODS = [
  { id: 'online', label: 'Pay Online (UPI / Card / Net Banking)' },
  { id: 'cod',    label: 'Cash on Delivery' },
];

const DELIVERY_FEE_THRESHOLD = 499;

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    address_flat: '', address_area: '', address_city: '', address_state: '', address_pin: '',
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinErr, setPinErr]         = useState('');
  const [payMethod, setPayMethod]   = useState('online');
  const [step, setStep]             = useState('cart'); // cart | success | failed
  const [loading, setLoading]       = useState(false);
  const [errMsg, setErrMsg]         = useState('');
  const [orderId, setOrderId]       = useState(null);

  const prepaidDiscount = payMethod === 'online' ? Math.round(subtotal * 0.03) : 0;
  const finalTotal = total - prepaidDiscount;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePinChange = async e => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm(f => ({ ...f, address_pin: pin }));
    setPinErr('');
    if (pin.length === 6) {
      setPinLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/pincode/${pin}`);
        const json = await res.json();
        if (json.status === 'success' && json.data?.city) {
          setForm(f => ({
            ...f,
            address_city:  json.data.city  || f.address_city,
            address_state: json.data.state || f.address_state,
          }));
        } else {
          setPinErr('PIN not found — please enter city & state manually.');
        }
      } catch {
        setPinErr('Could not reach lookup service — please enter city & state manually.');
      } finally {
        setPinLoading(false);
      }
    }
  };

  const toCheckout = () => {
    if (items.length === 0) return;
    setStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requiredFieldsFilled = () =>
    form.customer_name && form.customer_phone && form.customer_email &&
    form.address_flat && form.address_area && form.address_city && form.address_pin;

  const sendOrderEmails = async (orderData) => {
    const itemsList = orderData.items
      .map(i => `${i.name} x${i.qty} — ₹${i.price * i.qty}`)
      .join('\n');
    const address = [
      orderData.address_flat, orderData.address_area,
      orderData.address_city, orderData.address_state, orderData.address_pin,
    ].filter(Boolean).join(', ');
    const templateParams = {
      order_id:       orderData.orderId || '',
      customer_name:  orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      address,
      items_list:     itemsList,
      item_total:     `₹${orderData.item_total}`,
      delivery_fee:   orderData.delivery_fee === 0 ? 'FREE' : `₹${orderData.delivery_fee}`,
      grand_total:    `₹${orderData.grand_total}`,
      payment_method: orderData.payment_method === 'cod'
        ? 'Cash on Delivery'
        : orderData.payment_method === 'online'
          ? 'Online Payment (Razorpay)'
          : (orderData.payment_method || '').toUpperCase(),
    };
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        ...templateParams, to_email: orderData.customer_email, to_name: orderData.customer_name,
      }, EMAILJS_KEY);
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        ...templateParams, to_email: ADMIN_EMAIL, to_name: 'Crave Better Admin',
      }, EMAILJS_KEY);
    } catch (err) {
      console.error('EmailJS error:', err);
    }
  };

  const placeOrder = async (paymentMethod, extraFields = {}) => {
    const orderPayload = {
      ...form,
      payment_method: paymentMethod,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
      item_total:   subtotal,
      delivery_fee: deliveryFee,
      grand_total:  total,
      ...extraFields,
    };
    const res  = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    return res.json();
  };

  const handlePayment = async () => {
    if (!requiredFieldsFilled()) {
      setErrMsg('Please fill all required fields (marked *).');
      return;
    }
    setErrMsg('');
    setLoading(true);

    // Cash on Delivery — place order directly (no prepaid discount)
    if (payMethod === 'cod') {
      try {
        const json = await placeOrder('cod', { grand_total: total });
        if (json.status === 'success') {
          const oid = json.data?.order_number;
          setOrderId(oid);
          await sendOrderEmails({ ...form, orderId: oid, items, item_total: subtotal, delivery_fee: deliveryFee, grand_total: total, payment_method: 'cod' });
          clearCart();
          setStep('success');
        } else {
          setStep('failed');
        }
      } catch {
        setStep('failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online payment via Razorpay
    const loaded = await loadRazorpay();
    if (!loaded) {
      setErrMsg('Could not load payment gateway. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: create Razorpay order + pending DB order on backend
      const createRes  = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:         finalTotal * 100, // paise
          ...form,
          items:          items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
          item_total:     subtotal,
          delivery_fee:   deliveryFee,
          grand_total:    finalTotal,
        }),
      });
      const createJson = await createRes.json();
      if (createJson.status !== 'success') {
        setErrMsg('Could not initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      const rzpOrderId = createJson.data.id;
      const rzpKeyId   = createJson.data.key_id;

      // Step 2: open Razorpay checkout modal
      const options = {
        key:         rzpKeyId,
        amount:      finalTotal * 100,
        currency:    'INR',
        name:        'Crave Better Foods',
        description: 'Order Payment',
        order_id:    rzpOrderId,
        prefill: {
          name:    form.customer_name,
          email:   form.customer_email,
          contact: form.customer_phone,
        },
        theme:  { color: '#54221b' },
        handler: async (response) => {
          // Step 3: verify payment + place order
          try {
            const verifyRes  = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (verifyJson.status === 'success') {
              const oid = verifyJson.data?.order_number;
              setOrderId(oid);
              await sendOrderEmails({ ...form, orderId: oid, items, item_total: subtotal, delivery_fee: deliveryFee, grand_total: finalTotal, payment_method: 'online' });
              clearCart();
              setStep('success');
            } else {
              setStep('failed');
            }
          } catch {
            setStep('failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setLoading(false);
        setStep('failed');
      });
      rzp.open();
    } catch {
      setErrMsg('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <CheckCircle size={64} className="text-green-500" />
        <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
        {orderId && <p className="text-xs text-gray-400">Order ID: #{orderId}</p>}
        <p className="text-gray-500 max-w-sm">
          Your order has been placed successfully. A confirmation has been sent to{' '}
          <span className="font-semibold text-gray-700">{form.customer_email}</span>.
        </p>
        <Link
          to="/products"
          className="bg-[#54221b] text-white font-bold px-8 py-3 rounded-full hover:bg-[#6b2b22] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <XCircle size={64} className="text-red-500" />
        <h2 className="text-2xl font-black text-gray-900">Payment Failed</h2>
        <p className="text-gray-500 max-w-sm">Your payment could not be processed. Please try again.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setStep('checkout')}
            className="bg-[#54221b] text-white font-bold px-6 py-3 rounded-full hover:bg-[#6b2b22] transition-colors"
          >
            Try Again
          </button>
          <Link to="/products" className="border border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <ShoppingBag size={56} className="text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add some chocolate squares to get started!</p>
        <Link
          to="/products"
          className="bg-[#54221b] text-white font-bold px-8 py-3 rounded-full hover:bg-[#6b2b22] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Delivery & Discount Banner */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex-1 flex items-center gap-2.5 bg-[#edf7f2] border border-[#2D6A4F]/20 rounded-2xl px-4 py-3">
          <span className="text-lg">🚚</span>
          <div>
            <p className="text-xs font-black text-[#2D6A4F]">Free Delivery Above ₹499</p>
            <p className="text-[10px] text-gray-500">Add more to unlock free shipping</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2.5 bg-[#fdf5ee] border border-[#7b3f00]/20 rounded-2xl px-4 py-3">
          <span className="text-lg">💳</span>
          <div>
            <p className="text-xs font-black text-[#7b3f00]">Get 3% Discount on Prepaid Orders</p>
            <p className="text-[10px] text-gray-500">Pay online via UPI, Card or Net Banking</p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-black text-[#54221b] mb-8">
        {step === 'cart' ? 'Your Cart' : 'Checkout'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {step === 'cart' && (
            <>
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.protein} Protein</p>
                    <p className="text-[#54221b] font-black mt-1">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 active:scale-90"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-sm font-bold text-gray-900 min-w-[28px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 active:scale-90"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 'checkout' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-gray-900">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text" name="customer_name" value={form.customer_name} onChange={handleChange}
                    placeholder="John Doe" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input
                    type="tel" name="customer_phone" value={form.customer_phone} onChange={handleChange}
                    placeholder="+91 98765 43210" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                  <input
                    type="email" name="customer_email" value={form.customer_email} onChange={handleChange}
                    placeholder="john@example.com" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Flat / House No. *</label>
                  <input
                    type="text" name="address_flat" value={form.address_flat} onChange={handleChange}
                    placeholder="Flat 4B, Tower 1" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Street *</label>
                  <input
                    type="text" name="address_area" value={form.address_area} onChange={handleChange}
                    placeholder="MG Road, Andheri West" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code *</label>
                  <div className="relative">
                    <input
                      type="text" name="address_pin" value={form.address_pin} onChange={handlePinChange}
                      placeholder="400001" maxLength={6} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                    />
                    {pinLoading && (
                      <Loader size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                    )}
                  </div>
                  {pinErr && <p className="text-xs text-amber-600 mt-1">{pinErr}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                  <input
                    type="text" name="address_city" value={form.address_city} onChange={handleChange}
                    placeholder="Mumbai" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                  <input
                    type="text" name="address_state" value={form.address_state} onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                        payMethod === m.id
                          ? 'border-[#54221b] bg-[#54221b] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#54221b]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {payMethod === 'online' && (
                  <p className="mt-3 text-xs text-gray-500 bg-blue-50 rounded-xl px-4 py-3">
                    You'll be taken to a secure Razorpay payment page to pay via UPI, Card, or Net Banking.
                  </p>
                )}
                {payMethod === 'cod' && (
                  <p className="mt-3 text-xs text-gray-500 bg-yellow-50 rounded-xl px-4 py-3">
                    Cash on Delivery: Pay when your order arrives.
                  </p>
                )}
              </div>
              {errMsg && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errMsg}</p>}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{i.name} × {i.qty}</span>
                  <span className="text-gray-900 font-semibold flex-shrink-0">₹{i.price * i.qty}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {payMethod === 'online' && prepaidDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Prepaid Discount (3%)</span>
                  <span>-₹{prepaidDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span><span>₹{finalTotal}</span>
              </div>
            </div>

            {payMethod === 'online' && prepaidDiscount > 0 && (
              <p className="text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2 mt-3 font-semibold">
                🎉 You save ₹{prepaidDiscount} with prepaid payment (3% off)!
              </p>
            )}

            {subtotal > 0 && subtotal < DELIVERY_FEE_THRESHOLD && (
              <p className="text-xs text-teal-600 bg-teal-50 rounded-xl px-3 py-2 mt-3">
                Add ₹{DELIVERY_FEE_THRESHOLD - subtotal} more for FREE delivery!
              </p>
            )}

            <div className="mt-4 space-y-2">
              {step === 'cart' ? (
                <>
                  <button
                    onClick={toCheckout}
                    className="w-full bg-[#54221b] text-white font-bold py-3.5 rounded-full hover:bg-[#6b2b22] transition-colors text-sm"
                  >
                    Proceed to Checkout
                  </button>
                  <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                    Continue Shopping
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-[#54221b] text-white font-bold py-3.5 rounded-full hover:bg-[#6b2b22] transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <><Loader size={16} className="animate-spin" /> Processing…</>
                      : payMethod === 'cod' ? `Place Order — ₹${total}` : `Pay ₹${finalTotal}`
                    }
                  </button>
                  <button
                    onClick={() => { setStep('cart'); setErrMsg(''); }}
                    className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
                  >
                    ← Back to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
