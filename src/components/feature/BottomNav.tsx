import { Home, Clock, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "inicio", label: "Início", icon: Home, path: "/" },
  { id: "historico", label: "Histórico", icon: Clock, path: "/historico" },
  { id: "depoimentos", label: "Depoimentos", icon: MessageSquare, path: "/depoimentos" },
  { id: "perfil", label: "Perfil", icon: User, path: "/perfil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show bottom nav on admin or product detail pages
  if (location.pathname.startsWith("/ajustes") || location.pathname.startsWith("/produto")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-red-600" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
