import { useEffect, useState } from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';

const API_BASE = '/api';
function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('cb_token')}` };
}

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};
const STATUSES = ['new', 'contacted', 'converted', 'declined'];

export default function AdminBulkOrders() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/bulk-orders`, { headers: authHeader() });
      const json = await res.json();
      setRequests(json.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}/admin/bulk-orders/${id}`, {
      method: 'PUT',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { status } }),
    });
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Bulk Order Requests</h1>

      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : requests.length === 0 ? (
        <p className="text-gray-400 text-sm">No bulk order requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === r.id ? 'rotate-180' : ''}`} />
                  <div>
                    <p className="font-bold text-gray-900">{r.business_name}</p>
                    <p className="text-xs text-gray-400">{r.contact_name} · Qty: {r.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-7 sm:ml-0">
                  <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                  <select
                    value={r.status || 'new'}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(r.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[r.status] || STATUS_COLORS.new}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {expanded === r.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">Contact Details</p>
                      {r.contact_phone && (
                        <a href={`tel:${r.contact_phone}`} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#54221b] mb-1">
                          <Phone size={13} />{r.contact_phone}
                        </a>
                      )}
                      {r.contact_email && (
                        <a href={`mailto:${r.contact_email}`} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#54221b]">
                          <Mail size={13} />{r.contact_email}
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">Quantity Required</p>
                      <p className="text-sm font-bold text-gray-900">{r.quantity} bars</p>
                    </div>
                  </div>
                  {r.message && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">Message</p>
                      <p className="text-sm text-gray-700 bg-white rounded-xl p-3 border border-gray-100">{r.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
