import { useState } from "react";
import { Camera, Edit3, Gift, Star, ChevronRight, X, Settings, MapPin, Phone, Award, Crown } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, maxPoints: 99, color: "text-amber-700 bg-amber-100" },
  { name: "Prata", minPoints: 100, maxPoints: 299, color: "text-stone-500 bg-stone-100" },
  { name: "Ouro", minPoints: 300, maxPoints: 599, color: "text-yellow-600 bg-yellow-100" },
  { name: "Diamante", minPoints: 600, maxPoints: Infinity, color: "text-blue-600 bg-blue-100" },
];

export default function ProfilePage() {
  const { userProfile, updateUserProfile, orders } = useAppContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editHandle, setEditHandle] = useState(userProfile.handle);
  const [editPhone, setEditPhone] = useState(userProfile.phone || "");
  const [editAddress, setEditAddress] = useState(userProfile.address || "");

  const currentTier = loyaltyTiers.find(
    (tier) => userProfile.loyaltyPoints >= tier.minPoints && userProfile.loyaltyPoints <= tier.maxPoints
  ) || loyaltyTiers[0];

  const nextTier = loyaltyTiers.find((tier) => tier.minPoints > userProfile.loyaltyPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - userProfile.loyaltyPoints : 0;

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editName,
      handle: editHandle.toLowerCase().replace(/[^a-z0-9]/g, ""),
      phone: editPhone,
      address: editAddress,
    });
    setShowEditModal(false);
  };

  const handleAvatarChange = () => {
    const url = prompt("Cole a URL da nova foto de perfil:");
    if (url) {
      updateUserProfile({ avatar: url });
    }
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-bottom-nav">
      {/* Header */}
      <header className="bg-red-600 px-4 pt-6 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative">
          <h1 className="text-2xl font-black text-white">Meu Perfil</h1>
          <p className="text-sm text-white/70 font-medium mt-1">Gerencie suas informações</p>
        </div>
      </header>

      {/* Profile Card */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={handleAvatarChange}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-black text-stone-900 text-xl">{userProfile.name}</h2>
                  <p className="text-sm text-stone-400">@{userProfile.handle}</p>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              {/* Tier Badge */}
              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3 text-xs font-bold", currentTier.color)}>
                <Crown className="w-3.5 h-3.5" />
                {currentTier.name}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
            <div className="text-center">
              <p className="text-2xl font-black text-stone-900">{orders.length}</p>
              <p className="text-xs text-stone-500 font-medium">Pedidos</p>
            </div>
            <div className="text-center border-x border-stone-100">
              <p className="text-2xl font-black text-red-600">{userProfile.loyaltyPoints}</p>
              <p className="text-xs text-stone-500 font-medium">Pontos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-stone-900">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(totalSpent)}
              </p>
              <p className="text-xs text-stone-500 font-medium">Total gasto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-6 space-y-4">
        {/* Loyalty Program */}
        <button
          onClick={() => setShowLoyaltyModal(true)}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 flex items-center gap-4 text-left"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">Programa Fidelidade</p>
            <p className="text-sm text-white/70">
              {nextTier
                ? `Faltam ${pointsToNextTier} pontos para ${nextTier.name}`
                : "Nível máximo atingido!"}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {userProfile.phone && (
            <div className="flex items-center gap-4 p-4 border-b border-stone-100">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-stone-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-stone-400 font-medium">Telefone</p>
                <p className="font-bold text-stone-900">{userProfile.phone}</p>
              </div>
            </div>
          )}

          {userProfile.address && (
            <div className="flex items-center gap-4 p-4 border-b border-stone-100">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-stone-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-stone-400 font-medium">Endereço</p>
                <p className="font-bold text-stone-900">{userProfile.address}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-stone-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-stone-400 font-medium">Membro desde</p>
              <p className="font-bold text-stone-900">
                {new Date(userProfile.memberSince).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-stone-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-stone-900">Configurações</p>
            <p className="text-sm text-stone-500">Editar perfil e preferências</p>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400" />
        </button>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowEditModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-stone-900">Editar Perfil</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-stone-900 text-sm block mb-2">Nome</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-900 text-sm block mb-2">Usuário</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">@</span>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-900 text-sm block mb-2">Telefone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-900 text-sm block mb-2">Endereço</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Rua, número, bairro"
                  className="w-full px-4 py-3 bg-stone-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-red-600 font-medium placeholder:text-stone-400"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full bg-red-600 text-white hover:bg-red-700 py-4 rounded-xl font-black text-lg transition-colors mt-4"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </>
      )}

      {/* Loyalty Modal */}
      {showLoyaltyModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowLoyaltyModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-stone-900">Programa Fidelidade</h2>
              <button
                onClick={() => setShowLoyaltyModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>
            </div>

            {/* Current Points */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 text-center mb-6">
              <p className="text-white/70 text-sm font-medium">Seus pontos</p>
              <p className="text-5xl font-black text-white my-2">{userProfile.loyaltyPoints}</p>
              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white")}>
                <Crown className="w-3.5 h-3.5" />
                {currentTier.name}
              </div>
            </div>

            {/* How it works */}
            <div className="mb-6">
              <h3 className="font-bold text-stone-900 mb-3">Como funciona</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <p>- Ganhe 1 ponto a cada R$10 em pedidos</p>
                <p>- Ganhe 5 pontos ao deixar um depoimento</p>
                <p>- Acumule pontos para subir de nível</p>
              </div>
            </div>

            {/* Tiers */}
            <div>
              <h3 className="font-bold text-stone-900 mb-3">Níveis</h3>
              <div className="space-y-3">
                {loyaltyTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-colors",
                      currentTier.name === tier.name
                        ? "border-red-600 bg-red-50"
                        : "border-stone-200"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", tier.color)}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">{tier.name}</p>
                      <p className="text-xs text-stone-500">
                        {tier.maxPoints === Infinity
                          ? `${tier.minPoints}+ pontos`
                          : `${tier.minPoints} - ${tier.maxPoints} pontos`}
                      </p>
                    </div>
                    {currentTier.name === tier.name && (
                      <span className="text-xs font-bold text-red-600">Atual</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
