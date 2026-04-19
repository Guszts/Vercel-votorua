import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { AppSettings, Product, Testimonial, Order } from "../lib/types";
import { initialProducts as fallbackProducts } from "../data/products";

export interface SiteImages {
  heroSlides: string[];
  bannerBg: string;
  testimonialsBg: string;
  testimonialsAvatars: string[];
  benefitsImages: string[];
}

const defaultSiteImages: SiteImages = {
  heroSlides: [
    "https://readdy.ai/api/search-image?query=brazilian+food+marmita+lunch+box+rice+beans+meat+salad+overhead&width=1600&height=1200&seq=1&orientation=landscape",
    "https://readdy.ai/api/search-image?query=brazilian+barbecue+churrasco+grilled+meat+picanha&width=1600&height=1200&seq=2&orientation=landscape",
    "https://readdy.ai/api/search-image?query=food+delivery+driver+delivering+package+red+helmet&width=1600&height=1200&seq=3&orientation=landscape",
  ],
  bannerBg:
    "https://readdy.ai/api/search-image?query=restaurant+professional+kitchen+chef+cooking+fire+dynamic&width=1600&height=900&seq=10&orientation=landscape",
  testimonialsBg:
    "https://readdy.ai/api/search-image?query=warm+cozy+brazilian+restaurant+interior+blurred+background&width=1600&height=900&seq=16&orientation=landscape",
  testimonialsAvatars: [
    "https://readdy.ai/api/search-image?query=portrait+young+brazilian+man+smiling&width=200&height=200&seq=14&orientation=squarish",
    "https://readdy.ai/api/search-image?query=portrait+young+brazilian+woman+smiling&width=200&height=200&seq=15&orientation=squarish",
  ],
  benefitsImages: [
    "https://readdy.ai/api/search-image?query=fresh+ingredients+vegetables+kitchen+prep+tomatoes+crisp&width=800&height=800&seq=11&orientation=squarish",
    "https://readdy.ai/api/search-image?query=express+food+delivery+motorcycle+red+delivery+box+motion+blur&width=800&height=800&seq=12&orientation=squarish",
    "https://readdy.ai/api/search-image?query=variety+of+delicious+brazilian+food+dishes+buffet+overhead&width=800&height=800&seq=13&orientation=squarish",
  ],
};

const defaultSettings: AppSettings = {
  address: "Campo Novo do Parecis - MT",
  hours: "Seg a Sáb: 11h às 22h. Dom: 11h às 16h",
  delivery_time: "30-45 min",
  pickup_time: "15-20 min",
  payment_methods: ["Pix", "Cartão Crédito", "Cartão Débito", "Dinheiro"],
};

export interface CartExtra {
  removedIngredients?: string[];
  extras?: { name: string; price: number }[];
}

export interface CartItem {
  key: string; // uuid-like to support multiple customized entries of the same product
  product: Product;
  quantity: number;
  extras?: CartExtra;
  unitPrice: number; // price including extras
}

interface AppCtx {
  products: Product[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, opts?: { quantity?: number; extras?: CartExtra; unitPrice?: number }) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  siteImages: SiteImages;
  setSiteImages: React.Dispatch<React.SetStateAction<SiteImages>>;
  settings: AppSettings;
  refreshSettings: () => Promise<void>;
  saveSettings: (s: AppSettings) => Promise<void>;
  testimonials: Testimonial[];
  refreshTestimonials: () => Promise<void>;
  orders: Order[];
  refreshOrders: (userId?: string | null) => Promise<void>;
}

const C = createContext<AppCtx | null>(null);

function newKey() {
  return "ci_" + Math.random().toString(36).slice(2, 10);
}

// normalize Supabase product shape to the shape expected by existing components (desc, image, tag)
function normalize(p: Product): Product {
  return {
    ...p,
    desc: p.description ?? p.desc ?? "",
    image: p.image_url ?? p.image ?? "",
    tag: p.badge ?? p.tag ?? null,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    fallbackProducts.map((p) => ({
      id: p.id,
      category: p.category,
      name: p.name,
      description: p.desc,
      price: p.price,
      image_url: p.image,
      badge: p.tag ?? null,
      badge_color: null,
      stock: 9999,
      active: true,
      sort_order: 0,
      desc: p.desc,
      image: p.image,
      tag: p.tag ?? null,
    }))
  );
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [siteImages, setSiteImages] = useState<SiteImages>(defaultSiteImages);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // persist site images locally
  useEffect(() => {
    const saved = localStorage.getItem("vitoria_site_images");
    if (saved) {
      try {
        setSiteImages(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    const savedCart = localStorage.getItem("vitoria_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch { /* ignore */ }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("vitoria_site_images", JSON.stringify(siteImages));
  }, [siteImages]);
  useEffect(() => {
    localStorage.setItem("vitoria_cart", JSON.stringify(cart));
  }, [cart]);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length) {
        setProducts(data.map(normalize));
      }
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "main")
      .maybeSingle();
    if (data?.value) setSettings({ ...defaultSettings, ...(data.value as AppSettings) });
  }, []);

  const saveSettings = useCallback(async (s: AppSettings) => {
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "main", value: s, updated_at: new Date().toISOString() });
    if (!error) setSettings(s);
    else throw error;
  }, []);

  const refreshTestimonials = useCallback(async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, user_id, rating, content, created_at, profiles!inner(nickname, username, avatar_url, full_name)")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setTestimonials(
        data.map((t: any) => ({
          id: t.id,
          user_id: t.user_id,
          rating: t.rating,
          content: t.content,
          created_at: t.created_at,
          author: t.profiles,
        }))
      );
    }
  }, []);

  const refreshOrders = useCallback(async (userId?: string | null) => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    const { data } = await q;
    if (data) setOrders(data as Order[]);
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshSettings();
    refreshTestimonials();
  }, [refreshProducts, refreshSettings, refreshTestimonials]);

  const addToCart: AppCtx["addToCart"] = (product, opts) => {
    const qty = opts?.quantity ?? 1;
    const unitPrice = opts?.unitPrice ?? product.price;
    setCart((prev) => {
      // merge if no extras customization
      if (!opts?.extras || (!opts.extras.removedIngredients?.length && !opts.extras.extras?.length)) {
        const existing = prev.find((i) => i.product.id === product.id && !i.extras);
        if (existing) {
          return prev.map((i) =>
            i.key === existing.key ? { ...i, quantity: i.quantity + qty } : i
          );
        }
      }
      return [
        ...prev,
        { key: newKey(), product: normalize(product), quantity: qty, extras: opts?.extras, unitPrice },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key: string) => setCart((p) => p.filter((i) => i.key !== key));
  const updateQuantity = (key: string, qty: number) => {
    if (qty <= 0) return removeFromCart(key);
    setCart((p) => p.map((i) => (i.key === key ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setCart([]);

  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  return (
    <C.Provider
      value={{
        products,
        loadingProducts,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isOrderModalOpen,
        setIsOrderModalOpen,
        siteImages,
        setSiteImages,
        settings,
        refreshSettings,
        saveSettings,
        testimonials,
        refreshTestimonials,
        orders,
        refreshOrders,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useAppContext() {
  const c = useContext(C);
  if (!c) throw new Error("useAppContext must be used within AppProvider");
  return c;
}
