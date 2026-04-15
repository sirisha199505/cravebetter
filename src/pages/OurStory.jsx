import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function OurStory() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* Hero */}
      <section className="bg-[#54221b] text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.05) 0%, transparent 55%),
                            radial-gradient(ellipse at 10% 80%, rgba(45,106,79,0.18) 0%, transparent 50%)`,
        }} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-300 mb-4">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            The Story Behind<br />
            <span className="text-red-200">The Middle Ground</span>
          </h1>
          <p className="text-red-100/80 text-base sm:text-lg leading-relaxed italic max-w-2xl mx-auto">
            "Healthy isn't tasty and tasty isn't healthy." — We built Crave Better to change that.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full block" preserveAspectRatio="none">
            <path d="M0,40 C480,0 960,0 1440,40 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Story body */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">

          {/* Pull quote */}
          <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug mb-12 text-center">
            Food shouldn't make you <span className="text-[#54221b]">choose sides.</span>
          </p>

          <div className="space-y-7 text-gray-600 text-base sm:text-[17px] leading-[1.8]">
            <p>
              It started with a simple frustration — why did eating healthy feel like a compromise,
              and enjoying tasty food feel like guilt? We kept seeing the same pattern everywhere:
              either it was good for you but hard to enjoy, or it tasted great but came with trade-offs.
              We wanted something different.
            </p>

            <p>
              So we began building Crave Better — a brand shaped by that very tension. By focusing on
              quality ingredients and thoughtful choices, we created products that bring together what
              usually stays apart: <strong className="text-gray-900">taste, health, and affordability.</strong>
            </p>

            <p>
              Because food shouldn't make you choose sides.
            </p>
          </div>

          <blockquote className="border-l-4 border-[#54221b] pl-6 my-12 text-[#54221b] font-semibold text-lg sm:text-xl italic">
            "Healthy isn't tasty and tasty isn't healthy" — we built Crave Better to prove that wrong.
          </blockquote>
        </div>
      </section>

      {/* What makes it different */}
      <section className="py-14 sm:py-20 bg-[#faf7f5]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-3">
              What's inside
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Ingredients you can <span className="text-[#54221b]">read and trust</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Not a protein bar. Not an energy bar. A real, honest chocolate alternative — sweetened by nature, built on fiber.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {[
              {
                name: 'Ragi',
                color: 'bg-[#54221b]',
                text: 'Ancient grain rich in calcium, iron, and dietary fiber. Gives every square its wholesome crunch and slow-release energy.',
              },
              {
                name: 'Peanuts',
                color: 'bg-[#2D6A4F]',
                text: 'Real plant-based protein and healthy fats. Filling, satisfying, and completely natural.',
              },
              {
                name: 'Oats',
                color: 'bg-[#1e5054]',
                text: 'High in soluble fiber, oats slow digestion and help keep you full — no energy spikes, no crash.',
              },
              {
                name: 'Jaggery & FOS',
                color: 'bg-[#7b3f00]',
                text: 'Jaggery brings natural sweetness. FOS (fructooligosaccharides) is a prebiotic fiber that keeps blood sugar well in check — so you actually enjoy this without the guilt.',
              },
            ].map(ing => (
              <div key={ing.name} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-2 rounded-full flex-shrink-0 self-stretch ${ing.color} opacity-70`} />
                <div>
                  <p className="font-black text-gray-900 text-base mb-1.5">{ing.name}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{ing.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-[#1e5054] text-white text-center">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Ready to <span className="text-teal-200">Crave Better?</span>
          </h2>
          <p className="text-teal-100/80 text-sm sm:text-base mb-8 leading-relaxed">
            Three flavours. All natural. No compromise.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-[#1e5054] font-black px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors shadow-lg text-sm"
          >
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </main>
  );
}
