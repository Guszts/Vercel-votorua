import { ArrowLeft, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function TestimonialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { testimonials } = useAppContext();

  const testimonial = testimonials.find((t) => t.id === id);

  if (!testimonial) {
    return (
      <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen flex flex-col items-center justify-center p-4">
        <p className="font-bold text-lg text-stone-600">Depoimento não encontrado</p>
        <button
          onClick={() => navigate("/depoimentos")}
          className="mt-4 text-red-600 font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/depoimentos")}
            className="p-2 -ml-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-stone-900" />
          </button>
          <h1 className="text-xl font-black text-stone-900">Depoimento</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={testimonial.userAvatar}
              alt={testimonial.userName}
              className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="font-black text-stone-900 text-lg">{testimonial.userName}</h2>
              <p className="text-sm text-stone-400">@{testimonial.userHandle}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-6 h-6",
                  star <= testimonial.rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-stone-300"
                )}
              />
            ))}
            <span className="ml-2 text-lg font-bold text-stone-900">{testimonial.rating}.0</span>
          </div>

          {/* Testimonial Text */}
          <p className="text-stone-700 leading-relaxed text-base mb-6">
            {testimonial.text}
          </p>

          {/* Date */}
          <p className="text-sm text-stone-400 border-t border-stone-100 pt-4">
            Publicado em{" "}
            {new Date(testimonial.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}
