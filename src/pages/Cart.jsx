import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, XCircle, Loader } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../config';

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL      = 'luckysirisha1@gmail.com';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR' },
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'cod', label: 'Cash on Delivery' },
];

const DELIVERY_FEE_THRESHOLD = 599;

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    address_flat: '', address_area: '', address_city: '', address_state: '', address_pin: '',
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinErr, setPinErr] = useState('');
  const [payMethod, setPayMethod] = useState('upi');
  const [step, setStep] = useState('cart'); // cart | checkout | payment | success | failed
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [orderId, setOrderId] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePinChange = async e => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm(f => ({ ...f, address_pin: pin }));
    setPinErr('');
    if (pin.length === 6) {
      setPinLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const json = await res.json();
        if (json?.[0]?.Status === 'Success' && json[0].PostOffice?.length > 0) {
          const po = json[0].PostOffice[0];
          setForm(f => ({
            ...f,
            address_city: po.District || po.Name || f.address_city,
            address_state: po.State || f.address_state,
          }));
        } else {
          setPinErr('Pincode not found. Please fill city & state manually.');
        }
      } catch {
        setPinErr('Could not fetch pincode details. Please fill manually.');
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

  const sendOrderEmails = async (orderData) => {
    const itemsList = orderData.items
      .map(i => `${i.name} x${i.qty} — ₹${i.price * i.qty}`)
      .join('\n');

    const address = [
      orderData.address_flat,
      orderData.address_area,
      orderData.address_city,
      orderData.address_state,
      orderData.address_pin,
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
      platform_fee:   `₹${orderData.platform_fee}`,
      grand_total:    `₹${orderData.grand_total}`,
      payment_method: orderData.payment_method?.toUpperCase(),
    };

    try {
      // Email to customer
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        ...templateParams,
        to_email: orderData.customer_email,
        to_name:  orderData.customer_name,
      }, EMAILJS_KEY);

      // Email to admin
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        ...templateParams,
        to_email: ADMIN_EMAIL,
        to_name:  'Crave Better Admin',
      }, EMAILJS_KEY);
    } catch (err) {
      console.error('EmailJS error:', err);
    }
  };

  const simulatePayment = async () => {
    if (!form.customer_name || !form.customer_phone || !form.customer_email || !form.address_flat || !form.address_city || !form.address_pin) {
      setErrMsg('Please fill all required fields.');
      return;
    }
    setErrMsg('');
    setStep('payment');
    setLoading(true);

    // Simulate payment gateway delay
    await new Promise(r => setTimeout(r, 2000));

    // 90% success simulation
    const success = Math.random() < 0.9;
    if (!success) {
      setLoading(false);
      setStep('failed');
      return;
    }

    try {
      const orderPayload = {
        ...form,
        payment_method: payMethod,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
        item_total: subtotal,
        delivery_fee: deliveryFee,
        platform_fee: 5,
        grand_total: total + 5,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const json = await res.json();
      if (json.status === 'success') {
        const oid = json.data?.id;
        setOrderId(oid);
        await sendOrderEmails({
          ...form,
          orderId:      oid,
          items,
          item_total:   subtotal,
          delivery_fee: deliveryFee,
          platform_fee: 5,
          grand_total:  total + 5,
        });
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
  };

  if (step === 'payment') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <Loader size={48} className="text-[#54221b] animate-spin" />
        <p className="text-gray-600 font-medium">Processing your payment…</p>
        <p className="text-xs text-gray-400">Please do not close this window.</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <CheckCircle size={64} className="text-green-500" />
        <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
        {orderId && <p className="text-xs text-gray-400">Order ID: #{orderId}</p>}
        <p className="text-gray-500 max-w-sm">
          Your order has been placed successfully. A confirmation has been sent to <span className="font-semibold text-gray-700">{form.customer_email}</span>.
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
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1.5 py-1">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={11} />
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Street</label>
                  <input
                    type="text" name="address_area" value={form.address_area} onChange={handleChange}
                    placeholder="MG Road, Andheri West"
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
                {payMethod === 'upi' && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-2">Scan QR to pay</p>
                    <div className="w-28 h-28 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-400 text-xs">
                      [QR Code]
                    </div>
                    <p className="text-xs text-gray-400 mt-2">UPI ID: cravebetter@upi</p>
                  </div>
                )}
                {payMethod === 'card' && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-3">
                    <input type="text" placeholder="Card Number" maxLength={19}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                    <div className="flex gap-3">
                      <input type="text" placeholder="MM / YY"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                      <input type="text" placeholder="CVV" maxLength={4}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                    </div>
                    <p className="text-xs text-gray-400 text-center">This is a demo payment — no real transaction occurs.</p>
                  </div>
                )}
                {payMethod === 'cod' && (
                  <p className="mt-3 text-xs text-gray-500 bg-yellow-50 rounded-xl px-4 py-3">
                    Cash on Delivery: Pay when your order arrives. ₹5 COD convenience fee applies.
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

            {/* Items */}
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
              <div className="flex justify-between text-sm text-gray-500">
                <span>Platform Fee</span><span>₹5</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span><span>₹{total + 5}</span>
              </div>
            </div>

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
                    onClick={simulatePayment}
                    disabled={loading}
                    className="w-full bg-[#54221b] text-white font-bold py-3.5 rounded-full hover:bg-[#6b2b22] transition-colors text-sm disabled:opacity-60"
                  >
                    {loading ? 'Processing…' : `Pay ₹${total + 5}`}
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
