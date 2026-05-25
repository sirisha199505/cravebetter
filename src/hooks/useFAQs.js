import { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const FALLBACK_FAQS = [
  {
    id: 1,
    question: 'What ingredients are used in Crave Better snacks?',
    answer: 'Our snacks are made with real, clean ingredients — Ragi (finger millet), Oats, Roasted Peanuts, Jaggery, and FOS (a natural prebiotic fiber). No artificial colours, flavours, or preservatives. Ever.',
  },
  {
    id: 2,
    question: 'Are these snacks suitable for kids?',
    answer: 'Absolutely! The Milk Choco Square is especially loved by kids. All variants are made with natural ingredients and sweetened with Jaggery — making them a much smarter snack choice than conventional chocolates.',
  },
  {
    id: 3,
    question: 'Do the products contain refined sugar?',
    answer: 'No refined sugar. We sweeten our snacks with Jaggery and FOS (Fructooligosaccharides), a plant-based prebiotic fiber that keeps the sweetness real and the sugar spike minimal.',
  },
  {
    id: 4,
    question: 'What is the shelf life of Crave Better snacks?',
    answer: 'Crave Better snacks have a shelf life of 6 months from the date of manufacture when stored in a cool, dry place away from direct sunlight. Best consumed before the best-before date printed on the pack.',
  },
  {
    id: 5,
    question: 'Are the snacks high in protein?',
    answer: 'Each square contains 5g of plant-based protein sourced from roasted peanuts — no protein isolates, no fillers. Pair with your daily meals for a satisfying, protein-rich snack.',
  },
  {
    id: 6,
    question: 'Is free delivery available?',
    answer: 'Yes! We offer free delivery on all orders above ₹499. For orders below ₹499, a flat delivery fee of ₹49 applies.',
  },
  {
    id: 7,
    question: 'Do prepaid orders get any discounts?',
    answer: 'Yes! When you pay online (UPI, Card, or Net Banking), you automatically get a 3% discount on your order — applied at checkout before you pay.',
  },
];

let cache = null;

export function useFAQs() {
  const [faqs, setFaqs] = useState(cache || FALLBACK_FAQS);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    fetch(`${API_BASE}/faqs`)
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          cache = json.data;
          setFaqs(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading };
}
