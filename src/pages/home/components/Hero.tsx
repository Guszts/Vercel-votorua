import { useEffect, useState, useRef } from "react";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion, useScroll, useTransform } from "motion/react";

const slides = [
  "https://images.unsplash.com/photo-1593504049359-715560c5a5e3?q=80&w=2938&auto=format&fit=crop", // Brazilian food
  "https://images.unsplash.com/photo-1544025162-836e520ea5cd?q=80&w=3012&auto=format&fit=crop", // BBQ/Meat
  "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=2942&auto=format&fit=crop", // Delivery package / food
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const progressBarHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={heroRef} className="relative h-[250vh] bg-stone-900">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
              <a
                href="https://pedir.delivery/app/restaurantevitoria/menu"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2"
              >
                Fazer Pedido
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#marmitas"
                className="bg-white/10 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg"
              >
                Ver Cardápio
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-32 lg:top-40 right-4 lg:right-12 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full pr-4 p-2 border border-white/20 z-20">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black leading-none">4.8</span>
            <span className="text-white/80 text-xs font-medium">Avaliações</span>
          </div>
        </div>

        <div className="absolute bottom-32 lg:bottom-40 left-4 lg:left-12 hidden md:flex flex-col gap-4 z-20">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-white font-medium text-sm">30-45 min</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-white font-medium text-sm">Frete Grátis*</span>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-40 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === currentSlide ? "w-8 bg-red-500" : "w-2 bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Vertical Scroll Progress Overlay */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Role para ver</span>
          <div className="w-[1px] h-24 bg-white/20 relative">
            <motion.div 
              style={{ height: progressBarHeight }}
              className="absolute top-0 left-0 w-full bg-red-500 origin-top"
            />
          </div>
        </div>

        {/* Bottom Notch */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-white z-20"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>
    </section>
  );
}
