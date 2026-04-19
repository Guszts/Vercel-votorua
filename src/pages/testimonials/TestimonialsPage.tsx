import { useState } from "react";
import { Star, Plus, X, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function TestimonialsPage() {
  const { testimonials, addTestimonial, profile } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addTestimonial({
      userId: profile.id,
      userName: profile.name || "Usuario",
      userHandle: profile.handle || "usuario",
      userAvatar: profile.avatar || "",
      rating,
      text: text.trim(),
    });

    setText("");
    setRating(5);
    setShowForm(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const averageRating = testimonials.length > 0
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
    : 0;

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-black text-stone-900">Depoimentos</h1>
          <p className="text-sm text-stone-500">O que nossos clientes dizem</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-black text-stone-900">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= Math.round(averageRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-stone-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-stone-500">
                {testimonials.length} {testimonials.length === 1 ? "avaliacao" : "avaliacoes"}
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Avaliar
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400 text-lg mb-2">Nenhum depoimento ainda</p>
            <p className="text-stone-400 text-sm">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Link
                key={testimonial.id}
                to={`/depoimentos/${testimonial.id}`}
                className="block bg-white rounded-2xl border border-stone-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden shrink-0">
                    {testimonial.userAvatar ? (
                      <img
                        src={testimonial.userAvatar}
                        alt={testimonial.userName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-lg">
                        {testimonial.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-bold text-stone-900">{testimonial.userName}</h4>
                        <p className="text-xs text-stone-400">@{testimonial.userHandle}</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              star <= testimonial.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-stone-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm line-clamp-3">{testimonial.text}</p>
                    <p className="text-xs text-stone-400 mt-2">{formatDate(testimonial.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Add Testimonial Modal */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed inset-x-4 bottom-4 top-auto z-50 bg-white rounded-3xl p-6 max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-stone-900">Deixe sua avaliacao</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Sua nota
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= (hoveredStar || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-stone-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Conte sua experiencia
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="O que voce achou da comida, atendimento, entrega..."
                  rows={4}
                  className="w-full px-4 py-3 bg-stone-100 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Enviar Avaliacao
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
