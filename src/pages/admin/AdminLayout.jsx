import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, ChevronDown, User, KeyRound, ExternalLink,
  Eye, EyeOff, X,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { to: '/admin/products',  icon: <Package size={17} />,         label: 'Products' },
  { to: '/admin/orders',    icon: <ShoppingBag size={17} />,     label: 'Orders' },
  { to: '/admin/bulk-orders', icon: <Users size={17} />,         label: 'Bulk Orders' },
];

const API_BASE = '/api';

function EditProfileModal({ onClose }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setSuccess('');
    if (form.new_password !== form.confirm_password) {
      setErr('New passwords do not match.'); return;
    }
    if (form.new_password.length < 6) {
      setErr('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
        },
        body: JSON.stringify({ data: { current_password: form.current_password, new_password: form.new_password } }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        setSuccess('Password updated successfully!');
        setForm({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setErr(json.data || 'Failed to update password.');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally { setLoading(false); }
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] bg-white';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7" style={{ animation: 'popIn 0.3s ease both' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors">
          <X size={15} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#54221b]/10 rounded-xl flex items-center justify-center text-[#54221b]">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base">Change Password</h3>
            <p className="text-xs text-gray-400">Update your admin password</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.current_password}
                onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))}
                placeholder="••••••••" required className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
            <input type={showPass ? 'text' : 'password'} value={form.new_password}
              onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
              placeholder="Min. 6 characters" required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
            <input type={showPass ? 'text' : 'password'} value={form.confirm_password}
              onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
              placeholder="Re-enter new password" required className={inputCls} />
          </div>
          {err     && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          {success && <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#54221b] text-white font-bold py-3 rounded-full text-sm hover:bg-[#6b2b22] transition-colors disabled:opacity-60 mt-1">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
      <style>{`@keyframes popIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [adminUser, setAdminUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('cb_token');
    if (!token) { navigate('/admin', { replace: true }); return; }
    const info = localStorage.getItem('cb_user');
    if (info) setAdminUser(JSON.parse(info));
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
    navigate('/admin');
  };

  const initials = adminUser?.full_name
    ? adminUser.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">

          {/* Left — Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <img src="/icon2.png" alt="" aria-hidden="true" className="h-8 w-8 object-contain"
              onError={e => { e.target.style.display = 'none'; }} />
            <div className="leading-none">
              <span className="font-black text-gray-900 text-sm sm:text-base tracking-tight block">
                Crave <span className="text-[#1e5054]">Better</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Admin Panel</span>
            </div>
          </Link>

          {/* Right — actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Main Site link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e5054] border border-[#1e5054]/30 px-3 py-1.5 rounded-full hover:bg-[#1e5054]/5 transition-colors"
            >
              <ExternalLink size={12} />
              Main Site
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#54221b] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">{adminUser?.full_name || 'Admin'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{adminUser?.email}</p>
                </div>
                <ChevronDown size={13} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-black text-gray-900 truncate">{adminUser?.full_name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{adminUser?.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold bg-[#54221b]/10 text-[#54221b] px-2 py-0.5 rounded-full">
                      Administrator
                    </span>
                  </div>
                  <Link
                    to="/"
                    target="_blank"
                    onClick={() => setProfileOpen(false)}
                    className="sm:hidden flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1e5054] hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink size={14} /> Main Site
                  </Link>
                  <button
                    onClick={() => { setShowEditProfile(true); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <KeyRound size={14} /> Change Password
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="flex overflow-x-auto border-t border-gray-100 px-4 sm:px-6 scrollbar-hide">
          {navItems.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                pathname === n.to
                  ? 'border-[#54221b] text-[#54221b]'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {n.icon}
              {n.label}
            </Link>
          ))}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
    </div>
  );
}
