import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../../../context/AppContext";
import { cn } from "../../../lib/utils";

const categories = [
  { id: "all", label: "Todos" },
  { id: "marmitas", label: "Marmitas" },
  { id: "fitness", label: "Fitness" },
  { id: "carnes", label: "Carnes" },
  { id: "bebidas", label: "Bebidas" },
  { id: "sobremesas", label: "Sobremesas" },
  { id: "pastel", label: "Pastel" },
];

export default function FeaturedMenu() {
  const { products, addToCart } = useAppContext();
  const [cat, setCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "priceAsc" | "priceDesc">("default");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.active !== false);
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, search, sort]);

  return (
    <section className="bg-stone-50 py-20 px-5 lg:px-8" id="cardapio">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-3 block">
            Nossos Pratos
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-3 tracking-tight">
            Os favoritos da casa
          </h2>
          <p className="text-stone-600 font-medium text-lg max-w-2xl mx-auto">
            Feitos com ingredientes frescos e muito carinho.
          </p>
        </div>

        {/* Search + sort */}
        <div className="flex items-center gap-2 mb-3 max-w-3xl mx-auto" data-testid="products-search-bar">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              data-testid="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar prato..."
              className="w-full rounded-full bg-white border border-stone-200 pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-red-500"
            />
          </div>
          <select
            data-testid="products-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-white border border-stone-200 rounded-full px-4 py-3 font-bold text-sm"
          >
            <option value="default">Padrão</option>
            <option value="priceAsc">Menor preço</option>
            <option value="priceDesc">Maior preço</option>
          </select>
        </div>

        {/* Category filters */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar max-w-3xl mx-auto"
          data-testid="products-categories"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              data-testid={`cat-${c.id}`}
              onClick={() => setCat(c.id)}
              className={cn(
                "px-4 py-2 rounded-full font-bold text-sm transition-all shrink-0",
                cat === c.id
                  ? "bg-red-600 text-white shadow-md shadow-red-500/30"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            data-testid="products-grid"
          >
            {filtered.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-[28px] overflow-hidden border border-stone-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 flex flex-col"
                data-testid={`product-card-${item.id}`}
              >
                <Link to={`/produto/${item.id}`} className="h-52 overflow-hidden relative block">
                  <img
                    src={item.image_url || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-red-700 font-bold text-[10px] uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  {item.badge && (
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full"
                      style={{ backgroundColor: item.badge_color || "#dc2626" }}
                    >
                      <span className="text-white font-bold text-[10px] uppercase tracking-widest">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <Link to={`/produto/${item.id}`}>
                    <h3 className="text-xl font-black text-stone-900 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-stone-600 leading-relaxed flex-1 line-clamp-2 mt-1 text-sm">
                    {item.description || item.desc}
                  </p>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xl font-black text-red-600 shrink-0">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/produto/${item.id}`}
                        data-testid={`product-details-${item.id}`}
                        className="text-xs font-bold text-stone-700 border-2 border-stone-200 hover:border-stone-400 rounded-full px-3 py-2 flex items-center gap-1 transition"
                      >
                        Detalhes <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => addToCart(item)}
                        data-testid={`product-add-${item.id}`}
                        className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-2 flex items-center gap-1 transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-stone-500 font-medium" data-testid="products-empty">
            Nenhum prato encontrado.
          </p>
        )}
      </div>
    </section>
  );
}
