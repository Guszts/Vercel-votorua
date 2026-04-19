import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function OrderModal() {
  const { isOrderModalOpen, setIsOrderModalOpen } = useAppContext();
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  if (!isOrderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle");
        setIsOrderModalOpen(false);
      }, 3000);
    }, 1200);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 transition-opacity"
        onClick={() => setIsOrderModalOpen(false)}
      >
        <div 
          className="bg-white border-2 border-stone-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b-2 border-stone-900 flex justify-between items-center bg-stone-50">
            <h2 className="text-2xl font-black text-stone-900 uppercase">Contato / Pedido</h2>
            <button onClick={() => setIsOrderModalOpen(false)} className="p-2 border-2 border-stone-900 hover:bg-stone-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-stone-900" />
            </button>
          </div>

          <div className="p-8">
            {formStatus === "success" ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-20 h-20 bg-stone-900 text-white rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-stone-900 mb-2">Solicitação Recebida</h3>
                <p className="text-stone-600">Nossa equipe entrará em contato com você em instantes para concluir o pedido via WhatsApp!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="modal_name" className="text-sm font-bold text-stone-900">Nome ou Empresa</label>
                  <input 
                    type="text" 
                    id="modal_name" 
                    required autoFocus
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:ring-4 focus:ring-stone-200 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="modal_phone" className="text-sm font-bold text-stone-900">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="modal_phone" 
                    required
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:ring-4 focus:ring-stone-200 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="modal_message" className="text-sm font-bold text-stone-900">Observações adicionais</label>
                  <textarea 
                    id="modal_message" 
                    rows={3}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:ring-4 focus:ring-stone-200 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full bg-stone-900 hover:bg-stone-800 transition-all text-white font-black uppercase tracking-wider py-4 mt-2 rounded-xl border-2 border-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === "submitting" ? "Aguarde..." : "Enviar Solicitação"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
