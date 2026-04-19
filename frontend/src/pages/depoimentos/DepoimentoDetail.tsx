import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import TopBar from "../../components/layout/TopBar";
import { supabase } from "../../lib/supabase";
import { cn } from "../../lib/utils";
import type { Testimonial } from "../../lib/types";

export default function DepoimentoDetail() {
  const { id } = useParams();
  const [data, setData] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: row } = await supabase
        .from("testimonials")
        .select(
          "id, user_id, rating, content, created_at, profiles!inner(nickname, username, avatar_url, full_name)"
        )
        .eq("id", id)
        .maybeSingle();
      if (row) {
        setData({
          id: row.id,
          user_id: row.user_id,
          rating: row.rating,
          content: row.content,
          created_at: row.created_at,
          author: (row as any).profiles,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  return (
    <>
      <TopBar title="Depoimento" back />
      <div className="max-w-2xl mx-auto px-5 pb-28 pt-4" data-testid="depoimento-detail">
        {loading && <p className="text-center py-16 text-stone-500 font-bold">Carregando...</p>}
        {!loading && !data && (
          <div className="text-center py-16">
            <p className="font-bold text-stone-500 mb-4">Depoimento não encontrado.</p>
            <Link to="/depoimentos" className="text-red-600 font-bold hover:underline">
              Voltar
            </Link>
          </div>
        )}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-stone-100 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white text-2xl font-black flex items-center justify-center overflow-hidden">
                {data.author?.avatar_url ? (
                  <img src={data.author.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  (data.author?.nickname || data.author?.full_name || "?")[0]?.toUpperCase()
                )}
              </div>
              <div>
                <p className="text-xl font-black text-stone-900">
                  {data.author?.nickname || data.author?.full_name || "Cliente"}
                </p>
                <p className="text-sm text-stone-500 font-medium">
                  @{data.author?.username || "usuario"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-5" data-testid="depoimento-detail-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-6 h-6",
                    i < data.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"
                  )}
                />
              ))}
            </div>
            {data.content ? (
              <p className="text-lg text-stone-700 leading-relaxed font-medium">“{data.content}”</p>
            ) : (
              <p className="text-stone-400 italic font-medium">
                Sem comentários escritos, apenas uma avaliação em estrelas.
              </p>
            )}
            <p className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mt-6">
              {new Date(data.created_at).toLocaleString("pt-BR")}
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
