import { useState, useEffect } from "react";
import { Utensils, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Marmitas", href: "#marmitas" },
    { label: "Marmita Fitness", href: "#fitness" },
    { label: "Carnes em Kilo", href: "#carnes" },
    { label: "Bebidas", href: "#bebidas" },
    { label: "Sobremesas", href: "#sobremesas" },
    { label: "Pastel", href: "#pastel" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-red-100 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
            <Utensils className="w-5 h-5" />
          </div>
          <div className={cn("flex flex-col transition-colors", isScrolled ? "text-stone-900" : "text-white")}>
            <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Restaurante</span>
            <span className="text-xl font-black uppercase leading-none">Vitória</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
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
        <div className="hidden lg:block">
          <a
            href="https://pedir.delivery/app/restaurantevitoria/menu"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-6 py-2.5 rounded-full font-bold text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Pedir Agora
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("lg:hidden", isScrolled ? "text-stone-900" : "text-white")}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-white transition-transform duration-500",
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="p-6 flex justify-end">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 p-2">
            <X className="w-8 h-8" />
          </button>
        </div>
        <nav className="flex flex-col items-center gap-6 p-8">
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
          <a
            href="https://pedir.delivery/app/restaurantevitoria/menu"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="mt-8 flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-xl w-full justify-center"
          >
            <ShoppingBag className="w-6 h-6" />
            Pedir Agora
          </a>
        </nav>
      </div>
    </header>
  );
}
