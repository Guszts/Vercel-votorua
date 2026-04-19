import { ShoppingBag, X, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, setIsOrderModalOpen } = useAppContext();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Seu Carrinho
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-stone-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-medium text-lg">Seu carrinho está vazio.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-b border-stone-100 pb-4">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-stone-200" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 leading-tight">{item.product.name}</h4>
                    <p className="text-stone-500 font-medium text-sm mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-stone-100 rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="font-bold text-lg hover:text-red-600">-</button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="font-bold text-lg hover:text-red-600">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-stone-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-stone-600">Total</span>
              <span className="text-3xl font-black text-stone-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
              </span>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                setIsOrderModalOpen(true);
              }}
              className="w-full bg-stone-900 text-white hover:bg-stone-800 py-4 rounded-full font-black text-lg transition-transform hover:-translate-y-1"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
