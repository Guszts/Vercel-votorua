import { MapPin, Truck, Star, Phone } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function Contact() {
  const { setIsOrderModalOpen } = useAppContext();

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

          <button
             onClick={() => setIsOrderModalOpen(true)}
             className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg"
          >
             <Phone className="w-5 h-5" />
             Ligar Agora (WhatsApp)
          </button>
        </div>

        {/* Right Side: Maps */}
        <div className="w-full lg:w-[55%] h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.6465492233!2d-57.89332219999999!3d-14.654761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93a5b3a4a0dbfeff%3A0xc6ad505fccb0aa7a!2sCampo%20Novo%20do%20Parecis%20-%20MT!5e0!3m2!1spt-BR!2sbr!4v1714081030000!5m2!1spt-BR!2sbr" 
            className="absolute inset-0 w-full h-full border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
