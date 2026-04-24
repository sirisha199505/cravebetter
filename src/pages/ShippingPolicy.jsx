import { useEffect, useState } from 'react';
import { API_BASE } from '../config';

const contentCls = [
  '[&_h2]:text-xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3',
  '[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-2',
  '[&_p]:text-gray-600 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
  '[&_li]:text-gray-600 [&_li]:text-sm [&_li]:mb-1.5 [&_li]:leading-relaxed',
  '[&_strong]:text-gray-800 [&_a]:text-[#54221b] [&_a]:underline',
  '[&_hr]:border-gray-100 [&_hr]:my-6',
].join(' ');

const DEFAULT_CONTENT = `
<p>Thank you for shopping with <strong>Crave Better Foods</strong>. We are committed to delivering your favourite snacks fresh and on time.</p>

<h2>1. Shipping Coverage</h2>
<p>We currently ship across <strong>India</strong>. We are unable to process international orders at this time.</p>

<h2>2. Shipping Charges</h2>
<ul>
  <li><strong>Free delivery</strong> on all orders above <strong>₹599</strong></li>
  <li>For orders below ₹599, a flat shipping fee will be applied at checkout</li>
</ul>

<h2>3. Processing Time</h2>
<p>All orders are processed within <strong>1–2 business days</strong> of payment confirmation. Orders placed on weekends or public holidays will be processed on the next working day.</p>

<h2>4. Estimated Delivery Time</h2>
<ul>
  <li><strong>Metro cities</strong> (Hyderabad, Bengaluru, Mumbai, Delhi, Chennai, Kolkata): 2–4 business days</li>
  <li><strong>Tier 2 &amp; Tier 3 cities:</strong> 4–7 business days</li>
  <li><strong>Remote areas:</strong> 7–10 business days</li>
</ul>
<p>Delivery timelines are estimates and may vary due to courier delays, natural events, or public holidays.</p>

<h2>5. Order Tracking</h2>
<p>Once your order is dispatched, you will receive a confirmation email or SMS with tracking details so you can monitor your shipment.</p>

<h2>6. Packaging</h2>
<p>All orders are packed in food-grade, tamper-evident packaging to ensure your Crave Better squares reach you in perfect condition.</p>

<h2>7. Undelivered or Returned Shipments</h2>
<p>If a delivery attempt fails due to an incorrect address or unavailability of the recipient:</p>
<ul>
  <li>The courier will attempt delivery a maximum of <strong>2 times</strong></li>
  <li>If the shipment is returned to us, we will contact you to reattempt delivery (re-shipping charges may apply)</li>
  <li>Please ensure the shipping address and contact number provided are accurate</li>
</ul>

<h2>8. Damaged in Transit</h2>
<p>If your order arrives damaged, please take photographs and contact us within <strong>48 hours of delivery</strong> at <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a>. We will arrange a replacement or refund as per our Refund Policy.</p>

<h2>9. Bulk Orders</h2>
<p>Shipping timelines and charges for bulk orders may differ based on quantity and location. Our team will provide specific delivery details when confirming your bulk order.</p>

<h2>10. Contact Us</h2>
<ul>
  <li>Email: <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a></li>
  <li>Phone: +91 8008804992 / +91 8008804991 / +91 8008804997</li>
</ul>
`;

export default function ShippingPolicy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/page-contents/shipping-policy`)
      .then(r => r.json())
      .then(json => { if (json.status === 'success') setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const title = data?.title || 'Shipping Policy';
  const content = data?.content || DEFAULT_CONTENT;
  const updatedAt = data?.updated_at ? new Date(data.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-xl w-44" />
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-40 bg-gray-100 rounded-2xl mt-6" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{title}</h1>
            <p className="text-xs text-gray-400 mb-8 border-b border-gray-100 pb-6">
              {updatedAt ? `Last updated: ${updatedAt}` : 'Last updated: April 2026'}
            </p>
            <div className={contentCls} dangerouslySetInnerHTML={{ __html: content }} />
          </>
        )}
      </div>
    </main>
  );
}
