import { Link } from 'react-router-dom';
import { Plus, Minus, Info, TrendingDown, Activity, Wheat, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

function ProductCard({ product }) {
  const { addToCart, updateQty, removeFromCart, items } = useCart();
  const cartItem = items.find(i => i.id === product.id);
  const qty = cartItem?.qty || 0;

  const handleAdd = () => addToCart(product, 1);
  const handleIncrease = () => addToCart(product, 1);
  const handleDecrease = () => {
    if (qty === 1) removeFromCart(product.id);
    else updateQty(product.id, qty - 1);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative bg-[#fdf5f0] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 sm:h-72 object-contain py-5 px-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wide"
            style={{ backgroundColor: product.badgeColor || '#54221b' }}
          >
            {product.badge}
          </span>
        )}
        {/* Benefit badge pills */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#54221b]/90 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            <TrendingDown size={8} strokeWidth={3} /> Zero Sugar Spike
          </span>
          <span className="inline-flex items-center gap-1 bg-[#2D6A4F]/90 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Activity size={8} strokeWidth={3} /> High Fiber
          </span>
          <span className="inline-flex items-center gap-1 bg-[#7b3f00]/90 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Wheat size={8} strokeWidth={3} /> Millet-Powered
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-black text-gray-900 text-lg leading-snug">{product.name}</h3>
          {product.tagline && (
            <p className="text-xs sm:text-sm text-[#54221b] italic font-semibold mt-0.5">{product.tagline}</p>
          )}
          <p className="text-xs text-gray-400 mt-1.5">{product.weight} · {product.protein} Protein · {product.calories}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-xl font-black text-[#54221b]">₹{product.price}</span>
            <span className="text-[10px] text-gray-400 ml-1">/ square</span>
          </div>

          <div className="flex items-center gap-2">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className="bg-[#54221b] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#6b2b22] transition-all shadow-sm"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#54221b] rounded-full px-2 py-1.5">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Minus size={13} className="text-white" />
                </button>
                <span className="w-8 text-center text-sm font-black text-white">{qty}</span>
                <button
                  onClick={handleIncrease}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Plus size={13} className="text-white" />
                </button>
              </div>
            )}
            <Link
              to={`/products/${product.id}`}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:border-[#1e5054] hover:text-[#1e5054] transition-colors flex-shrink-0"
              title="Details"
            >
              <Info size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* ── SHOP HEADER ── */}
      <section className="bg-gray-950 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(84,34,27,0.3) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(45,106,79,0.15) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 text-center">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Pick Your Middle Ground</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            3 Flavours.{' '}
            <span className="text-red-300">Zero Guilt.</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            Crunchy, rich, satisfying — and actually good for you. Made with Ragi, Peanuts, Oats & Jaggery.
          </p>

          {/* Taste strip */}
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {['Crunchy', 'Rich', 'Satisfying'].map((word, i) => (
              <span key={word} className="flex items-center gap-4 sm:gap-8">
                <span className="text-white font-black text-lg sm:text-2xl uppercase tracking-tight">{word}</span>
                {i < 2 && <span className="text-[#54221b] text-xl sm:text-2xl font-black select-none">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY STRIP ── */}
      <div className="bg-[#2D6A4F] text-white text-center py-2.5 text-xs sm:text-sm font-semibold tracking-wide">
        🚚 Free delivery on orders above ₹599
      </div>

      {/* ── PRODUCT GRID ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-[#faf7f5] border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🌾', label: 'Millet-Powered', sub: 'Ragi as the base' },
              { icon: '🍫', label: 'Real Chocolate', sub: 'Not flavoured coating' },
              { icon: '🔬', label: 'Zero Refined Sugar', sub: 'Sweetened with Jaggery & FOS' },
              { icon: '📦', label: 'Free Delivery', sub: 'Orders above ₹599' },
            ].map(t => (
              <div key={t.label} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl sm:text-3xl">{t.icon}</span>
                <p className="font-black text-gray-900 text-xs sm:text-sm">{t.label}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
