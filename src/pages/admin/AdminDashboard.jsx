import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const API_BASE = '/api';

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('cb_token')}` };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, bulkOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE}/products`, { headers: authHeader() }),
          fetch(`${API_BASE}/admin/orders?page_size=5`, { headers: authHeader() }),
        ]);
        const products = await prodRes.json();
        const orders = await ordersRes.json();

        const orderList = orders.data || [];
        const revenue = orderList.reduce((s, o) => s + (o.grand_total || 0), 0);

        setStats({
          products: products.data?.length || 0,
          orders: orders.total_count || orderList.length,
          revenue,
          bulkOrders: 0,
        });
        setRecentOrders(orderList.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: <Package size={22} className="text-[#54221b]" />, bg: 'bg-red-50' },
    { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={22} className="text-[#1e5054]" />, bg: 'bg-teal-50' },
    { label: 'Revenue', value: `₹${stats.revenue}`, icon: <TrendingUp size={22} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Bulk Requests', value: stats.bulkOrders, icon: <Users size={22} className="text-purple-600" />, bg: 'bg-purple-50' },
  ];

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              {c.icon}
            </div>
            <div className="text-2xl font-black text-gray-900">{loading ? '—' : c.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-gray-500">#{o.id}</td>
                    <td className="py-3 pr-4 font-medium">{o.customer_name}</td>
                    <td className="py-3 pr-4 font-bold text-[#54221b]">₹{o.grand_total}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
