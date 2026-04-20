import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

/**
 * Handles auth callbacks (Supabase OAuth redirects).
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    (async () => {
      // Check for Supabase auth callback
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("[v0] Erro no callback de auth:", error);
        navigate("/?auth_error=1", { replace: true });
        return;
      }

      if (session) {
        // Auth successful, redirect to home
        navigate("/", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="font-black text-stone-900">Entrando...</p>
        <p className="text-stone-500 text-sm font-medium">Só um instante</p>
      </div>
    </div>
  );
}
