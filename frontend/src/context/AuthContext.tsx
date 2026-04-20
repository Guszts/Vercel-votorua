import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
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
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
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
    // CRITICAL: skip the /me check when returning from OAuth callback
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
    // React to Supabase auth state changes (email login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event) => {
      checkAuth();
    });
    return () => sub.subscription.unsubscribe();
  }, [checkAuth]);

  const signInWithGoogle = useCallback(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/";
    window.location.href =
      `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  }, []);

  const signInWithEmail: AuthCtx["signInWithEmail"] = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await checkAuth();
    return {};
  }, [checkAuth]);

  const signUpWithEmail: AuthCtx["signUpWithEmail"] = useCallback(async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch { /* noop */ }
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
        signInWithEmail,
        signUpWithEmail,
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
