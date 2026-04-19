import React, { useState, useEffect } from "react";
import { Utensils, ShoppingBag, Menu, X, ShieldAlert } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  
  const { cartCount, setIsCartOpen, setIsAdmin, isAdmin } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminTrigger = () => {
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "bilft") {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPassword("");
      // Wait a moment then navigate
      setTimeout(() => navigate('/ajustes'), 300);
    } else {
      alert("Senha incorreta.");
      setPassword("");
    }
  };

  const navLinks = [
    { label: "Cardápio", href: "#cardapio" },
    { label: "Nossa Qualidade", href: "#beneficios" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white shadow-sm border-b border-red-100 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-left relative">
             {/* Admin trigger in Desktop context if clicked */}
            <button 
               onClick={handleAdminTrigger} 
               className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-stone-200 z-10"
               title="Acesso Restrito"
            >
              ! 
            </button>
            
            <Link to="/" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
              <Utensils className="w-5 h-5" />
            </Link>
            <Link to="/" className={cn("flex flex-col transition-colors", isScrolled ? "text-stone-900" : "text-white")}>
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Restaurante</span>
              <span className="text-xl font-black uppercase leading-none">Vitória</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {isAdmin && (
              <Link to="/ajustes" className="text-sm font-bold text-red-600 border border-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">
                Configurações
              </Link>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-red-500",
                  isScrolled ? "text-stone-600" : "text-white/90"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Output Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 transition-all duration-300 text-white px-5 py-2.5 rounded-full font-bold text-sm relative"
            >
              <ShoppingBag className="w-4 h-4" />
              Carrinho
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
             <button
              className="relative bg-stone-900 text-white p-2 rounded-full"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              className={cn(isScrolled ? "text-stone-900" : "text-white")}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Fullscreen Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-[60] bg-white transition-opacity duration-300 flex flex-col",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="p-6 flex justify-between items-center bg-stone-50 border-b border-stone-200">
             <button 
               onClick={handleAdminTrigger} 
               className="text-stone-400 hover:text-stone-900 p-2 font-black text-xl"
             >
               !
             </button>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 p-2 border border-stone-200 rounded-full bg-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 p-8 flex-1 overflow-y-auto">
            {isAdmin && (
               <Link
                 to="/ajustes"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="text-xl font-black text-red-600 uppercase border border-red-600 px-6 py-2 rounded-full"
               >
                 Configurações
               </Link>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-black text-stone-900 uppercase"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="mt-8 flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-bold text-xl w-full justify-center"
            >
              <ShoppingBag className="w-6 h-6" />
              Abrir Carrinho
            </button>
          </nav>
        </div>
      </header>

      {/* Admin Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative">
             <button 
               onClick={() => setShowAuthModal(false)}
               className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"
             >
               <X className="w-6 h-6" />
             </button>
             <div className="flex flex-col items-center text-center mb-6">
               <ShieldAlert className="w-12 h-12 text-red-600 mb-4" />
               <h3 className="text-2xl font-black text-stone-900">Acesso Restrito</h3>
               <p className="text-stone-500 font-medium text-sm mt-1">Insira a senha do administrador</p>
             </div>
             
             <form onSubmit={handleAuthSubmit}>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-red-600 font-bold tracking-widest text-center"
                 placeholder="Senha"
                 autoFocus
               />
               <button
                 type="submit"
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
               >
                 Entrar
               </button>
             </form>
           </div>
        </div>
      )}
    </>
  );
}
