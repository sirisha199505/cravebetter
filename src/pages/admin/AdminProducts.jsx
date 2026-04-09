import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const API_BASE = '/api';
function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
    'Content-Type': 'application/json',
  };
}

const EMPTY_FORM = {
  name: '', category: 'Protein Bar', description: '', price: '',
  image_url: '', badge: '', badge_color: '',
  rating: '', orders_count: '',
  protein: '', calories: '', carbs: '', fat: '', weight: '',
  ingredients: '',
  benefits: '', // newline-separated in form, sent as array
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
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
      name: p.name,
      category: p.category || 'Protein Bar',
      description: p.description || '',
      price: p.price,
      image_url: p.image || '',
      badge: p.badge || '',
      badge_color: p.badgeColor || '',
      rating: p.rating || '',
      orders_count: p.orders || '',
      protein: p.protein || '',
      calories: p.calories || '',
      carbs: p.carbs || '',
      fat: p.fat || '',
      weight: p.weight || '',
      ingredients: p.ingredients || '',
      benefits: (p.benefits || []).join('\n'),
    });
    setEditId(p.id); setErrMsg(''); setModal('edit');
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setErrMsg('');
    const payload = {
      data: {
        ...form,
        price: Number(form.price),
        rating: form.rating ? Number(form.rating) : 0,
        orders_count: form.orders_count ? Number(form.orders_count) : 0,
        benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
      },
    };
    try {
      const url = modal === 'edit' ? `${API_BASE}/admin/products/${editId}` : `${API_BASE}/admin/products`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.status === 'success') { setModal(null); load(); }
      else setErrMsg(JSON.stringify(json.data));
    } catch { setErrMsg('Network error.'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Deactivate this product?')) return;
    await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Products</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#54221b] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#6b2b22] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Protein</th>
                <th className="px-4 py-3">Calories</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Rating</th>
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
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.weight || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-[#54221b]">{p.protein || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{p.calories || '—'}</td>
                  <td className="px-4 py-3 font-bold text-[#54221b]">₹{p.price}</td>
                  <td className="px-4 py-3">
                    {p.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.badgeColor || '#54221b' }}>
                        {p.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.rating ?? '—'}</td>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900">{modal === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basic Info</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Classic Square"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="150"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Product description…" rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input type="text" name="image_url" value={form.image_url} onChange={handleChange}
                  placeholder="/classic%20square.png"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="mt-2 h-24 object-contain bg-[#faf7f5] rounded-xl px-2" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
                  <input type="text" name="badge" value={form.badge} onChange={handleChange}
                    placeholder="Best Seller"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Badge Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" name="badge_color" value={form.badge_color || '#54221b'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
                    <input type="text" name="badge_color" value={form.badge_color} onChange={handleChange}
                      placeholder="#54221b"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
                  <input type="number" name="rating" value={form.rating} onChange={handleChange}
                    placeholder="4.8" step="0.1" min="0" max="5"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Orders Count</label>
                  <input type="number" name="orders_count" value={form.orders_count} onChange={handleChange}
                    placeholder="1200"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                </div>
              </div>

              {/* Nutrition */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Nutritional Info</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'weight',   label: 'Weight',   placeholder: '28g' },
                  { name: 'protein',  label: 'Protein',  placeholder: '5g' },
                  { name: 'calories', label: 'Calories', placeholder: '120 kcal' },
                  { name: 'carbs',    label: 'Carbs',    placeholder: '13g' },
                  { name: 'fat',      label: 'Fat',      placeholder: '3.2g' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ingredients</label>
                <textarea name="ingredients" value={form.ingredients} onChange={handleChange}
                  placeholder="Roasted Peanut (36%), Multigrain Muesli Mix (29%)…" rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] resize-none" />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Benefits <span className="text-gray-400 font-normal">(one per line)</span></label>
                <textarea name="benefits" value={form.benefits} onChange={handleChange}
                  placeholder={"100% Natural ingredients\nSweetened with Jaggery\nNo artificial preservatives"} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] resize-none" />
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
