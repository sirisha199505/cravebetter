import { Link } from 'react-router-dom';
import { TrendingDown, Wheat, Sprout, ArrowRight, Star, Plus, Minus, Coffee, Moon, Zap, Activity } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

/* ── data ── */

const benefitBadges = [
  {
    icon: <TrendingDown size={28} strokeWidth={2.5} />,
    label: 'Zero Sugar Spike',
    sub: 'All the sweetness. None of the crash.',
    color: '#54221b',
    bg: '#fdf0ed',
  },
  {
    icon: <Activity size={28} strokeWidth={2.5} />,
    label: 'High Fiber',
    sub: 'Stays with you. Keeps you satisfied.',
    color: '#2D6A4F',
    bg: '#edf7f2',
  },
  {
    icon: <Wheat size={28} strokeWidth={2.5} />,
    label: 'Millet-Powered',
    sub: 'Ragi — the ancient Indian superfood.',
    color: '#7b3f00',
    bg: '#fdf5ee',
  },
  {
    icon: <Sprout size={28} strokeWidth={2.5} />,
    label: '100% Natural',
    sub: 'Read the label. We dare you.',
    color: '#1e5054',
    bg: '#edf5f5',
  },
];

const occasions = [
  {
    time: '11 AM',
    tag: 'Office Snack',
    icon: <Coffee size={32} strokeWidth={2} />,
    title: 'Between Meetings',
    desc: 'Chai wore off. Lunch is two hours away. One square and you\'re back in the game — no vending machine required.',
    bg: '#54221b',
    accent: 'text-red-200',
  },
  {
    time: '3 PM',
    tag: 'The Slump Fix',
    icon: <Zap size={32} strokeWidth={2} />,
    title: 'The 3 PM Dip',
    desc: 'Everyone hits the wall. A Crave Better Square beats a sugary biscuit every time. Real energy, no regret.',
    bg: '#2D6A4F',
    accent: 'text-green-200',
  },
  {
    time: 'After Dinner',
    tag: 'Sweet Cravings',
    icon: <Moon size={32} strokeWidth={2} />,
    title: 'Late Night Fix',
    desc: 'You want something sweet. We get it. A rich chocolate square that\'s high in fiber? That\'s the smart move.',
    bg: '#1e5054',
    accent: 'text-teal-200',
  },
];

