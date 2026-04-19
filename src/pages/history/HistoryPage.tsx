import { useState } from "react";
import { ShoppingBag, Clock, Package, Truck, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

type Tab = "pedidos" | "carrinho";

const statusConfig = {
  pendente: { icon: Clock, label: "Pendente", color: "text-yellow-600 bg-yellow-50" },
  preparando: { icon: Package, label: "Preparando", color: "text-blue-600 bg-blue-50" },
  entregando: { icon: Truck, label: "Entregando", color: "text-purple-600 bg-purple-50" },
  entregue: { icon: CheckCircle, label: "Entregue", color: "text-green-600 bg-green-50" },
  cancelado: { icon: XCircle, label: "Cancelado", color: "text-red-600 bg-red-50" },
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pedidos");
  const { orders, cart, removeFromCart, updateQuantity, cartTotal, setIsOrderModalOpen } = useAppContext();

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-black text-stone-900">Histórico</h1>
          <p className="text-sm text-stone-500 font-medium mt-1">Seus pedidos e carrinho</p>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("pedidos")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors",
                activeTab === "pedidos"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("carrinho")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors",
                activeTab === "carrinho"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              Carrinho ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {activeTab === "pedidos" ? (
          <OrdersTab />
        ) : (
          <CartTab />
        )}
      </main>
    </div>
  );
}

function OrdersTab() {
  const { orders } = useAppContext();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <Package className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-bold text-lg">Nenhum pedido ainda</p>
        <p className="text-sm text-center">Seus pedidos aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = statusConfig[order.status];
        const StatusIcon = status.icon;

        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase">
                  Pedido #{order.id.split("-")[1]}
                </span>
                <span className={cn("flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full", status.color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Order Items */}
            <div className="p-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-500">{item.quantity}x {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-600">Total</span>
              <span className="text-lg font-black text-stone-900">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CartTab() {
  const { cart, removeFromCart, updateQuantity, cartTotal, setIsOrderModalOpen } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-bold text-lg">Carrinho vazio</p>
        <p className="text-sm text-center">Adicione itens para continuar</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 rounded-xl object-cover border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-stone-900 leading-tight">{item.product.name}</h4>
                <p className="text-stone-500 font-medium text-sm mt-1">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.product.price)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 bg-stone-100 rounded-full px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="font-bold text-lg hover:text-red-600"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="font-bold text-lg hover:text-red-600"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-stone-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-stone-600">Total</span>
          <span className="text-2xl font-black text-stone-900">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cartTotal)}
          </span>
        </div>
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="w-full bg-red-600 text-white hover:bg-red-700 py-4 rounded-xl font-black text-lg transition-colors"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}
