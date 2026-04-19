import { useState, useRef } from "react";
import {
  Camera,
  Edit3,
  Gift,
  Trophy,
  Star,
  Settings,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  X,
  Check,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, maxPoints: 99, color: "from-amber-700 to-amber-600" },
  { name: "Prata", minPoints: 100, maxPoints: 299, color: "from-gray-400 to-gray-500" },
  { name: "Ouro", minPoints: 300, maxPoints: 599, color: "from-yellow-400 to-amber-500" },
  { name: "Diamante", minPoints: 600, maxPoints: Infinity, color: "from-cyan-400 to-blue-500" },
];

const rewards = [
  { points: 50, reward: "Refrigerante Gratis", icon: Gift },
  { points: 100, reward: "10% de Desconto", icon: Star },
  { points: 200, reward: "Sobremesa Gratis", icon: Gift },
  { points: 300, reward: "15% de Desconto", icon: Star },
  { points: 500, reward: "Marmita G Gratis", icon: Trophy },
];

export default function ProfilePage() {
  const { profile, updateProfile, orders } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTier = loyaltyTiers.find(
    (tier) => profile.loyaltyPoints >= tier.minPoints && profile.loyaltyPoints <= tier.maxPoints
  ) || loyaltyTiers[0];

  const nextTier = loyaltyTiers.find((tier) => tier.minPoints > profile.loyaltyPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - profile.loyaltyPoints : 0;
  const progressInTier = nextTier
    ? ((profile.loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditedProfile({ ...editedProfile, avatar: base64 });
        if (!isEditing) {
          updateProfile({ avatar: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const settingsItems = [
    { icon: Bell, label: "Notificacoes", action: () => {} },
    { icon: Moon, label: "Modo Escuro", action: () => {} },
    { icon: HelpCircle, label: "Ajuda e Suporte", action: () => {} },
    { icon: LogOut, label: "Sair", action: () => {}, danger: true },
  ];

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900">Perfil</h1>
            <p className="text-sm text-stone-500">Suas informacoes</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(true);
              }}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <Edit3 className="w-5 h-5 text-stone-600" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              >
                <Check className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-stone-200 overflow-hidden">
                {(isEditing ? editedProfile.avatar : profile.avatar) ? (
                  <img
                    src={isEditing ? editedProfile.avatar : profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-3xl">
                    {(isEditing ? editedProfile.name : profile.name)?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name and Handle */}
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Usuario</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">@</span>
                    <input
                      type="text"
                      value={editedProfile.handle}
                      onChange={(e) => setEditedProfile({ ...editedProfile, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                      className="w-full pl-8 pr-4 py-3 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="usuario"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editedProfile.phone || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedProfile.email || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Endereco</label>
                  <input
                    type="text"
                    value={editedProfile.address || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Seu endereco"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-stone-900">{profile.name || "Usuario"}</h2>
                <p className="text-stone-500">@{profile.handle || "usuario"}</p>
                <p className="text-xs text-stone-400 mt-1">
                  Membro desde {formatDate(profile.memberSince)}
                </p>

                {/* Quick Info */}
                <div className="w-full mt-6 space-y-3">
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-stone-600">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-3 text-stone-600">
                      <Mail className="w-4 h-4 text-stone-400" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-3 text-stone-600">
                      <MapPin className="w-4 h-4 text-stone-400" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loyalty Program Card */}
        <button
          onClick={() => setShowLoyalty(!showLoyalty)}
          className="w-full bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-6 text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full bg-gradient-to-r", currentTier.color)}>
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Programa Fidelidade</p>
                <p className="text-white font-bold">{currentTier.name}</p>
              </div>
            </div>
            <ChevronRight className={cn("w-5 h-5 text-white transition-transform", showLoyalty && "rotate-90")} />
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white font-bold">{profile.loyaltyPoints} pontos</span>
              {nextTier && (
                <span className="text-white/70">{pointsToNextTier} para {nextTier.name}</span>
              )}
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn("h-full bg-gradient-to-r rounded-full transition-all", currentTier.color)}
                style={{ width: `${progressInTier}%` }}
              />
            </div>
          </div>

          <p className="text-white/50 text-xs">
            Ganhe 1 ponto a cada R$10 em compras
          </p>
        </button>

        {/* Loyalty Details */}
        {showLoyalty && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <h3 className="font-bold text-stone-900 mb-4">Recompensas Disponiveis</h3>
            <div className="space-y-3">
              {rewards.map((reward) => {
                const canRedeem = profile.loyaltyPoints >= reward.points;
                const RewardIcon = reward.icon;
                return (
                  <div
                    key={reward.points}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      canRedeem ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        canRedeem ? "bg-red-600 text-white" : "bg-stone-200 text-stone-400"
                      )}>
                        <RewardIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={cn("font-semibold", canRedeem ? "text-stone-900" : "text-stone-400")}>
                          {reward.reward}
                        </p>
                        <p className={cn("text-sm", canRedeem ? "text-stone-500" : "text-stone-400")}>
                          {reward.points} pontos
                        </p>
                      </div>
                    </div>
                    {canRedeem && (
                      <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors">
                        Resgatar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center">
            <p className="text-3xl font-black text-stone-900">{orders.length}</p>
            <p className="text-sm text-stone-500">Pedidos</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-4 text-center">
            <p className="text-3xl font-black text-red-600">{profile.loyaltyPoints}</p>
            <p className="text-sm text-stone-500">Pontos</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
          <h3 className="px-6 py-4 font-bold text-stone-900 border-b border-stone-100">
            Configuracoes
          </h3>
          {settingsItems.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors",
                  idx !== settingsItems.length - 1 && "border-b border-stone-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <ItemIcon className={cn("w-5 h-5", item.danger ? "text-red-600" : "text-stone-400")} />
                  <span className={cn("font-medium", item.danger ? "text-red-600" : "text-stone-700")}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
