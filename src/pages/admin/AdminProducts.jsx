import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

import { API_BASE } from '../../config';
function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
    'Content-Type': 'application/json',
  };
}

const EMPTY_FORM = {
  name: '', pack: 'Pack of 6', tagline: '', category: 'Chocolate Square',
  description: '', price: '', original_price: '',
  image_url: '', badge: '', badge_color: '',
  rating: '', orders_count: '',
  protein: '', fiber: '', calories: '', transfat: '', carbs: '', fat: '', weight: '',
  ingredients: '',
  benefits: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, { headers: authHeader() });
      const json = await res.json();
      setProducts(json.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null); setErrMsg(''); setModal('create');
  };

  const openEdit = p => {
    setForm({
      name:           p.name || '',
      pack:           p.pack || 'Pack of 6',
      tagline:        p.tagline || '',
      category:       p.category || 'Chocolate Square',
      description:    p.description || '',
      price:          p.price || '',
      original_price: p.originalPrice || '',
      image_url:      p.image || '',
      badge:          p.badge || '',
      badge_color:    p.badgeColor || '',
      rating:         p.rating || '',
      orders_count:   p.orders || '',
      protein:        p.protein || '',
      fiber:          p.fiber || '',
      calories:       p.calories || '',
      transfat:       p.transfat || '',
      carbs:          p.carbs || '',
      fat:            p.fat || '',
      weight:         p.weight || '',
      ingredients:    p.ingredients || '',
      benefits:       (p.benefits || []).join('\n'),
    });
    setEditId(p.id); setErrMsg(''); setModal('edit');
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setErrMsg('');
    const payload = {
      data: {
        ...form,
        price:          Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : 0,
        rating:         form.rating ? Number(form.rating) : 0,
        orders_count:   form.orders_count ? Number(form.orders_count) : 0,
        benefits:       form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
      },
    };
    try {
      const url    = modal === 'edit' ? `${API_BASE}/admin/products/${editId}` : `${API_BASE}/admin/products`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const json   = await res.json();
      if (json.status === 'success') { setModal(null); load(); }
      else setErrMsg(JSON.stringify(json.data));
    } catch { setErrMsg('Network error.'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Deactivate this product?')) return;
    await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Products</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#54221b] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#6b2b22] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Pack</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">MRP</th>
                <th className="px-4 py-3">Protein</th>
                <th className="px-4 py-3">Fiber</th>
                <th className="px-4 py-3">Calories</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-14 h-14 object-contain bg-[#faf7f5] rounded-xl p-1" />
                      : <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                    }
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    {p.tagline && <p className="text-[10px] text-gray-400 italic mt-0.5">{p.tagline}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.pack || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#54221b]">₹{p.price}</span>
                    {p.originalPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through ml-1">₹{p.originalPrice}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.originalPrice > 0 ? `₹${p.originalPrice}` : '—'}</td>
                  <td className="px-4 py-3 font-semibold text-[#54221b]">{p.protein || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{p.fiber || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{p.calories || '—'}</td>
                  <td className="px-4 py-3">
                    {p.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.badgeColor || '#54221b' }}>
                        {p.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#54221b] transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900">{modal === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">

              {/* ── Basic Info ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basic Info</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Classic Square" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pack Size</label>
                  <input type="text" name="pack" value={form.pack} onChange={handleChange}
                    placeholder="Pack of 6" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline</label>
                <input type="text" name="tagline" value={form.tagline} onChange={handleChange}
                  placeholder="Crunchy. Clean. Completely Satisfying." className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Product description…" rows={2}
                  className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input type="text" name="image_url" value={form.image_url} onChange={handleChange}
                  placeholder="/classic-1.png" className={inputCls} />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="mt-2 h-24 object-contain bg-[#faf7f5] rounded-xl px-2" />
                )}
              </div>

              {/* ── Pricing ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Pricing</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="190" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">MRP / Original Price (₹)</label>
                  <input type="number" name="original_price" value={form.original_price} onChange={handleChange}
                    placeholder="210" className={inputCls} />
                  <p className="text-[10px] text-gray-400 mt-1">Shown with strikethrough as the old price</p>
                </div>
              </div>

              {/* ── Badge ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Badge</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Text</label>
                  <input type="text" name="badge" value={form.badge} onChange={handleChange}
                    placeholder="Best Seller" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" name="badge_color" value={form.badge_color || '#54221b'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
                    <input type="text" name="badge_color" value={form.badge_color} onChange={handleChange}
                      placeholder="#54221b" className={`flex-1 ${inputCls}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                    <option value="Chocolate Square">Chocolate Square</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
                  <input type="number" name="rating" value={form.rating} onChange={handleChange}
                    placeholder="4.8" step="0.1" min="0" max="5" className={inputCls} />
                </div>
              </div>

              {/* ── Nutritional Info ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Nutritional Info (per square)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'protein',  label: 'Protein',   placeholder: '5g' },
                  { name: 'fiber',    label: 'Fiber',     placeholder: '5.2g' },
                  { name: 'calories', label: 'Calories',  placeholder: '120 kcal' },
                  { name: 'transfat', label: 'Transfat',  placeholder: '0g' },
                  { name: 'carbs',    label: 'Carbs',     placeholder: '13g' },
                  { name: 'fat',      label: 'Fat',       placeholder: '3.2g' },
                  { name: 'weight',   label: 'Weight',    placeholder: '28g × 6' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder} className={inputCls} />
                  </div>
                ))}
              </div>

              {/* ── Ingredients ── */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ingredients</label>
                <textarea name="ingredients" value={form.ingredients} onChange={handleChange}
                  placeholder="Roasted Peanut (36%), Multigrain Muesli Mix (29%)…" rows={3}
                  className={`${inputCls} resize-none`} />
              </div>

              {/* ── Benefits ── */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Benefits <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea name="benefits" value={form.benefits} onChange={handleChange}
                  placeholder={"Minimal sugar spike\nSweetened with Jaggery\nNo artificial preservatives"} rows={4}
                  className={`${inputCls} resize-none`} />
              </div>

              {errMsg && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errMsg}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-full text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-[#54221b] text-white font-bold py-2.5 rounded-full text-sm hover:bg-[#6b2b22] disabled:opacity-60 flex items-center justify-center gap-2">
                  <Check size={15} />{saving ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
