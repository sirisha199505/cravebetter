import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { API_BASE } from '../../config';
function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('cb_token')}`, 'Content-Type': 'application/json' };
}

const STATUSES = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, page_size: 10 });
    if (filterStatus) params.append('status', filterStatus);
    try {
      const res = await fetch(`${API_BASE}/admin/orders?${params}`, { headers: authHeader() });
      const json = await res.json();
      setOrders(json.data || []);
      setTotalPages(json.total_pages || 1);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ data: { status } }),
    });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#54221b]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === o.id ? 'rotate-180' : ''}`} />
                  <div>
                    <p className="font-bold text-gray-900">#{o.id} — {o.customer_name}</p>
                    <p className="text-xs text-gray-400">{o.customer_phone} · {new Date(o.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-7 sm:ml-0">
                  <span className="font-black text-[#54221b] text-sm">₹{o.grand_total}</span>
                  <select
                    value={o.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>

              {expanded === o.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-700">
                        {o.address?.flat}, {o.address?.area}<br />
                        {o.address?.city} — {o.address?.pin}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-1">Payment</p>
                      <p className="text-sm text-gray-700 capitalize">{o.payment_method?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">Items</p>
                  <div className="space-y-1.5">
                    {(o.items || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.name} × {item.qty}</span>
                        <span className="text-gray-900 font-semibold">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-sm">
                    <span>Grand Total</span><span className="text-[#54221b]">₹{o.grand_total}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${p === page ? 'bg-[#54221b] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#54221b]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
