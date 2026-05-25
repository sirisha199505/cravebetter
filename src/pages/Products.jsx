import { Link } from 'react-router-dom';
import { Plus, Minus, TrendingDown, Activity, Wheat, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

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
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#54221b]/90 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            <TrendingDown size={8} strokeWidth={3} /> Minimal Sugar Spike
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
          {product.pack && (
            <p className="text-xs font-black text-[#2D6A4F] mt-0.5">{product.pack}</p>
          )}
          {product.tagline && (
            <p className="text-xs sm:text-sm text-[#54221b] italic font-semibold mt-0.5">{product.tagline}</p>
          )}
          <p className="text-xs text-gray-400 mt-1.5">{product.weight} · {product.protein} Protein · {product.calories}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-xl font-black text-[#54221b]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
            )}
            <span className="text-[10px] text-gray-400 ml-1">/ pack</span>
          </div>

          <div className="flex items-center gap-2">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className="text-[10px] font-semibold px-2.5 py-1 rounded bg-[#54221b] text-white hover:bg-[#6b2b22] transition-colors"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-300"
                >
                  <Minus size={11} />
                </button>
                <span className="px-3 text-xs font-bold text-gray-900">{qty}</span>
                <button
                  onClick={handleIncrease}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors border-l border-gray-300"
                >
                  <Plus size={11} />
                </button>
              </div>
            )}
            <Link
              to={`/products/${product.id}`}
              className="text-xs font-semibold text-gray-400 hover:text-[#54221b] transition-colors whitespace-nowrap"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { products, loading } = useProducts();

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
            4 Flavours.{' '}
            <span className="text-red-300">Zero Guilt.</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            Crunchy, rich, satisfying — and actually good for you. Made with Ragi, Peanuts, Oats & Jaggery.
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {['Crunchy', 'Rich', 'Satisfying', 'Indulgent'].map((word, i) => (
              <span key={word} className="flex items-center gap-4 sm:gap-8">
                <span className="text-white font-black text-lg sm:text-2xl uppercase tracking-tight">{word}</span>
                {i < 3 && <span className="text-[#54221b] text-xl sm:text-2xl font-black select-none">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY STRIP ── */}
      <div className="bg-[#2D6A4F] text-white text-center py-2.5 text-xs sm:text-sm font-semibold tracking-wide">
        🚚 Free delivery on orders above ₹499&nbsp;&nbsp;·&nbsp;&nbsp;💳 Prepaid orders get 3% off
      </div>

      {/* ── PRODUCT GRID ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="col-span-4 py-20 text-center text-gray-400 text-sm">Loading products…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
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
              { icon: '📦', label: 'Free Delivery', sub: 'Orders above ₹499' },
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
