import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import { ArrowRight } from "lucide-react";

const menuItems = [
  {
    id: "marmita-p",
    category: "Marmitas",
    name: "Marmita P",
    desc: "Arroz, feijão, 1 carne à escolha, macarronada, e salada separada. Ideal para o dia a dia.",
    price: "R$ 20,00",
    tag: "Mais Vendida",
    image: "https://images.unsplash.com/photo-1627308595229-7830f5c90683?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "marmita-m",
    category: "Marmitas",
    name: "Marmita M",
    desc: "A queridinha da galera. Porção generosa com 2 misturas à sua escolha.",
    price: "R$ 28,00",
    tag: "Favorita",
    image: "https://images.unsplash.com/photo-1548943487-a2e4142f132e?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "marmita-g",
    category: "Marmitas",
    name: "Marmita G",
    desc: "Para quem tem muita fome. 3 opções de carnes e acompanhamentos caprichados.",
    price: "R$ 35,00",
    tag: "Tamanho Família",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "marmita-fit",
    category: "Fitness",
    name: "Marmita Fitness",
    desc: "Arroz integral/purê de batata doce, filé de frango grelhado e mix de legumes no vapor.",
    price: "R$ 32,00",
    tag: "Saudável",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "carnes-kilo",
    category: "Carnes no Kilo",
    name: "Churrasco em Kilo",
    desc: "Picanha, maminha, linguiça toscana e frango assado. Escolha sua carne favorita no peso.",
    price: "a partir R$ 45/kg",
    tag: "Fim de Semana",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "sobremesas",
    category: "Sobremesas",
    name: "Doces Caseiros",
    desc: "Pudim de leite condensado, mousse de maracujá e bombom na travessa.",
    price: "a partir R$ 8,00",
    tag: "Para fechar bem",
    image: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function FeaturedMenu() {
  const [activeItem, setActiveItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveItem(index);
          }
        },
        { threshold: [0.5, 0.6] }
      );
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  return (
    <section className="bg-white min-h-screen relative" id="marmitas" ref={containerRef}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        
        {/* Left Side: Scrollable List */}
        <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 pb-32">
          <div className="sticky top-24 mb-12">
            <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Nossos Pratos</span>
            <div className="text-[120px] leading-none font-black text-stone-100 absolute -top-8 -left-4 -z-10 select-none">
              {(activeItem + 1).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:gap-24 mt-24">
            {menuItems.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[i] = el)}
                className={cn(
                  "relative transition-all duration-700 p-6 rounded-2xl",
                  activeItem === i ? "bg-stone-50 scale-105 border border-stone-100" : "opacity-40 hover:opacity-80 cursor-pointer"
                )}
                onClick={() => setActiveItem(i)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-red-500 font-bold">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="h-[1px] w-8 bg-red-200" />
                  <span className="text-stone-500 font-bold text-sm tracking-wider uppercase">{item.category}</span>
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-black text-stone-900 mb-4">{item.name}</h3>
                
                <div className={cn(
                  "overflow-hidden transition-all duration-500",
                  activeItem === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <p className="text-stone-600 text-lg mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-red-600">{item.price}</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24">
            <a
              href="https://pedir.delivery/app/restaurantevitoria/menu"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold text-lg"
            >
              Ver Cardápio Completo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Side: Sticky Image area */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 bg-stone-100 overflow-hidden">
          {menuItems.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "absolute inset-0 transition-all duration-1000",
                activeItem === i ? "opacity-100 z-10" : "opacity-0 scale-105 z-0"
              )}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-16 left-16 right-16">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider inline-block mb-4">
                  {item.tag}
                </span>
                <h4 className="text-white text-5xl font-black mb-2 shadow-sm">{item.name}</h4>
                <p className="text-white/90 text-2xl font-medium">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
