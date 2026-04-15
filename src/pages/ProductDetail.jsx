import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingCart, Check, TrendingDown, Activity, Wheat, Sprout, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

/* Per-product taste chips */
const tasteChips = {
  1: ['Crunchy', 'Nutty', 'Satisfying'],
  2: ['Crunchy', 'Rich', 'Indulgent'],
  3: ['Creamy', 'Smooth', 'Satisfying'],
};

const benefitIcons = [
  { icon: <TrendingDown size={20} strokeWidth={2.5} />, label: 'Zero Sugar Spike', color: '#54221b', bg: '#fdf0ed' },
  { icon: <Activity size={20} strokeWidth={2.5} />, label: 'High Fiber', color: '#2D6A4F', bg: '#edf7f2' },
  { icon: <Wheat size={20} strokeWidth={2.5} />, label: 'Millet-Powered', color: '#7b3f00', bg: '#fdf5ee' },
  { icon: <Sprout size={20} strokeWidth={2.5} />, label: '100% Natural', color: '#1e5054', bg: '#edf5f5' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));
  const related = products.filter(p => p.id !== Number(id));
  const chips = tasteChips[product?.id] || ['Crunchy', 'Rich', 'Satisfying'];

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link to="/products" className="text-[#54221b] font-bold hover:underline">← Back to Products</Link>
      </div>
    );
  }

  return (
    <main className="bg-white overflow-x-hidden">

      {/* ── PRODUCT HERO ── */}
      <section className="bg-[#faf7f5] pt-6 pb-0 sm:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#54221b] transition-colors mb-6 sm:mb-8"
          >
            <ChevronLeft size={15} />
            All Products
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">

            {/* Image */}
            <div className="relative flex items-center justify-center py-8 sm:py-10">
              {/* Glow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl opacity-25 rounded-full"
                style={{ backgroundColor: product.badgeColor || '#54221b' }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md object-contain drop-shadow-2xl z-10"
              />
            </div>

            {/* Info */}
            <div className="py-8 sm:py-12 flex flex-col">
              {/* Badge */}
              {product.badge && (
                <span
                  className="self-start text-white text-xs font-black px-3 py-1 rounded-full mb-4 uppercase tracking-wide"
                  style={{ backgroundColor: product.badgeColor || '#54221b' }}
                >
                  {product.badge}
                </span>
              )}

              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-1 tracking-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-base sm:text-lg font-semibold italic text-[#54221b] mb-4">{product.tagline}</p>
              )}

              {/* Taste chips */}
              <div className="flex gap-2 flex-wrap mb-6">
                {chips.map(chip => (
                  <span
                    key={chip}
                    className="text-sm font-black text-gray-700 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Price + weight */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black text-[#54221b]">₹{product.price}</span>
                <span className="text-sm text-gray-400 font-medium">{product.weight} · Chocolate Square</span>
              </div>

              {/* Macros strip */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { label: 'Protein', value: product.protein },
                  { label: 'Calories', value: product.calories },
                  { label: 'Carbs', value: product.carbs },
                  { label: 'Fat', value: product.fat },
                ].map(m => (
                  <div key={m.label} className="bg-white rounded-2xl p-3 sm:p-4 text-center shadow-sm border border-gray-100">
                    <div className="text-base sm:text-lg font-black text-[#54221b]">{m.value}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">{product.description}</p>

              {/* Benefit icon badges */}
              <div className="grid grid-cols-2 gap-2 mb-7">
                {benefitIcons.map(b => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: b.bg }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: b.color }}>
                      {b.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-800">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1.5">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-7 text-center font-black text-base">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-black text-sm transition-all shadow-sm ${
                    added ? 'bg-green-500 text-white' : 'bg-[#54221b] text-white hover:bg-[#6b2b22] hover:shadow-md'
                  }`}
                >
                  <ShoppingCart size={17} />
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full bg-[#54221b]" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">What's Inside</h2>
            <span className="text-xs text-gray-400 font-medium ml-auto">Nothing to hide.</span>
          </div>
          <div className="bg-[#faf7f5] rounded-2xl p-5 sm:p-7 border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.ingredients}</p>
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Every ingredient is food. No fillers, no isolates, no artificial preservatives. Read it like you'd read a recipe.
          </p>
        </div>
      </section>

      {/* ── WHY YOU'LL LOVE IT ── */}
      <section className="py-12 sm:py-16 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              The Middle Ground Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why you'll <span className="text-red-300">actually love it</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {product.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#54221b] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={13} className="text-white" />
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRY ANOTHER FLAVOUR ── */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-7">
              <div>
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1">Also in the Range</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">Try Another Flavour</h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#54221b] hover:gap-2.5 transition-all"
              >
                See all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex items-center gap-4 bg-[#faf7f5] border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-gray-900 text-sm sm:text-base">{p.name}</p>
                        {p.tagline && <p className="text-xs text-[#54221b] italic font-semibold mt-0.5">{p.tagline}</p>}
                      </div>
                      <span className="font-black text-[#54221b] text-sm flex-shrink-0">₹{p.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{p.weight} · {p.protein} Protein · {p.calories}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#2D6A4F] group-hover:gap-2 transition-all">
                      View details <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
