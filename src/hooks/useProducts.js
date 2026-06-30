import { useState, useEffect } from 'react';
import { API_BASE } from '../config';
import { products as fallbackProducts } from '../data/products';

// Images are stored locally in /public — always use these regardless of what the API returns.
const localImagesByName = Object.fromEntries(
  fallbackProducts.map(p => [p.name, p.images])
);

export function useProducts() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map(p => {
            const localImages = localImagesByName[p.name] || [p.image || ''];
            return {
              id:            p.id,
              name:          p.name,
              pack:          p.pack || '',
              tagline:       p.tagline || '',
              price:         Number(p.price),
              originalPrice: Number(p.originalPrice) || 0,
              image:         localImages[0] || p.image || '',
              images:        localImages,
              badge:         p.badge || '',
              badgeColor:    p.badgeColor || '#54221b',
              protein:       p.protein || '',
              fiber:         p.fiber || '',
              calories:      p.calories || '',
              transfat:      p.transfat || '',
              carbs:         p.carbs || '',
              fat:           p.fat || '',
              weight:        p.weight || '',
              description:   p.description || '',
              ingredients:   p.ingredients || '',
              benefits:      Array.isArray(p.benefits) ? p.benefits : [],
            };
          });
          setProducts(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
