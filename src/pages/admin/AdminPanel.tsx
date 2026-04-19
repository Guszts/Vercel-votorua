import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit2, CheckCircle2, Image as ImageIcon, Utensils } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function AdminPanel() {
  const { isAdmin, products, setProducts, siteImages, setSiteImages } = useAppContext();
  const [activeTab, setActiveTab] = useState<'products' | 'images'>('products');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Local edit states
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editImage, setEditImage] = useState("");

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-4xl font-black text-stone-900 mb-4">Acesso Negado</h1>
          <Link to="/" className="text-red-500 font-bold hover:underline">Voltar para o Início</Link>
        </div>
      </div>
    );
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditDesc(product.desc);
    setEditPrice(product.price);
    setEditImage(product.image);
  };

  const handleSave = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, name: editName, desc: editDesc, price: editPrice, image: editImage } : p
    ));
    setEditingId(null);
  };

  const handleSiteImageChange = (key: keyof typeof siteImages, value: string | string[], index?: number) => {
    if (index !== undefined && Array.isArray(siteImages[key])) {
      const newArr = [...(siteImages[key] as string[])];
      newArr[index] = value as string;
      setSiteImages({ ...siteImages, [key]: newArr });
    } else {
      setSiteImages({ ...siteImages, [key]: value });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="bg-white border-b border-stone-200 py-6 px-6 lg:px-8 mb-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-stone-900" />
            </Link>
            <h1 className="text-2xl font-black text-stone-900 uppercase hidden sm:block">Ajustes</h1>
          </div>
          
          <div className="flex bg-stone-100 p-1 rounded-full">
            <button
               onClick={() => setActiveTab('products')}
               className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                 activeTab === 'products' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
               }`}
            >
              <Utensils className="w-4 h-4" /> <span className="hidden sm:inline">Produtos</span>
            </button>
            <button
               onClick={() => setActiveTab('images')}
               className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                 activeTab === 'images' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'
               }`}
            >
              <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Imagens do Site</span>
            </button>
          </div>

          <div className="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-xs sm:text-sm">
            Modo Edição
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {activeTab === 'products' ? (
          <div className="grid gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {editingId === product.id ? (
                  <>
                    <div className="flex-1 w-full space-y-4">
                      <input 
                        className="w-full font-bold text-lg border-2 border-stone-300 rounded-lg px-4 py-2"
                        value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nome"
                      />
                      <textarea 
                        className="w-full border-2 border-stone-300 rounded-lg px-4 py-2 resize-none"
                        rows={2} value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Descrição"
                      />
                      <div className="flex gap-4">
                        <input 
                          type="number" className="w-1/3 border-2 border-stone-300 rounded-lg px-4 py-2"
                          value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} placeholder="Preço"
                        />
                        <input 
                          type="text" className="w-2/3 border-2 border-stone-300 rounded-lg px-4 py-2"
                          value={editImage} onChange={e => setEditImage(e.target.value)} placeholder="URL da Imagem"
                        />
                      </div>
                    </div>
                    <button onClick={() => handleSave(product.id)} className="shrink-0 bg-stone-900 text-white p-4 rounded-xl hover:bg-stone-800 flex flex-col items-center gap-2 font-bold w-full md:w-auto">
                      <CheckCircle2 className="w-6 h-6" /> Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl border border-stone-100" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 uppercase rounded-md tracking-wider">{product.category}</span>
                        <h3 className="font-bold text-stone-900 text-xl">{product.name}</h3>
                      </div>
                      <p className="text-stone-500 mb-2">{product.desc}</p>
                      <span className="font-black text-red-600 text-lg">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <button onClick={() => handleEdit(product)} className="shrink-0 bg-stone-100 text-stone-900 p-4 rounded-xl hover:bg-stone-200 flex flex-col items-center gap-1 font-bold w-full md:w-auto">
                      <Edit2 className="w-5 h-5" /> Editar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="text-2xl font-black text-stone-900 mb-6">Imagens da Hero (Topo)</h2>
              <div className="space-y-4">
                {siteImages.heroSlides.map((url, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={url} className="w-20 h-14 object-cover rounded-md border border-stone-200" />
                    <input 
                      type="text" 
                      className="flex-1 border-2 border-stone-200 rounded-lg px-4 py-2"
                      value={url}
                      onChange={e => handleSiteImageChange('heroSlides', e.target.value, i)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="text-2xl font-black text-stone-900 mb-6">Banner Promocional</h2>
              <div className="flex gap-4 items-center">
                <img src={siteImages.bannerBg} className="w-20 h-14 object-cover rounded-md border border-stone-200" />
                <input 
                  type="text" 
                  className="flex-1 border-2 border-stone-200 rounded-lg px-4 py-2"
                  value={siteImages.bannerBg}
                  onChange={e => handleSiteImageChange('bannerBg', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="text-2xl font-black text-stone-900 mb-6">Imagens de Benefícios</h2>
              <div className="space-y-4">
                {siteImages.benefitsImages.map((url, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={url} className="w-16 h-16 object-cover rounded-md border border-stone-200" />
                    <input 
                      type="text" 
                      className="flex-1 border-2 border-stone-200 rounded-lg px-4 py-2"
                      value={url}
                      onChange={e => handleSiteImageChange('benefitsImages', e.target.value, i)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="text-2xl font-black text-stone-900 mb-6">Depoimentos</h2>
              <div className="mb-6">
                <label className="block text-sm font-bold text-stone-500 mb-2">Fundo (Background)</label>
                <div className="flex gap-4 items-center">
                  <img src={siteImages.testimonialsBg} className="w-20 h-14 object-cover rounded-md border border-stone-200" />
                  <input 
                    type="text" 
                    className="flex-1 border-2 border-stone-200 rounded-lg px-4 py-2"
                    value={siteImages.testimonialsBg}
                    onChange={e => handleSiteImageChange('testimonialsBg', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2">Avatares</label>
                <div className="space-y-4">
                  {siteImages.testimonialsAvatars.map((url, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img src={url} className="w-12 h-12 object-cover rounded-full border border-stone-200" />
                      <input 
                        type="text" 
                        className="flex-1 border-2 border-stone-200 rounded-lg px-4 py-2"
                        value={url}
                        onChange={e => handleSiteImageChange('testimonialsAvatars', e.target.value, i)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
