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
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=1200&fit=crop",
  ],
  bannerBg:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop",
  testimonialsBg:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop",
  testimonialsAvatars: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  ],
  benefitsImages: [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=800&fit=crop",
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
  key: string;
  product: Product;
  quantity: number;
  extras?: CartExtra;
  unitPrice: number;
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

// normalize Supabase product shape to the shape expected by existing components
function normalize(p: any): Product {
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

  // persist site images and cart locally
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
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length) {
        setProducts(data.map(normalize));
      }
    } catch (err) {
      console.error("[v0] Erro ao buscar produtos:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    // Settings podem ser armazenados em localStorage por enquanto
    const saved = localStorage.getItem("vitoria_settings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch { /* ignore */ }
    }
  }, []);

  const saveSettings = useCallback(async (s: AppSettings) => {
    localStorage.setItem("vitoria_settings", JSON.stringify(s));
    setSettings(s);
  }, []);

  const refreshTestimonials = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          id,
          user_id,
          rating,
          comment,
          created_at,
          profiles:user_id (nickname, username, avatar_url, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setTestimonials(
          data.map((t: any) => ({
            id: t.id,
            user_id: t.user_id,
            rating: t.rating,
            content: t.comment,
            created_at: t.created_at,
            author: t.profiles || { full_name: "Anônimo" },
          }))
        );
      }
    } catch (err) {
      console.error("[v0] Erro ao buscar depoimentos:", err);
    }
  }, []);

  const refreshOrders = useCallback(async (userId?: string | null) => {
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (!error && data) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.error("[v0] Erro ao buscar pedidos:", err);
      setOrders([]);
    }
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
