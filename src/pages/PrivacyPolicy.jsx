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
<p>At <strong>Crave Better Foods</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or place an order with us.</p>

<h2>1. Information We Collect</h2>
<h3>Personal Information</h3>
<p>When you place an order or register on our site, we may collect:</p>
<ul>
  <li>Full name</li>
  <li>Email address</li>
  <li>Phone number</li>
  <li>Delivery address (city, state, PIN code)</li>
  <li>Order and payment details</li>
</ul>
<h3>Automatically Collected Information</h3>
<p>When you visit our website, we may automatically collect certain information including your IP address, browser type, pages visited, and referring URLs to help us improve your experience.</p>

<h2>2. How We Use Your Information</h2>
<ul>
  <li>Process and fulfil your orders</li>
  <li>Send order confirmations and shipping updates</li>
  <li>Respond to customer service queries</li>
  <li>Send promotional emails (only if you have opted in)</li>
  <li>Improve our website, products, and services</li>
  <li>Comply with legal obligations</li>
</ul>

<h2>3. Sharing of Information</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
<ul>
  <li><strong>Delivery partners</strong> — to fulfil your orders (name, address, phone number only)</li>
  <li><strong>Payment processors</strong> — to process transactions securely</li>
  <li><strong>Legal authorities</strong> — if required by law or to protect our rights</li>
</ul>

<h2>4. Cookies</h2>
<p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings. Note that disabling cookies may affect certain functionality of the website.</p>

<h2>5. Data Security</h2>
<p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. However, no method of transmission over the internet is 100% secure.</p>

<h2>6. Your Rights</h2>
<p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a>.</p>

<h2>7. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

<h2>8. Contact Us</h2>
<ul>
  <li>Email: <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a></li>
  <li>Phone: +91 8008804992 / +91 8008804991 / +91 8008804997</li>
</ul>
`;

export default function PrivacyPolicy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/page-contents/privacy-policy`)
      .then(r => r.json())
      .then(json => { if (json.status === 'success') setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const title = data?.title || 'Privacy Policy';
  const content = data?.content || DEFAULT_CONTENT;
  const updatedAt = data?.updated_at ? new Date(data.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-xl w-48" />
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
