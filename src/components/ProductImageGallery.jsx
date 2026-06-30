import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageGallery({ images = [], alt = '', badgeColor = '#54221b' }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;

  const prev = () => setIdx(i => (i - 1 + count) % count);
  const next = () => setIdx(i => (i + 1) % count);

  if (!count) return null;

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">

      {/* ── Desktop: vertical thumbnail strip ── */}
      <div className="hidden md:flex flex-col gap-2.5 flex-shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="relative flex-shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center"
            style={{
              width: 76,
              height: 76,
              border: `2px solid ${i === idx ? badgeColor : '#e5e7eb'}`,
              boxShadow: i === idx ? `0 0 0 3px ${badgeColor}22` : 'none',
              opacity: i === idx ? 1 : 0.55,
              transform: i === idx ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-contain p-1.5"
            />
            {i === idx && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 2px ${badgeColor}` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Main viewer ── */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">

        {/* Main image box */}
        <div
          className="relative bg-[#faf7f5] rounded-2xl overflow-hidden group"
          style={{ aspectRatio: '1 / 1' }}
        >
          {/* Soft glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 blur-3xl opacity-25 rounded-full pointer-events-none"
            style={{ backgroundColor: badgeColor }}
          />

          {/* Slide track */}
          <div
            className="absolute inset-0 flex"
            style={{
              transform: `translateX(-${idx * 100}%)`,
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="w-full h-full flex-shrink-0 flex items-center justify-center p-7 sm:p-10"
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-contain drop-shadow-xl"
                  style={{ transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>

          {/* Left arrow */}
          {count > 1 && (
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
          )}

          {/* Right arrow */}
          {count > 1 && (
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          )}

          {/* Dot strip + counter */}
          {count > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === idx ? 20 : 6,
                      height: 5,
                      backgroundColor: i === idx ? badgeColor : '#d1d5db',
                    }}
                  />
                ))}
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  letterSpacing: '0.04em',
                }}
              >
                {idx + 1} / {count}
              </span>
            </div>
          )}
        </div>

        {/* ── Mobile: horizontal thumbnail strip ── */}
        {count > 1 && (
          <div className="md:hidden flex gap-2 overflow-x-auto pb-0.5">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white flex items-center justify-center"
                style={{
                  border: `2px solid ${i === idx ? badgeColor : '#e5e7eb'}`,
                  opacity: i === idx ? 1 : 0.55,
                  transform: i === idx ? 'scale(1.07)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
