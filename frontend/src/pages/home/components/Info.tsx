import { MapPin, Clock, Truck, DollarSign, Store, ShoppingBag, Banknote, CreditCard, QrCode, Ticket } from "lucide-react";
import { motion } from "motion/react";

const infoCards = [
  { icon: MapPin, label: "Endereço", value: "Av Brasil, 1020 - Centro, Campo Novo do Parecis/MT" },
  { icon: Clock, label: "Horário", value: "Segunda a Sábado, das 10h às 14h30" },
  { icon: Truck, label: "Entrega", value: "Delivery em toda a cidade via Motoboy" },
  { icon: DollarSign, label: "Frete", value: "Grátis para pedidos acima de R$ 50,00" },
  { icon: Store, label: "Retirada", value: "Disponível no balcão sem taxa" },
  { icon: ShoppingBag, label: "Pedidos", value: "Pelo App, WhatsApp ou Presencial" },
];

const payments = [
  { icon: Banknote, label: "Dinheiro" },
  { icon: CreditCard, label: "Cartão Débito" },
  { icon: CreditCard, label: "Cartão Crédito" },
  { icon: QrCode, label: "PIX" },
  { icon: Ticket, label: "Vale Refeição / VR" },
];

export default function Info() {
  return (
    <section className="bg-white py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Informações Úteis</span>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900">Como funcionamos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {infoCards.map((info, i) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-stone-50 border border-stone-100 p-8 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-stone-500 font-bold text-sm tracking-wider uppercase mb-1">{info.label}</h4>
                  <p className="text-stone-900 font-bold text-lg">{info.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="bg-stone-900 rounded-[2rem] p-10 lg:p-16 flex flex-col items-center justify-center text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 block">Facilidade na hora de pagar</span>
          <h3 className="text-3xl font-black text-white mb-10">Formas de Pagamento Aceitas</h3>
          
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {payments.map((pay, i) => {
              const Icon = pay.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-6 min-w-[140px] hover:bg-white/20 transition-colors">
                   <Icon className="w-8 h-8 text-white" />
                   <span className="text-white font-medium">{pay.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
