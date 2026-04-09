import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQty(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative bg-[#faf7f5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-contain py-4 px-3"
        />
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow"
            style={{ backgroundColor: product.badgeColor || '#54221b' }}
          >
            {product.badge}
          </span>
        )}
        {/* Highlight pills */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-2">
          <span className="bg-[#54221b]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            Rich in Protein
          </span>
          <span className="bg-[#2D6A4F]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            Less Sugar
          </span>
          <span className="bg-[#1e5054]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            Less Fat
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-1">
          {product.weight} · {product.protein} Protein · {product.calories}
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-black text-[#54221b]">₹{product.price}</span>
            {/* Qty selector */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1 py-1">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="w-5 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-[#54221b] text-white hover:bg-[#6b2b22]'
              }`}
            >
              <ShoppingCart size={15} />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <Link
              to={`/products/${product.id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border border-[#1e5054] text-[#1e5054] text-sm font-bold hover:bg-[#1e5054] hover:text-white transition-colors"
              title="Know More"
            >
              <Info size={15} />
              <span className="hidden sm:inline">Know More</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-[#54221b] mb-3">Our Protein Bars</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Three expertly crafted flavours. All natural, all delicious, all built for sustained energy.
          Free delivery on orders above ₹500.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
