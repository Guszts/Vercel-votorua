import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  nickname: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  loyalty_points: number;
  is_admin: boolean;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me as AuthUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const signInWithGoogle = useCallback(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/";
    window.location.href =
      `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  }, []);

  const signOut = useCallback(async () => {
    try { await api.logout(); } catch { /* noop */ }
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  const updateProfile = useCallback(async (patch: Partial<AuthUser>) => {
    try {
      await api.patchProfile(patch);
      await checkAuth();
      return {};
    } catch (e: any) {
      return { error: e?.message || "Erro ao atualizar" };
    }
  }, [checkAuth]);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        isAdmin: !!user?.is_admin,
        signInWithGoogle,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
