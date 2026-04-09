import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
  ];

  const isActive = (to) => pathname === to;

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-[#54221b] text-white text-center text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2 tracking-wide px-4">
        🚚 Free delivery on orders above ₹1500 &nbsp;·&nbsp; 5g protein per bar &nbsp;·&nbsp; No artificial additives
      </div>

      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <img
              src="/new logo2.png"
              alt=""
              aria-hidden="true"
              className="h-12 wsm:h-14 sm:w-14 object-contain flex-shrink-0"
            />
            <img
              src="/icon2.png"
              alt="Crave Better"
              className="h-10 sm:h-12 w-auto max-w-[600px] sm:max-w-[400px] object-contain flex-shrink-0"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-sm lg:text-base font-semibold transition-colors pb-1 group ${isActive(l.to) ? 'text-[#2D6A4F]' : 'text-gray-700 hover:text-[#2D6A4F]'
                  }`}
              >
                {l.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#2D6A4F] transition-all duration-300 ${isActive(l.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shop CTA — desktop only */}
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#245940] transition-colors shadow-sm"
            >
              Shop Now
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-full hover:bg-gray-50 transition-colors">
              <ShoppingCart size={22} className="text-[#2D6A4F]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#54221b] text-white text-[9px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} className="text-[#2D6A4F]" /> : <Menu size={20} className="text-gray-700" />}
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
                className={`text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors ${isActive(l.to)
                    ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#2D6A4F]'
                  }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-[#2D6A4F] text-white font-bold py-2.5 rounded-full text-sm hover:bg-[#245940] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
