import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

/**
 * Handles the Emergent Auth redirect.
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 * Emergent returns to `${origin}/#session_id=<id>`. We exchange it for a session
 * cookie through our backend, then clean the URL and go back to "/".
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    (async () => {
      const hash = window.location.hash || "";
      const match = hash.match(/session_id=([^&]+)/);
      const sessionId = match ? decodeURIComponent(match[1]) : null;

      if (!sessionId) {
        navigate("/", { replace: true });
        return;
      }

      try {
        await api.session(sessionId);
        // Clean URL and reload so AuthProvider picks up the cookie
        window.location.replace("/");
      } catch {
        navigate("/?auth_error=1", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="font-black text-stone-900">Entrando…</p>
        <p className="text-stone-500 text-sm font-medium">Só um instante</p>
      </div>
    </div>
  );
}
