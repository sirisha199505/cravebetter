import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useFAQs } from '../hooks/useFAQs';

function highlightText(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
      : part
  );
}

function FAQItem({ q, a, highlight }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#fdf5f0] transition-colors"
      >
        <span className="font-bold text-gray-900 text-sm sm:text-base pr-4 leading-snug">
          {highlightText(q, highlight)}
        </span>
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${open ? 'bg-[#54221b] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
          <ChevronDown size={15} />
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? (contentRef.current?.scrollHeight ?? 500) + 'px' : '0px' }}
      >
        <div className="px-5 pb-5 pt-1 bg-white border-t border-gray-50">
          <p className="text-sm text-gray-500 leading-relaxed">{highlightText(a, highlight)}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQs() {
  const { faqs } = useFAQs();
  const [query, setQuery] = useState('');
  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="bg-white overflow-x-hidden">

      {/* Header */}
      <section className="bg-gray-950 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(84,34,27,0.3) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(45,106,79,0.15) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Got Questions?</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Frequently Asked{' '}
            <span className="text-red-300">Questions</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about Crave Better snacks — ingredients, delivery, discounts and more.
          </p>
        </div>
      </section>

      {/* Search + FAQs */}
      <section className="py-14 sm:py-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#54221b]/30 focus:border-[#54221b] shadow-sm"
            />
            {query && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map(faq => (
                <FAQItem key={faq.id} q={faq.question} a={faq.answer} highlight={query} />
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-10">No FAQs match your search.</p>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">Still have questions?</p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 bg-[#54221b] text-white font-bold px-6 py-3 rounded-full hover:bg-[#6b2b22] transition-colors text-sm shadow-sm"
            >
              Contact Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
