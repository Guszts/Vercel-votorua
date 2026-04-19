/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import AdminPanel from "./pages/admin/AdminPanel";
import ProductDetail from "./pages/product/ProductDetail";
import HistoryPage from "./pages/history/HistoryPage";
import TestimonialsPage from "./pages/testimonials/TestimonialsPage";
import TestimonialDetail from "./pages/testimonials/TestimonialDetail";
import ProfilePage from "./pages/profile/ProfilePage";
import { AppProvider } from "./context/AppContext";
import CartDrawer from "./components/feature/CartDrawer";
import OrderModal from "./components/feature/OrderModal";
import BottomNav from "./components/feature/BottomNav";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ajustes" element={<AdminPanel />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/depoimentos" element={<TestimonialsPage />} />
          <Route path="/depoimentos/:id" element={<TestimonialDetail />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Routes>
        <CartDrawer />
        <OrderModal />
        <BottomNav />
      </BrowserRouter>
    </AppProvider>
  );
}
