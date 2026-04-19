import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart } = useAppContext();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
        <h1 className="text-4xl font-black text-stone-900">Produto não encontrado</h1>
        <Link to="/" className="text-red-600 font-bold hover:underline">Voltar para a tela inicial</Link>
      </div>
    );
  }

  // Obter alguns produtos recomendados aleatoriamente (da mesma categoria)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Voltar ao Cardápio
        </Link>
        
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-6">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-[400px] lg:h-[600px] object-cover rounded-2xl border border-stone-100"
            />
          </div>
          
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="mb-4 inline-flex">
              <span className="bg-stone-100 text-stone-600 font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-md">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter mb-6">{product.name}</h1>
            
            <p className="text-stone-600 text-xl leading-relaxed mb-10">
              {product.desc}
            </p>
            
            <div className="border-t border-b border-stone-100 py-6 mb-10 flex items-center justify-between">
              <span className="text-2xl font-bold text-stone-400 uppercase tracking-widest">Preço</span>
              <span className="text-5xl font-black text-red-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </span>
            </div>
            
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-stone-900 text-white hover:bg-stone-800 transition-all font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1"
            >
              <ShoppingBag className="w-6 h-6" /> Adicionar ao Pedido
            </button>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-2xl border border-stone-200">
              <h3 className="font-black text-xl text-stone-900 mb-4">Ingredientes Frescos</h3>
              <p className="text-stone-600 leading-relaxed">Nossos pratos são preparados diariamente com os melhores e mais frescos ingredientes, garantindo um sabor único e incrível qualidade nutricional.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl border border-stone-200">
              <h3 className="font-black text-xl text-stone-900 mb-4">Embalagem Térmica</h3>
              <p className="text-stone-600 leading-relaxed">Enviamos tudo de forma cuidadosa e super protegida. O seu pedido chega quentinho na sua casa, como se tivesse acabado de sair do fogo.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl border border-stone-200">
              <h3 className="font-black text-xl text-stone-900 mb-4">Entrega Rápida</h3>
              <p className="text-stone-600 leading-relaxed">Sistema logístico próprio que atende todo o centro e bairros da cidade. O prato que você deseja chega voando até a mesa da sua família.</p>
           </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-black text-stone-900 mb-8 border-b-2 border-stone-900 pb-4 inline-block">Você também pode gostar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link to={`/produto/${rel.id}`} key={rel.id} className="group bg-white border border-stone-200 rounded-[2rem] overflow-hidden hover:border-red-200 transition-all flex flex-col">
                  <div className="h-64 overflow-hidden relative p-4 pb-0">
                    <img 
                      src={rel.image} 
                      alt={rel.name} 
                      className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-2 group-hover:text-red-600 transition-colors">{rel.name}</h3>
                    <p className="text-stone-500 font-medium leading-relaxed mb-6 flex-1 line-clamp-2">{rel.desc}</p>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-2xl font-black text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rel.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
