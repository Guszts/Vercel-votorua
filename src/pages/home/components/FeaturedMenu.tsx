import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

export default function FeaturedMenu() {
  const { products, setIsOrderModalOpen } = useAppContext();
  const featured = products.slice(0, 6); // Grab some products to show on home

  return (
    <section className="bg-stone-50 py-24 px-6 lg:px-8" id="cardapio">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Nossos Pratos</span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6">Os favoritos da casa</h2>
          <p className="text-stone-600 font-medium text-lg max-w-2xl mx-auto">
            Feitos com ingredientes frescos e muito carinho para garantir o melhor sabor na sua mesa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <Link
              to={`/produto/${item.id}`}
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50">
                   <span className="text-red-700 font-bold text-xs uppercase tracking-wider">{item.category}</span>
                </div>
                {item.tag && (
                  <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full">
                     <span className="text-white font-bold text-xs uppercase tracking-wider">{item.tag}</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-2xl font-black text-stone-900 group-hover:text-red-600 transition-colors">{item.name}</h3>
                </div>
                <p className="text-stone-600 leading-relaxed flex-1 line-clamp-3">
                  {item.desc}
                </p>
                <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                   <span className="text-2xl font-black text-red-600 shrink-0">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                   </span>
                   <span className="text-stone-900 font-bold flex items-center gap-2 group-hover:text-red-600 transition-colors">
                     Detalhes
                     <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-red-600 transition-all duration-300 text-white hover:-translate-y-1 px-8 py-4 rounded-full font-bold text-lg"
          >
            Fazer Pedido Completo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
