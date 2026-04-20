import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import AdminPanel from "./pages/admin/AdminPanel";
import ProductDetail from "./pages/product/ProductDetail";
import Historico from "./pages/historico/Historico";
import Depoimentos from "./pages/depoimentos/Depoimentos";
import DepoimentoDetail from "./pages/depoimentos/DepoimentoDetail";
import Perfil from "./pages/perfil/Perfil";
import SetupSql from "./pages/setup/SetupSql";
import AuthCallback from "./components/auth/AuthCallback";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import CartDrawer from "./components/feature/CartDrawer";
import OrderModal from "./components/feature/OrderModal";
import BottomNav from "./components/layout/BottomNav";
import ScrollToHero from "./components/layout/ScrollToHero";

function Shell() {
  const loc = useLocation();

  // CRITICAL: process Emergent Auth session_id BEFORE any route render
  if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  const hideBottomNav = loc.pathname.startsWith("/ajustes") || loc.pathname.startsWith("/setup-sql");
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <ScrollToHero />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ajustes" element={<AdminPanel />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/depoimentos" element={<Depoimentos />} />
          <Route path="/depoimentos/:id" element={<DepoimentoDetail />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/setup-sql" element={<SetupSql />} />
        </Routes>
      </main>
      <CartDrawer />
      <OrderModal />
      {!hideBottomNav && <BottomNav />}
    </div>
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
