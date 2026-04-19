import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, ADMIN_EMAIL } from "../lib/supabase";
import type { Profile } from "../lib/types";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[auth] profile load error", error.message);
      setProfile(null);
      return;
    }
    setProfile(data as Profile | null);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) loadProfile(sess.user.id);
      else setProfile(null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithEmail: AuthCtx["signInWithEmail"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUpWithEmail: AuthCtx["signUpWithEmail"] = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return error ? { error: error.message } : {};
  };

  const signInWithGoogle: AuthCtx["signInWithGoogle"] = async () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectTo = window.location.origin + "/";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user.id);
  };

  const updateProfile: AuthCtx["updateProfile"] = async (patch) => {
    if (!session?.user) return { error: "not authenticated" };
    const { error } = await supabase.from("profiles").update(patch).eq("id", session.user.id);
    if (error) return { error: error.message };
    await loadProfile(session.user.id);
    return {};
  };

  const isAdmin =
    profile?.role === "admin" || session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isAdmin: !!isAdmin,
        loading,
        signInWithEmail,
        signUpWithEmail,
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
