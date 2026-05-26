import { useState, useEffect, useRef } from 'react';

export default function ProductImageSlider({ images = [], alt = '', imgClassName = '', isHovered = false }) {
  const [idx, setIdx] = useState(0);
  const [animated, setAnimated] = useState(true);
  const timer = useRef(null);
  const count = images.length;

  // Append clone of first image so the loop always moves left
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => {
    clearInterval(timer.current);
    if (isHovered || count <= 1) return;
    timer.current = setInterval(() => {
      setAnimated(true);
      setIdx(i => i + 1);
    }, 2000);
    return () => clearInterval(timer.current);
  }, [isHovered, count]);

  // When the clone (last slide) finishes, snap silently back to real index 0
  const onTransitionEnd = () => {
    if (idx >= count) {
      setAnimated(false);
      setIdx(0);
    }
  };

  if (!count) return null;

  const dotIdx = idx % count;

  return (
    <>
      <div
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(-${idx * 100}%)`,
          transition: animated ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {slides.map((src, i) => (
          <div
            key={i}
            className={`w-full h-full flex-shrink-0 flex items-center justify-center ${imgClassName}`}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain"
              style={{
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.5s ease',
              }}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, i) => (
            <span
              key={i}
              className="block rounded-full bg-white"
              style={{
                width: i === dotIdx ? 14 : 6,
                height: 5,
                opacity: i === dotIdx ? 1 : 0.55,
                transition: 'width 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