const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Working Professional, Mumbai',
    text: 'Genuinely surprised — I expected a "health bar" taste and got a proper chocolate. The Classic Square is on my desk every day now.',
    rating: 5,
    avatar: 'AS',
  },
  {
    name: 'Priya Menon',
    role: 'Teacher, Bangalore',
    text: "My students always sneak my Dark Choco Squares. Guess that settles the 'does it taste good?' question. We're all hooked.",
    rating: 5,
    avatar: 'PM',
  },
  {
    name: 'Rohan Desai',
    role: 'Business Owner, Pune',
    text: "We bulk order for the whole office now. The Milk Choco Square is gone within a day. Everyone assumes it's a regular chocolate — until they read the label.",
    rating: 5,
    avatar: 'RD',
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

/* ── component ── */

export default function Home() {
  const { addToCart, updateQty, removeFromCart, items } = useCart();

  const getQty = (id) => items.find(i => i.id === id)?.qty || 0;
  const handleAdd = (p) => addToCart(p, 1);
  const handleIncrease = (p) => addToCart(p, 1);
  const handleDecrease = (p) => {
    const q = getQty(p.id);
    if (q === 1) removeFromCart(p.id);
    else updateQty(p.id, q - 1);
  };

  return (
    <main className="overflow-x-hidden bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-[#54221b] text-white min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 55%),
                            radial-gradient(ellipse at 10% 80%, rgba(45,106,79,0.22) 0%, transparent 50%)`,
        }} />
        <img
          src="/main image 2.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-[80%] w-auto object-contain opacity-[0.08] pointer-events-none select-none z-0"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/5 z-0" />
        <div className="absolute -left-12 bottom-16 w-60 h-60 rounded-full bg-[#2D6A4F]/15 blur-3xl z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 md:py-28 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Text */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-3 sm:px-4 rounded-full mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              India's Favourite Middle Ground Snack
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-4 sm:mb-5 tracking-tight">
              Tastes Like a<br />
              <span className="text-red-200">Treat.</span>{' '}
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.35)' }}>
                Works Like Food.
              </span>
            </h1>

            {/* Indulgent descriptors */}
            <div className="flex gap-3 justify-center md:justify-start mb-5 sm:mb-6">
              {['Crunchy', 'Rich', 'Satisfying'].map(d => (
                <span key={d} className="text-red-200 font-black text-lg sm:text-2xl">{d}.</span>
              ))}
            </div>

            <p className="text-red-100/80 text-base sm:text-lg max-w-sm sm:max-w-md mx-auto md:mx-0 mb-8 sm:mb-10 leading-relaxed font-light">
              Snacking shouldn't be a compromise. We bridge the gap between indulgent taste and real nutrition — using clean Indian superfoods you can actually feel good about.
            </p>

            {/* Inline benefit pills */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8 sm:mb-10">
              {[
                { label: 'Zero Sugar Spike', icon: <TrendingDown size={11} strokeWidth={2.5} /> },
                { label: 'High Fiber', icon: <Activity size={11} strokeWidth={2.5} /> },
                { label: 'Millet-Powered', icon: <Wheat size={11} strokeWidth={2.5} /> },
                { label: '100% Natural', icon: <Sprout size={11} strokeWidth={2.5} /> },
              ].map(b => (
                <span key={b.label} className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  {b.icon}{b.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mb-10 sm:mb-12">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#54221b] font-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm"
              >
                Try a Box <ArrowRight size={15} />
              </Link>
              <Link
                to="/our-story"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 hover:border-white/50 transition-all text-sm"
              >
                Our Story
              </Link>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {['AS', 'PM', 'RD', 'KT'].map(i => (
                  <div key={i} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-300 to-red-500 border-2 border-[#54221b] flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-red-200/80 text-xs font-medium">10,000+ happy customers</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center mt-2 md:mt-0">
            <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-lg mx-auto">
              <div className="absolute inset-8 bg-red-400/20 rounded-full blur-3xl" />
              <img
                src="/main image 2.png"
                alt="Crave Better Chocolate Squares"
                className="relative w-full object-contain drop-shadow-2xl"
                onError={e => { e.target.src = '/bar1.png'; }}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 52" className="w-full block" preserveAspectRatio="none">
            <path d="M0,52 C480,0 960,0 1440,52 L1440,52 L0,52 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: '5g', label: 'Protein Per Square', color: 'text-[#54221b]' },
            { value: '6g', label: 'Fiber Per Square', color: 'text-[#2D6A4F]' },
            { value: '0', label: 'Refined Sugar', color: 'text-[#54221b]' },
            { value: '10k+', label: 'Happy Customers', color: 'text-[#2D6A4F]' },
          ].map(s => (
            <div key={s.label}>
              <div className={`text-3xl sm:text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE MIDDLE GROUND ── */}
      <section className="py-14 sm:py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(84,34,27,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(45,106,79,0.2) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">

          {/* The contrast */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 sm:mb-14">
            <div className="flex-1 max-w-xs bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7">
              <div className="text-3xl sm:text-4xl mb-3">🍫</div>
              <p className="text-white font-black text-base sm:text-lg mb-1">Chocolate</p>
              <p className="text-gray-400 text-sm">Tastes amazing.</p>
              <p className="text-red-400 text-sm font-semibold mt-1">Sugar crash. Every time.</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-8 sm:h-12 bg-white/20 sm:hidden" />
              <div className="bg-white text-gray-900 font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest">
                vs
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/20 sm:hidden" />
            </div>

            <div className="flex-1 max-w-xs bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7">
              <div className="text-3xl sm:text-4xl mb-3">🌾</div>
              <p className="text-white font-black text-base sm:text-lg mb-1">Health Bar</p>
              <p className="text-gray-400 text-sm">Good for you.</p>
              <p className="text-yellow-400 text-sm font-semibold mt-1">Made to Crave.</p>
            </div>
          </div>

          {/* The answer */}
          <div className="relative">
            <div className="inline-block bg-gradient-to-br from-[#54221b] to-[#2D6A4F] p-px rounded-3xl">
              <div className="bg-gray-950 rounded-3xl px-8 sm:px-14 py-8 sm:py-12">
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">The Answer</span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                  Welcome to the<br />
                  <span className="text-transparent bg-clip-text" style={{
                    backgroundImage: 'linear-gradient(135deg, #f87171 0%, #fca5a5 50%, #a7f3d0 100%)',
                  }}>
                    Middle Ground.
                  </span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                  A Ragi-based chocolate alternative that satisfies your sweet tooth <em>without the sugar crash</em>. The mission: make "better-for-you" snacking the easiest choice you make all day.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-xl text-sm"
                >
                  Find Your Flavour <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFIT BADGES ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-3">The Science of Snacking Better</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3">
              No brain fog.{' '}
              <span className="text-[#54221b]">No sugar guilt.</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              By using Ragi, Oats, and FOS, we've built a high-fiber snack that keeps your energy stable while tasting like an actual treat. Here's how.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefitBadges.map((b) => (
              <div
                key={b.label}
                className="group rounded-2xl border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white shadow-sm cursor-default"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: b.bg, color: b.color }}
                >
                  {b.icon}
                </div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug mb-1.5">{b.label}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-14 sm:py-20 bg-[#faf7f5]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div>
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 sm:mb-3">Pick Your Favourite</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900">
                3 Flavours.{' '}
                <span className="text-[#54221b]">Zero Guilt.</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#54221b] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-[#6b2b22] transition-all flex-shrink-0 shadow-sm"
            >
              Shop All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image area */}
                <div className="relative overflow-hidden bg-[#fdf5f0] rounded-3xl mx-3 mt-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-56 sm:h-60 object-contain group-hover:scale-105 transition-transform duration-500 py-3 px-2"
                  />
                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: p.badgeColor || '#54221b' }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-2 flex-wrap">
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
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <p className="font-black text-gray-900 text-sm sm:text-base mb-0.5 leading-snug">{p.name}</p>
                  <p className="text-[10px] sm:text-xs text-[#54221b] font-semibold italic mb-2">{p.tagline}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-3">{p.weight} · {p.protein} Protein · {p.calories}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-base sm:text-lg font-black text-[#54221b]">₹{p.price}</span>
                      <span className="text-[10px] text-gray-400 ml-1">/ square</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {getQty(p.id) === 0 ? (
                        <button
                          onClick={() => handleAdd(p)}
                          className="text-xs font-bold px-5 py-2 rounded-full bg-[#54221b] text-white hover:bg-[#6b2b22] transition-all shadow-sm"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#54221b] rounded-full px-1.5 py-1">
                          <button
                            onClick={() => handleDecrease(p)}
                            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                          >
                            <Minus size={11} className="text-white" />
                          </button>
                          <span className="w-5 text-center text-xs font-black text-white">{getQty(p.id)}</span>
                          <button
                            onClick={() => handleIncrease(p)}
                            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                          >
                            <Plus size={11} className="text-white" />
                          </button>
                        </div>
                      )}
                      <Link
                        to={`/products/${p.id}`}
                        className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section className="bg-gray-950 py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(84,34,27,0.3) 0%, transparent 65%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">

          {/* Row 1 — Taste */}
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-5">The Crave Better Promise</p>
          <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-12 mb-4 sm:mb-5 flex-wrap">
            {['Crunchy', 'Rich', 'Satisfying'].map((word, i) => (
              <span key={word} className="flex items-center gap-3 sm:gap-8 md:gap-12">
                <span className="text-white font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none">{word}</span>
                {i < 2 && <span className="text-[#54221b] text-4xl sm:text-5xl font-black select-none leading-none">·</span>}
              </span>
            ))}
          </div>

          <div className="w-12 h-px bg-white/10 mx-auto my-4 sm:my-6" />

          {/* Row 2 — Values */}
          <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-12 flex-wrap">
            {[
              { word: 'Clean', color: 'text-white' },
              { word: 'Guilt-Free', color: 'text-red-300' },
              { word: 'Millet-Powered', color: 'text-green-300' },
            ].map((item, i) => (
              <span key={item.word} className="flex items-center gap-3 sm:gap-8 md:gap-12">
                <span className={`font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-none ${item.color}`}>
                  {item.word}
                </span>
                {i < 2 && <span className="text-white/15 text-2xl sm:text-3xl font-black select-none leading-none">·</span>}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── YOUR ANYTIME FIX ── */}
      <section className="py-14 sm:py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Eat Any Time</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3">
              Your{' '}
              <span className="text-red-300">Anytime</span>{' '}
              Fix.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              There's always a good reason for a square. Here are three favourites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {occasions.map((o) => (
              <div
                key={o.time}
                className="relative rounded-3xl p-7 sm:p-8 flex flex-col overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                style={{ backgroundColor: o.bg }}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/15 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                  {o.time}
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-5 text-white group-hover:bg-white/20 transition-colors">
                  {o.icon}
                </div>
                <h3 className="font-black text-white text-lg sm:text-xl mb-2">{o.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${o.accent}`}>{o.tag}</span>
                <p className="text-white/70 text-sm leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg text-sm"
            >
              Shop All Flavours <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INGREDIENT SPOTLIGHT ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#54221b] mb-3">Nothing to hide</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3">
              4 Ingredients.{' '}
              <span className="text-[#2D6A4F]">All of them real.</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Read the label. We dare you.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Ragi', role: 'The base', color: '#54221b', bg: '#fdf0ed', desc: 'Calcium, iron & dietary fiber. Ancient Indian grain, modern snack.' },
              { name: 'Peanuts', role: 'The protein', color: '#2D6A4F', bg: '#edf7f2', desc: 'Real plant protein and healthy fats. No isolates, no fillers.' },
              { name: 'Oats', role: 'The good filler', color: '#1e5054', bg: '#edf5f5', desc: 'Slow-release energy. High in soluble fiber. No crash.' },
              { name: 'Jaggery + FOS', role: 'The sweetness', color: '#7b3f00', bg: '#fdf5ee', desc: 'Natural sweetener + prebiotic fiber. Sugar spike: contained.' },
            ].map(ing => (
              <div key={ing.name} className="rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: ing.bg }}>
                <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: ing.color }} />
                <p className="font-black text-gray-900 text-base sm:text-lg mb-0.5">{ing.name}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: ing.color }}>{ing.role}</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 sm:py-20 bg-[#54221b] text-white relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 25% 60%, rgba(45,106,79,0.2) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-300 mb-3">Real Reviews</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white">
              "I thought it would<br />
              <span className="text-red-200">taste like a health bar."</span>
            </h2>
            <p className="text-red-100/70 mt-4 text-sm sm:text-base">They were wrong. Here's what they said instead.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/10 border border-white/10 rounded-2xl p-5 sm:p-7 hover:bg-white/15 transition-colors"
              >
                <StarRating count={t.rating} />
                <p className="text-red-100/90 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4 mb-4 sm:mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-white/10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-300 to-red-600 flex items-center justify-center text-[10px] sm:text-xs font-black text-white flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs sm:text-sm">{t.name}</p>
                    <p className="text-red-300/80 text-[10px] sm:text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK CTA ── */}
      <section className="py-14 sm:py-20 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="bg-gradient-to-br from-[#1e5054] to-[#0f2e30] rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(ellipse at 85% 40%, rgba(255,255,255,0.06) 0%, transparent 50%)',
            }} />
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/5" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center p-8 sm:p-12 md:p-16">
              <div>
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal-300 mb-4">For Businesses</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-5 leading-tight">
                  Order in Bulk.<br />
                  <span className="text-teal-200">Save More.</span>
                </h2>
                <p className="text-teal-100/80 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-sm">
                  Perfect for offices, schools, events & gifting. Special pricing, custom packaging, and dedicated support.
                </p>
                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center gap-2 bg-white text-[#1e5054] font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-teal-50 transition-colors shadow-lg text-sm"
                >
                  Request Bulk Quote <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: '50+', label: 'Minimum Order' },
                  { value: '30%', label: 'Bulk Savings' },
                  { value: '24h', label: 'Response Time' },
                  { value: '∞', label: 'Custom Packs' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-[10px] sm:text-xs text-teal-300 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
