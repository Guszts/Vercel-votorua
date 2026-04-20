import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, ADMIN_EMAIL } from "../lib/supabase";

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

  const loadUserProfile = useCallback(async (authUserId: string, email: string) => {
    try {
      // Buscar ou criar perfil no Supabase
      let { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("[v0] Erro ao buscar perfil:", error);
      }

      // Se não existe, criar
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            email,
            full_name: email.split("@")[0],
            role: email === ADMIN_EMAIL ? "admin" : "user",
          })
          .select()
          .single();

        if (insertError) {
          console.error("[v0] Erro ao criar perfil:", insertError);
          return null;
        }
        profile = newProfile;
      }

      const isAdmin = profile.role === "admin" || email === ADMIN_EMAIL;
      
      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        nickname: profile.nickname,
        username: profile.username,
        avatar_url: profile.avatar_url,
        role: profile.role || "user",
        loyalty_points: profile.loyalty_points || 0,
        is_admin: isAdmin,
      } as AuthUser;
    } catch (err) {
      console.error("[v0] Erro ao carregar perfil:", err);
      return null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id, session.user.email || "");
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("[v0] Erro ao verificar auth:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadUserProfile]);

  useEffect(() => {
    checkAuth();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await loadUserProfile(session.user.id, session.user.email || "");
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [checkAuth, loadUserProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("[v0] Erro ao fazer login com Google:", error);
    }
  }, []);

  const signInWithEmail: AuthCtx["signInWithEmail"] = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await checkAuth();
    return {};
  }, [checkAuth]);

  const signUpWithEmail: AuthCtx["signUpWithEmail"] = useCallback(async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };

    // Criar perfil imediatamente após signup
    if (data.user) {
      await supabase.from("profiles").upsert({
        email,
        full_name: fullName,
        role: email === ADMIN_EMAIL ? "admin" : "user",
      }, { onConflict: "email" });
    }

    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  const updateProfile = useCallback(async (patch: Partial<AuthUser>) => {
    if (!user) return { error: "Usuário não logado" };
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: patch.full_name,
          nickname: patch.nickname,
          username: patch.username,
          avatar_url: patch.avatar_url,
        })
        .eq("id", user.id);

      if (error) return { error: error.message };
      await checkAuth();
      return {};
    } catch (e: any) {
      return { error: e?.message || "Erro ao atualizar" };
    }
  }, [user, checkAuth]);

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
