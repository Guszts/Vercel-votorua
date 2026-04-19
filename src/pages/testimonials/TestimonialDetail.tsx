import { ArrowLeft, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function TestimonialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { testimonials } = useAppContext();

  const testimonial = testimonials.find((t) => t.id === id);

  if (!testimonial) {
    return (
      <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-stone-900">Depoimento</h1>
          </div>
        </header>
        <div className="text-center py-16">
          <p className="text-stone-400 text-lg">Depoimento nao encontrado</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-stone-900">Depoimento</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
          {/* User Info */}
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 overflow-hidden shrink-0">
                {testimonial.userAvatar ? (
                  <img
                    src={testimonial.userAvatar}
                    alt={testimonial.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-2xl">
                    {testimonial.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900">{testimonial.userName}</h2>
                <p className="text-stone-500">@{testimonial.userHandle}</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-center">
            <div className="text-center">
              <div className="flex gap-1 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8",
                      star <= testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-stone-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-stone-500 text-sm">
                {testimonial.rating} de 5 estrelas
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-stone-700 text-lg leading-relaxed whitespace-pre-wrap">
              {testimonial.text}
            </p>
            <p className="text-stone-400 text-sm mt-6">
              Publicado em {formatDate(testimonial.createdAt)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
