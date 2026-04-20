import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

// Backend URL resolution order:
//   1. VITE_BACKEND_URL explicit override (ex: dev tunnel, separate host)
//   2. REACT_APP_BACKEND_URL (legacy)
//   3. Same-origin path prefix when running as Vercel multi-service
//      (frontend at "/", backend at "/_/backend")
const explicit =
  (import.meta.env.VITE_BACKEND_URL as string) ||
  (import.meta.env.REACT_APP_BACKEND_URL as string) ||
  "";

export const BACKEND_URL = explicit || "/_/backend";

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string) || "gustavomonteiro09g@gmail.com";
