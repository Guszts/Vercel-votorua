import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import AdminPanel from "./pages/admin/AdminPanel";
import ProductDetail from "./pages/product/ProductDetail";
import Historico from "./pages/historico/Historico";
import Depoimentos from "./pages/depoimentos/Depoimentos";
import DepoimentoDetail from "./pages/depoimentos/DepoimentoDetail";
import Perfil from "./pages/perfil/Perfil";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import CartDrawer from "./components/feature/CartDrawer";
import OrderModal from "./components/feature/OrderModal";
import BottomNav from "./components/layout/BottomNav";
import ScrollToHero from "./components/layout/ScrollToHero";

function Shell() {
  const loc = useLocation();
  // Hide bottom nav on certain routes (admin panel keeps its own layout)
  const hideBottomNav = loc.pathname.startsWith("/ajustes");
  return (
    <>
      <ScrollToHero />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ajustes" element={<AdminPanel />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/depoimentos" element={<Depoimentos />} />
        <Route path="/depoimentos/:id" element={<DepoimentoDetail />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <CartDrawer />
      <OrderModal />
      {!hideBottomNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
