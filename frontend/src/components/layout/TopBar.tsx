import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ArrowLeft, Settings2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

interface Props {
  title?: string;
  back?: boolean;
  transparent?: boolean;
}

export default function TopBar({ title, back, transparent }: Props) {
  const { profile, isAdmin, session } = useAuth();
  const location = useLocation();
  const initial = (profile?.nickname || profile?.full_name || session?.user?.email || "?")[0]?.toUpperCase();

  return (
    <header
      data-testid="top-bar"
      className={cn(
        "sticky top-0 z-30 transition-colors duration-300",
        transparent ? "bg-transparent" : "bg-white/90 backdrop-blur-md border-b border-stone-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {back && (
            <Link
              to=".."
              data-testid="top-bar-back"
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 transition flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-stone-900" />
            </Link>
          )}
          {title ? (
            <h1 className="text-lg font-black text-stone-900 tracking-tight">{title}</h1>
          ) : (
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
                Restaurante
              </span>
              <span className="text-xl font-black uppercase text-stone-900 leading-none">
                Vitória
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/ajustes"
              data-testid="admin-shortcut"
              className="hidden sm:flex items-center gap-1.5 bg-red-600 text-white rounded-full font-bold text-xs px-3 py-2 hover:bg-red-700 transition"
            >
              <Settings2 className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          <Link
            to="/perfil"
            data-testid="top-bar-avatar"
            className="w-10 h-10 rounded-full bg-stone-900 text-white font-black flex items-center justify-center overflow-hidden border-2 border-white shadow"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.nickname || ""} className="w-full h-full object-cover" />
            ) : (
              <span>{initial}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
