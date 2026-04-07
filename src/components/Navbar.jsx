import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { isLoggedIn, userInfo, logoutUser, setShowAuthPopup } = useUserAuth();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const userMenuRef = useRef(null);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
  ];

  const isActive = (to) => pathname === to;

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userInfo?.full_name
    ? userInfo.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#54221b] text-white text-center text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2 tracking-wide px-4">
        🚚 Free delivery on orders above ₹500 &nbsp;·&nbsp; 20g protein per bar &nbsp;·&nbsp; No artificial additives
      </div>

      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <img
              src="/icon2.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain flex-shrink-0"
            />
            <span className="font-black text-gray-900 text-sm sm:text-base md:text-lg leading-none tracking-tight">
              Crave <span className="text-[#1e5054]">Better</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-sm lg:text-base font-semibold transition-colors pb-1 group ${
                  isActive(l.to) ? 'text-[#1e5054]' : 'text-gray-700 hover:text-[#1e5054]'
                }`}
              >
                {l.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#1e5054] transition-all duration-300 ${isActive(l.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shop CTA — desktop only */}
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#1e5054] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#245940] transition-colors shadow-sm"
            >
              Shop Now
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-full hover:bg-gray-50 transition-colors">
              <ShoppingCart size={20} className="text-[#1e5054]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#54221b] text-white text-[9px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth — user menu or login button */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1e5054] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[90px] truncate">
                    {userInfo?.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-black text-gray-900 truncate">{userInfo?.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{userInfo?.email}</p>
                    </div>
                    <button
                      onClick={() => { logoutUser(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthPopup(true)}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:border-[#1e5054] hover:text-[#1e5054] transition-colors text-xs sm:text-sm"
              >
                <User size={13} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} className="text-[#1e5054]" /> : <Menu size={20} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors ${
                  isActive(l.to)
                    ? 'bg-[#1e5054]/10 text-[#1e5054]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#1e5054]'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-[#1e5054] text-white font-bold py-2.5 rounded-full text-sm hover:bg-[#245940] transition-colors"
              >
                Shop Now
              </Link>
              {!isLoggedIn && (
                <button
                  onClick={() => { setOpen(false); setShowAuthPopup(true); }}
                  className="w-full text-center border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-full text-sm hover:border-[#1e5054] hover:text-[#1e5054] transition-colors"
                >
                  Login / Register
                </button>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => { setOpen(false); logoutUser(); }}
                  className="w-full text-center text-red-600 font-semibold py-2.5 rounded-full text-sm hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
