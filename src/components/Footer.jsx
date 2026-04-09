import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#54221b] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="Crave Better Foods" className="h-12 w-auto object-contain" />
            <p className="text-sm text-red-100 leading-relaxed">
              Fuel your ambition with protein bars crafted for champions. No compromise. Better taste. Better you.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-red-200">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/bulk-orders', label: 'Bulk Orders' },
                { to: '/cart', label: 'Cart' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-red-100 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-red-200">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-red-100">
                <Mail size={15} />
                <a href="mailto:hello@cravebetterfoods.com" className="hover:text-white transition-colors">
                  hello@cravebetterfoods.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <Phone size={15} />
                <a href="tel:+919999999999" className="hover:text-white transition-colors">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                <a href="#" className="hover:text-white transition-colors">
                  @cravebetterfoods
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-900 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-red-200">&copy; {new Date().getFullYear()} Crave Better Foods. All rights reserved.</p>
          <a
            href="https://www.srinishtha.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-300 hover:text-white transition-colors"
          >
             Powered by Srinishtha Technologies LLP
          </a>
        </div>
      </div>
    </footer>
  );
}
