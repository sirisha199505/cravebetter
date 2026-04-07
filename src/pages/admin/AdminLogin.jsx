import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const API_BASE = '/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email, password } }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        localStorage.setItem('cb_token', json.data.token);
        localStorage.setItem('cb_user', JSON.stringify(json.data.info));
        navigate('/admin/dashboard');
      } else {
        setErr(json.data || 'Invalid credentials.');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#edf7f2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Top brand bar */}
          <div className="bg-[#54221b] px-8 pt-8 pb-7 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/icon2.png"
                alt="Crave Better"
                className="h-10 w-10 object-contain brightness-0 invert"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="text-left">
                <p className="font-black text-white text-lg leading-none tracking-tight">Crave Better</p>
                <p className="text-red-200 text-xs mt-0.5">Foods</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full">
              <Lock size={11} className="text-red-200" />
              <span className="text-white text-[11px] font-bold uppercase tracking-widest">Admin Access</span>
            </div>
          </div>

          {/* Form area */}
          <div className="px-8 py-7">
            <h1 className="text-lg font-black text-gray-900 mb-1">Sign In</h1>
            <p className="text-xs text-gray-400 mb-6">Enter your credentials to access the dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cravebetterfoods.com" required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] transition-colors"
                  />
                  <button
                    type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {err && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-red-600">{err}</p>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full bg-[#54221b] text-white font-bold py-3 rounded-full hover:bg-[#6b2b22] transition-colors disabled:opacity-60 text-sm mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={12} />
            Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}
