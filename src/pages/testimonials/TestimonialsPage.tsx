import { useState } from "react";
import { Star, Plus, X, MessageSquare, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function TestimonialsPage() {
  const { testimonials, addTestimonial, userProfile } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    addTestimonial({
      userId: userProfile.id,
      userName: userProfile.name,
      userHandle: userProfile.handle,
      userAvatar: userProfile.avatar,
      rating,
      text: text.trim(),
    });

    setText("");
    setRating(5);
    setShowCreateModal(false);
  };

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0.0";

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-black text-stone-900">Depoimentos</h1>
          <p className="text-sm text-stone-500 font-medium mt-1">O que nossos clientes dizem</p>
        </div>

        {/* Stats */}
        <div className="px-4 pb-4">
          <div className="bg-stone-100 rounded-xl p-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <span className="text-3xl font-black text-stone-900">{averageRating}</span>
            </div>
            <div className="border-l border-stone-300 pl-4">
              <p className="text-sm font-bold text-stone-900">{testimonials.length} avaliações</p>
              <p className="text-xs text-stone-500">de clientes verificados</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {/* Add Review Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4 mb-4 hover:border-red-200 transition-colors"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-left">
            <p className="font-bold text-stone-900">Deixe seu depoimento</p>
            <p className="text-sm text-stone-500">Compartilhe sua experiência</p>
          </div>
        </button>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-bold text-lg">Nenhum depoimento ainda</p>
            <p className="text-sm text-center">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map((testimonial) => (
              <Link
                to={`/depoimentos/${testimonial.id}`}
                key={testimonial.id}
                className="block bg-white rounded-2xl border border-stone-200 p-4 hover:border-red-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={testimonial.userAvatar}
                    alt={testimonial.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">{testimonial.userName}</h3>
                        <p className="text-xs text-stone-400">@{testimonial.userHandle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-400" />
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= testimonial.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-stone-300"
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-stone-600 line-clamp-2">{testimonial.text}</p>

                    <p className="text-xs text-stone-400 mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-stone-900">Novo Depoimento</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="font-bold text-stone-900 block mb-3">Sua avaliação</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        star <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-stone-300 hover:text-yellow-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="mb-6">
              <label className="font-bold text-stone-900 block mb-3">Seu depoimento</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Conte sua experiência com o Vitória..."
                className="w-full h-32 px-4 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-stone-900 placeholder:text-stone-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="w-full bg-red-600 text-white hover:bg-red-700 disabled:bg-stone-300 disabled:cursor-not-allowed py-4 rounded-xl font-black text-lg transition-colors"
            >
              Publicar Depoimento
            </button>
          </div>
        </>
      )}
    </div>
  );
}
