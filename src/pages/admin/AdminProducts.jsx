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
  image_url: '', badge: '', badge_color: '', rating: '', orders_count: '',
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

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setErrMsg(''); setModal('create'); };
  const openEdit = p => {
    setForm({ name: p.name, category: p.category || 'Protein Bar', description: p.desc || '', price: p.price, image_url: p.image || '', badge: p.badge || '', badge_color: p.badgeColor || '', rating: p.rating || '', orders_count: p.orders || '' });
    setEditId(p.id); setErrMsg(''); setModal('edit');
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setErrMsg('');
    const payload = { data: { ...form, price: Number(form.price), rating: form.rating ? Number(form.rating) : 0, orders_count: form.orders_count ? Number(form.orders_count) : 0 } };
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
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                      : <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 font-bold text-[#54221b]">₹{p.price}</td>
                  <td className="px-4 py-3">
                    {p.badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.badgeColor || '#54221b' }}>{p.badge}</span>}
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900">{modal === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'name', label: 'Name *', placeholder: 'Chocolate Peanut Butter' },
                { name: 'description', label: 'Description', placeholder: 'Product description…', type: 'textarea' },
                { name: 'price', label: 'Price (₹) *', placeholder: '150', type: 'number' },
                { name: 'image_url', label: 'Image URL', placeholder: '/bar1.png' },
                { name: 'badge', label: 'Badge', placeholder: 'Best Seller' },
                { name: 'badge_color', label: 'Badge Color', placeholder: '#54221b' },
                { name: 'rating', label: 'Rating (0-5)', placeholder: '4.5', type: 'number' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] resize-none" />
                  ) : (
                    <input type={f.type || 'text'} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]" />
                  )}
                </div>
              ))}
              {errMsg && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errMsg}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-full text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#54221b] text-white font-bold py-2.5 rounded-full text-sm hover:bg-[#6b2b22] disabled:opacity-60 flex items-center justify-center gap-2">
                  <Check size={15} />{saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
