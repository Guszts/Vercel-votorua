import React, { useState } from "react";
import { CheckCircle2, MapPin, Truck, Star, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Mock the fetch to a Readdy Forms endpoint
    setTimeout(() => {
      setFormStatus("success");
      // Reset form after a few seconds
      setTimeout(() => setFormStatus("idle"), 5000);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section className="bg-stone-50 py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Contact Info */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Fale Conosco</span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6">Dúvidas ou encomendas grandes?</h2>
          <p className="text-stone-600 text-lg mb-10 leading-relaxed">
            Seja para o almoço da sua empresa, um evento especial ou apenas para tirar dúvidas sobre o cardápio, estamos aqui para ajudar.
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-stone-900 font-black">Centro, Campo Novo do Parecis</p>
                <p className="text-stone-500 text-sm">Av Brasil, 1020</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200">
                <Truck className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-stone-900 font-black">Delivery em toda cidade</p>
                <p className="text-stone-500 text-sm">30 a 45 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200">
                <Star className="w-5 h-5 text-red-600 fill-red-600" />
              </div>
              <div>
                <p className="text-stone-900 font-black">4.8/5.0 de Avaliação</p>
                <p className="text-stone-500 text-sm">Nota máxima no App</p>
              </div>
            </div>
          </div>

          <a
             href="https://pedir.delivery/app/restaurantevitoria/menu"
             target="_blank"
             rel="nofollow noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg"
          >
             <Phone className="w-5 h-5" />
             Ligar Agora (WhatsApp)
          </a>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[55%]">
          <div className="bg-white p-8 lg:p-12 rounded-2xl border border-stone-200">
            {formStatus === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-16"
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="text-3xl font-black text-stone-900 mb-4">Mensagem Enviada!</h3>
                <p className="text-stone-600 text-lg">Retornaremos o contato o mais rápido possível.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-stone-900">Nome Completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      placeholder="João da Silva"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-bold text-stone-900">Telefone / WhatsApp</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      placeholder="(65) 99999-9999"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-bold text-stone-900">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      placeholder="joao@exemplo.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-bold text-stone-900">Assunto</label>
                    <select 
                      id="subject" 
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="duvida">Dúvida sobre cardápio</option>
                      <option value="evento">Orçamento para Evento/Empresa</option>
                      <option value="reclamacao">Sugestão ou Reclamação</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-bold text-stone-900">Mensagem</label>
                  <textarea 
                    id="message" 
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Como podemos te ajudar hoje?"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full bg-stone-900 hover:bg-stone-800 transition-all duration-300 text-white font-bold text-lg py-4 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {formStatus === "submitting" ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
