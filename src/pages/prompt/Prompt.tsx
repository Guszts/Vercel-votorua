import { useState } from "react";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const promptText = `Crie um site vitrine completo para o **Restaurante e Marmitaria Vitória**, localizado em Campo Novo do Parecis/MT (Av Brasil, 1020 - Centro). O site deve ser uma landing page de uma única página com múltiplas seções, estilo minimalista moderno com identidade visual em vermelho e branco.

---

## IDENTIDADE VISUAL

- **Paleta de cores principal:** Vermelho (#b91c1c / red-700), Branco (#ffffff), Pedra/Stone (#f5f5f4 / stone-100), Fundo footer (#fdf5f3)
- **Cor de destaque:** Vermelho (#ef4444 / red-500) para highlights e textos em destaque
- **Tipografia:** Google Fonts — usar fonte sem-serif moderna com peso black/extrabold para títulos (ex: Inter, Poppins ou similar). Títulos com font-black, subtítulos com font-bold, corpo com font-medium/normal.
- **Bordas arredondadas:** rounded-2xl para cards, rounded-full para botões e badges, rounded-xl para formulários
- **Sem sombras** (design limpo e flat)
- **Sem azul ou roxo** em nenhum elemento
... [ver restante no código]
`;

export default function Prompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-red-600 font-bold mb-8 hover:translate-x-1 transition-transform">
          <ArrowLeft className="w-5 h-5" />
          Voltar para Home
        </Link>
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-stone-900">Prompt Original</h1>
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm text-stone-700 bg-stone-100 p-6 rounded-xl overflow-x-auto">
            {promptText}
          </pre>
        </div>
      </div>
    </div>
  );
}
