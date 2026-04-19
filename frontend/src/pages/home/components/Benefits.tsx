import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { motion } from "motion/react";
import { CheckCircle2, Truck, ListCollapse } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

export default function Benefits() {
  const { siteImages } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      id: "qualidade",
      title: "Qualidade na mesa",
      desc: "Ingredientes frescos todos os dias, selecionados a dedo. Comida de verdade com sabor e higiene impecável.",
      stats: [
        { label: "Ingredientes", value: "100% Frescos" },
        { label: "Preparo", value: "Artesanal" },
        { label: "Higiene", value: "Nota 10" },
      ],
      icon: CheckCircle2,
      image: siteImages?.benefitsImages[0]
    },
    {
      id: "entrega",
      title: "Entrega express",
      desc: "Não passe fome esperando. Nossa equipe de motoboys cobre toda a cidade rapidamente, mantendo a comida quentinha.",
      stats: [
        { label: "Tempo médio", value: "35 min" },
        { label: "Frete Grátis*", value: "Acima R$50" },
        { label: "Embalagem", value: "Térmica" },
      ],
      icon: Truck,
      image: siteImages?.benefitsImages[1]
    },
    {
      id: "variedade",
      title: "Cardápio variado",
      desc: "Enjoar? Nunca. Todos os dias temos opções diferentes em marmitas, carnes variadas no rolete e sobremesas no capricho.",
      stats: [
        { label: "Categorias", value: "6+" },
        { label: "Pratos", value: "Mais de 30" },
        { label: "Opções", value: "Para todos" },
      ],
      icon: ListCollapse,
      image: siteImages?.benefitsImages[2]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [benefits.length]);

  const activeBenefit = benefits[activeTab];

  return (
    <section className="bg-stone-50 py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Por que escolher o Vitória</span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900">Três razões para pedir todo dia</h2>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
               <activeBenefit.icon className="w-8 h-8 text-red-600" />
               <h3 className="text-3xl font-black text-stone-900">{activeBenefit.title}</h3>
            </div>
            
            <p className="text-stone-600 text-lg mb-10 leading-relaxed min-h-[80px]">
              {activeBenefit.desc}
            </p>

            <div className="space-y-6 flex-1">
              {activeBenefit.stats.map((stat, i) => (
                <div key={i} className="flex justify-between items-center border-b border-stone-100 pb-4">
                  <span className="text-stone-500 font-medium">{stat.label}</span>
                  <span className="text-stone-900 font-black text-lg">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Progress indicators wrapper */}
            <div className="mt-10 flex gap-2">
              {benefits.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 bg-stone-100 rounded-full overflow-hidden relative" onClick={() => setActiveTab(i)}>
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: activeTab === i ? "100%" : "0%" }}
                    transition={{ duration: activeTab === i ? 5 : 0, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-red-600 origin-left"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="w-full lg:w-1/2 relative h-64 min-h-[300px] lg:h-auto lg:min-h-full">
             {benefits.map((benefit, i) => (
               <div 
                 key={benefit.id}
                 className={cn(
                   "absolute inset-0 transition-opacity duration-500",
                   activeTab === i ? "opacity-100 z-10" : "opacity-0 z-0"
                 )}
               >
                 <img 
                   src={benefit.image} 
                   alt={benefit.title} 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent lg:bg-gradient-to-r lg:from-white/20 lg:to-transparent" />
               </div>
             ))}
          </div>
        </div>

        {/* Mini Cards (Interactive Tabs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
           {benefits.map((benefit, i) => (
             <button
               key={benefit.id}
               onClick={() => setActiveTab(i)}
               className={cn(
                 "p-6 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 hover:-translate-y-1",
                 activeTab === i 
                  ? "bg-red-600 border-red-600 text-white shadow-none" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-red-200"
               )}
             >
               <benefit.icon className={cn("w-6 h-6", activeTab === i ? "text-white" : "text-red-600")} />
               <span className={cn("font-bold", activeTab === i ? "text-white" : "text-stone-900")}>
                 {benefit.title}
               </span>
             </button>
           ))}
        </div>
      </div>
    </section>
  );
}
