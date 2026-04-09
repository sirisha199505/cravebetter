import { useState } from 'react';
import { Building2, Users, Dumbbell, Bus, CheckCircle, ChevronDown, LogIn } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const targets = [
  { icon: <Dumbbell size={22} className="text-[#54221b]" />, label: 'Gyms & Fitness Centres' },
  { icon: <Users size={22} className="text-[#54221b]" />, label: 'Fight Events & MMA Clubs' },
  { icon: <Bus size={22} className="text-[#54221b]" />, label: 'Bus & Travel Agencies' },
  { icon: <Building2 size={22} className="text-[#54221b]" />, label: 'Corporate Wellness' },
];

const productOptions = [
  { value: '', label: 'Select a flavour...' },
  { value: 'Classic Square', label: 'Classic Square — ₹35 · 28g · 120 kcal' },
  { value: 'Dark Choco Square', label: 'Dark Choco Square — ₹60 · 38g · 180 kcal' },
  { value: 'Milk Choco Square', label: 'Milk Choco Square — ₹50 · 38g · 170 kcal' },
  { value: 'Assorted Mix', label: 'Assorted Mix (all flavours)' },
];

import { API_BASE } from '../config';

export default function BulkOrders() {
  const { isLoggedIn, userInfo, setShowAuthPopup } = useUserAuth();
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    product_preference: '',
    quantity: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthPopup(true);
      return;
    }
    if (!form.business_name || !form.contact_phone || !form.quantity) {
      setErrMsg('Please fill in Business Name, Phone, and Quantity.');
      return;
    }
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch(`${API_BASE}/bulk-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        setStatus('success');
        setForm({ business_name: '', contact_name: '', contact_phone: '', contact_email: '', product_preference: '', quantity: '', message: '' });
      } else {
        setErrMsg(json.data || 'Something went wrong. Please try again.');
        setStatus('idle');
      }
    } catch {
      setErrMsg('Network error. Please try again.');
      setStatus('idle');
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] transition-colors bg-white';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-3">Partner With Us</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          Bulk <span className="text-[#54221b]">Orders</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Get premium protein bars at special bulk pricing. Perfect for gyms, fight events, travel agencies, and corporate teams.
        </p>
      </div>

      {/* Target customers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
        {targets.map(t => (
          <div key={t.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 text-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              {t.icon}
            </div>
            <p className="text-xs font-semibold text-gray-700 leading-snug">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Form + Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6">Request a Bulk Quote</h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <CheckCircle size={52} className="text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Request Received!</h3>
              <p className="text-gray-500 max-w-xs text-sm">
                Our team will reach out within 24 hours with your customised bulk pricing.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 bg-[#54221b] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#6b2b22] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Business / Organisation Name *</label>
                <input
                  type="text"
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  placeholder="e.g. Iron Gym, India Fights League"
                  className={inputCls}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={form.contact_phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  className={inputCls}
                />
              </div>

              {/* Product dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Product / Flavour</label>
                <div className="relative">
                  <select
                    name="product_preference"
                    value={form.product_preference}
                    onChange={handleChange}
                    className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  >
                    {productOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity Required *</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  min="50"
                  className={inputCls}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Minimum order: 50 bars</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your event, delivery requirements, custom packaging..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {errMsg && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errMsg}</p>}

              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <LogIn size={15} className="text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-medium">
                    Please <button type="button" onClick={() => setShowAuthPopup(true)} className="underline font-bold">sign in</button> to submit a bulk order request.
                  </p>
                </div>
              )}

              {isLoggedIn && userInfo && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">Submitting as <span className="font-bold">{userInfo.full_name || userInfo.email}</span></p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#54221b] text-white font-bold py-3.5 rounded-full hover:bg-[#6b2b22] transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {!isLoggedIn
                  ? <><LogIn size={15} /> Sign In to Submit</>
                  : status === 'loading' ? 'Submitting...' : 'Request Bulk Order'
                }
              </button>
            </form>
          )}
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#54221b] text-white rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-black mb-5">Bulk Order Benefits</h3>
            <ul className="space-y-3">
              {[
                'Special discounted pricing for bulk orders',
                'Custom branding & packaging available',
                'Dedicated account manager',
                'Flexible delivery scheduling',
                'Priority customer support',
                'Minimum order: 50 bars',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-red-100">
                  <CheckCircle size={16} className="text-red-300 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview */}
          <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
            <h4 className="font-black text-gray-900 text-sm mb-4">Available Flavours</h4>
            <div className="space-y-2.5">
              {productOptions.slice(1).map(o => (
                <div key={o.value} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{o.value}</span>
                  <span className="text-xs text-[#2D6A4F] font-semibold bg-[#2D6A4F]/10 px-2.5 py-0.5 rounded-full">
                    {o.label.includes('protein') ? o.label.split('— ')[1] : 'All flavours'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e5054] text-white rounded-2xl p-6">
            <h4 className="font-bold mb-2 text-sm">India Fights Partnership</h4>
            <p className="text-sm text-teal-100 leading-relaxed">
              We proudly supply protein bars to fight events across India. Power up your athletes — Crave Better Foods is the official nutrition partner for major fight circuits.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
