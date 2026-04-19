import { Instagram, Facebook, Ghost } from "lucide-react"; // Using Ghost or similar as fallback for WhatsApp if not available in Lucide, wait, Lucide has no WhatsApp. Wait, no, it might not. I will use a message-circle for whatsapp
import { MessageCircle, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

export default function Footer() {
  const { setIsOrderModalOpen } = useAppContext();

  return (
    <footer className="bg-[var(--color-vitoria-footer)] pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-16 border-b border-red-200">
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight">
            Sua marmita quentinha <br className="hidden md:block"/>
            está a <span className="text-red-600">um clique.</span>
          </h2>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg text-center min-w-[200px]"
          >
            Pedir Agora
          </button>
        </div>

        {/* 4 Columns Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          <div className="flex flex-col gap-4">
             <h4 className="font-black text-stone-900 text-lg mb-2">Cardápio</h4>
             <a href="#marmitas" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Marmitas Clássicas</a>
             <a href="#fitness" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Marmitas Fitness</a>
             <a href="#carnes" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Carnes em Kilo</a>
             <a href="#bebidas" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Bebidas</a>
             <a href="#sobremesas" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Sobremesas</a>
          </div>
          
          <div className="flex flex-col gap-4">
             <h4 className="font-black text-stone-900 text-lg mb-2">Informações</h4>
             <a href="#" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Dúvidas Frequentes</a>
             <a href="#" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Regiões de Entrega</a>
             <a href="#" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Trabalhe Conosco</a>
             <a href="#" className="text-stone-600 font-medium hover:text-red-600 transition-colors">Termos de Uso</a>
          </div>

          <div className="flex flex-col gap-4">
             <h4 className="font-black text-stone-900 text-lg mb-2">Contato</h4>
             <p className="text-stone-600 font-medium">Av Brasil, 1020 - Centro<br/>Campo Novo do Parecis/MT</p>
             <p className="text-stone-600 font-medium">(65) 99999-9999</p>
             <p className="text-stone-600 font-medium">contato@restaurantevitoria.com</p>
          </div>

          <div className="flex flex-col gap-4">
             <h4 className="font-black text-stone-900 text-lg mb-2">Siga o Vitória</h4>
             <div className="flex items-center gap-3">
               <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                 <Instagram className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                 <MessageCircle className="w-5 h-5" />
               </a>
               <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                 <Facebook className="w-5 h-5" />
               </a>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-red-200">
          <div className="flex items-center gap-2 text-stone-900">
            <Utensils className="w-4 h-4 text-red-600" />
            <span className="font-black uppercase text-sm">Vitória</span>
          </div>
          
          <p className="text-stone-500 text-sm font-medium text-center">
            &copy; {new Date().getFullYear()} Restaurante e Marmitaria Vitória. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
