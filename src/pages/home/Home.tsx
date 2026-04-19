import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ProductCategory } from "../../data/products";
import { cn } from "../../lib/utils";

const categories: { id: ProductCategory | "all"; name: string }[] = [
  { id: "all", name: "Todos" },
  { id: "marmitas", name: "Marmitas" },
  { id: "fitness", name: "Fitness" },
  { id: "carnes", name: "Carnes" },
  { id: "bebidas", name: "Bebidas" },
  { id: "sobremesas", name: "Sobremesas" },
  { id: "pastel", name: "Pastel" },
];

const priceRanges = [
  { id: "all", label: "Todos os preços" },
  { id: "0-20", label: "Até R$20" },
  { id: "20-40", label: "R$20 - R$40" },
  { id: "40-60", label: "R$40 - R$60" },
  { id: "60+", label: "Acima de R$60" },
];

export default function Home() {
  const { products, addToCart } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(query) && !product.desc.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Price filter
    if (selectedPriceRange !== "all") {
      const price = product.price;
      if (selectedPriceRange === "0-20" && price > 20) return false;
      if (selectedPriceRange === "20-40" && (price <= 20 || price > 40)) return false;
      if (selectedPriceRange === "40-60" && (price <= 40 || price > 60)) return false;
      if (selectedPriceRange === "60+" && price <= 60) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSortBy("name");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedPriceRange !== "all" || sortBy !== "name" || searchQuery;

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
              <span className="font-black text-lg">V</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 leading-none block">Restaurante</span>
              <span className="text-lg font-black uppercase text-stone-900 leading-none">Vitória</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-stone-900 placeholder:text-stone-400"
            />
            <button
              onClick={() => setShowFilters(true)}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
                hasActiveFilters ? "bg-red-600 text-white" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                  selectedCategory === cat.id
                    ? "bg-red-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-stone-500 font-medium">
            {sortedProducts.length} {sortedProducts.length === 1 ? "produto" : "produtos"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 font-bold flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <Search className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-bold text-lg">Nenhum produto encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <Link
                to={`/produto/${product.id}`}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-bold uppercase text-red-600 tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {product.desc}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-black text-red-600">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-stone-900">Filtros</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-bold text-stone-900 mb-3">Ordenar por</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "name", label: "Nome" },
                  { id: "price-asc", label: "Menor preço" },
                  { id: "price-desc", label: "Maior preço" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as typeof sortBy)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition-colors",
                      sortBy === option.id
                        ? "bg-red-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-bold text-stone-900 mb-3">Faixa de preço</h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition-colors",
                      selectedPriceRange === range.id
                        ? "bg-red-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
