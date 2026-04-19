import { NavLink } from "react-router-dom";
import { Home, History, MessageSquareHeart, UserRound } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";

const tabs = [
  { to: "/", label: "Início", icon: Home, id: "home" },
  { to: "/historico", label: "Histórico", icon: History, id: "history" },
  { to: "/depoimentos", label: "Depoimentos", icon: MessageSquareHeart, id: "reviews" },
  { to: "/perfil", label: "Perfil", icon: UserRound, id: "profile" },
];

export default function BottomNav() {
  const { cartCount } = useAppContext();
  return (
    <nav
      data-testid="bottom-nav"
      className="sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] safe-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="max-w-3xl mx-auto grid grid-cols-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.id}>
              <NavLink
                to={t.to}
                end={t.to === "/"}
                data-testid={`tab-${t.id}`}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center justify-center gap-1 py-2.5 px-1 transition-all duration-300 font-bold text-[11px] tracking-tight",
                    isActive ? "text-red-600" : "text-stone-500 hover:text-stone-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-red-600 rounded-b-full" />
                    )}
                    <span className="relative">
                      <Icon
                        className={cn(
                          "w-6 h-6 transition-transform",
                          isActive ? "scale-110" : "scale-100"
                        )}
                        strokeWidth={2.4}
                      />
                      {t.id === "history" && cartCount > 0 && (
                        <span
                          data-testid="bottom-nav-cart-badge"
                          className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white"
                        >
                          {cartCount}
                        </span>
                      )}
                    </span>
                    <span>{t.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
