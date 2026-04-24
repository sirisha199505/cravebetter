import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { API_BASE } from '../config';

const contentCls = [
  '[&_h2]:text-xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3',
  '[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-2',
  '[&_p]:text-gray-600 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
  '[&_li]:text-gray-600 [&_li]:text-sm [&_li]:mb-1.5 [&_li]:leading-relaxed',
  '[&_strong]:text-gray-800 [&_a]:text-[#54221b] [&_a]:underline',
  '[&_hr]:border-gray-100 [&_hr]:my-6',
].join(' ');

function DefaultContact() {
  return (
    <>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Contact Us</h1>
      <p className="text-sm text-gray-500 mb-10">We'd love to hear from you. Reach out and we'll get back to you shortly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#fdf0ed] flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-[#54221b]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm mb-1">Email Us</p>
            <a href="mailto:listen@cravebetter4u.com" className="text-xs text-[#54221b] hover:underline break-all">
              listen@cravebetter4u.com
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#edf7f2] flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-[#2D6A4F]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm mb-1">Call Us</p>
            <a href="tel:+918008804992" className="text-xs text-gray-600 block hover:text-[#2D6A4F]">+91 8008804992</a>
            <a href="tel:+918008804991" className="text-xs text-gray-600 block hover:text-[#2D6A4F]">+91 8008804991</a>
            <a href="tel:+918008804997" className="text-xs text-gray-600 block hover:text-[#2D6A4F]">+91 8008804997</a>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#edf5f5] flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-[#1e5054]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm mb-1">Working Hours</p>
            <p className="text-xs text-gray-500">Monday – Saturday</p>
            <p className="text-xs text-gray-500">10:00 AM – 6:00 PM IST</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#fdf5ee] flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-[#7b3f00]" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm mb-1">Location</p>
            <p className="text-xs text-gray-500">Hyderabad, Telangana</p>
            <p className="text-xs text-gray-500">India</p>
          </div>
        </div>
      </div>

      <div className="bg-[#fdf0ed] rounded-2xl p-6">
        <p className="font-bold text-[#54221b] text-sm mb-2">Response Time</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          We typically respond within <strong>24–48 business hours</strong>. For bulk order enquiries, please use the{' '}
          <a href="/bulk-orders" className="text-[#54221b] underline font-semibold">Bulk Orders</a> form for a faster response.
        </p>
      </div>

      <div className="mt-6 bg-[#edf7f2] rounded-2xl p-6">
        <p className="font-bold text-[#2D6A4F] text-sm mb-2">Order Issues</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          If you have a concern about a delivered order (damaged product, wrong item, missing items), email us at{' '}
          <a href="mailto:listen@cravebetter4u.com" className="text-[#54221b] underline">listen@cravebetter4u.com</a>{' '}
          with your order number and photographs within 48 hours of delivery.
        </p>
      </div>
    </>
  );
}

export default function ContactUs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/page-contents/contact-us`)
      .then(r => r.json())
      .then(json => { if (json.status === 'success') setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-xl w-40" />
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-40 bg-gray-100 rounded-2xl mt-6" />
          </div>
        ) : data?.content ? (
          <>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{data.title || 'Contact Us'}</h1>
            <p className="text-xs text-gray-400 mb-8 border-b border-gray-100 pb-6">
              Last updated: {data.updated_at ? new Date(data.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'April 2026'}
            </p>
            <div className={contentCls} dangerouslySetInnerHTML={{ __html: data.content }} />
          </>
        ) : (
          <DefaultContact />
        )}
      </div>
    </main>
  );
}
