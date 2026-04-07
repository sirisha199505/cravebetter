import { useState } from 'react';
import { X, User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const API_BASE = '/api';

const inputCls =
  'w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] transition-colors bg-white py-2.5';

export default function AuthPopup() {
  const { showAuthPopup, setShowAuthPopup, loginUser } = useUserAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ full_name: '', email: '', password: '', phone_number: '' });

  if (!showAuthPopup) return null;

  const switchTab = (t) => { setTab(t); setErr(''); setShowPass(false); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: loginForm }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        loginUser(json.data.token, json.data.info);
      } else {
        setErr(json.data || 'Invalid credentials.');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: regForm }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        loginUser(json.data.token, json.data.info);
      } else {
        setErr(json.data || 'Registration failed.');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthPopup(false)} />

      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm"
        style={{ animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Header band */}
        <div className="bg-[#2D6A4F] px-7 pt-8 pb-6 text-white text-center">
          <img
            src="/icon2.png"
            alt="Crave Better Foods"
            className="h-10 w-auto object-contain mx-auto mb-3"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h2 className="text-lg font-black">
            {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-green-200 text-xs mt-1">
            {tab === 'login' ? 'Sign in to continue' : 'Join 10,000+ athletes'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-3 text-sm font-bold transition-colors capitalize ${
                tab === t
                  ? 'text-[#54221b] border-b-2 border-[#54221b]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <div className="px-7 py-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email" placeholder="Email address" required
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  className={`${inputCls} pl-9 pr-4`}
                />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'} placeholder="Password" required
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className={`${inputCls} pl-9 pr-10`}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {err && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-[#54221b] text-white font-bold py-3 rounded-full text-sm hover:bg-[#6b2b22] transition-colors disabled:opacity-60 mt-1">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text" placeholder="Full name" required
                  value={regForm.full_name}
                  onChange={e => setRegForm(f => ({ ...f, full_name: e.target.value }))}
                  className={`${inputCls} pl-9 pr-4`}
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email" placeholder="Email address" required
                  value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                  className={`${inputCls} pl-9 pr-4`}
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel" placeholder="Phone number (optional)"
                  value={regForm.phone_number}
                  onChange={e => setRegForm(f => ({ ...f, phone_number: e.target.value }))}
                  className={`${inputCls} pl-9 pr-4`}
                />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'} placeholder="Password (min. 6 chars)" required
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                  className={`${inputCls} pl-9 pr-10`}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {err && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-[#2D6A4F] text-white font-bold py-3 rounded-full text-sm hover:bg-[#245940] transition-colors disabled:opacity-60 mt-1">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => setShowAuthPopup(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
