import { Link } from 'react-router-dom';
import { Zap, Shield, Leaf, Award, ArrowRight, Star, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const benefits = [
  {
    icon: <Zap size={22} />,
    title: 'Rich in Protein',
    desc: 'Packed with plant-based protein from Ragi and Peanuts to fuel your body and keep you full longer.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Less Sugar',
    desc: 'Sweetened naturally with Jaggery — no refined sugar, no artificial sweeteners, no guilt.',
  },
  {
    icon: <Leaf size={22} />,
    title: 'Less Fat',
    desc: 'Made with wholesome Oats and Ragi, keeping fat content low so you can snack smarter.',
  },
  {
    icon: <Award size={22} />,
    title: '100% Natural',
    desc: 'No artificial colours, flavours, or preservatives. Every ingredient earns its place.',
  },
];

const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Powerlifter, Mumbai',
    text: 'The Classic Square is my go-to pre-workout snack. All natural, sweetened with jaggery — incredible taste and I feel great. I keep a box at the gym and one at home.',
    rating: 5,
    avatar: 'AS',
  },
  {
    name: 'Priya Menon',
    role: 'CrossFit Coach, Bangalore',
    text: "Finally a bar that doesn't taste like cardboard. My entire class is hooked on the Dark Choco Square — real ingredients, no junk!",
    rating: 5,
    avatar: 'PM',
  },
  {
    name: 'Rohan Desai',
    role: 'MMA Fighter, Pune',
    text: 'We bulk order Crave Better for our fight camp. The Milk Choco Square is everyone\'s favourite. Great pricing and super responsive team.',
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
      <section className="relative bg-[#54221b] text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 55%),
                            radial-gradient(ellipse at 10% 80%, rgba(45,106,79,0.22) 0%, transparent 50%)`,
        }} />

        {/* Transparent background watermark image */}
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
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-3 sm:px-4   rounded-full mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              India's Premium Protein Bar
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-5 sm:mb-6 tracking-tight">
              Crave Better.<br />
              <span className="text-red-200">Perform</span>{' '}
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.35)' }}>
                Better.
              </span>
            </h1>

            <p className="text-red-100/80 text-base sm:text-lg md:text-xl max-w-sm sm:max-w-md mx-auto md:mx-0 mb-8 sm:mb-10 leading-relaxed font-light">
              Premium protein bars built for champions — real ingredients, zero compromise, every macro dialled in.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mb-10 sm:mb-12">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#54221b] font-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm"
              >
                Shop Now <ArrowRight size={15} />
              </Link>
              <Link
                to="/bulk-orders"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 hover:border-white/50 transition-all text-sm"
              >
                Bulk Orders
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
                <p className="text-red-200/80 text-xs font-medium">10,000+ happy athletes</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center mt-2 md:mt-0">
            <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-lg mx-auto">
              <div className="absolute inset-8 bg-red-400/20 rounded-full blur-3xl" />
              {/* <div className="absolute -left-3 sm:-left-6 top-8 bg-white rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2 z-10">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-medium">Per Bar</div>
                  <div className="text-xs sm:text-sm font-black text-gray-900">20g Protein</div>
                </div>
              </div> */}
              {/* <div className="absolute -right-3 sm:-right-6 bottom-10 bg-white rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2 z-10">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-[#54221b] font-black text-sm flex-shrink-0">0</div>
                <div>
                  <div className="text-[9px] text-gray-400 font-medium">Artificial</div>
                  <div className="text-xs sm:text-sm font-black text-gray-900">Additives</div>
                </div>
              </div> */}
              <img
                src="/main image 2.png"
                alt="Crave Better Protein Bars"
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
            { value: '5g', label: 'Protein Per Bar', color: 'text-[#54221b]' },
            { value: '3', label: 'Unique Flavours', color: 'text-[#2D6A4F]' },
            { value: '100%', label: 'Natural Ingredients', color: 'text-[#54221b]' },
            { value: '10k+', label: 'Happy Athletes', color: 'text-[#2D6A4F]' },
          ].map(s => (
            <div key={s.label}>
              <div className={`text-3xl sm:text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-14 sm:py-20 bg-[#1e5054]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Why Choose Us</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
              Built Different.{' '}
              <span className="text-green-200">Crafted Better.</span>
            </h2>
            <p className="text-green-100/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              No shortcuts, no filler — just premium nutrition you can feel with every bite.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group bg-white rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#2D6A4F]/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white transition-all duration-300">
                  {b.icon}
                </div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base mb-1.5">{b.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div>
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 sm:mb-3">Our Range</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900">
                3 Flavours.{' '}
                <span className="text-[#54221b]">Endless Gains.</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-[#54221b] font-bold text-xs sm:text-sm hover:gap-3 transition-all group flex-shrink-0"
            >
              View all products
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-7">
            {products.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Rectangular rounded image */}
                <div className="relative overflow-hidden bg-[#faf7f5] rounded-3xl mx-3 mt-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-56 sm:h-64 object-contain group-hover:scale-105 transition-transform duration-500 py-3 px-2"
                  />
                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: p.badgeColor || '#54221b' }}
                    >
                      {p.badge}
                    </span>
                  )}
                  {/* Highlight pills */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-2">
                    <span className="bg-[#54221b]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Rich in Protein
                    </span>
                    <span className="bg-[#2D6A4F]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Less Sugar
                    </span>
                    <span className="bg-[#1e5054]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Less Fat
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <p className="font-black text-gray-900 text-sm sm:text-base mb-1 leading-snug">{p.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-2">{p.weight} · {p.protein} Protein · {p.calories}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-base sm:text-lg font-black text-[#54221b]">₹{p.price}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {getQty(p.id) === 0 ? (
                        <button
                          onClick={() => handleAdd(p)}
                          className="text-xs font-bold px-4 py-1.5 rounded-full bg-[#54221b] text-white hover:bg-[#6b2b22] transition-all"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#54221b] rounded-full px-1.5 py-1">
                          <button
                            onClick={() => handleDecrease(p)}
                            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                          >
                            <Minus size={11} className="text-white" />
                          </button>
                          <span className="w-4 text-center text-xs font-black text-white">{getQty(p.id)}</span>
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
                        className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-all"
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 sm:py-20 bg-[#2D6A4F] relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Simple Process</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white">
              Order in <span className="text-green-200">3 Easy Steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 relative">
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px bg-white/20" />
            {[
              { step: '01', title: 'Browse & Pick', desc: 'Explore our 3 premium flavours and select your favourites with full nutritional info.' },
              { step: '02', title: 'Add to Cart', desc: 'Choose your quantity, add to cart, and sail through our quick checkout process.' },
              { step: '03', title: 'Delivered Fresh', desc: 'Your bars are packed and delivered straight to your door, fast and fresh.' },
            ].map((s) => (
              <div key={s.step} className="relative text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-black group-hover:bg-white group-hover:text-[#2D6A4F] transition-all duration-300 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-2">{s.title}</h3>
                <p className="text-green-100/75 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-14">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-[#2D6A4F] font-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full hover:bg-green-50 transition-colors shadow-lg text-sm"
            >
              Start Shopping <ArrowRight size={15} />
            </Link>
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
              What Athletes <span className="text-red-200">Say</span>
            </h2>
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
                  Perfect for gyms, fight events, travel agencies & corporates. Special pricing, custom packaging, and dedicated support.
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

      {/* ── FINAL CTA ── */}
      {/* <section className="pt-6 pb-14 sm:pt-8 sm:pb-20 bg-white border-t border-gray-100 text-center">
        <div className="max-w-xl mx-auto px-5">
          <img src="/logo.png" alt="Crave Better Foods" className="h-10 sm:h-12 w-auto object-contain mx-auto mb-5 sm:mb-6 opacity-90" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Ready to <span className="text-[#54221b]">Crave Better?</span>
          </h2>
          <p className="text-gray-500 mb-7 sm:mb-8 text-sm sm:text-base leading-relaxed">
            Join 10,000+ athletes who've made the switch.<br />
            Free delivery on orders above ₹500.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#54221b] text-white font-black px-10 sm:px-12 py-3.5 sm:py-4 rounded-full hover:bg-[#6b2b22] transition-all shadow-xl hover:-translate-y-0.5 text-sm"
          >
            Shop All Flavours <ArrowRight size={15} />
          </Link>
        </div>
      </section> */}

    </main>
  );
}
