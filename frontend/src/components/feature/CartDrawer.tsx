import { ShoppingBag, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const currency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useAppContext();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity"
        onClick={() => setIsCartOpen(false)}
        data-testid="cart-backdrop"
      />

      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
        data-testid="cart-drawer"
      >
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Seu Carrinho
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            data-testid="cart-close"
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-stone-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 py-20">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-medium text-lg">Seu carrinho está vazio.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.key}
                className="flex gap-3 border border-stone-100 rounded-2xl p-3"
                data-testid={`cart-drawer-item-${item.product.id}`}
              >
                <img
                  src={item.product.image_url || item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-bold text-stone-900 leading-tight truncate">
                      {item.product.name}
                    </h4>
                    {item.extras?.removedIngredients?.length ? (
                      <p className="text-[11px] text-stone-500 font-medium">
                        Sem: {item.extras.removedIngredients.join(", ")}
                      </p>
                    ) : null}
                    <p className="text-stone-500 font-medium text-sm mt-1">
                      {currency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="font-black w-6 h-6 flex items-center justify-center hover:text-red-600"
                      >
                        -
                      </button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="font-black w-6 h-6 flex items-center justify-center hover:text-red-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-stone-600">Total</span>
              <span className="text-3xl font-black text-stone-900">{currency(cartTotal)}</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/historico");
              }}
              data-testid="cart-go-history"
              className="w-full bg-red-600 text-white hover:bg-red-700 py-4 rounded-2xl font-black text-lg transition hover:-translate-y-0.5"
            >
              Ver carrinho completo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
