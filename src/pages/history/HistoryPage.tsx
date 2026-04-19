import { useState } from "react";
import { Package, ShoppingCart, Clock, CheckCircle, Truck, XCircle, ChevronRight, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

type Tab = "pedidos" | "carrinho";

const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, color: "text-amber-600 bg-amber-100" },
  preparando: { label: "Preparando", icon: Package, color: "text-blue-600 bg-blue-100" },
  saiu_entrega: { label: "Saiu para Entrega", icon: Truck, color: "text-purple-600 bg-purple-100" },
  entregue: { label: "Entregue", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  cancelado: { label: "Cancelado", icon: XCircle, color: "text-red-600 bg-red-100" },
};

export default function HistoryPage() {
  const { orders, cart, removeFromCart, updateQuantity, cartTotal, setIsOrderModalOpen, setIsCartOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("pedidos");

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-black text-stone-900">Historico</h1>
          <p className="text-sm text-stone-500">Seus pedidos e carrinho</p>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-stone-100">
          <button
            onClick={() => setActiveTab("pedidos")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
              activeTab === "pedidos"
                ? "border-red-600 text-red-600"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            <Package className="w-4 h-4" />
            Pedidos
            {orders.length > 0 && (
              <span className="bg-stone-200 text-stone-600 text-xs px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("carrinho")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
              activeTab === "carrinho"
                ? "border-red-600 text-red-600"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            Carrinho
            {cart.length > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "pedidos" ? (
          // Orders Tab
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-400 text-lg mb-2">Nenhum pedido ainda</p>
                <p className="text-stone-400 text-sm">Seus pedidos aparecerão aqui</p>
              </div>
            ) : (
              orders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-stone-500">
                          Pedido #{order.id.split("-")[1]}
                        </span>
                        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>
                      <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="p-4">
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-500 shrink-0">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-stone-500">
                            {order.items.reduce((acc, i) => acc + i.quantity, 0)} itens
                          </p>
                          <p className="text-lg font-black text-stone-900">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}
                          </p>
                        </div>
                        <button className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
                          Detalhes
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Cart Tab
          <div>
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-400 text-lg mb-2">Seu carrinho esta vazio</p>
                <p className="text-stone-400 text-sm">Adicione produtos para continuar</p>
              </div>
            ) : (
              <>
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
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-900">{item.product.name}</h4>
                        <p className="text-sm text-stone-500 mb-2">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between">
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
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-stone-600 font-medium">Total</span>
                    <span className="text-2xl font-black text-stone-900">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cartTotal)}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full bg-stone-900 text-white py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-colors"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
