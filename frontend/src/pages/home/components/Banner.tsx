import { motion } from "motion/react";
import { useAppContext } from "../../../context/AppContext";

export default function Banner() {
  const { siteImages } = useAppContext();

  return (
    <section className="relative bg-[#1a0a08] py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={siteImages?.bannerBg} 
          alt="Cozinha local" 
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a08] via-[#1a0a08]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter mb-4">
            Marmitaria <span className="text-red-500 block lg:inline">Vitória.</span>
          </h2>
          <p className="text-stone-300 text-xl md:text-2xl font-medium max-w-2xl mb-10 leading-relaxed">
            Mais que comida, uma tradição e entrega rápida. Sinta-se em casa todos os dias, de Campo Novo do Parecis para sua mesa.
          </p>
          
          <a
            href="https://pedir.delivery/app/restaurantevitoria/menu"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-10 py-5 rounded-full font-black text-lg md:text-xl shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
          >
            Fazer Meu Pedido
          </a>
        </motion.div>
      </div>
    </section>
  );
}
