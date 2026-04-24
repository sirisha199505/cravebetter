import { useEffect, useState } from 'react';
import { FileText, Check, Loader2 } from 'lucide-react';
import { API_BASE } from '../../config';

function authHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
    'Content-Type': 'application/json',
  };
}

const PAGES = [
  { slug: 'privacy-policy',            label: 'Privacy Policy' },
  { slug: 'terms-and-conditions',      label: 'Terms & Conditions' },
  { slug: 'cancellation-refund-policy', label: 'Cancellation & Refund Policy' },
  { slug: 'shipping-policy',           label: 'Shipping Policy' },
  { slug: 'contact-us',               label: 'Contact Us' },
];

export default function AdminPageContents() {
  const [selected, setSelected] = useState(PAGES[0]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  const load = async (page) => {
    setLoading(true);
    setErr('');
    setSaved(false);
    try {
      const res = await fetch(`${API_BASE}/page-contents/${page.slug}`, { headers: authHeader() });
      const json = await res.json();
      if (json.status === 'success') {
        setForm({ title: json.data.title || page.label, content: json.data.content || '' });
      }
    } catch {
      setErr('Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(selected); }, [selected]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/admin/page-contents/${selected.slug}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ data: form }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErr(typeof json.data === 'string' ? json.data : 'Failed to save.');
      }
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Page Contents</h1>
      <p className="text-sm text-gray-400 mb-6">Edit the content for legal and policy pages shown on the website.</p>

      <div className="flex gap-6">

        {/* Left — page list */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {PAGES.map(page => (
              <button
                key={page.slug}
                onClick={() => setSelected(page)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm transition-colors border-b border-gray-50 last:border-0 ${
                  selected.slug === page.slug
                    ? 'bg-[#54221b]/5 text-[#54221b] font-bold'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                <FileText size={15} className={selected.slug === page.slug ? 'text-[#54221b]' : 'text-gray-400'} />
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right — editor */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{selected.label}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Route: /{selected.slug}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 bg-[#54221b] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#6b2b22] transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading…
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Page Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder={selected.label}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Content <span className="text-gray-400 font-normal">(HTML supported)</span>
                  </label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={20}
                    placeholder={`Paste the ${selected.label} content here.\nYou can use plain text or HTML (e.g. <h2>, <p>, <ul>, <li>).`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#54221b] focus:ring-1 focus:ring-[#54221b] resize-y"
                  />
                </div>

                {err && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2.5">{err}</p>}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Preview hint</p>
                  <p className="text-xs text-gray-400">
                    Content is rendered as HTML on the public page. Use standard HTML tags like{' '}
                    <code className="bg-white px-1 py-0.5 rounded text-gray-600">&lt;h2&gt;</code>,{' '}
                    <code className="bg-white px-1 py-0.5 rounded text-gray-600">&lt;p&gt;</code>,{' '}
                    <code className="bg-white px-1 py-0.5 rounded text-gray-600">&lt;ul&gt;&lt;li&gt;</code> for formatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
