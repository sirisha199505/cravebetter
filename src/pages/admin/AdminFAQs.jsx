import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, GripVertical } from 'lucide-react';
import { API_BASE } from '../../config';

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
    'Content-Type': 'application/json',
  };
}

const EMPTY_FORM = { question: '', answer: '', position: '' };

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/admin/faqs`, { headers: authHeader() });
      const json = await res.json();
      setFaqs(json.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, position: faqs.length });
    setEditId(null); setErrMsg(''); setModal('create');
  };

  const openEdit = (f) => {
    setForm({ question: f.question, answer: f.answer, position: f.position ?? '' });
    setEditId(f.id); setErrMsg(''); setModal('edit');
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setErrMsg('Question and Answer are required.');
      return;
    }
    setSaving(true); setErrMsg('');
    const payload = {
      data: {
        question: form.question.trim(),
        answer:   form.answer.trim(),
        position: form.position !== '' ? Number(form.position) : faqs.length,
        active:   true,
      },
    };
    try {
      const url    = modal === 'edit' ? `${API_BASE}/admin/faqs/${editId}` : `${API_BASE}/admin/faqs`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const json   = await res.json();
      if (json.status === 'success') { setModal(null); load(); }
      else setErrMsg(JSON.stringify(json.data));
    } catch { setErrMsg('Network error.'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`${API_BASE}/admin/faqs/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b]';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">FAQ's</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage questions shown on the FAQ's page and homepage</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#54221b] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#6b2b22] transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">No FAQs added yet.</p>
          <button onClick={openCreate} className="text-[#54221b] text-sm font-bold hover:underline">
            Add your first FAQ →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4"
            >
              <div className="text-gray-300 mt-1 flex-shrink-0">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    #{f.position ?? i}
                  </span>
                  {f.active === false && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm leading-snug">{f.question}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEdit(f)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#54221b] transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900">{modal === 'edit' ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Question *</label>
                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="What ingredients are used in Crave Better snacks?"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Answer *</label>
                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Our snacks are made with real, clean ingredients…"
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Display Order <span className="text-gray-400 font-normal">(lower = shown first)</span>
                </label>
                <input
                  type="number"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={inputCls}
                />
              </div>

              {errMsg && (
                <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{errMsg}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-full text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#54221b] text-white font-bold py-2.5 rounded-full text-sm hover:bg-[#6b2b22] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Check size={15} />
                  {saving ? 'Saving…' : 'Save FAQ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
