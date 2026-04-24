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
<p>At <strong>Crave Better Foods</strong>, we take great pride in the quality of our products. Please read our Cancellation and Refund Policy carefully.</p>

<h2>1. Order Cancellation</h2>
<h3>Before Dispatch</h3>
<p>Orders can be cancelled within <strong>12 hours of placing the order</strong>, provided the order has not yet been dispatched. To request a cancellation, contact us immediately at <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a> or call +91 8008804992.</p>
<h3>After Dispatch</h3>
<p>Once an order has been dispatched, it cannot be cancelled. You may raise a return or refund request upon delivery as described below.</p>

<h2>2. Return Policy</h2>
<p>We accept returns only in the following circumstances:</p>
<ul>
  <li>The product received is <strong>damaged</strong> or <strong>defective</strong></li>
  <li>The product received is <strong>different from what was ordered</strong></li>
  <li>The product is <strong>past its expiry date</strong> at the time of delivery</li>
</ul>
<p><strong>Returns are not accepted for:</strong></p>
<ul>
  <li>Change of mind or taste preference</li>
  <li>Products that have been opened or partially consumed</li>
  <li>Products damaged due to improper storage by the customer</li>
</ul>

<h2>3. How to Raise a Return Request</h2>
<ol>
  <li>Contact us within <strong>48 hours of delivery</strong> at <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a></li>
  <li>Include your order number, description of the issue, and photos of the damaged/incorrect product</li>
  <li>Our team will review and respond within 2 business days</li>
  <li>If approved, we will arrange a pickup or provide return instructions</li>
</ol>

<h2>4. Refund Process</h2>
<p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved:</p>
<ul>
  <li><strong>Online payments:</strong> Refund credited to original payment method within <strong>5–7 business days</strong></li>
  <li><strong>Cash on Delivery orders:</strong> Refund via bank transfer or UPI within <strong>5–7 business days</strong></li>
</ul>
<p>Shipping charges are non-refundable unless the return is due to our error.</p>

<h2>5. Replacement</h2>
<p>In certain cases, we may offer a <strong>replacement</strong> of the same product at no additional cost instead of a refund. This will be agreed upon with you during the return process.</p>

<h2>6. Bulk Orders</h2>
<p>Cancellation and refund policies for bulk orders may differ. Please refer to the terms agreed at the time of your bulk order, or contact us for clarification.</p>

<h2>7. Contact Us</h2>
<ul>
  <li>Email: <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a></li>
  <li>Phone: +91 8008804992 / +91 8008804991 / +91 8008804997</li>
</ul>
`;

export default function CancellationRefundPolicy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/page-contents/cancellation-refund-policy`)
      .then(r => r.json())
      .then(json => { if (json.status === 'success') setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const title = data?.title || 'Cancellation & Refund Policy';
  const content = data?.content || DEFAULT_CONTENT;
  const updatedAt = data?.updated_at ? new Date(data.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-xl w-64" />
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
