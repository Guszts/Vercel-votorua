import { useEffect, useState } from "react";
import { Star, MapPin, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion } from "motion/react";
import { useAppContext } from "../../../context/AppContext";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { cartCount, setIsCartOpen, siteImages } = useAppContext();
  const slides = siteImages?.heroSlides || [];
  
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-stone-900 flex flex-col justify-end">
      {/* Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide}
            alt="Restaurante Vitória"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-6">
            Restaurante & Marmitaria
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Sabor de <br className="md:hidden" />
            <span className="text-red-500">Casa.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-200 font-medium max-w-2xl mb-10">
            A verdadeira comida caseira em Campo Novo do Parecis. Montada com carinho e entregue quentinha na sua porta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 relative"
            >
              Fazer Pedido
              <ShoppingBag className="w-5 h-5 ml-1" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 border-2 border-white text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href="#cardapio"
              className="bg-stone-800 hover:bg-stone-700 hover:-translate-y-1 transition-all duration-300 border border-stone-600 text-white px-8 py-4 rounded-full font-bold text-lg"
            >
              Ver Cardápio
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Badges */}
      <div className="absolute top-32 lg:top-40 right-4 lg:right-12 hidden md:flex items-center gap-2 bg-stone-900/60 rounded-full pr-4 p-2 border border-white/10 z-20">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
          <Star className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black leading-none">4.8</span>
          <span className="text-white/80 text-xs font-medium">Avaliações</span>
        </div>
      </div>

      <div className="absolute bottom-16 lg:bottom-24 left-4 lg:left-12 hidden md:flex flex-col gap-4 z-20">
        <div className="flex items-center gap-3 bg-stone-900/60 rounded-full px-5 py-3 border border-white/10">
          <Clock className="w-5 h-5 text-red-500" />
          <span className="text-white font-medium text-sm">30-45 min</span>
        </div>
        <div className="flex items-center gap-3 bg-stone-900/60 rounded-full px-5 py-3 border border-white/10">
          <MapPin className="w-5 h-5 text-red-500" />
          <span className="text-white font-medium text-sm">Frete Grátis*</span>
        </div>
      </div>

      {/* Bottom Notch */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 bg-white z-20"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
