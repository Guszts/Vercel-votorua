import { Home, History, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Inicio" },
  { path: "/historico", icon: History, label: "Historico" },
  { path: "/depoimentos", icon: MessageSquare, label: "Depoimentos" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();

  // Nao mostrar em rotas de admin ou produto
  if (location.pathname.startsWith("/ajustes") || location.pathname.startsWith("/produto/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
                isActive ? "text-red-600" : "text-stone-500 hover:text-stone-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className={cn("text-xs font-medium", isActive && "font-bold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
