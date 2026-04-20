import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  initial?: "login" | "signup";
}) {
  const { signInWithGoogle } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          data-testid="auth-modal"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 pb-10 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              data-testid="auth-close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 text-center">
              <span className="inline-block bg-red-100 text-red-700 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                Entrar
              </span>
              <h2 className="text-3xl font-black tracking-tight text-stone-900 mt-3">
                Entre com sua conta Google
              </h2>
              <p className="text-stone-500 font-medium mt-2">
                Um clique, sem senha. Leva menos de 5 segundos.
              </p>
            </div>

            <button
              onClick={signInWithGoogle}
              data-testid="auth-google"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-2xl py-4 font-black text-base transition hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <svg width="22" height="22" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.8 26.9 36 24 36c-5.1 0-9.4-3.3-11.2-7.9l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6.6 5.6C41 35.4 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Continuar com Google
            </button>

            <p className="text-center text-xs text-stone-400 font-medium mt-6 leading-relaxed">
              Ao continuar, você concorda com os termos de uso e política de privacidade da Vitória.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
