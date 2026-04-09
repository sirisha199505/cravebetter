import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, ArrowRight } from 'lucide-react';

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  const close = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm sm:max-w-md"
        style={{ animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Top brand band */}
        <div className="bg-[#2D6A4F] px-6 sm:px-8 pt-8 pb-7 text-white text-center relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/5" />
          <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-white/10 blur-2xl" />

          {/* Logo */}
          <div className="relative flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <img
                src="/new logo.png"
                alt="Crave Better"
                className="h-9 w-9 object-contain"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="text-left">
              <p className="font-black text-white text-xl leading-none">Crave Better</p>
              <p className="text-green-200 text-xs mt-0.5 font-medium">Foods</p>
            </div>
          </div>

          <div className="relative inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
            <Zap size={11} /> Welcome to Crave Better Foods
          </div>

          <h2 className="relative text-2xl sm:text-3xl font-black leading-tight mb-2">
            Fuel Your<br />
            <span className="text-green-200">Best Performance</span>
          </h2>
          <p className="relative text-green-100/90 text-xs sm:text-sm leading-relaxed">
            India's premium protein bars — crafted for athletes, fighters, and anyone who refuses to settle.
          </p>
        </div>

        {/* Bottom section */}
        <div className="px-6 sm:px-8 py-6 bg-white text-center">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            {[
              { value: '20g', label: 'Protein' },
              { value: '5', label: 'Flavours' },
              { value: '0', label: 'Junk' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl py-3 sm:py-4">
                <div className="text-lg sm:text-xl font-black text-[#54221b]">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              to="/products"
              onClick={close}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#54221b] text-white font-bold py-3 sm:py-3.5 rounded-full hover:bg-[#6b2b22] transition-colors text-sm"
            >
              Shop Now <ArrowRight size={14} />
            </Link>
            <Link
              to="/bulk-orders"
              onClick={close}
              className="w-full border border-[#2D6A4F] text-[#2D6A4F] font-bold py-2.5 sm:py-3 rounded-full hover:bg-[#2D6A4F] hover:text-white transition-colors text-sm"
            >
              Bulk Orders
            </Link>
          </div>

          <button
            onClick={close}
            className="mt-4 text-[11px] sm:text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Continue browsing
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
