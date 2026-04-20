import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string || process.env.SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string || process.env.SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn("[v0] Supabase URL ou ANON_KEY não configurados. Usando valores de fallback.");
}

export const supabase = createClient(url || "", key || "", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string) || "gustavomonteiro09g@gmail.com";
