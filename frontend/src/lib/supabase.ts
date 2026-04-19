import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) ||
  (import.meta.env.REACT_APP_BACKEND_URL as string) ||
  "";

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string) || "gustavomonteiro09g@gmail.com";
