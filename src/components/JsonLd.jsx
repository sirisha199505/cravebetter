import { useEffect } from 'react';

/**
 * Injects a <script type="application/ld+json"> into <head> for structured data.
 * Keyed by `id` so each page's schema is added/replaced cleanly and removed on unmount.
 */
export default function JsonLd({ id, data }) {
  const json = JSON.stringify(data);

  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let el = document.getElementById(scriptId);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = json;

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [id, json]);

  return null;
}
