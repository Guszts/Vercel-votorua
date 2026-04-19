import { useState } from "react";
import { Search, Filter, ArrowRight, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext, ProductCategory } from "../../context/AppContext";
import { cn } from "../../lib/utils";

const categories: { id: ProductCategory | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "marmitas", label: "Marmitas" },
  { id: "fitness", label: "Fitness" },
  { id: "carnes", label: "Carnes" },
  { id: "bebidas", label: "Bebidas" },
  { id: "sobremesas", label: "Sobremesas" },
  { id: "pastel", label: "Pastel" },
];

const sortOptions = [
  { id: "relevancia", label: "Relevancia" },
  { id: "menor_preco", label: "Menor Preco" },
  { id: "maior_preco", label: "Maior Preco" },
  { id: "nome_az", label: "Nome A-Z" },
];

export default function Home() {
  const { products, addToCart } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "todas">("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === "todas" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "menor_preco":
          return a.price - b.price;
        case "maior_preco":
          return b.price - a.price;
        case "nome_az":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-stone-900">Vitoria</h1>
              <p className="text-sm text-stone-500">Restaurante e Marmitaria</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-stone-100 rounded-full text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors",
                showFilters ? "bg-red-600 text-white" : "bg-stone-200 text-stone-600"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="overflow-x-auto scrollbar-hide border-t border-stone-100">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  selectedCategory === cat.id
                    ? "bg-red-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-stone-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Faixa de Preco: R${priceRange[0]} - R${priceRange[1]}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 accent-red-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500 text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-lg mb-2">Nenhum produto encontrado</p>
            <p className="text-stone-400 text-sm">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow group"
              >
                <Link to={`/produto/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {product.tag && (
                      <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-full">
                        <span className="text-white font-bold text-xs">{product.tag}</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-3">
                  <Link to={`/produto/${product.id}`}>
                    <p className="text-xs text-stone-400 uppercase font-medium mb-1">{product.category}</p>
                    <h3 className="font-bold text-stone-900 text-sm mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-stone-500 text-xs line-clamp-2 mb-3">{product.desc}</p>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-black text-lg">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 bg-stone-900 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
