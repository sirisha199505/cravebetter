import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link to="/products" className="text-[#54221b] font-bold hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#54221b] transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Back to Products
      </button>

      {/* Main product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center p-6 min-h-72">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-96 object-contain drop-shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.badge && (
            <span
              className="self-start text-white text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: product.badgeColor || '#54221b' }}
            >
              {product.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-black text-[#54221b] mb-4">₹{product.price}</p>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Protein', value: product.protein },
              { label: 'Calories', value: product.calories },
              { label: 'Carbs', value: product.carbs },
              { label: 'Fat', value: product.fat },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-base font-black text-[#54221b]">{m.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Benefits */}
          <ul className="mb-6 space-y-2">
            {product.benefits.map(b => (
              <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                <Check size={16} className="text-[#1e5054] flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* Add to cart */}
          <div className="flex items-center gap-3 mt-auto">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-[#54221b] text-white hover:bg-[#6b2b22]'
              }`}
            >
              <ShoppingCart size={18} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12">
        <h2 className="font-bold text-gray-900 mb-2">Ingredients</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{product.ingredients}</p>
      </div>

      {/* Related */}
      <div>
        <h2 className="text-2xl font-black text-[#54221b] mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedProducts.map(p => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="font-bold text-sm text-gray-900">{p.name}</p>
                <p className="text-[#54221b] font-black text-sm mt-1">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
