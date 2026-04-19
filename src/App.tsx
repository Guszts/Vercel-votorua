/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import AdminPanel from "./pages/admin/AdminPanel";
import ProductDetail from "./pages/product/ProductDetail";
import { AppProvider } from "./context/AppContext";
import CartDrawer from "./components/feature/CartDrawer";
import OrderModal from "./components/feature/OrderModal";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ajustes" element={<AdminPanel />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
        </Routes>
        <CartDrawer />
        <OrderModal />
      </BrowserRouter>
    </AppProvider>
  );
}
