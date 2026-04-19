import { NavLink } from "react-router-dom";
import { Home, History, MessageSquareHeart, UserRound } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";
import { motion } from "motion/react";

const tabs = [
  { to: "/", label: "Início", icon: Home, id: "home" },
  { to: "/historico", label: "Histórico", icon: History, id: "history" },
  { to: "/depoimentos", label: "Depoimentos", icon: MessageSquareHeart, id: "reviews" },
  { to: "/perfil", label: "Perfil", icon: UserRound, id: "profile" },
];

export default function BottomNav() {
  const { cartCount } = useAppContext();
  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      data-testid="bottom-nav"
      className="fixed bottom-3 left-3 right-3 z-40 rounded-[28px] bg-white/95 backdrop-blur-xl border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-2 py-2 safe-bottom"
    >
      <ul className="grid grid-cols-4 gap-1">
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
                    "relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 transition-all duration-300 font-bold text-[11px] tracking-tight",
                    isActive
                      ? "bg-red-600 text-white shadow-[0_6px_18px_rgba(220,38,38,0.35)]"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                  )
                }
              >
                <span className="relative">
                  <Icon className="w-5 h-5" strokeWidth={2.4} />
                  {t.id === "history" && cartCount > 0 && (
                    <span
                      data-testid="bottom-nav-cart-badge"
                      className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 bg-stone-900 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white"
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
                <span>{t.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
