import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { cn } from "../../../lib/utils";

const testimonials = [
  {
    text: "Moro sozinho e a Marmitaria Vitória salvou a minha vida. O tempero é maravilhoso, lembra comida de mãe. E a entrega sempre no horário!",
    name: "Carlos Eduardo",
    role: "Cliente fiel há 1 ano",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop"
  },
  {
    text: "O churrasco no kilo no fim de semana é de lei aqui em casa. Picanha sempre no ponto, farofa perfeita. Melhor custo-benefício de Campo Novo.",
    name: "Mariana Silva",
    role: "Pede todo final de semana",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-stone-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop" 
          alt="Restaurante" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-[15%] mb-8 lg:mb-0">
          <Quote className="w-20 h-20 md:w-32 md:h-32 text-red-600 opacity-50" />
        </div>
        
        <div className="w-full lg:w-[85%] relative min-h-[250px]">
          {testimonials.map((test, i) => (
            <div 
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                activeIndex === i ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              )}
            >
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-10">
                "{test.text}"
              </h3>
              
              <div className="flex items-center gap-4">
                <img 
                  src={test.avatar} 
                  alt={test.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-red-600"
                />
                <div>
                  <h4 className="text-white font-black text-lg">{test.name}</h4>
                  <p className="text-red-400 font-medium text-sm">{test.role}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute -bottom-4 lg:-bottom-12 left-0 flex gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeIndex === i ? "bg-red-600 w-10" : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Ir para depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
