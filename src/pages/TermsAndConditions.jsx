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
<p>Welcome to <strong>Crave Better Foods</strong>. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.</p>

<h2>1. About Us</h2>
<p>Crave Better Foods is an Indian food brand offering Ragi-based chocolate snack squares made with 100% natural ingredients — no refined sugar, no artificial anything.</p>

<h2>2. Use of the Website</h2>
<p>You agree to use this website only for lawful purposes. You must not:</p>
<ul>
  <li>Use the site in any way that violates applicable local, national, or international laws</li>
  <li>Transmit any unsolicited or unauthorised advertising material</li>
  <li>Attempt to gain unauthorised access to any part of the website</li>
</ul>

<h2>3. Products</h2>
<p>All products are subject to availability. Product images are for illustrative purposes only. We make every effort to display accurate nutritional information, but this may vary slightly due to natural ingredient variations. Please refer to actual product packaging for the most accurate information.</p>

<h2>4. Pricing</h2>
<p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices without prior notice. The price applicable to your order is the price at the time of placing it.</p>

<h2>5. Orders & Payments</h2>
<p>By placing an order, you confirm that all information provided is accurate and complete. We reserve the right to refuse or cancel orders at our discretion, including in cases of pricing errors or suspected fraud. Payments must be completed at the time of placing the order.</p>

<h2>6. Intellectual Property</h2>
<p>All content on this website — including text, graphics, logos, images, and software — is the property of Crave Better Foods and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.</p>

<h2>7. Limitation of Liability</h2>
<p>Crave Better Foods shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the website or our products, to the fullest extent permitted by law.</p>

<h2>8. Governing Law</h2>
<p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.</p>

<h2>9. Changes to Terms</h2>
<p>We reserve the right to update these Terms and Conditions at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.</p>

<h2>10. Contact</h2>
<p>For any questions, please contact us at <a href="mailto:listen@cravebetter4u.com">listen@cravebetter4u.com</a>.</p>
`;

export default function TermsAndConditions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/page-contents/terms-and-conditions`)
      .then(r => r.json())
      .then(json => { if (json.status === 'success') setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const title = data?.title || 'Terms & Conditions';
  const content = data?.content || DEFAULT_CONTENT;
  const updatedAt = data?.updated_at ? new Date(data.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <main className="min-h-screen bg-white py-16 px-5">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-xl w-56" />
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
