import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { UserAuthProvider } from './context/UserAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePopup from './components/WelcomePopup';
import AuthPopup from './components/AuthPopup';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BulkOrders from './pages/BulkOrders';
import Cart from './pages/Cart';
import OurStory from './pages/OurStory';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBulkOrders from './pages/admin/AdminBulkOrders';
import AdminPageContents from './pages/admin/AdminPageContents';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <WelcomePopup />
      <AuthPopup />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/our-story" element={<PublicLayout><OurStory /></PublicLayout>} />
            <Route path="/bulk-orders" element={<PublicLayout><BulkOrders /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/terms-and-conditions" element={<PublicLayout><TermsAndConditions /></PublicLayout>} />
            <Route path="/cancellation-refund-policy" element={<PublicLayout><CancellationRefundPolicy /></PublicLayout>} />
            <Route path="/shipping-policy" element={<PublicLayout><ShippingPolicy /></PublicLayout>} />
            <Route path="/contact-us" element={<PublicLayout><ContactUs /></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="bulk-orders" element={<AdminBulkOrders />} />
              <Route path="page-contents" element={<AdminPageContents />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </CartProvider>
  );
}
